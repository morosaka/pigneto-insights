'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { VerticalDeck } from '../VerticalDeck';
import { HeroPage } from '../HeroPage';
import { CatalogView } from '../CatalogView';
import { DetailPage } from '../DetailPage';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Transit':         'linear-gradient(152deg, hsl(206,47%,10%), hsl(206,44%,22%), hsl(206,40%,34%))',
  'Pharmacy':        'linear-gradient(155deg, hsl(111,41%,10%), hsl(111,38%,20%), hsl(111,34%,32%))',
  'Market':          'linear-gradient(150deg, hsl(111,41%,10%), hsl(111,38%,22%), hsl(111,34%,34%))',
  'Grocery':         'linear-gradient(150deg, hsl(111,41%,10%), hsl(111,38%,22%), hsl(111,34%,34%))',
  'Laundry':         'linear-gradient(158deg, hsl(19,34%,10%), hsl(19,28%,18%), hsl(206,40%,28%))',
  'Parking':         'linear-gradient(162deg, hsl(19,34%,10%), hsl(19,30%,20%), hsl(19,25%,28%))',
  'Rental':          'linear-gradient(155deg, hsl(23,55%,12%), hsl(10,60%,22%), hsl(23,50%,34%))',
  'Luggage Storage': 'linear-gradient(158deg, hsl(206,47%,10%), hsl(206,40%,20%), hsl(19,34%,26%))',
};
const DEFAULT_GRADIENT = 'linear-gradient(155deg, hsl(206,47%,10%), hsl(206,44%,22%), hsl(19,34%,28%))';

type View = 'cover' | 'catalog' | 'detail';

interface Props {
  coverPlaces: Place[];
  allPlaces: Place[];
}

export function EssentialsTab({ coverPlaces, allPlaces }: Props) {
  const [view, setView] = useState<View>('cover');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  if (view === 'detail' && selectedPlace) {
    return (
      <DetailPage
        place={selectedPlace}
        tabLabel="Essentials"
        onBack={() => setView('catalog')}
      />
    );
  }

  if (view === 'catalog') {
    return (
      <CatalogView
        places={allPlaces}
        tabLabel="Essentials"
        onSelect={place => { setSelectedPlace(place); setView('detail'); }}
        onBack={() => setView('cover')}
      />
    );
  }

  const cards = coverPlaces.map(place => (
    <HeroPage
      key={place.id}
      photoUrl={place.cover_url ?? undefined}
      gradient={CATEGORY_GRADIENTS[place.category] ?? DEFAULT_GRADIENT}
      categoryColor="var(--ardesia)"
      categoryLabel={[place.category, place.hours?.slice(0, 12)].filter(Boolean).join(' · ')}
      title={place.name}
      subtitle={place.description?.slice(0, 100) ?? undefined}
      swipeHint
    />
  ));

  if (cards.length === 0) {
    cards.push(
      <HeroPage
        key="empty"
        gradient={DEFAULT_GRADIENT}
        categoryColor="var(--ardesia)"
        categoryLabel="Essentials"
        title="Everything you need."
        subtitle="Markets, transit, pharmacy, and more."
      />
    );
  }

  return (
    <VerticalDeck
      cards={cards}
      onPullUp={() => setView('catalog')}
    />
  );
}
