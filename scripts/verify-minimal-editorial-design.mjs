import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const read = (relativePath) => readFile(resolve(root, relativePath), 'utf8');

const globalCss = await read('src/styles/global.css');
const indexPage = await read('src/pages/index.astro');
const postLayout = await read('src/layouts/PostLayout.astro');

const checks = [
  [
    globalCss.includes('"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'),
    'global.css must define the Pretendard Variable font stack',
  ],
  [globalCss.includes('#e84057'), 'global.css must define the #e84057 accent'],
  [
    !globalCss.includes('prefers-color-scheme'),
    'global.css must not use prefers-color-scheme',
  ],
  [indexPage.includes('post.data.published'), 'index.astro must filter unpublished posts'],
  [/<article\b/.test(postLayout), 'PostLayout.astro must render an article element'],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);

if (failures.length > 0) {
  console.error('Minimal editorial design verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Minimal editorial design verification passed.');
