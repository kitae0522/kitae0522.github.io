import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const rendererUrl = new URL('../src/scripts/render-mermaid.mjs', import.meta.url);
assert.ok(existsSync(rendererUrl), 'Mermaid browser renderer module must exist');

const { MERMAID_SELECTOR, renderMermaidBlocks } = await import(rendererUrl.href);

let emptyLoadCount = 0;
const emptyResult = await renderMermaidBlocks({
  root: { querySelectorAll: () => [] },
  loadMermaid: async () => {
    emptyLoadCount += 1;
    return {};
  },
});
assert.deepEqual(emptyResult, { rendered: 0, failed: 0 });
assert.equal(emptyLoadCount, 0, 'Mermaid must not load on posts without diagrams');
assert.equal(MERMAID_SELECTOR, '.post-content pre[data-mermaid]');

function createBlock(source) {
  return {
    textContent: source,
    dataset: {},
    attributes: {},
    replacement: undefined,
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    replaceWith(value) {
      this.replacement = value;
    },
  };
}

async function captureRendererOutcome(options) {
  try {
    return { result: await renderMermaidBlocks(options) };
  } catch (error) {
    return { error };
  }
}

function assertFailedSourceBlock(block, index) {
  assert.equal(block.replacement, undefined, 'Failed setup must keep the source block visible');
  assert.equal(block.dataset.mermaidError, 'true');
  assert.equal(block.attributes.role, 'status');
  assert.equal(
    block.attributes['aria-label'],
    `Mermaid 다이어그램 ${index + 1} 렌더링 실패. 원본 코드.`,
  );
}

const loaderFailureBlocks = [
  createBlock('graph TD\n  A --> B'),
  createBlock('graph TD\n  B --> C'),
];
const loaderError = new Error('load failed');
const loaderReports = [];
const loaderFailure = await captureRendererOutcome({
  root: { querySelectorAll: () => loaderFailureBlocks },
  loadMermaid: async () => {
    throw loaderError;
  },
  reportError(error) {
    loaderReports.push(error);
  },
});
assert.equal(loaderFailure.error, undefined, 'Loader rejection must be handled');
assert.deepEqual(loaderFailure.result, { rendered: 0, failed: loaderFailureBlocks.length });
assert.deepEqual(loaderReports, [loaderError]);
loaderFailureBlocks.forEach(assertFailedSourceBlock);

const initializeFailureBlocks = [
  createBlock('graph TD\n  A --> B'),
  createBlock('graph TD\n  B --> C'),
];
const initializeError = new Error('initialize failed');
const initializeReports = [];
let initializeCalls = 0;
const initializeFailure = await captureRendererOutcome({
  root: { querySelectorAll: () => initializeFailureBlocks },
  loadMermaid: async () => ({
    initialize() {
      initializeCalls += 1;
      throw initializeError;
    },
    render() {
      assert.fail('Mermaid must not render after initialization failure');
    },
  }),
  reportError(error) {
    initializeReports.push(error);
  },
});
assert.equal(initializeFailure.error, undefined, 'Initialization rejection must be handled');
assert.deepEqual(initializeFailure.result, {
  rendered: 0,
  failed: initializeFailureBlocks.length,
});
assert.deepEqual(initializeReports, [initializeError]);
assert.equal(initializeCalls, 1);
initializeFailureBlocks.forEach(assertFailedSourceBlock);

function createContainer() {
  return {
    className: '',
    innerHTML: '',
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
}

function createAttachedBlock(source) {
  const block = createBlock(source);
  const parent = { child: block };

  block.replaceWith = function replaceWith(value) {
    assert.equal(parent.child, block);
    parent.child = value;
    this.replacement = value;
  };

  return { block, parent };
}

const validBlock = createBlock('graph TD\n  A --> B');
let initializedWith;
const validResult = await renderMermaidBlocks({
  root: { querySelectorAll: () => [validBlock] },
  loadMermaid: async () => ({
    initialize(config) {
      initializedWith = config;
    },
    async render(id, source) {
      assert.match(id, /^mermaid-diagram-\d+$/);
      assert.equal(source, 'graph TD\n  A --> B');
      return { svg: '<svg aria-label="diagram"></svg>' };
    },
  }),
  createContainer,
  reportError: assert.fail,
});
assert.deepEqual(validResult, { rendered: 1, failed: 0 });
assert.equal(initializedWith.startOnLoad, false);
assert.equal(initializedWith.securityLevel, 'strict');
assert.equal(initializedWith.theme, 'base');
assert.equal(initializedWith.suppressErrorRendering, true);
assert.match(initializedWith.fontFamily, /Pretendard/);
assert.equal(validBlock.replacement.className, 'mermaid-diagram');
assert.match(validBlock.replacement.innerHTML, /<svg/);

const { block: bindingFailureBlock, parent: bindingParent } = createAttachedBlock(
  'graph TD\n  A --> B',
);
let bindingContainer;
let bindingSawAttached = false;
let bindingError;
const bindingFailureResult = await renderMermaidBlocks({
  root: { querySelectorAll: () => [bindingFailureBlock] },
  loadMermaid: async () => ({
    initialize() {},
    async render() {
      return {
        svg: '<svg aria-label="diagram"></svg>',
        bindFunctions() {
          bindingSawAttached = bindingParent.child === bindingContainer;
          throw new Error('bind failed');
        },
      };
    },
  }),
  createContainer() {
    bindingContainer = createContainer();
    bindingContainer.replaceWith = function replaceWith(value) {
      assert.equal(bindingParent.child, bindingContainer);
      bindingParent.child = value;
    };
    return bindingContainer;
  },
  reportError(error) {
    bindingError = error;
  },
});
assert.deepEqual(bindingFailureResult, { rendered: 0, failed: 1 });
assert.equal(bindingSawAttached, true, 'Bindings must run while the diagram is attached');
assert.equal(
  bindingParent.child,
  bindingFailureBlock,
  'Binding failure must restore the original source block',
);
assert.equal(
  bindingFailureBlock.replacement,
  bindingContainer,
  'The source block must have been replaced before binding ran',
);
assert.equal(bindingFailureBlock.dataset.mermaidError, 'true');
assert.equal(bindingError.message, 'bind failed');

const invalidBlock = createBlock('not a valid Mermaid diagram');
let reportedError;
const invalidResult = await renderMermaidBlocks({
  root: { querySelectorAll: () => [invalidBlock] },
  loadMermaid: async () => ({
    initialize() {},
    async render() {
      throw new Error('parse failed');
    },
  }),
  createContainer,
  reportError(error) {
    reportedError = error;
  },
});
assert.deepEqual(invalidResult, { rendered: 0, failed: 1 });
assert.equal(invalidBlock.replacement, undefined, 'Invalid source must remain in place');
assert.equal(invalidBlock.dataset.mermaidError, 'true');
assert.equal(invalidBlock.attributes.role, 'status');
assert.match(invalidBlock.attributes['aria-label'], /렌더링 실패/);
assert.equal(reportedError.message, 'parse failed');

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.match(packageJson.dependencies.mermaid, /^\^11\./);
assert.equal(
  packageJson.scripts['verify:mermaid'],
  'node scripts/verify-mermaid-transformer.mjs && node scripts/verify-mermaid-renderer.mjs',
);

const layout = readFileSync(new URL('../src/layouts/PostLayout.astro', import.meta.url), 'utf8');
assert.match(layout, /import \{ renderMermaidBlocks \}/);
assert.match(layout, /void renderMermaidBlocks\(\)/);

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(css, /\.post-content \.mermaid-diagram\s*\{/);
assert.match(css, /\.mermaid-diagram svg\s*\{/);
assert.match(css, /pre\[data-mermaid\]\[data-mermaid-error='true'\]/);

console.log('Mermaid renderer verification passed.');
