import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const appConfigPath = join(root, '.obsidian/app.json');
const obsidianGuidePath = join(root, 'OBSIDIAN.md');
const raycastCommandPath = join(root, 'raycast/new-blog-post.sh');

check(existsSync(appConfigPath), 'Obsidian app configuration must exist');
check(existsSync(obsidianGuidePath), 'Obsidian authoring documentation must exist');
check(existsSync(raycastCommandPath), 'the Raycast new-post command must exist');
check(!existsSync(join(root, '.obsidian/plugins')), 'Obsidian community plugins must stay removed');
check(!existsSync(join(root, '.obsidian/community-plugins.json')), 'Obsidian community plugin registration must stay removed');

if (existsSync(appConfigPath)) {
  const config = JSON.parse(readFileSync(appConfigPath, 'utf8'));
  check(config.newFileFolderPath === 'src/content/posts', 'Obsidian new files must target post content');
  check(config.attachmentFolderPath === 'src/content/images', 'Obsidian attachments must target content images');
  check(config.useMarkdownLinks === true, 'Obsidian must insert Markdown image links');
}

if (existsSync(raycastCommandPath)) {
  const command = readFileSync(raycastCommandPath, 'utf8');
  check(command.includes('@raycast.schemaVersion 1'), 'the Raycast command must declare schema version');
  check(command.includes('@raycast.title 새 블로그 글'), 'the Raycast command must expose the approved title');
  check(command.includes('@raycast.mode compact'), 'the Raycast command must show compact completion feedback');
  check(command.includes('scripts/create-post.mjs'), 'the Raycast command must use the shared post generator');
  check(command.includes('open -a "Obsidian"'), 'the Raycast command must open the draft in Obsidian');
}

if (failures.length === 0) {
  const outputDirectory = mkdtempSync(join(tmpdir(), 'blog-post-'));

  try {
    const result = spawnSync(process.execPath, [
      join(root, 'scripts/create-post.mjs'),
      '--title', 'Raycast에서 글쓰기',
      '--category', 'review',
      '--tags', '테스트,#블로그',
      '--description', 'Raycast 작성 흐름을 검증합니다.',
      '--date', '2026-08-04',
      '--output-dir', outputDirectory,
    ], { encoding: 'utf8' });
    const postPath = join(outputDirectory, '2026-08-04-001.md');

    check(result.status === 0, `the shared post generator must exit successfully: ${result.stderr}`);
    check(existsSync(postPath), 'the shared post generator must create a dated draft');

    if (existsSync(postPath)) {
      const content = readFileSync(postPath, 'utf8');
      check(content.includes('title: "Raycast에서 글쓰기"'), 'the draft must contain the requested title');
      check(content.includes('category: review'), 'the draft must contain the selected category');
      check(content.includes('- "테스트"') && content.includes('- "블로그"'), 'the draft must normalize tag hashes');
      check(content.includes('published: false'), 'the draft must start unpublished');
    }
  } finally {
    rmSync(outputDirectory, { recursive: true, force: true });
  }
}

if (failures.length > 0) {
  console.error('Obsidian and Raycast authoring verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Obsidian and Raycast authoring verification passed.');
