-- Fix: current_issue view with SECURITY INVOKER so RLS is evaluated for the querying user.
-- Also switches to SELECT * to automatically include future columns added to weekly_issues.
CREATE OR REPLACE VIEW current_issue WITH (security_invoker = true) AS
  SELECT *
  FROM weekly_issues
  WHERE published = true
    AND valid_until >= CURRENT_DATE
  ORDER BY issue_date DESC
  LIMIT 1;
