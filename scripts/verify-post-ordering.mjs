import { readFile } from 'node:fs/promises';

const postIds = ['2026-08-04-001', '2026-08-04-002'];

const posts = await Promise.all(postIds.map(async (id) => {
  const source = await readFile(new URL(`../src/content/posts/${id}.md`, import.meta.url), 'utf8');
  const date = source.match(/^date:\s*(.+)$/m)?.[1];

  if (!date) throw new Error(`${id} is missing a date`);

  return { id, date: new Date(date) };
}));

posts.sort((a, b) => b.date.valueOf() - a.date.valueOf());

if (posts[0]?.id !== '2026-08-04-002') {
  throw new Error(`Expected 2026-08-04-002 first, received ${posts[0]?.id ?? 'no post'}`);
}

console.log('Post ordering uses the latest timestamp.');
