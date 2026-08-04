const POSTS_FOLDER = 'src/content/posts/';
const TEMPLATE_PATH = 'templates/blog-post.md';
const DEFAULT_TEMPLATE = `---
title: ""
date: {{date}}
category: other
tags: []
published: false
description: ""
---

`;

const renderTemplate = (date, template = DEFAULT_TEMPLATE) => template.replaceAll('{{date}}', date);

const isBlankPost = (path, content) => path.startsWith(POSTS_FOLDER) && path.endsWith('.md') && content.trim() === '';

module.exports = {
  DEFAULT_TEMPLATE,
  POSTS_FOLDER,
  TEMPLATE_PATH,
  isBlankPost,
  renderTemplate,
};
