import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { basename, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const defaultOutputDirectory = join(root, 'src/content/posts');
const templatePath = join(root, 'templates/post.md');
const categories = [
  ['dev', '개발'],
  ['review', '리뷰'],
  ['retrospective', '회고'],
  ['investment', '투자'],
  ['daily', '일상'],
  ['thought', '생각'],
  ['career', '커리어'],
  ['other', '기타'],
];

const argumentsMap = new Map();
const flags = new Set();
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (!argument.startsWith('--')) continue;

  const key = argument.slice(2);
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) flags.add(key);
  else {
    argumentsMap.set(key, value);
    index += 1;
  }
}

const option = (name) => argumentsMap.get(name)?.trim();
const today = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const parseTags = (value = '') => value
  .split(',')
  .map((tag) => tag.trim().replace(/^#+/, ''))
  .filter(Boolean);

const tagsYaml = (tags) => tags.length === 0
  ? 'tags: []'
  : `tags:\n${tags.map((tag) => `  - ${JSON.stringify(tag)}`).join('\n')}`;

const nextPostPath = (directory, date) => {
  const matchingNumbers = existsSync(directory)
    ? (readdirSync(directory)
      .map((file) => basename(file).match(new RegExp(`^${date}-(\\d{3})\\.md$`))?.[1])
      .filter(Boolean)
      .map(Number))
    : [];
  const nextNumber = Math.max(0, ...matchingNumbers) + 1;
  return join(directory, `${date}-${String(nextNumber).padStart(3, '0')}.md`);
};

const normalizeCategory = (value) => {
  const normalized = value.trim().toLowerCase();
  const numericIndex = Number(normalized);
  if (Number.isInteger(numericIndex) && numericIndex >= 1 && numericIndex <= categories.length) {
    return categories[numericIndex - 1][0];
  }
  return categories.find(([id]) => id === normalized)?.[0] ?? null;
};

const requiredAnswer = async (reader, label, currentValue) => {
  if (currentValue) return currentValue;
  while (true) {
    const answer = (await reader.question(label)).trim();
    if (answer) return answer;
  }
};

const createPost = async () => {
  const interactive = input.isTTY && !option('title');
  const reader = interactive ? createInterface({ input, output }) : null;

  try {
    const title = reader
      ? await requiredAnswer(reader, '제목: ', option('title'))
      : option('title');
    if (!title) throw new Error('--title이 필요합니다. Orca Terminal에서는 인자 없이 실행해도 됩니다.');

    let category = option('category');
    if (reader && !category) {
      console.log('\n카테고리');
      for (const [index, [id, label]] of categories.entries()) console.log(`${index + 1}. ${label} (${id})`);
      category = await reader.question('번호 또는 id: ');
    }
    const normalizedCategory = normalizeCategory(category ?? '');
    if (!normalizedCategory) throw new Error('유효한 category가 필요합니다. 예: review 또는 2');

    const tags = parseTags(reader && !option('tags') ? await reader.question('태그 (쉼표 구분, 선택): ') : option('tags'));
    const description = reader && !option('description')
      ? await reader.question('목록 설명 (선택): ')
      : (option('description') ?? '');
    const date = option('date') ?? today();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('date는 YYYY-MM-DD 형식이어야 합니다.');

    const outputDirectory = resolve(option('output-dir') ?? defaultOutputDirectory);
    mkdirSync(outputDirectory, { recursive: true });
    const postPath = nextPostPath(outputDirectory, date);
    const template = readFileSync(templatePath, 'utf8');
    const content = template
      .replaceAll('{{title}}', JSON.stringify(title.replaceAll('\n', ' ').trim()))
      .replaceAll('{{date}}', date)
      .replaceAll('{{category}}', normalizedCategory)
      .replaceAll('{{tags}}', tagsYaml(tags))
      .replaceAll('{{description}}', JSON.stringify(description.replaceAll('\n', ' ').trim()));

    writeFileSync(postPath, content, 'utf8');
    console.log(`초안 생성: ${postPath}`);

    if (!flags.has('no-open')) {
      spawnSync('orca', ['file', 'open', postPath], { cwd: root, stdio: 'ignore' });
    }
  } finally {
    reader?.close();
  }
};

createPost().catch((error) => {
  console.error(`글 생성 실패: ${error.message}`);
  process.exit(1);
});
