import { supabase } from './supabase';
import type { Place, NewsItem, Story, EvergreenItem } from './types';

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
  if (error) return null;
  return data as Place;
}

export async function getActiveNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('active', true)
    .order('date_start', { ascending: false });
  if (error) throw error;
  return data as NewsItem[];
}

export async function getStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data as Story[];
}

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
