export type Tab = 'home' | 'eat-drink' | 'essentials' | 'discover';

// ────────────────────────────────────────────────────────────
// Places
// ────────────────────────────────────────────────────────────
export interface Place {
  id: string;
  tab: 'eat-drink' | 'essentials';
  category: string;
  name: string;
  description: string | null;
  price_tier: 1 | 2 | 3 | null;
  price_range: string | null;
  address: string | null;
  walk_minutes: number | null;
  hours: string | null;
  phone: string | null;
  website: string | null;
  social_url: string | null;
  video_url: string | null;
  cover_url: string | null;
  gallery_url: string | null;
  cover_eligible: boolean;
  active: boolean;
  // Editorial / Discovery fields (migration 001)
  editorial_intro_md: string | null;
  featured_in_issue_id: string | null;
  featured_until: string | null;       // ISO date
}

// ────────────────────────────────────────────────────────────
// News — multi-week events only (Discover "Ongoing in Rome")
// Mono-weekly events live in issue_shorts, not here.
// ────────────────────────────────────────────────────────────
export interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  date_start: string | null;
  date_end: string | null;
  location: string | null;
  external_url: string | null;
  category: string | null;
  featured: boolean;
  active: boolean;
  multi_week: boolean;                 // migration 001: true = show in Discover
}

// ────────────────────────────────────────────────────────────
// Stories — long-form with dual audio and lifecycle
// ────────────────────────────────────────────────────────────
export interface Story {
  id: string;
  title: string;
  summary: string | null;
  body_md: string | null;
  cover_url: string | null;
  reading_time_min: number | null;
  featured: boolean;
  published_at: string | null;
  // Audio (migration 001)
  narration_url: string | null;        // TTS read-aloud of the article
  narration_time_min: number | null;
  podcast_url: string | null;          // NotebookLM Audio Overview (conversational)
  podcast_time_min: number | null;
  // Editorial lifecycle (migration 001)
  slug: string | null;                 // URL: /story/[slug]
  micro_intro: string | null;          // 1-2 lines for Home DeepReadCard
  featured_until: string | null;       // ISO date — visible in Home until
  discover_until: string | null;       // ISO date — visible in Discover "Recent Stories" until
}

// ────────────────────────────────────────────────────────────
// Evergreen
// ────────────────────────────────────────────────────────────
export interface EvergreenItem {
  id: string;
  title: string;
  body_md: string | null;
  tags: string[];
  source_notebook: string | null;
  active: boolean;
  published_week: string | null;
  // Editorial / Discovery fields (migration 001)
  editorial_intro_md: string | null;
  featured_in_issue_id: string | null;
  featured_until: string | null;       // ISO date
}

// ────────────────────────────────────────────────────────────
// Weekly Issue — "il numero della settimana"
// ────────────────────────────────────────────────────────────
export interface WeeklyIssue {
  id: string;
  slug: string;                        // es. '2026-w20'
  issue_date: string;                  // ISO date — lunedì di inizio
  valid_until: string;                 // ISO date — scade dalla Home
  lead_title: string;
  lead_subtitle: string | null;
  lead_body_md: string;
  lead_cover_url: string | null;
  alerts_md: string | null;
  weather_md: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface IssueShort {
  id: string;
  issue_id: string;
  title: string;
  body_md: string;
  date_label: string | null;           // es. "Wed 21 – Sat 24"
  location: string | null;
  external_url: string | null;
  sort_order: number;
  created_at: string;
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
export type PriceTierLabel = '€' | '€€' | '€€€';

export function priceTierLabel(tier: 1 | 2 | 3 | null): PriceTierLabel | null {
  if (!tier) return null;
  return (['€', '€€', '€€€'] as PriceTierLabel[])[tier - 1];
}
