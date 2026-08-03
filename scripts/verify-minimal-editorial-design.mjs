import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const read = (relativePath) => readFile(resolve(root, relativePath), 'utf8');
const readOptional = async (relativePath) => {
  try {
    return await read(relativePath);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return '';
    throw error;
  }
};

const globalCss = await read('src/styles/global.css');
const baseLayout = await read('src/layouts/BaseLayout.astro');
const indexPage = await read('src/pages/index.astro');
const postLayout = await read('src/layouts/PostLayout.astro');
const aboutPage = await readOptional('src/pages/about.astro');
const searchPage = await readOptional('src/pages/search.astro');
const rssPage = await readOptional('src/pages/rss.xml.ts');
const categories = await readOptional('src/lib/categories.ts');
const contentConfig = await read('src/content.config.ts');
const packageJson = await read('package.json');

const hasRule = (selector, declarations) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rules = [...globalCss.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'g'))];

  return rules.some(([, body]) => declarations.every((declaration) => body.includes(declaration)));
};

const checks = [
  [
    globalCss.includes('"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'),
    'global.css must define the Pretendard Variable font stack',
  ],
  [
    baseLayout.includes('pretendardvariable.css') && baseLayout.includes('rel="preconnect"'),
    'BaseLayout.astro must load Pretendard Variable for production visitors',
  ],
  [globalCss.includes('#e84057'), 'global.css must define the #e84057 accent'],
  [!globalCss.includes('prefers-color-scheme'), 'global.css must not use prefers-color-scheme'],
  [
    hasRule('body', ['word-break: keep-all;', 'overflow-wrap: break-word;']),
    'Korean prose must preserve word boundaries while long tokens can wrap',
  ],
  [indexPage.includes('post.data.published'), 'index.astro must filter unpublished posts'],
  [/<article\b/.test(postLayout), 'PostLayout.astro must render an article element'],
  [
    postLayout.includes('role="heading" aria-level="1"') && !postLayout.includes('<h1 class="post-title"'),
    'PostLayout.astro must avoid a duplicate native h1 around Markdown content',
  ],
  [
    baseLayout.includes("pageKind?: 'home' | 'post' | 'about' | 'search';") &&
      baseLayout.includes("'home-view': pageKind === 'home'") &&
      indexPage.includes('pageKind="home"') &&
      postLayout.includes('pageKind="post"') && searchPage.includes('pageKind="search"'),
    'layouts must mark home, post, and search surfaces independently',
  ],
  [
    /body\s*\{[\s\S]*?background:\s*var\(--canvas\);/.test(globalCss) && !globalCss.includes('#f5f5f6'),
    'every route must use the same white reading canvas',
  ],
  [
    /\.post-page\s*\{[^}]*max-width:\s*720px;/.test(globalCss) &&
      /\.post-content\s*\{[^}]*font-size:\s*18px;[^}]*line-height:\s*1\.78;/.test(globalCss),
    'post detail must keep a white 720px reading measure with 18px body copy',
  ],
  [
    /@media \(max-width: 700px\)[\s\S]*?\.post-content\s*\{[\s\S]*?font-size:\s*17px;/.test(globalCss) &&
      /@media \(max-width: 700px\)[\s\S]*?\.site-shell\s*\{[\s\S]*?width:\s*calc\(100% - 40px\);/.test(globalCss),
    'mobile detail must retain 17px body copy and 20px gutters',
  ],
  [
    globalCss.includes('.post-content h1') && globalCss.includes('list-style: disc') && globalCss.includes('list-style: decimal'),
    'global.css must preserve readable prose headings and list markers',
  ],
  [
    globalCss.includes('.home-card__meta') && globalCss.includes('.post-category') &&
      !globalCss.includes('.taxonomy-chip') && !indexPage.includes('taxonomy-chip') &&
      postLayout.includes('post-category') && postLayout.includes('post-tags'),
    'home rows and post details must show taxonomy as editorial text instead of chips',
  ],
  [
    !baseLayout.includes('menu-button') &&
      hasRule('.site-nav', ['font-size: 15px;', 'gap: 4px;']) &&
      hasRule('.site-nav a', ['padding-inline: 10px;', 'min-width: 44px;', 'min-height: 44px;']) &&
      hasRule('.site-header__inner', ['min-height: 64px;']),
    'mobile navigation must use readable links without a disabled menu control',
  ],
  [
    hasRule('.home-card__meta,\n.home-card__tags,\n.post-metadata,\n.post-category', ['font-size: 14px;']) &&
      hasRule('.post-tags', ['margin: 0;']),
    'taxonomy and reading metadata must remain readable at mobile scale',
  ],
  [
    baseLayout.includes('searchHref') && baseLayout.includes('rssHref') &&
      baseLayout.includes('rel="alternate"') && searchPage.includes('data-search-item') &&
      searchPage.includes('search-input') && searchPage.includes("addEventListener('input'") &&
      rssPage.includes("from '@astrojs/rss'") && rssPage.includes("getCollection('posts'") &&
      packageJson.includes('"@astrojs/rss"'),
    'search and RSS links must point to real, functional site features',
  ],
  [
    indexPage.includes('>Personal Blog</h1>') &&
      indexPage.includes('개발, 리뷰, 회고, 아무거나 적습니다. 제가 쓰고 싶을 때 업데이트됩니다.') &&
      indexPage.includes('categoryFilters') && indexPage.includes('data-category-filter') &&
      indexPage.includes('home-card__meta'),
    'home must use the supplied personal-blog copy and a working category filter',
  ],
  [
    categories.includes("'dev'") && categories.includes("'review'") &&
      categories.includes("'retrospective'") && categories.includes("'investment'") &&
      categories.includes("'daily'") && categories.includes("'thought'") &&
      categories.includes("'career'") && categories.includes("'other'") &&
      categories.includes("dev: '개발'") && categories.includes("review: '리뷰'") &&
      categories.includes("retrospective: '회고'") && categories.includes("investment: '투자'") &&
      categories.includes("daily: '일상'") && categories.includes("thought: '생각'") &&
      categories.includes("career: '커리어'") && categories.includes("other: '기타'") &&
      contentConfig.includes('z.enum(POST_CATEGORY_IDS)') &&
      postLayout.includes("import { categoryLabels, type PostCategory }") &&
      searchPage.includes("import { categoryLabels }") && indexPage.includes("import { categoryEntries, categoryLabels }") &&
      !categories.includes("'project'") && !categories.includes("project: '프로젝트'") &&
      !indexPage.includes("startup: '제품'") && !searchPage.includes("daily: '기록'"),
    'all reader-facing category labels must come from the shared eight-category taxonomy',
  ],
  [
    baseLayout.includes('aboutHref') && baseLayout.includes('pageKind === \'about\'') &&
      aboutPage.includes('pageKind="about"') && aboutPage.includes('Ted Song의 개인 블로그입니다.') &&
      aboutPage.includes('개발, 리뷰, 회고, 아무거나 적습니다. 제가 쓰고 싶을 때 업데이트됩니다.'),
    'the introduction link must lead to a real about page',
  ],
  [
    postLayout.includes('post-metadata') && postLayout.includes('post-tags') &&
      !postLayout.includes('읽는 시간 약'),
    'post metadata must combine tags and date without repeating reading time',
  ],
  [
    hasRule('.site-shell', ['width: min(calc(100% - 64px), 1120px);']) &&
      hasRule('.home-page', ['max-width: 760px;']) &&
      hasRule('.home-description', ['max-width: none;', 'text-wrap: balance;']) &&
      hasRule('.home-card', ['padding: 28px 0;', 'border-bottom: 1px solid var(--rule);', 'border-radius: 0;']) &&
      hasRule('.post-content h1,\n.post-content h2,\n.post-content h3,\n.post-content h4', ['margin-block: 40px 0;', 'letter-spacing: -0.035em;']),
    'the editorial rhythm must use a wider shell and unframed article rows',
  ],
  [
    /@media \(max-width: 700px\)[\s\S]*?\.site-shell\s*\{[\s\S]*?width:\s*calc\(100% - 40px\);/.test(globalCss) &&
      /@media \(max-width: 700px\)[\s\S]*?\.site-main\s*\{[\s\S]*?padding-block:\s*40px 56px;/.test(globalCss) &&
      /@media \(max-width: 700px\)[\s\S]*?\.post-content h1,\s*\.post-content h2,\s*\.post-content h3,\s*\.post-content h4\s*\{[\s\S]*?margin-top:\s*32px;/.test(globalCss),
    'mobile editorial rhythm must tighten article entry and heading spacing',
  ],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);

if (failures.length > 0) {
  console.error('Minimal editorial design verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Minimal editorial design verification passed.');
