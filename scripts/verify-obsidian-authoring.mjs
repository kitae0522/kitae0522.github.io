import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

const readJson = (relativePath) => JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'));
const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8');
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const appPath = '.obsidian/app.json';
const pluginsPath = '.obsidian/community-plugins.json';
const hotkeysPath = '.obsidian/hotkeys.json';
const templatePath = 'templates/blog-post.md';
const pluginPath = '.obsidian/plugins/blog-new-post-template/main.js';
const manifestPath = '.obsidian/plugins/blog-new-post-template/manifest.json';
const corePath = '.obsidian/plugins/blog-new-post-template/plugin-core.cjs';
const pluginPackagePath = '.obsidian/plugins/blog-new-post-template/package.json';

for (const path of [appPath, pluginsPath, hotkeysPath, templatePath, pluginPath, manifestPath, corePath, pluginPackagePath, 'src/content/images/.gitkeep']) {
  check(existsSync(resolve(root, path)), `${path} must exist`);
}

if (failures.length === 0) {
  const app = readJson(appPath);
  const plugins = readJson(pluginsPath);
  const hotkeys = readJson(hotkeysPath);
  const manifest = readJson(manifestPath);
  const pluginPackage = readJson(pluginPackagePath);
  const core = require(resolve(root, corePath));
  const rendered = core.renderTemplate('2026-08-04');

  check(app.newFileLocation === 'folder' && app.newFileFolderPath === 'src/content/posts', 'Cmd+N fallback must create notes in the posts folder');
  check(app.attachmentFolderPath === 'src/content/images', 'dragged images must go to src/content/images');
  check(app.useMarkdownLinks === true && app.newLinkFormat === 'relative', 'Obsidian must emit standard relative Markdown image links');
  check(plugins.includes('blog-new-post-template'), 'the blog template plugin must be enabled in this vault');
  check(
    hotkeys['blog-new-post-template:new-blog-post']?.some((hotkey) => hotkey.key === 'n' && hotkey.modifiers?.includes('Mod')),
    'Cmd+N must trigger the blog new-post command',
  );
  check(manifest.id === 'blog-new-post-template', 'the template plugin manifest must use the configured id');
  check(pluginPackage.type === 'commonjs', 'the local Obsidian plugin must remain CommonJS inside Astro projects');
  check(!read(pluginPath).includes("require('./plugin-core.cjs')"), 'the Obsidian plugin must bundle its helpers into main.js');
  check(read(templatePath).includes('{{date}}') && read(templatePath).includes('published: false'), 'the editable post template must include date and draft defaults');
  check(rendered.includes('date: 2026-08-04') && rendered.includes('category: other') && !rendered.includes('{{date}}'), 'new posts must receive a dated frontmatter snippet');
  check(core.isBlankPost('src/content/posts/new-note.md', '   ') && !core.isBlankPost('notes/new-note.md', ''), 'only blank posts receive the automatic template');
  check(read(pluginPath).includes('onLayoutReady') && read(pluginPath).includes("addCommand({") && read(pluginPath).includes("hotkeys: [{ modifiers: ['Mod'], key: 'n' }]") && read(pluginPath).includes("vault.on('create'"), 'the plugin must safely create and populate new post notes');
}

if (failures.length > 0) {
  console.error('Obsidian authoring verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Obsidian authoring verification passed.');
