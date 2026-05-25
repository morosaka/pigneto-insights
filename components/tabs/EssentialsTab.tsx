'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';

const CAT_COLOR: Record<string, string> = {
  'Grocery':         'var(--oliva)',
  'Market':          'var(--oliva)',
  'Pharmacy':        'var(--ardesia)',
  'Transit':         'var(--ardesia)',
  'Laundry':         'var(--ardesia)',
  'Phone & SIM':     'var(--ardesia)',
  'Post & Shipping': 'var(--ciocco)',
  'Luggage Storage': 'var(--ciocco)',
  'Parking':         'var(--ciocco)',
  'Rental':          'var(--terra)',
  'Other':           'var(--avorio-dk)',
};
function catColor(cat: string) { return CAT_COLOR[cat] ?? 'var(--avorio-dk)'; }

const CATEGORY_ORDER = [
  'Transit', 'Grocery', 'Market', 'Pharmacy',
  'Laundry', 'Parking', 'Phone & SIM', 'Post & Shipping',
  'Luggage Storage', 'Rental', 'Other',
];

function PlaceRow({ place, onTap }: { place: Place; onTap: () => void }) {
  return (
    <button onClick={onTap} className="place-row">
      <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
        <div className="place-thumb">
          {place.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.cover_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, var(--ardesia), var(--oliva))` }} />
          )}
        </div>
        <div className="place-body">
          <div className="t-label" style={{ color: catColor(place.category), marginBottom: 2, textAlign: 'left' }}>
            {place.category}{place.hours ? ` · ${place.hours}` : ''}
          </div>
          <div className="t-meta" style={{ textAlign: 'left' }}>
            {place.walk_minutes ? `${place.walk_minutes} min walk` : (place.address ?? '')}
          </div>
        </div>
        <div className="place-arrow">›</div>
      </div>
      <div className="t-heading" style={{ textAlign: 'left', marginTop: 8 }}>{place.name}</div>
    </button>
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

interface Props { places: Place[]; }

export function EssentialsTab({ places }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // categories present in data, in priority order
  const presentCats = CATEGORY_ORDER.filter(c => places.some(p => p.category === c));
  const unknownCats = Array.from(new Set(places.map(p => p.category))).filter(c => !CATEGORY_ORDER.includes(c));
  const categories = [...presentCats, ...unknownCats];

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

      <div className="tab-hd" style={{ background: 'var(--ardesia)' }}>
        <div className="tab-hd-sub" style={{ color: 'rgba(255,255,255,0.55)' }}>Pigneto Insights</div>
        <div className="t-title">The Neighbourhood</div>
      </div>

      <div className="chip-wrap">
        <FilterChip label="All" active={selected.size === 0} onClick={() => setSelected(new Set())} color="var(--ardesia)" />
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
