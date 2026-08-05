# Post Timestamp Ordering Design

## Goal

Order published posts by their full publication timestamp, newest first, while continuing to display only the calendar date.

## Data model

Each post keeps the existing `date` frontmatter field. New posts use an ISO 8601 timestamp with an explicit Korea timezone offset, for example `2026-08-05T16:42:16+09:00`. Existing date-only values remain valid and parse as midnight.

## Behaviour

- The home page, search page, RSS feed, and adjacent-post navigation sort by `date` descending.
- Posts published on the same calendar date use their timestamp; filenames never affect ordering.
- The UI continues to render `YYYY.MM.DD` only.

## Verification

Add a content-ordering test with two posts on one day and different timestamps. It must prove that the later timestamp appears first. Run the project test command and production build.
