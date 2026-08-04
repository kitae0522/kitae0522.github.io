const { MarkdownView, Notice, Plugin, TFile } = require('obsidian');

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
const isBlankPost = (path, content) => path.startsWith(POSTS_FOLDER) && path.endsWith('.md') && content.trim().length === 0;

module.exports = class BlogNewPostTemplatePlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'new-blog-post',
      name: '새 블로그 글 만들기',
      hotkeys: [{ modifiers: ['Mod'], key: 'n' }],
      callback: () => this.createPost(),
    });

    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(this.app.vault.on('create', (file) => {
        void this.populateBlankPost(file);
      }));
    });
  }

  today() {
    return new Date().toLocaleDateString('en-CA');
  }

  async loadTemplate() {
    const file = this.app.vault.getAbstractFileByPath(TEMPLATE_PATH);
    return file instanceof TFile ? this.app.vault.read(file) : DEFAULT_TEMPLATE;
  }

  async contentForToday() {
    return renderTemplate(this.today(), await this.loadTemplate());
  }

  nextPostPath() {
    const date = this.today();
    let index = 1;

    while (true) {
      const suffix = index === 1 ? 'untitled' : `untitled-${index}`;
      const path = `${POSTS_FOLDER}${date}-${suffix}.md`;
      if (!this.app.vault.getAbstractFileByPath(path)) return path;
      index += 1;
    }
  }

  async createPost() {
    const file = await this.app.vault.create(this.nextPostPath(), await this.contentForToday());
    await this.app.workspace.getLeaf(false).openFile(file);

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    view?.editor?.setCursor({ line: 1, ch: 8 });
    new Notice('새 블로그 초안을 만들었습니다.');
  }

  async populateBlankPost(file) {
    if (!(file instanceof TFile)) return;

    const content = await this.app.vault.read(file);
    if (!isBlankPost(file.path, content)) return;

    await this.app.vault.modify(file, await this.contentForToday());
  }
};
