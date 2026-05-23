-- ============================================================
-- Pigneto Insights — Migration 004
-- Rich fields: places compendium + evergreen cover + shorts image
-- 2026-05-23
-- ============================================================

-- ── evergreen: hero image for card and landing header ────────
ALTER TABLE evergreen
  ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- ── places: rich editorial and practical fields ──────────────
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS google_rating        FLOAT,
  ADD COLUMN IF NOT EXISTS google_review_count  INTEGER,
  ADD COLUMN IF NOT EXISTS google_maps_url      TEXT,
  ADD COLUMN IF NOT EXISTS booking_url          TEXT,
  ADD COLUMN IF NOT EXISTS menu_url             TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url        TEXT,
  ADD COLUMN IF NOT EXISTS delivery_url         TEXT,
  ADD COLUMN IF NOT EXISTS tags                 TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery_urls         TEXT[]  NOT NULL DEFAULT '{}';

-- ── issue_shorts: image (type already declares it) ───────────
ALTER TABLE issue_shorts
  ADD COLUMN IF NOT EXISTS image_url TEXT;
