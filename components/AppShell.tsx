'use client';
import { useState, useEffect } from 'react';
import { TabShell } from './TabShell';
import { HomeTab } from './tabs/HomeTab';
import { EatDrinkTab } from './tabs/EatDrinkTab';
import { EssentialsTab } from './tabs/EssentialsTab';
import { DiscoverTab } from './tabs/DiscoverTab';
import { OnboardingFlow, ONBOARDING_KEY, ONBOARDING_VERSION } from './OnboardingFlow';
import { SettingsSheet } from './SettingsSheet';
import type { Place, Story, NewsItem, EvergreenItem } from '@/lib/types';

interface Props {
  eatDrinkCovers: Place[];
  eatDrinkAll: Place[];
  essentialsCovers: Place[];
  essentialsAll: Place[];
  featuredStory: Story | null;
  featuredNews: NewsItem | null;
  featuredPlace: Place | null;
  stories: Story[];
  news: NewsItem[];
  evergreen: EvergreenItem[];
  lastUpdated: string;
}

export function AppShell(props: Props) {
  const {
    eatDrinkCovers, eatDrinkAll,
    essentialsCovers, essentialsAll,
    featuredStory, featuredNews, featuredPlace,
    stories, news, evergreen,
    lastUpdated,
  } = props;

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY) === ONBOARDING_VERSION;
    if (!seen) setShowOnboarding(true);
  }, []);

  const handleOnboardingDone = () => {
    localStorage.setItem(ONBOARDING_KEY, ONBOARDING_VERSION);
    setShowOnboarding(false);
  };

  const handleReplayOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  };

  const tabs = [
    <HomeTab
      key="home"
      featuredStory={featuredStory}
      featuredNews={featuredNews}
      featuredPlace={featuredPlace}
    />,
    <EatDrinkTab key="eat" coverPlaces={eatDrinkCovers} allPlaces={eatDrinkAll} />,
    <EssentialsTab key="ess" coverPlaces={essentialsCovers} allPlaces={essentialsAll} />,
    <DiscoverTab key="disc" stories={stories} news={news} evergreen={evergreen} />,
  ];

  return (
    <div style={{ width: '100vw', height: '100svh', overflow: 'hidden', position: 'relative' }}>
      {/* Settings trigger — ⋯ top-right */}
      <button
        onClick={() => setShowSettings(true)}
        aria-label="Settings"
        style={{
          position: 'absolute', top: 12, right: 16, zIndex: 80,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 20, lineHeight: 1,
          color: 'rgba(255,255,255,0.3)',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px',
        }}
      >
        ⋯
      </button>

      <TabShell tabs={tabs} />

      {showOnboarding && <OnboardingFlow onDone={handleOnboardingDone} />}
      {showSettings && (
        <SettingsSheet
          onClose={() => setShowSettings(false)}
          onReplayOnboarding={handleReplayOnboarding}
          lastUpdated={lastUpdated}
        />
      )}
    </div>
  );
}
