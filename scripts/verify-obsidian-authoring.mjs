import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const appConfigPath = join(root, '.obsidian/app.json');
const obsidianGuidePath = join(root, 'OBSIDIAN.md');
const templatePath = join(root, 'templates/post.md');
const packagePath = join(root, 'package.json');

check(existsSync(appConfigPath), 'Obsidian app configuration must exist');
check(existsSync(obsidianGuidePath), 'Obsidian authoring documentation must exist');
check(existsSync(templatePath), 'the native Obsidian post template must exist');
check(!existsSync(join(root, 'raycast')), 'the Raycast command directory must be removed');
check(!existsSync(join(root, 'scripts/create-post.mjs')), 'the Raycast-only post generator must be removed');
check(!existsSync(join(root, '.obsidian/plugins/blog-terminal')), 'the retired terminal community plugin must stay removed');

if (existsSync(appConfigPath)) {
  const config = JSON.parse(readFileSync(appConfigPath, 'utf8'));
  check(config.newFileFolderPath === 'src/content/posts', 'Obsidian new files must target post content');
  check(config.attachmentFolderPath === 'src/content/images', 'Obsidian attachments must target content images');
  check(config.useMarkdownLinks === true, 'Obsidian must insert Markdown image links');
}

if (existsSync(templatePath)) {
  const template = readFileSync(templatePath, 'utf8');
  check(template.includes('title: "{{title}}"'), 'the template must use the active note title');
  check(template.includes('date: "{{date}}"'), 'the template must insert today\'s date');
  check(template.includes('category: "dev"'), 'the template must include a default category');
  check(template.includes('published: false'), 'the template must start unpublished');
}

if (existsSync(packagePath)) {
  const packageConfig = JSON.parse(readFileSync(packagePath, 'utf8'));
  check(!Object.hasOwn(packageConfig.scripts, 'post:new'), 'the Raycast-only post command must be removed');
}

if (failures.length > 0) {
  console.error('Obsidian authoring verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Obsidian authoring verification passed.');
