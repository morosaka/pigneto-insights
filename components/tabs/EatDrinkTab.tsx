'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';
import { VerticalDeck } from '../VerticalDeck';
import { HeroPage } from '../HeroPage';
import { CatalogView } from '../CatalogView';
import { DetailPage } from '../DetailPage';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Café':       'linear-gradient(162deg, hsl(19,34%,10%), hsl(19,30%,22%), hsl(23,35%,36%))',
  'Brewery':    'linear-gradient(155deg, hsl(19,28%,8%), hsl(19,30%,18%), hsl(23,35%,32%))',
  'Trattoria':  'linear-gradient(158deg, hsl(10,68%,10%), hsl(10,65%,22%), hsl(23,55%,36%))',
  'Wine bar':   'linear-gradient(152deg, hsl(10,50%,12%), hsl(10,45%,22%), hsl(23,40%,34%))',
  'Club':       'linear-gradient(165deg, hsl(19,34%,6%), hsl(206,47%,14%), hsl(19,28%,24%))',
  'Pizzeria':   'linear-gradient(150deg, hsl(10,68%,12%), hsl(10,60%,24%), hsl(23,55%,38%))',
  'Gelateria':  'linear-gradient(158deg, hsl(206,47%,10%), hsl(206,44%,22%), hsl(206,40%,36%))',
  'Steakhouse': 'linear-gradient(160deg, hsl(10,55%,10%), hsl(10,50%,20%), hsl(19,34%,30%))',
  'Seafood':    'linear-gradient(155deg, hsl(206,47%,10%), hsl(206,40%,20%), hsl(206,35%,32%))',
};
const DEFAULT_GRADIENT = 'linear-gradient(162deg, hsl(19,34%,10%), hsl(10,68%,24%), hsl(23,55%,40%))';

type View = 'cover' | 'catalog' | 'detail';

interface Props {
  coverPlaces: Place[];
  allPlaces: Place[];
}

export function EatDrinkTab({ coverPlaces, allPlaces }: Props) {
  const [view, setView] = useState<View>('cover');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  if (view === 'detail' && selectedPlace) {
    return (
      <DetailPage
        place={selectedPlace}
        tabLabel="Eat & Drink"
        onBack={() => setView('catalog')}
      />
    );
  }

  if (view === 'catalog') {
    return (
      <CatalogView
        places={allPlaces}
        tabLabel="Eat & Drink"
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
      categoryColor="var(--terra)"
      categoryLabel={[place.category, priceTierLabel(place.price_tier)].filter(Boolean).join(' · ')}
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
        categoryColor="var(--terra)"
        categoryLabel="Eat & Drink"
        title="Pigneto's best."
        subtitle="From trattorias to craft breweries."
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
