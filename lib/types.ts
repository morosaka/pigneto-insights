export type Tab = 'home' | 'eat-drink' | 'essentials' | 'discover';

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
}

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
}

export interface Story {
  id: string;
  title: string;
  summary: string | null;
  body_md: string | null;
  audio_url: string | null;
  cover_url: string | null;
  reading_time_min: number | null;
  audio_time_min: number | null;
  featured: boolean;
  published_at: string | null;
}

export interface EvergreenItem {
  id: string;
  title: string;
  body_md: string | null;
  tags: string[];
  source_notebook: string | null;
  active: boolean;
  published_week: string | null;
}

export interface HomeFeatured {
  news_id: string | null;
  story_id: string | null;
  place_id: string | null;
  highlight_text: string | null;
}

export type PriceTierLabel = '€' | '€€' | '€€€';

export function priceTierLabel(tier: 1 | 2 | 3 | null): PriceTierLabel | null {
  if (!tier) return null;
  return (['€', '€€', '€€€'] as PriceTierLabel[])[tier - 1];
}
