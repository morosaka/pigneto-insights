'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';

const CAT_COLOR: Record<string, string> = {
  'Café':         'var(--ciocco)',
  'Brewery':      'var(--ciocco)',
  'Trattoria':    'var(--pompei)',
  'Wine bar':     'var(--pompei)',
  'Restaurant':   'var(--pompei)',
  'Pizzeria':     'var(--pompei)',
  'Steakhouse':   'var(--pompei)',
  'Seafood':      'var(--ardesia)',
  'Gelateria':    'var(--ardesia)',
  'Club':         'var(--ardesia)',
  'Japanese':     'var(--ardesia)',
  'International':'var(--oliva)',
  'Gastropub':    'var(--oliva)',
  'Street food':  'var(--terra)',
};
function catColor(cat: string) { return CAT_COLOR[cat] ?? 'var(--terra)'; }

function PlaceRow({ place, onTap }: { place: Place; onTap: () => void }) {
  const price = priceTierLabel(place.price_tier);
  return (
    <button onClick={onTap} className="place-row">
      <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
        <div className="place-thumb">
          {place.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.cover_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, var(--ciocco), ${catColor(place.category)})` }} />
          )}
        </div>
        <div className="place-body">
          <div className="t-label" style={{ color: catColor(place.category), marginBottom: 2, textAlign: 'right' }}>
            {place.category}{price ? ` · ${price}` : ''}
          </div>
          <div className="t-meta" style={{ textAlign: 'right', marginBottom: 6 }}>
            {place.walk_minutes ? `${place.walk_minutes} min walk` : (place.address ?? '')}
          </div>
          <div className="t-heading" style={{ textAlign: 'left' }}>{place.name}</div>
        </div>
        <div className="place-arrow">›</div>
      </div>
      {place.description && (
        <div className="t-meta" style={{ marginTop: 8, textAlign: 'left' }}>{place.description}</div>
      )}
    </button>
  );
}

interface Props { places: Place[]; }

export function EatDrinkTab({ places }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const categories = Array.from(new Set(places.map(p => p.category)));
  const filtered = selected.size === 0 ? places : places.filter(p => selected.has(p.category));

  function toggle(cat: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--avorio)', position: 'relative' }}>
      <div className="tab-hd" style={{ background: 'var(--ciocco)' }}>
        <div className="tab-hd-sub" style={{ color: 'var(--terra)' }}>Pigneto Insights</div>
        <div className="t-title">Eat &amp; Drink</div>
      </div>

      <div className="chip-wrap">
        <FilterChip label="All" active={selected.size === 0} onClick={() => setSelected(new Set())} color="var(--ciocco)" />
        {categories.map(cat => (
          <FilterChip key={cat} label={cat} active={selected.has(cat)} onClick={() => toggle(cat)} color={catColor(cat)} />
        ))}
      </div>

      <div style={{ padding: '0 18px' }}>
        {filtered.map(p => <PlaceRow key={p.id} place={p} onTap={() => setSelectedPlace(p)} />)}
      </div>

      {selectedPlace && <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
    </div>
  );
}

function FilterChip({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      className="filter-chip"
      style={active ? { background: color, borderColor: color, color: 'white' } : { border: `1px solid ${color}`, color }}
    >
      {label}
    </button>
  );
}
