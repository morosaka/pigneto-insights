'use client';
import { useState } from 'react';
import type { Story, NewsItem, EvergreenItem } from '@/lib/types';
import { VerticalDeck } from '../VerticalDeck';
import { HeroPage } from '../HeroPage';
import { AudioPlayer } from '../AudioPlayer';

type Section = 'stories' | 'news' | 'evergreen';

interface Props {
  stories: Story[];
  news: NewsItem[];
  evergreen: EvergreenItem[];
}

export function DiscoverTab({ stories, news, evergreen }: Props) {
  const [section, setSection] = useState<Section>('stories');

  const SECTIONS: { key: Section; label: string }[] = [
    { key: 'stories',   label: 'Rome Stories' },
    { key: 'news',      label: 'News & Events' },
    { key: 'evergreen', label: 'Evergreen' },
  ];

  const picker = (
    <div style={{
      position: 'absolute', top: 48, left: 0, right: 0, zIndex: 10,
      display: 'flex', justifyContent: 'center', gap: 8,
      pointerEvents: 'none',
    }}>
      {SECTIONS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setSection(key)}
          style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 9, fontWeight: 500,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 20,
            border: section === key ? 'none' : '1px solid rgba(255,255,255,0.3)',
            background: section === key ? 'var(--terra)' : 'rgba(0,0,0,0.25)',
            color: 'white', cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  let cards: React.ReactNode[] = [];

  if (section === 'stories') {
    if (stories.length === 0) {
      cards = [
        <HeroPage
          key="empty-stories"
          gradient="linear-gradient(155deg, hsl(10,68%,10%), hsl(10,65%,22%), hsl(23,55%,36%))"
          categoryColor="var(--terra)"
          categoryLabel="Rome Stories"
          title="Stories coming soon."
          subtitle="Longform Rome, one story at a time."
        />
      ];
    } else {
      cards = stories.map(story => (
        <HeroPage
          key={story.id}
          photoUrl={story.cover_url ?? undefined}
          gradient="linear-gradient(155deg, hsl(10,68%,10%), hsl(10,65%,22%), hsl(23,55%,36%))"
          categoryColor="var(--terra)"
          categoryLabel="Rome Stories"
          title={story.title}
          subtitle={story.summary ?? undefined}
          swipeHint={stories.indexOf(story) < stories.length - 1}
        >
          <AudioPlayer
            audioUrl={story.audio_url}
            durationMin={story.audio_time_min ?? story.reading_time_min}
            title={story.title}
          />
        </HeroPage>
      ));
    }
  }

  if (section === 'news') {
    if (news.length === 0) {
      cards = [
        <HeroPage
          key="empty-news"
          gradient="linear-gradient(145deg, hsl(111,41%,12%), hsl(111,38%,28%), hsl(111,35%,40%))"
          categoryColor="var(--oliva)"
          categoryLabel="News & Events"
          title="No events this week."
          subtitle="Check back soon."
        />
      ];
    } else {
      cards = news.map((item, idx) => (
        <HeroPage
          key={item.id}
          gradient="linear-gradient(145deg, hsl(111,41%,12%), hsl(111,38%,28%), hsl(111,35%,40%))"
          categoryColor="var(--oliva)"
          categoryLabel="News & Events"
          title={item.title}
          subtitle={[
            item.location,
            item.date_start,
            item.date_end && item.date_end !== item.date_start ? `→ ${item.date_end}` : null,
          ].filter(Boolean).join(' · ')}
          swipeHint={idx < news.length - 1}
        />
      ));
    }
  }

  if (section === 'evergreen') {
    if (evergreen.length === 0) {
      cards = [
        <HeroPage
          key="empty-evergreen"
          gradient="linear-gradient(152deg, hsl(206,47%,10%), hsl(206,44%,22%), hsl(206,40%,34%))"
          categoryColor="var(--ardesia)"
          categoryLabel="Rome Evergreen"
          title="More stories coming soon."
          subtitle="New content added every two weeks."
        />
      ];
    } else {
      cards = evergreen.map((item, idx) => (
        <HeroPage
          key={item.id}
          gradient="linear-gradient(152deg, hsl(206,47%,10%), hsl(206,44%,22%), hsl(206,40%,34%))"
          categoryColor="var(--ardesia)"
          categoryLabel={item.tags.slice(0, 2).join(' · ') || 'Rome Evergreen'}
          title={item.title}
          subtitle={item.body_md?.slice(0, 120) ?? undefined}
          swipeHint={idx < evergreen.length - 1}
        />
      ));
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {picker}
      <VerticalDeck key={section} cards={cards} />
    </div>
  );
}
