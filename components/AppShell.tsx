'use client';
import { useState } from 'react';
import { TabShell } from './TabShell';
import { HomeTab } from './tabs/HomeTab';
import { EatDrinkTab } from './tabs/EatDrinkTab';
import { EssentialsTab } from './tabs/EssentialsTab';
import { DiscoverTab } from './tabs/DiscoverTab';
import type { Place, Story, NewsItem, EvergreenItem } from '@/lib/types';

interface Props {
  featuredStory: Story | null;
  eatDrinkPreview: Place[];
  eatDrinkAll: Place[];
  essentialsAll: Place[];
  stories: Story[];
  news: NewsItem[];
  evergreenItems: EvergreenItem[];
}

export function AppShell({
  featuredStory,
  eatDrinkPreview,
  eatDrinkAll,
  essentialsAll,
  stories,
  news,
  evergreenItems,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    <HomeTab
      key="home"
      featuredStory={featuredStory}
      eatDrinkPreview={eatDrinkPreview}
      news={news}
      evergreenItems={evergreenItems}
      onViewEatDrink={() => setActiveTab(1)}
      onViewDiscover={() => setActiveTab(3)}
    />,
    <EatDrinkTab key="eat" places={eatDrinkAll} />,
    <EssentialsTab key="ess" places={essentialsAll} />,
    <DiscoverTab key="disc" stories={stories} news={news} evergreenItems={evergreenItems} />,
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <TabShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
