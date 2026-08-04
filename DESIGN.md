---
name: Minimal Editorial Blog
theme: light-only
accent: "#e84057"
font: Pretendard Variable
---

# Minimal Editorial Blog

## Direction

Quiet, cool, and text-first. The home page is a simple personal index: a brief introduction followed by chronological article rows. It borrows CRO's restrained list rhythm, Toss's clear article hierarchy, and AI Frontier's structured metadata — never their dark-mode or dashboard treatment.

Avoid paper textures, warm neutrals, decorative imagery, cards, and visual effects. The memorable element is the calm editorial rhythm of the type and the thin rules between posts.

## Global rules

- Use `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for every text role. Load Pretendard Variable from the pinned v1.3.9 stylesheet so visitors do not depend on a locally installed font.
- Light-only product. Do not add a dark theme, theme toggle, or `prefers-color-scheme` switch.
- Every route uses a white reading canvas. Do not add a gray page frame or a card surface behind the article list.
- Use `#e84057` only for category markers, active states, and text-link decoration. Do not use it as a large background, gradient, or text color for body copy.
- Use square or nearly square corners. No pill UI except where semantic tags require it.
- Motion must be optional and respect `prefers-reduced-motion`.

## Type scale

| Role | Desktop | Mobile | Line height |
| --- | ---: | ---: | ---: |
| Post body | 18px | 17px | 1.78 / 1.82 |
| Post title | 44px | 34px | 1.16 / 1.18 |
| Home title | 36px | 32px | 1.20 / 1.22 |
| Home post title | 24px | 21px | 1.30 / 1.35 |
| Home post description | 16px | 16px | 1.60 |
| Section heading | 28px | 25px | 1.35 / 1.38 |
| Summary | 18px | 17px | 1.68 / 1.70 |
| Metadata and navigation | 14px / 15px | 14px / 14px | 1.55 / 1.50 |

Use restrained display tracking only for headings: `letter-spacing: -0.045em` for the post title and `-0.035em` for section headings. Body copy uses `-0.018em`.

## Layout

### Site shell

- Header: white, 64px desktop / 60px mobile, thin bottom rule, `Ted Song` left, `글 · 검색 · 소개` right. Use a 1120px shell so the header does not feel over-padded. Do not show a non-functional menu button; each navigation link has a 44px minimum touch target.
- Desktop home: a centered 760px text column on the same white canvas as the post detail route.
- Mobile shell: 20px horizontal padding.
- Keep main-page vertical spacing at 56px desktop and 40px mobile; use a 52px desktop / 40px mobile gap between intro and article rows.
- Footer: thin top rule, compact copyright, working RSS link, and GitHub link.

### Home

- Use the centered 760px home reading column directly; do not add a grid, hero feature, or sidebar.
- Intro: `Personal Blog` and `개발, 리뷰, 회고, 아무거나 적습니다. 제가 쓰고 싶을 때 업데이트됩니다.` Use no eyebrow, category marker, section heading, or home-page external links.
- Show posts as a one-column stack of unframed rows with thin bottom rules: 28px desktop and 24px mobile row padding. Hover underlines only the article title; never lift or fill the row.
- The category taxonomy is fixed: `개발`, `리뷰`, `회고`, `투자`, `일상`, `생각`, `커리어`, `기타`. Each row shows its 14px reader-facing text category, reading time, and date above its 24px desktop / 21px mobile title, then a 16px summary. Tags stay as quiet 14px text below. The category text uses `#e84057`; categories and tags never become pills.
- Place the eight categories as a plain-text filter below the introduction. It filters the published article list client-side, preserves the selected category in `?category=`, and uses `aria-pressed` plus a live result count. It is not a tab bar, chip row, or card surface.
- Show latest-first.

### Post

- Desktop article measure: 720px maximum on a pure-white canvas.
- Mobile article padding: 20px; never below 17px body text.
- Order: back link, title, summary, category/read-time, tags/date, divider, content, previous/next links.
- Show category/read-time on one line, then textual tags/date on one wrapping metadata line. Do not repeat reading time.
- Keep the post header compact: 24px after the back link, 28px before the divider, and 36px before content. Section headings use 40px desktop / 32px mobile top spacing.
- Paragraph gap: 25px desktop and 22px mobile.
- Blockquotes have a 2px `#e84057` left rule. Lists use small `#e84057` markers. Code blocks are neutral gray with horizontal scrolling.

## Accessibility and responsive behavior

- Keep text contrast at WCAG AA or higher.
- Use semantic `header`, `nav`, `main`, `article`, `section`, and ordered heading levels.
- Show clear keyboard focus with a visible `#e84057` outline.
- Do not convey state with color alone.
- Preserve readable line lengths: post body at 45–75 characters where possible; list page stays compact rather than stretching across the viewport.
- The `소개` navigation item routes to a real `/about/` page with the same personal-blog description, not an in-page placeholder.

## Functional polish

- `/search/` filters published posts in the browser by title, summary, category, and tags. It supports a shareable `?q=` query and announces result counts to assistive technology.
- `/rss.xml` is a real RSS endpoint generated from the published post collection. Expose it in the footer and through feed auto-discovery in the document head.
- Do not show controls or links unless their destination works in the static build.
