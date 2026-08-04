---
version: alpha
name: "Dark Editorial with Vivid Orange Accent"
theme: "dark-only"
description: "A Korean-language engineering and product blog built on a near-black (#1a1a1c) surface with vivid orange (#ff4b0f) as the sole brand accent. Pretendard Variable is used across all text roles for a unified Korean and Latin reading experience. The layout is editorial-first: a hero carousel with a large featured article image, followed by an article listing with category tags and a ranked popular-posts sidebar. Muted grays support navigation, body text, metadata, and UI chrome, while orange is reserved for CTAs, links, active labels, and focus states. Geometry remains soft and structured, and elevation stays minimal and content-forward."
colors:
  surface-base: "#1a1a1c"
  pure-black: "#000000"
  body-text-gray: "#afafaf"
  brand-orange: "#ff4b0f"
  link-gray: "#69727d"
  muted-gray: "#b0b0b0"
  pure-white: "#ffffff"
  dim-gray: "#9e9e9e"
typography:
  display-heading:
    fontFamily: "Pretendard Variable"
    fontSize: "36px"
    fontWeight: "700"
    lineHeight: "1.24"
  section-heading:
    fontFamily: "Pretendard Variable"
    fontSize: "32px"
    fontWeight: "700"
    lineHeight: "44.8px"
  article-title:
    fontFamily: "Pretendard Variable"
    fontSize: "20px"
    fontWeight: "700"
    lineHeight: "29px"
  body-regular:
    fontFamily: "Pretendard Variable"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-medium:
    fontFamily: "Pretendard Variable"
    fontSize: "15px"
    fontWeight: "400"
    lineHeight: "30px"
  label-semibold:
    fontFamily: "Pretendard Variable"
    fontSize: "15px"
    fontWeight: "600"
    lineHeight: "24px"
  caption-regular:
    fontFamily: "Pretendard Variable"
    fontSize: "13px"
    fontWeight: "400"
    lineHeight: "18px"
  caption-semibold:
    fontFamily: "Pretendard Variable"
    fontSize: "13px"
    fontWeight: "600"
    lineHeight: "20.8px"
  caption-bold:
    fontFamily: "Pretendard Variable"
    fontSize: "13px"
    fontWeight: "700"
    lineHeight: "18px"
  subheading:
    fontFamily: "Pretendard Variable"
    fontSize: "17px"
    fontWeight: "400"
    lineHeight: "27.2px"
rounded:
  radius-button: "10px"
  radius-card-sm: "8px"
  radius-card-md: "12px"
  radius-card-lg: "16px"
  radius-card-xl: "24px"
  radius-pill: "999px"
  radius-badge-sm: "10px"
spacing:
  space-2: "2px"
  space-4: "4px"
  space-6: "6px"
  space-8: "8px"
  space-9: "9px"
  space-10: "10px"
  space-12: "12px"
  space-14: "14px"
  space-16: "16px"
  space-20: "20px"
  space-24: "24px"
  space-28: "28px"
  space-32: "32px"
  space-36: "36px"
  space-40: "40px"
  space-60: "60px"
  space-64: "64px"
---

## Overview

A Korean-language engineering and product blog built on a near-black (#1a1a1c) surface with vivid orange (#ff4b0f) as the sole brand accent. **Pretendard Variable** is used across all text roles for a unified Korean and Latin reading experience. The layout is editorial-first: a hero carousel with a large featured article image, followed by an article listing with category tags and a ranked "popular posts" sidebar. Muted grays support navigation, body text, metadata, and UI chrome, while orange is reserved for CTAs, links, active labels, and focus states. Geometry remains soft and structured, and elevation stays minimal and content-forward.

**Signature traits:**

- Variable single-family hierarchy: Builds hierarchy from Pretendard Variable across weights 400, 600, and 700 rather than multiple font families.
- Dark editorial palette: Uses a near-black canvas and one vivid orange action color.
- Soft, rounded geometry: Generous corner rounding up to 999px.
- Minimal elevation: Depth comes from one validated shadow token.

### Theme Policy

This product is **dark-only**. The near-black `surface-base` is the permanent page canvas, not one option in a theme switcher.

- Do not provide a light theme or theme toggle.
- Do not change the theme from `prefers-color-scheme` or operating-system settings.
- Use `surface-base` for the document, navigation, footer, and primary content surfaces.
- Use `pure-black` only for deeper surfaces such as dialogs and emphasized cards.
- Use `pure-white` only for high-emphasis content. Never use it as a page or section background.
- Keep form controls, loading states, empty states, and error states within the same dark surface hierarchy.

## Colors

The palette uses eight validated color tokens across one dark theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**

- **surface-primary** maps to `surface-base`: Primary page and hero background.
- **action-text** maps to `brand-orange`: CTA buttons, links, active labels, and focus states.
- **content-text** maps to `body-text-gray`: Primary body copy and supporting navigation text.
- **surface-text** maps to `pure-white`: Headings and high-emphasis content on dark surfaces.

### Primary Brand

- **Surface Base** (#1a1a1c): Primary page, hero, and major section background. Role: primary. {authored: rgb(26, 26, 28), space: rgb}

### Text Scale

- **Body Text Gray** (#afafaf): Primary body text, navigation items, and hero descriptive text. Role: text. {authored: rgb(175, 175, 175), space: rgb}
- **Brand Orange** (#ff4b0f): Primary CTA, links, active navigation, labels, and focus states. Role: text/action. {authored: rgb(255, 75, 15), space: rgb}
- **Link Gray** (#69727d): Tertiary text and muted link states. Role: text. {authored: rgb(105, 114, 125), space: rgb}
- **Muted Gray** (#b0b0b0): Secondary text, footer labels, and metadata. Role: text. {authored: rgb(176, 176, 176), space: rgb}
- **Pure White** (#ffffff): Headings, high-emphasis text, input text, and icon fills on dark surfaces. Role: text. {authored: rgb(255, 255, 255), space: rgb}

### Interactive

- **Dim Gray** (#9e9e9e): Subtle borders, dividers, and secondary footer elements. Role: border. {authored: rgb(158, 158, 158), space: rgb}

### Surface & Shadows

- **Pure Black** (#000000): Modal/dialog backgrounds, deep cards, and high-contrast filled controls. Role: background. {authored: rgb(0, 0, 0), space: rgb}

## Typography

Typography uses **Pretendard Variable** across all hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Use Pretendard Variable throughout for a uniform Korean and Latin reading experience. The documented weight range spans regular, semibold, and bold. Sizes range from 13px to 36px.

### Font Loading and Fallback

Use the variable webfont as the primary face and keep a system-safe Korean fallback stack:

```css
font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
  "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", sans-serif;
```

Load Pretendard Variable once at the application root. Use numeric `font-weight` values so the browser selects the appropriate point on the variable font axis. Avoid synthetic bold and duplicate per-weight font files.

### Font Roles

- **Headline Font**: Pretendard Variable
- **Body Font**: Pretendard Variable

### Type Scale Evidence

| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero article headline | Pretendard Variable | 36px | 700 | 1.24 | normal | `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", sans-serif` | Adapted token |
| Section titles like '전체 아티클' | Pretendard Variable | 32px | 700 | 44.8px | normal | Same shared stack | Adapted token |
| Article card titles in listing view | Pretendard Variable | 20px | 700 | 29px | normal | Same shared stack | Adapted token |
| Primary body text | Pretendard Variable | 16px | 400 | 24px | normal | Same shared stack | Adapted token |
| Secondary body text and article descriptions | Pretendard Variable | 15px | 400 | 30px | normal | Same shared stack | Adapted token |
| Navigation labels, button text, and UI labels | Pretendard Variable | 15px | 600 | 24px | normal | Same shared stack | Adapted token |
| Bylines, author names, and metadata | Pretendard Variable | 13px | 400 | 18px | normal | Same shared stack | Adapted token |
| Tag labels and small emphasized metadata | Pretendard Variable | 13px | 600 | 20.8px | normal | Same shared stack | Adapted token |
| Ranked list numbers and strong small labels | Pretendard Variable | 13px | 700 | 18px | normal | Same shared stack | Adapted token |
| Intermediate subheadings and featured article subtitles | Pretendard Variable | 17px | 400 | 27.2px | normal | Same shared stack | Adapted token |

## Layout

The responsive system uses three breakpoint tiers: mobile, tablet, and desktop.

This system uses an 8px base grid with scale values 2, 4, 6, 8, 9, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 60, and 64.

### Responsive Strategy

- **mobile (<= 768px)**: Constrain layout for small viewports and prioritize vertical stacking.
- **tablet (640–1024px)**: Increase spacing and column structure for medium-width viewports.
- **desktop (>= 1024px)**: Expand layout density and horizontal composition for wide viewports.

### Spacing System

| Token | Value | Px | Notes |
|------|-------|----|-------|
| space-2 | 2px | 2 | Extracted spacing token |
| space-4 | 4px | 4 | Extracted spacing token |
| space-6 | 6px | 6 | Extracted spacing token |
| space-8 | 8px | 8 | Extracted spacing token |
| space-9 | 9px | 9 | Extracted spacing token |
| space-10 | 10px | 10 | Extracted spacing token |
| space-12 | 12px | 12 | Extracted spacing token |
| space-14 | 14px | 14 | Extracted spacing token |
| space-16 | 16px | 16 | Extracted spacing token |
| space-20 | 20px | 20 | Extracted spacing token |
| space-24 | 24px | 24 | Extracted spacing token |
| space-28 | 28px | 28 | Extracted spacing token |
| space-32 | 32px | 32 | Extracted spacing token |
| space-36 | 36px | 36 | Extracted spacing token |
| space-40 | 40px | 40 | Extracted spacing token |
| space-60 | 60px | 60 | Extracted spacing token |
| space-64 | 64px | 64 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence

| Shadow Token | Layers | Details |
|--------------|--------|---------|
| inset-border | 1 | inset 0px 0px 0px 1px rgba(0, 0, 0, 0) |

### Interaction Signals

| Theme | Signal | Evidence |
|-------|--------|----------|
| Dark | outline-color | rgb(175, 175, 175); rgb(255, 255, 255); rgb(255, 75, 15) |
| Dark | outline-width | 3px |
| Dark | outline-offset | 0px |
| Dark | transform | matrix(1, 0, 0, 1, 0, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles

| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| radius-card-sm | 8px | 8 | Control corner |
| radius-button | 10px | 10 | Control corner |
| radius-card-md | 12px | 12 | Control corner |
| radius-card-lg | 16px | 16 | Card corner |
| radius-card-xl | 24px | 24 | Large surface corner |
| radius-pill | 999px | 999 | Pill and fully rounded surface |

### Geometry Evidence

| Radius Token | Shape | Units |
|--------------|-------|-------|
| radius-button | 10px | px |
| radius-card-sm | 8px | px |
| radius-card-md | 12px | px |
| radius-card-lg | 16px | px |
| radius-card-xl | 24px | px |
| radius-pill | 999px | px |
| radius-badge-sm | 10px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect the variable single-family hierarchy, soft rounded geometry, and minimal evidence-backed elevation without adding unsupported visual claims.

| Do | Don't |
|----|-------|
| Do use Pretendard Variable for every text role | Don't mix unrelated display and body font families |
| Do use numeric weights 400, 600, and 700 | Don't load separate static font files when the variable face is available |
| Do preserve the dark surface hierarchy across every route and overlay | Don't add a light theme, theme toggle, or automatic system-theme switching |
| Do use pure white for high-emphasis content only | Don't use pure white as a page, section, or card background |
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do reserve brand orange for the single most important action per screen | Don't introduce blue or additional accent colors |
| Do verify evidence before writing new design-system guidance | Don't invent new shadows without interaction evidence |

## Responsive Evidence

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <= 640px | only screen and (max-width: 640px) |
| Breakpoint 2 | <= 768px | (max-width: 768px) |
| Mobile | >= 640px | (min-width: 640px) |
| Mobile | 641–810px | only screen and (min-width: 641px) and (max-width: 810px) |
| Tablet | >= 768px | (min-width: 768px) |
| Tablet | 769–1024px | (min-width: 769px) and (max-width: 1024px) |
| Desktop | >= 1024px | (min-width: 1024px) |
| Desktop | >= 1280px | (min-width: 1280px) |
| Breakpoint 9 | Unknown | (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.9) |

## Agent Prompt Guide

### Example Component Prompts

- Create a button component using brand orange, the Pretendard Variable label style, and spacing tokens.
- Create a card component with the mapped radius role and evidence-backed elevation.
- Create a form input component using the inferred typography hierarchy and border roles.

### Iteration Guide

1. Start with the extracted palette and Pretendard Variable typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in the output.
5. Iterate with the smallest diffs and re-check section hierarchy after each change.
