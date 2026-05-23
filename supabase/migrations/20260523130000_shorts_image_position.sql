-- issue_shorts: optional image position — 'above' (before title) or 'below' (after title, default)
ALTER TABLE issue_shorts
  ADD COLUMN IF NOT EXISTS image_position TEXT NOT NULL DEFAULT 'below';
