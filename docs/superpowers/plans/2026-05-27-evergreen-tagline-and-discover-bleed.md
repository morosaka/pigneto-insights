# Evergreen Tagline + Discover Bleed — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `tagline` field (~30 words) to the `evergreen` table and update the Discover tab list item to show it with a right-edge image bleed from `lead_cover_url`.

**Architecture:** Four touch points — DB migration, TypeScript type, React component, content skill. Each is independent; apply in order to avoid type errors. No test framework exists; verification is via `npx tsc --noEmit` and dev server visual check.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Supabase (MCP), CSS-in-JS (inline styles)

---

## File Map

| Action | File |
|--------|------|
| Create | `supabase/migrations/20260527000000_evergreen_tagline.sql` |
| Modify | `lib/types.ts` — `EvergreenItem` interface |
| Modify | `components/tabs/DiscoverTab.tsx` — evergreen row |
| Modify | `~/.claude/skills/pausania-evergreen/SKILL.md` — Step 4, Step 5, Step 6, Step 7 |

---

## Task 1: DB Migration

**Files:**
- Create: `supabase/migrations/20260527000000_evergreen_tagline.sql`

- [ ] **Step 1: Create the migration file**

```sql
ALTER TABLE evergreen ADD COLUMN IF NOT EXISTS tagline TEXT;
```

Save to `supabase/migrations/20260527000000_evergreen_tagline.sql`.

- [ ] **Step 2: Apply via Supabase MCP**

Use the `mcp__supabase__apply_migration` tool:
- name: `evergreen_tagline`
- query: the SQL above

- [ ] **Step 3: Verify the column exists**

Run via `mcp__supabase__execute_sql`:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'evergreen' AND column_name = 'tagline';
```

Expected: one row — `tagline | text | YES`

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260527000000_evergreen_tagline.sql
git commit -m "feat: add tagline column to evergreen table"
```

---

## Task 2: TypeScript Type

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Add `tagline` to `EvergreenItem`**

In `lib/types.ts`, locate the `EvergreenItem` interface. After `editorial_intro_md`:

```ts
// before
editorial_intro_md: string | null;
featured_in_issue_id: string | null;

// after
editorial_intro_md: string | null;
tagline: string | null;
featured_in_issue_id: string | null;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add tagline field to EvergreenItem type"
```

---

## Task 3: DiscoverTab Component

**Files:**
- Modify: `components/tabs/DiscoverTab.tsx` (lines 184–200, the evergreen `filteredEvergreen.map` block)

- [ ] **Step 1: Replace the evergreen row button**

Locate the current evergreen row (inside `filteredEvergreen.map`):

```tsx
// CURRENT — replace this entire button
<button key={e.id} onClick={() => setSelectedEvergreen(e)}
  style={{
    width: '100%', textAlign: 'left', background: 'none', border: 'none',
    padding: '12px 0', borderBottom: '1px solid var(--avorio-dim)',
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
  } as React.CSSProperties}>
  <div className="t-heading" style={{ marginBottom: 4 }}>{e.title}</div>
  {e.body_md && (
    <div className="t-meta">{e.body_md.slice(0, 120)}…</div>
  )}
</button>
```

Replace with:

```tsx
<button key={e.id} onClick={() => setSelectedEvergreen(e)}
  style={{
    position: 'relative', overflow: 'hidden',
    width: '100%', textAlign: 'left', background: 'none', border: 'none',
    padding: '12px 0', borderBottom: '1px solid var(--avorio-dim)',
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
  } as React.CSSProperties}>
  {e.lead_cover_url && (
    <div style={{
      position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%',
      backgroundImage: `url(${e.lead_cover_url})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      opacity: 0.18,
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
      maskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
    }} />
  )}
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div className="t-heading" style={{ marginBottom: 4 }}>{e.title}</div>
    {(e.tagline || e.editorial_intro_md) && (
      <div className="t-meta">
        {e.tagline ?? `${e.editorial_intro_md!.slice(0, 120)}…`}
      </div>
    )}
  </div>
</button>
```

Key details:
- `position: relative` + `overflow: hidden` on the outer button contain the absolute image div.
- The image div uses `WebkitMaskImage` (Safari) and `maskImage` (standard): the gradient fades from transparent at the left edge to opaque at the right, so the image bleeds in from the right and disappears toward the text.
- `opacity: 0.18` keeps the image subtle enough not to compete with the text.
- Fallback chain: `tagline` (shown as-is) → `editorial_intro_md` truncated to 120 chars with `…` → nothing (title only).
- If `lead_cover_url` is null, the bleed div is not rendered.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visual check in dev server**

```bash
npm run dev
```

Open the app at `http://localhost:3000`, navigate to the Discover tab → Rome Evergreen section. Verify:
- Items with `lead_cover_url` show the right-edge bleed (faint image bleeding from the right).
- Items without `lead_cover_url` render cleanly with no background.
- Items with `tagline` show the tagline text.
- Items without `tagline` but with `editorial_intro_md` show the truncated intro with `…`.
- Items with neither show only the title.
- Tapping any item still opens the `EvergreenDetail` overlay correctly.

- [ ] **Step 4: Commit**

```bash
git add components/tabs/DiscoverTab.tsx
git commit -m "feat: evergreen discover row — tagline preview + right-edge image bleed"
```

---

## Task 4: Skill Update

**Files:**
- Modify: `~/.claude/skills/pausania-evergreen/SKILL.md`

- [ ] **Step 1: Add `Tagline` to Step 4 scheda structure**

Locate the scheda structure block in Step 4 (around line 124):

```markdown
### [Titolo in inglese — evocativo, non didascalico]

Tags: [tag1, tag2, tag3]          ← in English, sempre
Source notebook: [Nome Notebook]
```

Replace with:

```markdown
### [Titolo in inglese — evocativo, non didascalico]

Tagline: [~30 words — discovery hook for the Discover tab listing.
           Not recycled from body_md. Dry register: no exclamation marks,
           no "Discover amazing…" openers. States something concrete and
           specific about the content that makes the reader want to tap.]

Tags: [tag1, tag2, tag3]          ← in English, sempre
Source notebook: [Nome Notebook]
```

- [ ] **Step 2: Add `tagline` to Step 5 presentazione format**

Locate the Step 5 presentation block (around line 208):

```markdown
### Scheda 1: [Titolo]

Tags: [tag1, tag2]
Source notebook: [Nome]
News trigger: [in English]
```

Replace with:

```markdown
### Scheda 1: [Titolo]

Tagline: [~30 words]

Tags: [tag1, tag2]
Source notebook: [Nome]
News trigger: [in English]
```

- [ ] **Step 3: Add `tagline` to Step 6 draft format**

Locate the Step 6 draft structure block (around line 265):

```markdown
## [Titolo scheda 1]

Tags: ...
Source notebook: ...
News trigger: ...
```

Replace with:

```markdown
## [Titolo scheda 1]

Tagline: ...

Tags: ...
Source notebook: ...
News trigger: ...
```

- [ ] **Step 4: Add `tagline` to Step 7 SQL INSERT**

Locate the INSERT statement in Step 7. Replace:

```sql
INSERT INTO evergreen (
  title,
  body_md,
  footnote_md,        -- NULL se non presente
  category,
  tags,
  source_notebook,
  cover_url,          -- immagine inline nel body_md
  lead_cover_url,     -- header image (orizzontale 2:1), NULL se non ancora pronta
  active,
  published_week      -- formato 'YYYY-WWW' es. '2026-W22'
) VALUES (
  '[Titolo]',
  E'[body_md con immagine inline]',
  '[footnote_md o NULL]',
  '[categoria principale]',
  ARRAY['tag1', 'tag2', 'tag3'],
  '[Nome Notebook]',
  '[cover_url o NULL]',
  true,
  '[YYYY-WWW]'
);
```

With:

```sql
INSERT INTO evergreen (
  title,
  tagline,
  body_md,
  footnote_md,        -- NULL se non presente
  category,
  tags,
  source_notebook,
  cover_url,          -- immagine inline nel body_md
  lead_cover_url,     -- header image (orizzontale 2:1), NULL se non ancora pronta
  active,
  published_week      -- formato 'YYYY-WWW' es. '2026-W22'
) VALUES (
  '[Titolo]',
  '[tagline ~30 words]',
  E'[body_md con immagine inline]',
  '[footnote_md o NULL]',
  '[categoria principale]',
  ARRAY['tag1', 'tag2', 'tag3'],
  '[Nome Notebook]',
  '[cover_url o NULL]',
  true,
  '[YYYY-WWW]'
);
```

- [ ] **Step 5: Verify symlink to Cowork is current**

The skill file is symlinked to Cowork per global CLAUDE.md convention. Check the symlink exists:

```bash
ls -la "$HOME/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/a86d5241-1538-4c2a-b79f-82cd6d020d71/0fe4c0dd-1f9b-4cb0-a49b-225b8541ab10/skills/pausania-evergreen/SKILL.md"
```

If the symlink is missing, create it:

```bash
COWORK="$HOME/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/a86d5241-1538-4c2a-b79f-82cd6d020d71/0fe4c0dd-1f9b-4cb0-a49b-225b8541ab10/skills"
mkdir -p "$COWORK/pausania-evergreen"
ln -sf "$HOME/.claude/skills/pausania-evergreen/SKILL.md" "$COWORK/pausania-evergreen/SKILL.md"
```

Since the skill file is symlinked (not a copy), no further sync step is needed — editing the original updates the symlink target automatically.

- [ ] **Step 6: Commit**

```bash
git -C /Volumes/WDSN770/Pausania/Pigneto/pigneto-insights commit --allow-empty -m "docs: update evergreen skill — add tagline field to schema and SQL INSERT"
```

Note: the skill file lives outside the project repo (`~/.claude/skills/`), so there are no project files to stage. Use `--allow-empty` only if no other project files changed in this task; otherwise skip this commit and include the message in the next natural commit.

---

## Self-Review Checklist

- [x] **Spec coverage:** DB ✓, type ✓, component ✓, skill (Step 4 ✓, Step 5 ✓, Step 6 ✓, Step 7 ✓)
- [x] **No placeholders:** all steps have actual code
- [x] **Type consistency:** `tagline: string | null` defined in Task 2, used as `e.tagline` in Task 3 — matches
- [x] **Fallback chain:** explicit in Task 3 Step 1 and matches spec
- [x] **Safari prefix:** `WebkitMaskImage` included alongside `maskImage` in Task 3
- [x] **Symlink note:** Task 4 Step 5 covers Cowork sync
