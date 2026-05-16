<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Evergreen content — tag system

Evergreen articles live in the `evergreen` Supabase table (`EvergreenItem`). Each record carries a `tags` field (`string[]`). Tags are the bridge between database content and the pill navigation in the UI: when a user taps a pill, the app filters evergreen items whose `tags` array contains that pill's label (exact string match, case-sensitive).

## Canonical tag list

Use **only** these values. Do not invent new tags without updating the pill lists in `components/tabs/HomeTab.tsx` and `components/tabs/DiscoverTab.tsx` (and this document).

| Tag | Shown in |
|---|---|
| `neighbourhood history` | Home, Discover |
| `Rome transport` | Home, Discover |
| `Roman cuisine` | Home, Discover |
| `walking routes` | Home, Discover |
| `historic markets` | Home, Discover |
| `street art` | Home, Discover |
| `parks & gardens` | Home, Discover |
| `free museums` | Discover only |
| `local food` | Discover only |

## Rules for content creators / agents

- An article **must have at least one** tag from the list above; otherwise it will never surface in the UI.
- An article **may have multiple** tags if it genuinely spans topics (e.g. a piece on the Testaccio market fits both `historic markets` and `local food`). Do not over-tag.
- Tags are filters, not a full taxonomy — keep them broad. If a topic does not fit any existing tag, flag it for a human decision rather than coining a new one.
- `active: true` must be set for an article to appear. `published_week` should follow the `YYYY-WXX` format (e.g. `2026-W20`).

## Adding a new tag

1. Decide the English label (lowercase, consistent with existing style).
2. Add it to `EVERGREEN_PILLS` in both `HomeTab.tsx` and `DiscoverTab.tsx` (or just one, if it only belongs in one section) with an appropriate colour variable.
3. Update the table above.

# UI Language

All user-facing strings in the UI **must be in English**. This applies to labels, section headers, button text, nav tabs, pills, date formats, and any other copy rendered to the screen. Content that comes from the database (place names, story titles, descriptions) is exempt — only hardcoded UI strings are in scope.
