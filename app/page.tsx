import { AppShell } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';
import { getCoverPlaces, getAllPlaces, getActiveNews, getStories, getEvergreen } from '@/lib/api';
import type { Story, NewsItem, Place } from '@/lib/types';

async function getHomeFeatured(): Promise<{
  featuredStory: Story | null;
  featuredNews: NewsItem | null;
  featuredPlace: Place | null;
}> {
  try {
    const { data, error } = await supabase
      .from('home_featured')
      .select('story_id, news_id, place_id, highlight_text, stories(*), news(*), places(*)')
      .eq('active', true)
      .limit(1)
      .single();

    if (error || !data) return { featuredStory: null, featuredNews: null, featuredPlace: null };

    const d = data as Record<string, unknown>;
    return {
      featuredStory: (d['stories'] as Story) ?? null,
      featuredNews: (d['news'] as NewsItem) ?? null,
      featuredPlace: (d['places'] as Place) ?? null,
    };
  } catch {
    return { featuredStory: null, featuredNews: null, featuredPlace: null };
  }
}

export default async function Page() {
  const [
    eatDrinkCovers,
    eatDrinkAll,
    essentialsCovers,
    essentialsAll,
    { featuredStory, featuredNews, featuredPlace },
    stories,
    news,
    evergreen,
  ] = await Promise.all([
    getCoverPlaces('eat-drink').catch(() => []),
    getAllPlaces('eat-drink').catch(() => []),
    getCoverPlaces('essentials').catch(() => []),
    getAllPlaces('essentials').catch(() => []),
    getHomeFeatured(),
    getStories().catch(() => []),
    getActiveNews().catch(() => []),
    getEvergreen().catch(() => []),
  ]);

  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <AppShell
      eatDrinkCovers={eatDrinkCovers}
      eatDrinkAll={eatDrinkAll}
      essentialsCovers={essentialsCovers}
      essentialsAll={essentialsAll}
      featuredStory={featuredStory}
      featuredNews={featuredNews}
      featuredPlace={featuredPlace}
      stories={stories}
      news={news}
      evergreen={evergreen}
      lastUpdated={lastUpdated}
    />
  );
}
