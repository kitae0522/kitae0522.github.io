export const POST_CATEGORY_IDS = [
  'dev',
  'review',
  'retrospective',
  'investment',
  'daily',
  'thought',
  'career',
  'other',
] as const;

export type PostCategory = (typeof POST_CATEGORY_IDS)[number];

export const categoryLabels: Record<PostCategory, string> = {
  dev: '개발',
  review: '리뷰',
  retrospective: '회고',
  investment: '투자',
  daily: '일상',
  thought: '생각',
  career: '커리어',
  other: '기타',
};

export const categoryEntries = POST_CATEGORY_IDS.map((id) => ({
  id,
  label: categoryLabels[id],
}));
