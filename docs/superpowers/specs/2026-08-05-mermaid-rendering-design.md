# Mermaid Diagram Rendering Design

## Goal

Render fenced `mermaid` code blocks in published Markdown posts as responsive Mermaid diagrams while preserving the blog's static Astro deployment and light editorial design.

## Chosen approach

Use client-side Mermaid rendering. Mark `mermaid` code fences during Astro's Markdown highlighting step, then dynamically import Mermaid only when a rendered post contains a marked block.

This approach was selected over build-time SVG generation because it works on the existing GitHub Pages build without adding a browser binary or browser automation to CI. A third option, requiring authors to use a custom Astro or MDX component, was rejected because existing posts and the Obsidian workflow use plain Markdown.

## Architecture

### Markdown marker

Add a small Shiki transformer in the Astro Markdown configuration. The transformer adds a stable data attribute to the generated `pre` element only when the fenced code language is `mermaid`. Other fenced code blocks retain their current syntax highlighting and styling.

### Browser renderer

Add a post-layout module script that:

1. Finds marked Mermaid code blocks inside `.post-content`.
2. Exits without importing Mermaid when none exist.
3. Dynamically imports the local `mermaid` package when at least one block exists.
4. Initializes Mermaid once with `startOnLoad: false`, `securityLevel: 'strict'`, a light theme, and the Pretendard font stack.
5. Renders each source block to SVG with a unique DOM identifier.
6. Replaces the source block only after that diagram renders successfully.

The package is bundled by Astro and served with the site. No runtime CDN dependency is added.

## Rendering and styling

Rendered diagrams use a semantic container with an accessible label derived from the diagram position. SVG output scales down to the article width without stretching beyond its natural size. The container allows horizontal scrolling for diagrams that cannot remain readable at narrow widths.

The surrounding surface stays white and uses the existing editorial spacing. Mermaid uses a light theme and Pretendard so diagrams remain consistent with `DESIGN.md`. Existing neutral code-block styles remain unchanged for non-Mermaid fences.

## Error handling and security

Each diagram renders independently. Before replacement, the original code block remains in the document. If parsing or rendering fails, that block stays visible as source code and receives an accessible error status; other valid diagrams continue rendering.

`securityLevel: 'strict'` remains fixed by the site. Diagram-authored HTML and click handlers are not enabled. Markdown content remains author-controlled, but the strict setting prevents future content changes from silently broadening Mermaid's trust boundary.

## Testing and verification

Follow red-green TDD with a focused verification script that initially fails against the current project. It will check the Markdown marker, conditional Mermaid loader, strict configuration, error fallback, and responsive styles.

After implementation:

- Run the focused Mermaid verification script.
- Run the existing project verification scripts.
- Run `npm run build` and confirm the generated post route succeeds.
- Start Astro with `astro dev --background` as required by `AGENTS.md`.
- Open a post containing a Mermaid test diagram and verify that it becomes SVG at desktop and mobile widths.
- Verify an ordinary fenced code block remains a code block.
- Verify invalid Mermaid source remains readable instead of disappearing.
- Stop the background development server after browser verification.

Any temporary test post used for live verification must remain unpublished or be removed before handoff.

## Out of scope

- Build-time SVG generation
- Mermaid theme switching or dark mode
- Interactive diagram click handlers
- MDX-only authoring components
- Changes to category, routing, RSS, search, or the Obsidian authoring workflow
