# Minimal Editorial Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing Astro blog as a light-only, Pretendard-based minimal editorial reading experience.

**Architecture:** Keep the existing Astro content collection and `/posts/[...slug]` route. Replace the layout and page markup with semantic site-shell, home-index, and article structures; centralize all visual rules in `global.css` so page components only express content hierarchy.

**Tech Stack:** Astro 7, Astro content collections, Tailwind CSS 4 import, CSS custom properties.

## Global Constraints

- Use `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for all typography.
- Light-only: no dark-theme class, theme toggle, or `prefers-color-scheme` switch.
- Accent is exactly `#e84057`, used only for small semantic accents.
- Body copy is 18px/1.78 desktop and 17px/1.82 mobile; article measure is 690px desktop and mobile edge padding is 20px.
- Keep the existing published filtering, date sorting, dynamic post routes, and GitHub Pages base-path-safe post links.

---

### Task 1: Build the minimal editorial site shell and reading layouts

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/PostLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/posts/[...slug].astro` only if it is needed to pass adjacent post metadata into `PostLayout.astro`

**Interfaces:**

- Consumes: existing `posts` collection fields (`title`, `date`, `category`, `tags`, `published`, `description`).
- Produces: semantic home post index and article template with accessible navigation, readable responsive typography, and base-path-safe links.

- [x] **Step 1: Write the failing verification script**

Create `scripts/verify-minimal-editorial-design.mjs` that reads the source files and exits non-zero unless: the Pretendard Variable stack appears in `global.css`; `#e84057` appears in `global.css`; no source style file contains `prefers-color-scheme`; `index.astro` retains `post.data.published` filtering; and `PostLayout.astro` contains an `article` element.

- [x] **Step 2: Run the script and verify it fails**

Run: `node scripts/verify-minimal-editorial-design.mjs`

Expected: non-zero exit because the current design does not yet define the required font, accent, light-only guardrail, and article layout.

- [x] **Step 3: Implement the smallest complete redesign**

Replace the slate/blue Tailwind visual classes with the semantic minimal editorial markup and CSS described in `DESIGN.md`. Preserve existing content behavior. Add only non-routing header links/affordances; do not create search, RSS, about, or dark-mode functionality.

- [x] **Step 4: Run design verification and production build**

Run: `node scripts/verify-minimal-editorial-design.mjs && npm run build`

Expected: both commands exit 0 and Astro generates the home page and every published post route.

- [x] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro src/layouts/PostLayout.astro src/pages/index.astro src/pages/posts/[...slug].astro scripts/verify-minimal-editorial-design.mjs
git commit -m "feat: redesign blog as minimal editorial site"
```
