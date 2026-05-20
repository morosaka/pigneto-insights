-- ============================================================
-- Pigneto Insights — Migration 001
-- Weekly issues, editorial fields, stories audio model
-- 2026-05-20
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. BACKFILL CAMPI MANCANTI nelle tabelle esistenti
--    (presenti in types.ts ma non nel DB reale)
-- ────────────────────────────────────────────────────────────

-- stories: cover_url, narration_url, narration_time_min
ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS cover_url            TEXT,
  ADD COLUMN IF NOT EXISTS narration_url        TEXT,
  ADD COLUMN IF NOT EXISTS narration_time_min   SMALLINT;

-- evergreen: tags, source_notebook, published_week
ALTER TABLE evergreen
  ADD COLUMN IF NOT EXISTS tags             TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_notebook  TEXT,
  ADD COLUMN IF NOT EXISTS published_week   TEXT;

-- news: external_url
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS external_url TEXT;

-- ────────────────────────────────────────────────────────────
-- 1. NUOVA TABELLA: weekly_issues
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_issues (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        UNIQUE NOT NULL,
  issue_date      DATE        NOT NULL,
  valid_until     DATE        NOT NULL,
  lead_title      TEXT        NOT NULL,
  lead_subtitle   TEXT,
  lead_body_md    TEXT        NOT NULL,
  lead_cover_url  TEXT,
  alerts_md       TEXT,
  weather_md      TEXT,
  published       BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER weekly_issues_updated_at
  BEFORE UPDATE ON weekly_issues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- 2. NUOVA TABELLA: issue_shorts
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS issue_shorts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id      UUID        NOT NULL REFERENCES weekly_issues(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  body_md       TEXT        NOT NULL,
  date_label    TEXT,
  location      TEXT,
  external_url  TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issue_shorts_issue_id ON issue_shorts(issue_id);

-- ────────────────────────────────────────────────────────────
-- 3. NUOVI CAMPI: places (discovery flow)
-- ────────────────────────────────────────────────────────────
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS editorial_intro_md   TEXT,
  ADD COLUMN IF NOT EXISTS featured_in_issue_id UUID REFERENCES weekly_issues(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS featured_until        DATE;

-- ────────────────────────────────────────────────────────────
-- 4. NUOVI CAMPI: evergreen (discovery flow)
-- ────────────────────────────────────────────────────────────
ALTER TABLE evergreen
  ADD COLUMN IF NOT EXISTS editorial_intro_md   TEXT,
  ADD COLUMN IF NOT EXISTS featured_in_issue_id UUID REFERENCES weekly_issues(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS featured_until        DATE;

-- ────────────────────────────────────────────────────────────
-- 5. NUOVO CAMPO: news (flag eventi multi-settimanali)
-- ────────────────────────────────────────────────────────────
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS multi_week BOOLEAN NOT NULL DEFAULT false;

-- Backfill: verifica le 4 news esistenti e imposta manualmente:
-- UPDATE news SET multi_week = true WHERE date_end - date_start >= 14;

-- ────────────────────────────────────────────────────────────
-- 6. NUOVI CAMPI: stories (lifecycle Home→Discover→Library + audio)
-- ────────────────────────────────────────────────────────────
ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS podcast_url         TEXT,
  ADD COLUMN IF NOT EXISTS podcast_time_min    SMALLINT,
  ADD COLUMN IF NOT EXISTS micro_intro         TEXT,
  ADD COLUMN IF NOT EXISTS slug                TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS featured_until      DATE,
  ADD COLUMN IF NOT EXISTS discover_until      DATE;

-- Backfill slug per le 2 stories esistenti (da aggiustare a mano):
-- UPDATE stories SET slug = 'nome-storia-1' WHERE id = <id1>;
-- UPDATE stories SET slug = 'nome-storia-2' WHERE id = <id2>;

-- ────────────────────────────────────────────────────────────
-- 7. HELPER VIEW: issue corrente
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW current_issue AS
  SELECT *
  FROM weekly_issues
  WHERE published = true
    AND valid_until >= CURRENT_DATE
  ORDER BY issue_date DESC
  LIMIT 1;
