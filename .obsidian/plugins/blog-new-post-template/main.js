const { FuzzySuggestModal, MarkdownView, Notice, Plugin, TFile } = require('obsidian');

const POSTS_FOLDER = 'src/content/posts/';
const TEMPLATE_PATH = 'templates/blog-post.md';
const DEFAULT_TEMPLATE = `---
title: ""
date: {{date}}
category: {{category}}
tags: []
published: false
description: ""
---

`;

const CATEGORY_OPTIONS = [
  { id: 'dev', label: '개발' },
  { id: 'review', label: '리뷰' },
  { id: 'retrospective', label: '회고' },
  { id: 'investment', label: '투자' },
  { id: 'daily', label: '일상' },
  { id: 'thought', label: '생각' },
  { id: 'career', label: '커리어' },
  { id: 'other', label: '기타' },
];

const renderTemplate = (date, category = 'other', template = DEFAULT_TEMPLATE) => template
  .replaceAll('{{date}}', date)
  .replaceAll('{{category}}', category);
const isBlankPost = (path, content) => path.startsWith(POSTS_FOLDER) && path.endsWith('.md') && content.trim().length === 0;

class CategorySuggestModal extends FuzzySuggestModal {
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.didChoose = false;
  }

  getItems() {
    return CATEGORY_OPTIONS;
  }

  getItemText(item) {
    return `${item.label} ${item.id}`;
  }

  renderSuggestion(item, element) {
    element.setText(`${item.label} · ${item.id}`);
  }

  onChooseItem(item) {
    this.didChoose = true;
    this.onChoose(item);
  }

  onClose() {
    if (!this.didChoose) this.onChoose(null);
  }
}

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

  async contentForToday(category = 'other') {
    return renderTemplate(this.today(), category, await this.loadTemplate());
  }

  chooseCategory() {
    return new Promise((resolve) => {
      const modal = new CategorySuggestModal(this.app, resolve);
      modal.setPlaceholder('카테고리 선택');
      modal.open();
    });
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
    const category = await this.chooseCategory();
    if (!category) return;

    const file = await this.app.vault.create(this.nextPostPath(), await this.contentForToday(category.id));
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
