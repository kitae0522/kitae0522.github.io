// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { mermaidCodeTransformer } from './src/lib/mermaid-code-transformer.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://kitae0522.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      transformers: [mermaidCodeTransformer],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
