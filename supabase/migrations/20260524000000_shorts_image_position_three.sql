-- Extend image_position to three values: 'above' | 'middle' | 'below'
-- Fix the default (was 'below', matches the current layout which is actually 'middle')
ALTER TABLE issue_shorts
  ALTER COLUMN image_position SET DEFAULT 'middle';

UPDATE issue_shorts
  SET image_position = 'middle'
  WHERE image_position = 'below';
