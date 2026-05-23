-- Evergreen: lead_cover_url — defined cover image for the article,
-- distinct from cover_url (card/hero thumbnail).
ALTER TABLE evergreen
  ADD COLUMN IF NOT EXISTS lead_cover_url TEXT;
