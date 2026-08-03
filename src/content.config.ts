import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { POST_CATEGORY_IDS } from './lib/categories';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(POST_CATEGORY_IDS),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    description: z.string().optional(),
  }),
});

export const collections = { posts };
