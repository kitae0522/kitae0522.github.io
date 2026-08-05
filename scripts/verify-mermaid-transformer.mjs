import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const transformerUrl = new URL('../src/lib/mermaid-code-transformer.mjs', import.meta.url);

assert.ok(existsSync(transformerUrl), 'Mermaid code transformer module must exist');

const { mermaidCodeTransformer } = await import(transformerUrl.href);

function transform(lang) {
  const node = { type: 'element', tagName: 'pre', properties: {}, children: [] };
  mermaidCodeTransformer.pre.call({ options: { lang } }, node);
  return node;
}

assert.equal(
  transform('mermaid').properties['data-mermaid'],
  '',
  'Mermaid fences must receive the data-mermaid marker',
);
assert.equal(
  transform('javascript').properties['data-mermaid'],
  undefined,
  'Non-Mermaid fences must remain unmarked',
);

const astroConfig = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
assert.match(astroConfig, /import \{ mermaidCodeTransformer \}/);
assert.match(astroConfig, /transformers:\s*\[mermaidCodeTransformer\]/);

console.log('Mermaid transformer verification passed.');
