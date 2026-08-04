import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const createPostPath = join(root, 'scripts/create-post.mjs');
const templatePath = join(root, 'templates/post.md');
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

check(!existsSync(join(root, '.obsidian')), 'Obsidian vault configuration must be removed');
check(!existsSync(join(root, 'OBSIDIAN.md')), 'Obsidian authoring documentation must be removed');
check(existsSync(createPostPath), 'the Orca post creation command must exist');
check(existsSync(templatePath), 'the Orca post template must exist');

if (failures.length === 0) {
  const outputDirectory = mkdtempSync(join(tmpdir(), 'blog-post-'));

  try {
    const result = spawnSync(process.execPath, [
      createPostPath,
      '--title', 'Orca에서 글쓰기',
      '--category', 'review',
      '--tags', '테스트,#블로그',
      '--description', 'Orca 작성 흐름을 검증합니다.',
      '--date', '2026-08-04',
      '--output-dir', outputDirectory,
      '--no-open',
    ], { encoding: 'utf8' });

    const postPath = join(outputDirectory, '2026-08-04-001.md');
    check(result.status === 0, `the post creation command must exit successfully: ${result.stderr}`);
    check(existsSync(postPath), 'the post creation command must create a dated draft');

    if (existsSync(postPath)) {
      const content = readFileSync(postPath, 'utf8');
      check(content.includes('title: "Orca에서 글쓰기"'), 'the draft must contain the requested title');
      check(content.includes('category: review'), 'the draft must contain the selected category');
      check(content.includes('- "테스트"') && content.includes('- "블로그"'), 'the draft must normalize tag hashes');
      check(content.includes('published: false'), 'the draft must start unpublished');
    }

    check(!readFileSync(createPostPath, 'utf8').includes('git push'), 'the Orca authoring command must never publish automatically');
  } finally {
    rmSync(outputDirectory, { recursive: true, force: true });
  }
}

if (failures.length > 0) {
  console.error('Orca authoring verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Orca authoring verification passed.');
