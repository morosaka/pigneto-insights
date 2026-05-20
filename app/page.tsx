export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/AppShell';
import {
  getAllPlaces,
  getAllStories,
  getActiveNews,
  getEvergreen,
  getCurrentIssue,
  getIssueShorts,
  getIssueDiscoveryPlaces,
  getIssueDiscoveryEvergreen,
  getCurrentDeepRead,
  getRecentStoriesForDiscover,
} from '@/lib/api';

export default async function Page() {
  const [
    eatDrinkAll,
    essentialsAll,
    ongoingNews,
    evergreenItems,
    currentIssue,
    deepRead,
    recentStories,
  ] = await Promise.all([
    getAllPlaces('eat-drink').catch(() => []),
    getAllPlaces('essentials').catch(() => []),
    getActiveNews().catch(() => []),          // multi_week = true only
    getEvergreen().catch(() => []),
    getCurrentIssue().catch(() => null),
    getCurrentDeepRead().catch(() => null),
    getRecentStoriesForDiscover().catch(() => []),
  ]);

  // Fetch issue-dependent data only when an issue exists
  const [shorts, discoveryPlaces, discoveryEvergreen] = currentIssue
    ? await Promise.all([
        getIssueShorts(currentIssue.id).catch(() => []),
        getIssueDiscoveryPlaces(currentIssue.id).catch(() => []),
        getIssueDiscoveryEvergreen(currentIssue.id).catch(() => []),
      ])
    : [[], [], []];

  return (
    <AppShell
      currentIssue={currentIssue}
      shorts={shorts}
      deepRead={deepRead}
      discoveryPlaces={discoveryPlaces}
      discoveryEvergreen={discoveryEvergreen}
      eatDrinkAll={eatDrinkAll}
      essentialsAll={essentialsAll}
      ongoingNews={ongoingNews}
      recentStories={recentStories}
      evergreenItems={evergreenItems}
    />
  );
}
