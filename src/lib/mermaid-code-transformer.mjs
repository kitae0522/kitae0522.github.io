export const mermaidCodeTransformer = {
  name: 'mermaid-code-block',
  pre(node) {
    if (this.options.lang === 'mermaid') {
      node.properties['data-mermaid'] = '';
    }
  },
};
