-- ============================================================
-- Pigneto Insights — Migration 005
-- Multi-source ratings for places
-- Replace single google_rating with per-source fields + composite avg
-- 2026-05-24
-- ============================================================

-- Per-source ratings (google fields already exist from migration 004)
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS thefork_rating        FLOAT,
  ADD COLUMN IF NOT EXISTS thefork_review_count  INTEGER,
  ADD COLUMN IF NOT EXISTS tripadvisor_rating    FLOAT,
  ADD COLUMN IF NOT EXISTS tripadvisor_review_count INTEGER,

  -- Composite average across all sources with data
  ADD COLUMN IF NOT EXISTS rating_avg            FLOAT,

  -- Which sources contributed to rating_avg (e.g. ARRAY['google','thefork'])
  ADD COLUMN IF NOT EXISTS rating_sources        TEXT[] NOT NULL DEFAULT '{}';
