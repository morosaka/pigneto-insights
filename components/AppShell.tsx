'use client';
import { useState } from 'react';
import { TabShell } from './TabShell';
import { HomeTab } from './tabs/HomeTab';
import { EatDrinkTab } from './tabs/EatDrinkTab';
import { EssentialsTab } from './tabs/EssentialsTab';
import { DiscoverTab } from './tabs/DiscoverTab';
import type { Place, Story, NewsItem, EvergreenItem, WeeklyIssue, IssueShort } from '@/lib/types';

interface Props {
  // Home
  currentIssue: WeeklyIssue | null;
  shorts: IssueShort[];
  deepRead: Story | null;
  discoveryPlaces: Place[];
  discoveryEvergreen: EvergreenItem[];
  // Eat & Drink / Essentials
  eatDrinkAll: Place[];
  essentialsAll: Place[];
  // Discover
  ongoingNews: NewsItem[];
  recentStories: Story[];
  evergreenItems: EvergreenItem[];
}

export function AppShell({
  currentIssue, shorts, deepRead, discoveryPlaces, discoveryEvergreen,
  eatDrinkAll, essentialsAll,
  ongoingNews, recentStories, evergreenItems,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    <HomeTab
      key="home"
      currentIssue={currentIssue}
      shorts={shorts}
      deepRead={deepRead}
      discoveryPlaces={discoveryPlaces}
      discoveryEvergreen={discoveryEvergreen}
    />,
    <EatDrinkTab key="eat" places={eatDrinkAll} />,
    <EssentialsTab key="ess" places={essentialsAll} />,
    <DiscoverTab
      key="disc"
      ongoingNews={ongoingNews}
      recentStories={recentStories}
      evergreenItems={evergreenItems}
    />,
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <TabShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
