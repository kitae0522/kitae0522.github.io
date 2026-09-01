import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const assetDirectory = resolve(root, 'dist/_astro');
const cssFiles = readdirSync(assetDirectory)
  .filter((file) => file.endsWith('.css'))
  .map((file) => resolve(assetDirectory, file));

assert.ok(cssFiles.length > 0, 'Astro build must emit at least one CSS asset');

const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];
const chrome = chromeCandidates.find((candidate) => {
  try {
    execFileSync(candidate, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});

assert.ok(chrome, 'Chrome or Chromium is required to verify computed link styles');

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'blog-link-styles-'));
const fixturePath = resolve(temporaryDirectory, 'fixture.html');
const stylesheets = cssFiles
  .map((file) => `<link rel="stylesheet" href="${pathToFileURL(file).href}">`)
  .join('\n');

writeFileSync(fixturePath, `<!doctype html>
<html>
  <head>${stylesheets}</head>
  <body>
    <a id="global-link" href="#global">Global link</a>
    <div class="post-content"><a id="post-link" href="#post">Post link</a></div>
    <nav class="site-nav"><a id="nav-link" href="#nav">Nav link</a></nav>
    <script>
      for (const id of ['global-link', 'post-link', 'nav-link']) {
        const style = getComputedStyle(document.getElementById(id));
        document.body.setAttribute('data-' + id + '-decoration-line', style.textDecorationLine);
        document.body.setAttribute('data-' + id + '-decoration-color', style.textDecorationColor);
      }
    </script>
  </body>
</html>`);

try {
  const renderedHtml = execFileSync(chrome, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    '--dump-dom',
    pathToFileURL(fixturePath).href,
  ], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  assert.match(renderedHtml, /data-global-link-decoration-line="underline"/);
  assert.match(renderedHtml, /data-post-link-decoration-line="underline"/);
  assert.match(renderedHtml, /data-post-link-decoration-color="rgb\(232, 64, 87\)"/);
  assert.match(renderedHtml, /data-nav-link-decoration-line="none"/);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}

console.log('Global and post links remain visible while navigation links stay undecorated.');
