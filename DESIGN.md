---
name: Minimal Editorial Blog
theme: light-only
accent: "#e84057"
font: Pretendard Variable
---

# Minimal Editorial Blog

## Direction

Quiet, cool, and text-first. The home page is a simple personal index: brief introduction, relevant links, then a chronological post list. It follows the sparse reading flow of blog.cro.sh while preserving the structure of the associated portfolio.

Avoid paper textures, warm neutrals, decorative imagery, large cards, and visual effects. The memorable element is the calm editorial rhythm of the type and the thin rules between posts.

## Global rules

- Use `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for every text role.
- Light-only product. Do not add a dark theme, theme toggle, or `prefers-color-scheme` switch.
- Canvas and surfaces are white. Use neutral gray only for secondary text, rules, inline code, and subtle hover backgrounds.
- Use `#e84057` only for category markers, active states, and text-link decoration. Do not use it as a large background, gradient, or text color for body copy.
- Use square or nearly square corners. No pill UI except where semantic tags require it.
- Motion must be optional and respect `prefers-reduced-motion`.

## Type scale

| Role | Desktop | Mobile | Line height |
| --- | ---: | ---: | ---: |
| Post body | 18px | 17px | 1.78 / 1.82 |
| Post title | 48px max | 34px | 1.14 / 1.17 |
| Section heading | 27px | 24px | 1.33 / 1.34 |
| Summary | 17px | 16px | 1.65 / 1.63 |
| Metadata and navigation | 12px / 11px | 11px / 10px | 1.5 |

Use tight display tracking only for headings: `letter-spacing: -0.075em` for the post title, `-0.055em` for section headings. Body copy uses `-0.018em`.

## Layout

### Site shell

- Header: white, thin bottom rule, logo left, `글 · 소개 · 검색` right.
- Desktop shell: `max-width: 920px`; horizontal padding scales from 24px to 66px.
- Mobile shell: 20px horizontal padding; compact header with menu affordance.
- Footer: thin top rule, copyright, RSS/GitHub links.

### Home

- One centered content column, maximum 458px reading/list width.
- Intro: compact title, one-line personal description, portfolio/GitHub/RSS links.
- Every post row has category, title, optional description, and date. Rows are separated by a 1px neutral rule.
- Show latest-first. No category card grid.

### Post

- Desktop article measure: 690px maximum.
- Mobile article padding: 20px; never below 17px body text.
- Order: back link, category, title, summary, date/read-time, divider, content, previous/next links.
- Paragraph gap: 25px desktop and 22px mobile.
- Blockquotes have a 2px `#e84057` left rule. Lists use small `#e84057` markers. Code blocks are neutral gray with horizontal scrolling.

## Accessibility and responsive behavior

- Keep text contrast at WCAG AA or higher.
- Use semantic `header`, `nav`, `main`, `article`, `section`, and ordered heading levels.
- Show clear keyboard focus with a visible `#e84057` outline.
- Do not convey state with color alone.
- Preserve readable line lengths: post body at 45–75 characters where possible; list page stays compact rather than stretching across the viewport.
