import { supabase } from './supabase';
import type { Place, NewsItem, Story, EvergreenItem, WeeklyIssue, IssueShort } from './types';

// ────────────────────────────────────────────────────────────
// Places
// ────────────────────────────────────────────────────────────

export async function getCoverPlaces(tab: 'eat-drink' | 'essentials'): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('tab', tab)
    .eq('cover_eligible', true)
    .eq('active', true);
  if (error) throw error;
  return (data as Place[]).sort(() => Math.random() - 0.5);
}

export async function getAllPlaces(tab: 'eat-drink' | 'essentials'): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('tab', tab)
    .eq('active', true)
    .order('name');
  if (error) throw error;
  return data as Place[];
}

export async function getPlace(id: string): Promise<Place | null> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Place;
}

// ────────────────────────────────────────────────────────────
// News — multi-week events only (Discover "Ongoing in Rome")
// ────────────────────────────────────────────────────────────

export async function getActiveNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('active', true)
    .eq('multi_week', true)
    .order('date_start', { ascending: false });
  if (error) throw error;
  return data as NewsItem[];
}

// ────────────────────────────────────────────────────────────
// Stories
// ────────────────────────────────────────────────────────────

/** Story attiva in Home come Deep Read (max 1). */
export async function getCurrentDeepRead(): Promise<Story | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .gte('featured_until', today)
    .order('featured_until', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Story | null;
}

/** Stories in "decanting" — uscite dalla Home, ancora in Discover "Recent Stories". */
export async function getRecentStoriesForDiscover(): Promise<Story[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .gte('discover_until', today)
    .lt('featured_until', today)
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data as Story[];
}

/** Tutte le stories — per la Library. */
export async function getAllStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data as Story[];
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Story | null;
}

// ────────────────────────────────────────────────────────────
// Evergreen
// ────────────────────────────────────────────────────────────

export async function getEvergreen(tag?: string): Promise<EvergreenItem[]> {
  let query = supabase
    .from('evergreen')
    .select('*')
    .eq('active', true)
    .order('published_week', { ascending: false });
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) throw error;
  return data as EvergreenItem[];
}

// ────────────────────────────────────────────────────────────
// Weekly Issues
// ────────────────────────────────────────────────────────────

/** Issue corrente attiva in Home (valid_until >= oggi, published = true). */
export async function getCurrentIssue(): Promise<WeeklyIssue | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('weekly_issues')
    .select('*')
    .eq('published', true)
    .gte('valid_until', today)
    .order('issue_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as WeeklyIssue | null;
}

export async function getIssueBySlug(slug: string): Promise<WeeklyIssue | null> {
  const { data, error } = await supabase
    .from('weekly_issues')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data as WeeklyIssue | null;
}

/** Issues passate — per la Library. */
export async function getPastIssues(limit = 20): Promise<WeeklyIssue[]> {
  const { data, error } = await supabase
    .from('weekly_issues')
    .select('*')
    .eq('published', true)
    .order('issue_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as WeeklyIssue[];
}

/** Shorts di una issue (ordinati per sort_order). */
export async function getIssueShorts(issueId: string): Promise<IssueShort[]> {
  const { data, error } = await supabase
    .from('issue_shorts')
    .select('*')
    .eq('issue_id', issueId)
    .order('sort_order');
  if (error) throw error;
  return data as IssueShort[];
}

/** Discoveries di una issue (places o evergreen con featured_in_issue_id). */
export async function getIssueDiscoveryPlaces(issueId: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('featured_in_issue_id', issueId)
    .eq('active', true);
  if (error) throw error;
  return data as Place[];
}

export async function getIssueDiscoveryEvergreen(issueId: string): Promise<EvergreenItem[]> {
  const { data, error } = await supabase
    .from('evergreen')
    .select('*')
    .eq('featured_in_issue_id', issueId)
    .eq('active', true);
  if (error) throw error;
  return data as EvergreenItem[];
}
