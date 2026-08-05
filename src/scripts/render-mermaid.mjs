export const MERMAID_SELECTOR = '.post-content pre[data-mermaid]';

export const MERMAID_CONFIG = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  suppressErrorRendering: true,
  fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
};

let diagramSequence = 0;

export async function renderMermaidBlocks({
  root = globalThis.document,
  loadMermaid = async () => (await import('mermaid')).default,
  createContainer = () => document.createElement('figure'),
  reportError = (error) => console.error('Mermaid diagram rendering failed.', error),
} = {}) {
  const blocks = root ? [...root.querySelectorAll(MERMAID_SELECTOR)] : [];
  if (blocks.length === 0) return { rendered: 0, failed: 0 };

  const mermaid = await loadMermaid();
  mermaid.initialize(MERMAID_CONFIG);

  let rendered = 0;
  let failed = 0;

  for (const [index, block] of blocks.entries()) {
    const source = block.textContent?.trim() ?? '';
    const container = createContainer();
    container.className = 'mermaid-diagram';
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', `Mermaid 다이어그램 ${index + 1}`);

    try {
      const id = `mermaid-diagram-${++diagramSequence}`;
      const { svg, bindFunctions } = await mermaid.render(id, source);
      container.innerHTML = svg;
      bindFunctions?.(container);
      block.replaceWith(container);
      rendered += 1;
    } catch (error) {
      block.dataset.mermaidError = 'true';
      block.setAttribute('role', 'status');
      block.setAttribute(
        'aria-label',
        `Mermaid 다이어그램 ${index + 1} 렌더링 실패. 원본 코드.`,
      );
      reportError(error);
      failed += 1;
    }
  }

  return { rendered, failed };
}
