-- Weekly issues: audio overview from NotebookLM deep-dive podcast
-- Lifecycle: ~10 days (same as valid_until). Not archival.
-- Multi-language future path: create issue_audio table instead of adding columns here.

ALTER TABLE weekly_issues
  ADD COLUMN IF NOT EXISTS audio_url          TEXT,
  ADD COLUMN IF NOT EXISTS audio_duration_min INT;

COMMENT ON COLUMN weekly_issues.audio_url          IS 'NotebookLM deep-dive podcast for this issue — Supabase Storage bucket news-audio';
COMMENT ON COLUMN weekly_issues.audio_duration_min IS 'Approximate duration in minutes';
