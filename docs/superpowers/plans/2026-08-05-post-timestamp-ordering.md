# Post Timestamp Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display newly published posts first by their full publication timestamp.

**Architecture:** Preserve Astro's existing `date` schema and replace date-only values with ISO 8601 timestamps. Existing descending sorts already consume `Date` values, so they will automatically use timestamp precision. Add a regression test around the content ordering contract.

**Tech Stack:** Astro content collections, TypeScript, Node.js test runner.

## Global Constraints

- Use `date` as the single publication-ordering field.
- New timestamps must include `+09:00`.
- Do not use filenames as an ordering tie-breaker.
- Keep the rendered date format as `YYYY.MM.DD`.

---

### Task 1: Timestamp-based post order

**Files:**
- Modify: `src/content/posts/2026-08-04-001.md:3`
- Modify: `src/content/posts/2026-08-04-002.md:3`
- Test: `scripts/verify-post-ordering.mjs`

**Interfaces:**
- Consumes: `src/content/posts/*.md` frontmatter `date` values accepted by `z.coerce.date()`.
- Produces: Later publication timestamps sort first in the home, search, RSS, and adjacent-post sorts.

- [ ] **Step 1: Write the failing test**

Create `scripts/verify-post-ordering.mjs` to read both frontmatter date values, parse them with `Date`, sort descending, and assert `2026-08-04-002` precedes `2026-08-04-001`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-post-ordering.mjs`

Expected: failure because date-only values are equal and do not establish publication order.

- [ ] **Step 3: Write minimal implementation**

Set `2026-08-04-001.md` to a midnight `+09:00` timestamp and set `2026-08-04-002.md` to the later confirmed publication timestamp. Keep the existing `date` field name so all current pages consume the value without a new sorting interface.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-post-ordering.mjs`

Expected: success and output naming `2026-08-04-002` as newest.

- [ ] **Step 5: Verify the production build**

Run: `npm run build`

Expected: Astro content parsing and static generation succeed.
