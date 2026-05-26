# Evergreen Tagline + Discover Bleed — Design Spec

**Date:** 2026-05-27  
**Status:** Approved

---

## Overview

Two improvements to the Discover tab evergreen listing:

1. A new `tagline` field (~30 words) replaces the raw `body_md` truncation as the preview text for each evergreen item.
2. The `lead_cover_url` header image bleeds in from the right edge of each list row, creating a subtle visual texture without interfering with readability.

---

## 1. Database

**File:** `supabase/migrations/20260527000000_evergreen_tagline.sql`

```sql
ALTER TABLE evergreen ADD COLUMN IF NOT EXISTS tagline TEXT;
```

- Nullable, no default, no backfill.
- Existing records start with `tagline = null` and fall back to `editorial_intro_md` in the UI until updated manually or via the evergreen skill.

---

## 2. Type

**File:** `lib/types.ts` — `EvergreenItem` interface

Add after the existing editorial fields:

```ts
tagline: string | null;
```

No API changes needed: `getEvergreen()` already uses `select('*')`.

---

## 3. DiscoverTab — Evergreen List Item

**File:** `components/tabs/DiscoverTab.tsx`

### Preview text

```
tagline ?? editorial_intro_md?.slice(0, 120) ?? undefined
```

If both are null: only the title is shown, no preview line.

### Image bleed (right edge)

Applied only when `lead_cover_url` is present.

```
┌─────────────────────────────────────────┐
│                              │░░░░░░░░░│
│  Title                       │░░img░░░│  ← right 40%, opacity 0.18
│  Tagline preview text…       │░░░░░░░░│     fades left via mask
│                              │░░░░░░░░│
└─────────────────────────────────────────┘
```

- Container: `position: relative`, `overflow: hidden`
- Image div: `position: absolute`, `right: 0`, `top: 0`, `bottom: 0`, `width: 40%`, `backgroundImage: url(lead_cover_url)`, `backgroundSize: cover`, `backgroundPosition: center`, `opacity: 0.18`, `maskImage: linear-gradient(to right, transparent 0%, black 100%)`
- Text wrapper: `position: relative`, `zIndex: 1`
- If `lead_cover_url` is null: no background element rendered

---

## 4. Skill — pausania-evergreen

**File:** `~/.claude/skills/pausania-evergreen/SKILL.md`

### Step 4 — scheda structure

Add `Tagline` as a required field immediately after the title line:

```
### [Title]

Tagline: [~30 words — discovery hook. Exposes the central idea clearly
          and invitingly. Not recycled from body_md. Same dry register
          as the rest of the project — no exclamation marks, no
          "Discover amazing…" openers. Says something concrete.]
```

### Step 7 — SQL INSERT

Add `tagline` to the column list and VALUES:

```sql
INSERT INTO evergreen (
  title,
  tagline,
  body_md,
  ...
) VALUES (
  '[Title]',
  '[tagline text]',
  E'[body_md]',
  ...
);
```

---

## Constraints & Rules

- `tagline` is distinct from `editorial_intro_md`: different length (30 vs 60–70 words), different purpose (list hook vs article lede), shown in different contexts (listing vs detail view).
- The bleed image is purely decorative — no alt text required, no semantic role.
- The image opacity (0.18) is intentionally low. Do not increase it to a point where it competes with body text contrast.
- UI strings remain in English per project convention.
