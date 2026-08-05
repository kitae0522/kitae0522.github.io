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

const bindingFailureBlock = createBlock('graph TD\n  A --> B');
let bindingError;
const bindingFailureResult = await renderMermaidBlocks({
  root: { querySelectorAll: () => [bindingFailureBlock] },
  loadMermaid: async () => ({
    initialize() {},
    async render() {
      return {
        svg: '<svg aria-label="diagram"></svg>',
        bindFunctions() {
          throw new Error('bind failed');
        },
      };
    },
  }),
  createContainer,
  reportError(error) {
    bindingError = error;
  },
});
assert.deepEqual(bindingFailureResult, { rendered: 0, failed: 1 });
assert.equal(
  bindingFailureBlock.replacement,
  undefined,
  'Binding failure must leave the original source block in place',
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
