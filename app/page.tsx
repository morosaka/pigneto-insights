export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/AppShell';
import { getAllPlaces, getStories, getActiveNews, getEvergreen } from '@/lib/api';

export default async function Page() {
  const [eatDrinkAll, essentialsAll, stories, news, evergreenItems] = await Promise.all([
    getAllPlaces('eat-drink').catch(() => []),
    getAllPlaces('essentials').catch(() => []),
    getStories().catch(() => []),
    getActiveNews().catch(() => []),
    getEvergreen().catch(() => []),
  ]);

  const featuredStory = stories[0] ?? null;
  // Home shows first 6 eat-drink places (sorted by walk_minutes server-side via name order;
  // take cover_eligible first, then fill up to 6)
  const coverFirst = eatDrinkAll.filter(p => p.cover_eligible);
  const rest = eatDrinkAll.filter(p => !p.cover_eligible);
  const eatDrinkPreview = [...coverFirst, ...rest].slice(0, 6);

  return (
    <AppShell
      featuredStory={featuredStory}
      eatDrinkPreview={eatDrinkPreview}
      eatDrinkAll={eatDrinkAll}
      essentialsAll={essentialsAll}
      stories={stories}
      news={news}
      evergreenItems={evergreenItems}
    />
  );
}
