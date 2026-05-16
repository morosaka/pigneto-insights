'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';

const CAT_COLOR: Record<string, string> = {
  'Grocery':    'var(--oliva)',
  'Market':     'var(--oliva)',
  'Pharmacy':   'var(--ardesia)',
  'Transport':  'var(--ardesia)',
  'Laundry':    'var(--ardesia)',
  'Tabacchi':   'var(--ciocco)',
  'ATM':        'var(--ciocco)',
  'Health':     'var(--ardesia)',
};
function catColor(cat: string) { return CAT_COLOR[cat] ?? 'var(--oliva)'; }

function PlaceRow({ place, onTap }: { place: Place; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      style={{
        display: 'flex', alignItems: 'stretch', width: '100%',
        padding: '12px 0',
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
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, var(--ardesia), var(--oliva))` }} />
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.11em', color: catColor(place.category), marginBottom: 3, fontFamily: 'var(--font-sans)' }}>
          {place.category}{place.hours ? ` · ${place.hours}` : ''}
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

interface Props {
  places: Place[];
}

export function EssentialsTab({ places }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const grouped = places.reduce<Record<string, Place[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});
  const categoryOrder = Array.from(new Set(places.map(p => p.category)));

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--avorio)', position: 'relative' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--ardesia)', padding: 'calc(env(safe-area-inset-top, 0px) + 1rem) 18px 14px', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)', marginBottom: 2, fontFamily: 'var(--font-sans)' }}>
          Pigneto Insights
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'var(--avorio)', lineHeight: 1.1 }}>
          Nel Quartiere
        </div>
      </div>

      {/* ── Grouped list ───────────────────────────────────── */}
      {categoryOrder.map(cat => (
        <div key={cat}>
          <div style={{ padding: '11px 18px 6px', fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'var(--avorio-dk)', background: 'hsl(37, 30%, 84%)', borderBottom: '1px solid var(--avorio-dim)', fontFamily: 'var(--font-sans)' }}>
            {cat}
          </div>
          <div style={{ padding: '0 18px' }}>
            {grouped[cat].map(p => <PlaceRow key={p.id} place={p} onTap={() => setSelectedPlace(p)} />)}
          </div>
        </div>
      ))}

      {/* ── Detail overlay ─────────────────────────────────── */}
      {selectedPlace && (
        <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}
