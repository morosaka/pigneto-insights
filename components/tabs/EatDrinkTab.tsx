'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';

// ── helpers ──────────────────────────────────────────────────────────────────

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

// ── sub-components ────────────────────────────────────────────────────────────

function PlaceRow({ place, onTap }: { place: Place; onTap: () => void }) {
  const price = priceTierLabel(place.price_tier);
  return (
    <button
      onClick={onTap}
      style={{
        display: 'flex', alignItems: 'stretch', width: '100%',
        padding: '12px 0',
        borderBottom: '1px solid var(--avorio-dim)',
        background: 'none', border: 'none',
        borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--avorio-dim)',
        cursor: 'pointer', textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      <div
        style={{
          width: 58, height: 68, borderRadius: 9,
          flexShrink: 0, overflow: 'hidden',
          marginRight: 12, background: 'var(--avorio-dim)',
        }}
      >
        {place.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.cover_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, var(--ciocco), ${catColor(place.category)})` }} />
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.11em', color: catColor(place.category), marginBottom: 3, fontFamily: 'var(--font-sans)' }}>
          {place.category}{price ? ` · ${price}` : ''}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ciocco)', lineHeight: 1.2, marginBottom: 3 }}>
          {place.name}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--avorio-dk)', fontFamily: 'var(--font-sans)' }}>
          {place.walk_minutes ? `${place.walk_minutes} min a piedi` : (place.address ?? '')}
        </div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--avorio-dim)', display: 'flex', alignItems: 'center', paddingLeft: 8 }}>›</div>
    </button>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

interface Props {
  places: Place[];
}

export function EatDrinkTab({ places }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const categories = Array.from(new Set(places.map(p => p.category)));
  const filtered = activeCategory ? places.filter(p => p.category === activeCategory) : places;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--avorio)', position: 'relative' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--ciocco)', padding: 'calc(env(safe-area-inset-top, 0px) + 1rem) 18px 14px', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--terra)', marginBottom: 2, fontFamily: 'var(--font-sans)' }}>
          Pigneto Insights
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'var(--avorio)', lineHeight: 1.1 }}>
          Eat &amp; Drink
        </div>
      </div>

      {/* ── Filter chips ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 18px 8px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 } as React.CSSProperties}>
        <FilterChip label="Tutti" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
        {categories.map(cat => (
          <FilterChip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </div>

      {/* ── Place list ─────────────────────────────────────── */}
      <div style={{ padding: '0 18px' }}>
        {filtered.map(p => <PlaceRow key={p.id} place={p} onTap={() => setSelectedPlace(p)} />)}
      </div>

      {/* ── Detail overlay ─────────────────────────────────── */}
      {selectedPlace && (
        <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        fontSize: 10, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.09em',
        padding: '5px 12px', borderRadius: 20,
        border: `1px solid ${active ? 'var(--ciocco)' : 'var(--avorio-dim)'}`,
        background: active ? 'var(--ciocco)' : 'transparent',
        color: active ? 'var(--avorio)' : 'var(--avorio-dk)',
        cursor: 'pointer', fontFamily: 'var(--font-sans)',
        transition: 'all 0.15s',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      {label}
    </button>
  );
}
