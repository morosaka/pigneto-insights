'use client';
import type { Story, NewsItem, Place } from '@/lib/types';
import { VerticalDeck } from '../VerticalDeck';
import { HeroPage } from '../HeroPage';
import { AudioPlayer } from '../AudioPlayer';

interface Props {
  featuredStory: Story | null;
  featuredNews: NewsItem | null;
  featuredPlace: Place | null;
}

export function HomeTab({ featuredStory, featuredNews, featuredPlace }: Props) {
  const cards: React.ReactNode[] = [];

  if (featuredStory) {
    cards.push(
      <HeroPage
        key="story"
        photoUrl={featuredStory.cover_url ?? undefined}
        gradient="linear-gradient(162deg, hsl(19,34%,10%) 0%, hsl(10,68%,22%) 45%, hsl(23,55%,40%) 100%)"
        categoryColor="var(--terra)"
        categoryLabel="Rome Stories"
        title={featuredStory.title}
        subtitle={featuredStory.summary ?? undefined}
        swipeHint={!!featuredNews || !!featuredPlace}
      >
        <AudioPlayer
          audioUrl={featuredStory.audio_url}
          durationMin={featuredStory.audio_time_min ?? featuredStory.reading_time_min}
          title={featuredStory.title}
        />
      </HeroPage>
    );
  }

  if (featuredNews) {
    cards.push(
      <HeroPage
        key="news"
        gradient="linear-gradient(145deg, hsl(111,41%,12%) 0%, hsl(111,38%,28%) 50%, hsl(111,35%,40%) 100%)"
        categoryColor="var(--oliva)"
        categoryLabel="This week"
        title={featuredNews.title}
        subtitle={[featuredNews.location, featuredNews.date_start].filter(Boolean).join(' · ')}
        swipeHint={!!featuredPlace}
      />
    );
  }

  if (featuredPlace) {
    cards.push(
      <HeroPage
        key="place"
        photoUrl={featuredPlace.cover_url ?? undefined}
        gradient="linear-gradient(158deg, hsl(19,34%,10%), hsl(19,28%,18%), hsl(23,35%,32%))"
        categoryColor="var(--terra)"
        categoryLabel="Recommended"
        title={featuredPlace.name}
        subtitle={featuredPlace.description?.slice(0, 90) ?? undefined}
      />
    );
  }

  if (cards.length === 0) {
    cards.push(
      <HeroPage
        key="empty"
        gradient="linear-gradient(162deg, hsl(19,34%,10%), hsl(10,68%,22%), hsl(23,55%,40%))"
        title="Pigneto Insights"
        subtitle="A neighborhood guide curated by Mauro."
      />
    );
  }

  return <VerticalDeck cards={cards} />;
}
