---
name: Minimal Editorial Blog
theme: light-only
accent: "#e84057"
font: Pretendard Variable
---

# Minimal Editorial Blog

## Direction

Quiet, cool, and text-first. The home page is a simple personal index: a brief introduction followed by one narrow chronological card list. It uses CRO 70% for whitespace and one-column reading flow, Toss 20% for category metadata, and AI Frontier 10% for reading-time, tag, and date scanning.

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
| Home title | 32px | 30px | 1.12 / 1.13 |
| Home post title | 20px | 20px | 1.32 |
| Home post description | 16px | 16px | 1.5 |
| Section heading | 27px | 24px | 1.33 / 1.34 |
| Summary | 17px | 16px | 1.65 / 1.63 |
| Metadata and navigation | 12px / 11px | 11px / 10px | 1.5 |

Use tight display tracking only for headings: `letter-spacing: -0.075em` for the post title, `-0.055em` for section headings. Body copy uses `-0.018em`.

## Layout

### Site shell

- Header: white, 58px desktop / 54px mobile, thin bottom rule, `Ted Song` left, `글 · 소개` right. Use a 760px inner navigation width.
- Desktop shell: a `max-width: 920px` pale-gray page frame with a centered 620px home reading column. Do not use a secondary sidebar or grid.
- Mobile shell: 18px horizontal padding; compact header with menu affordance.
- Keep home main-page vertical spacing at 104px desktop and 68px mobile; use a 72px desktop / 42px mobile gap between intro and post cards.
- Footer: thin top rule, compact copyright and GitHub link.

### Home

- Use the centered 620px home reading column directly; do not add a grid, hero feature, or sidebar.
- Intro: `Personal notes.` at 38px desktop / 33px mobile and one-line 17px desktop / 16px mobile description. Use no eyebrow, category marker, section heading, or home-page external links.
- Show posts as a one-column stack of white cards: 25px/28px desktop and 21px/20px mobile card padding, 9px radius, 16px desktop / 12px mobile gap, thin neutral border, and a 2px hover lift.
- Each card shows a 11px category chip plus reading time above its 24px desktop / 21px mobile title, then a 16px desktop / 15px mobile summary. The bottom metadata line has text tags and a 13px date. The category chip uses a pale `#e84057` background and red text; tags are text, not chips.
- Show latest-first.

### Post

- Desktop article measure: 690px maximum.
- Mobile article padding: 20px; never below 17px body text.
- Order: back link, category, title, summary, date/read-time, divider, content, previous/next links.
- Show the same category chip, reading time, textual tags, and date/read-time metadata below the summary.
- Paragraph gap: 25px desktop and 22px mobile.
- Blockquotes have a 2px `#e84057` left rule. Lists use small `#e84057` markers. Code blocks are neutral gray with horizontal scrolling.

## Accessibility and responsive behavior

- Keep text contrast at WCAG AA or higher.
- Use semantic `header`, `nav`, `main`, `article`, `section`, and ordered heading levels.
- Show clear keyboard focus with a visible `#e84057` outline.
- Do not convey state with color alone.
- Preserve readable line lengths: post body at 45–75 characters where possible; list page stays compact rather than stretching across the viewport.
