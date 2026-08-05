import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const post = readFileSync(new URL('../src/content/posts/2026-08-04-002.md', import.meta.url), 'utf8');

assert.match(css, /\.post-content table\s*\{[\s\S]*overflow-x:\s*auto/);
assert.match(css, /\.post-content table\s*\{[\s\S]*width:\s*min\(1120px, calc\(100vw - 64px\)\)/);
assert.match(css, /\.post-content \.mermaid-diagram\s*\{[\s\S]*width:\s*min\(1120px, calc\(100vw - 64px\)\)/);
assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.post-content table\s*\{[\s\S]*white-space:\s*nowrap/);
assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.post-content \.mermaid-diagram\s*\{[\s\S]*transform:\s*none/);
assert.match(post, /flowchart TD/);

console.log('Rich content layout keeps tables and Mermaid diagrams readable.');
