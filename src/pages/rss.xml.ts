import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL | undefined }) {
  const posts = await getCollection('posts', (post) => post.data.published);

  return rss({
    title: 'Ted Song',
    description: '개발, 리뷰, 회고, 아무거나 적습니다. 제가 쓰고 싶을 때 업데이트됩니다.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/posts/${post.id}/`,
      })),
    customData: '<language>ko-KR</language>',
  });
}
