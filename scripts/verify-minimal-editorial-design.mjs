import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const read = (relativePath) => readFile(resolve(root, relativePath), 'utf8');

const globalCss = await read('src/styles/global.css');
const baseLayout = await read('src/layouts/BaseLayout.astro');
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
  [
    postLayout.includes('role="heading" aria-level="1"') && !postLayout.includes('<h1 class="post-title"'),
    'PostLayout.astro must avoid a duplicate native h1 around Markdown content',
  ],
  [globalCss.includes('.post-content h1'), 'global.css must style Markdown h1 content'],
  [globalCss.includes('list-style: disc') && globalCss.includes('list-style: decimal'), 'global.css must restore prose list markers'],
  [
    globalCss.includes('.text-link') && globalCss.includes('.back-link') && globalCss.includes('.post-content a') &&
      (globalCss.match(/text-decoration-line:\s*underline/g) ?? []).length >= 3,
    'global.css must explicitly underline editorial text links',
  ],
  [
    globalCss.includes('pre[class*="astro-code"]') &&
      globalCss.includes('background: var(--surface-subtle) !important') &&
      globalCss.includes('color: var(--ink) !important'),
    'global.css must neutralize Shiki code colors for light-only output',
  ],
  [globalCss.includes('--quiet: #66666b'), 'global.css secondary text must meet AA contrast on white'],
  [
    /@media \(max-width: 700px\)[\s\S]*?\.post-content h1,\s*\.post-content h2\s*\{[\s\S]*?font-size: 24px;/.test(globalCss),
    'global.css must use a 24px mobile section heading',
  ],
  [
    /@media \(max-width: 700px\)[\s\S]*?\.post-content h1,\s*\.post-content h2\s*\{[\s\S]*?font-size: 24px;/.test(globalCss),
    'global.css must use 24px mobile article headings',
  ],
  [
    /@media \(max-width: 700px\)[\s\S]*?\.post-byline\s*\{[\s\S]*?font-size: 11px;/.test(globalCss) &&
      /@media \(max-width: 700px\)[\s\S]*?\.home-post__date\s*\{[\s\S]*?font-size: 11px;/.test(globalCss),
    'global.css must use 11px mobile metadata',
  ],
  [
    /@media \(max-width: 700px\)[\s\S]*?\.site-nav,\s*\.footer-links,\s*\.home-links\s*\{[\s\S]*?font-size: 10px;/.test(globalCss),
    'global.css must use 10px mobile navigation',
  ],
  [
    !indexPage.includes('id="search"') && !indexPage.includes('id="rss"') &&
      !baseLayout.includes('#search') && !baseLayout.includes('#rss'),
    'the site must not expose non-functional search or RSS links',
  ],
  [baseLayout.includes('menu-button'), 'BaseLayout.astro must expose a mobile menu affordance'],
  [
    globalCss.includes('width: min(calc(100% - 48px), 920px);') &&
      globalCss.includes('padding-block: 40px 56px;') &&
      /@media \(max-width: 700px\)[\s\S]*?\.site-shell\s*\{[\s\S]*?width: calc\(100% - 36px\);/.test(globalCss) &&
      /@media \(max-width: 700px\)[\s\S]*?\.site-main\s*\{[\s\S]*?padding-block: 28px 48px;/.test(globalCss),
    'global.css must keep compact shell gutters and vertical spacing',
  ],
  [
    globalCss.includes('min-height: 50px;') &&
      /@media \(max-width: 700px\)[\s\S]*?\.site-header__inner\s*\{[\s\S]*?min-height: 46px;/.test(globalCss),
    'global.css must use the compact 50px/46px header',
  ],
  [baseLayout.includes('>kitae.</a>') || baseLayout.includes('>kitae.</a'), 'BaseLayout.astro must use the kitae. wordmark'],
  [
    indexPage.includes('Personal notes.') &&
      !indexPage.includes('home-intro__eyebrow') &&
      !indexPage.includes('section-heading') &&
      !indexPage.includes('section-count'),
    'index.astro must use the compact Personal notes home intro',
  ],
  [
    globalCss.includes('.home-post__title') && globalCss.includes('font-size: 18px;') &&
      globalCss.includes('.home-post__summary') && globalCss.includes('font-size: 14px;') &&
      globalCss.includes('padding: 16px 0;'),
    'global.css must use compact home post typography and row padding',
  ],
  [
      indexPage.includes('postIndex === 0') &&
      indexPage.includes('post-link__marker') &&
      !indexPage.includes('post-link__category') &&
      indexPage.indexOf('home-post__summary') < indexPage.indexOf('home-post__date'),
    'index.astro must show only the first marker and place date below description',
  ],
  [
    globalCss.includes('.post-link__marker') &&
      globalCss.includes('width: 5px;') &&
      globalCss.includes('height: 5px;'),
    'global.css must define the compact 5px home marker',
  ],
  [
    baseLayout.includes('GitHub') && !baseLayout.includes('${homeHref}#rss'),
    'BaseLayout.astro footer must stay compact with GitHub only',
  ],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);

if (failures.length > 0) {
  console.error('Minimal editorial design verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Minimal editorial design verification passed.');
