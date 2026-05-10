'use client';
import { useState, useMemo } from 'react';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';

interface Props {
  places: Place[];
  tabLabel: string;
  onSelect: (place: Place) => void;
  onBack: () => void;
}

export function CatalogView({ places, tabLabel, onSelect, onBack }: Props) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<Place | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(places.map(p => p.category)));
    return ['All', ...cats.sort()];
  }, [places]);

  const filtered = useMemo(() => {
    return places.filter(p => {
      const matchesCat = filter === 'All' || p.category === filter;
      const matchesSearch = !search
        || p.name.toLowerCase().includes(search.toLowerCase())
        || p.category.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [places, filter, search]);

  const displayed = preview ?? filtered[0] ?? null;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', background: 'var(--avorio)',
    }}>
      {/* LEFT COLUMN — 38% */}
      <div style={{ width: '38%', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        {displayed?.cover_url ? (
          <img
            src={displayed.cover_url}
            alt={displayed.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(162deg, hsl(19,34%,10%), hsl(23,55%,40%))',
          }} />
        )}

        {/* Caption overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '40px 10px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }}>
          <p style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: 14, color: 'white', lineHeight: 1.2,
          }}>
            {displayed?.name}
          </p>
          <span style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 8, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {displayed?.category}
          </span>
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 48, left: 8,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 8, fontWeight: 500,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
            border: 'none', borderRadius: 4,
            padding: '3px 8px', cursor: 'pointer',
          }}
        >
          ← {tabLabel}
        </button>
      </div>

      {/* RIGHT COLUMN — 62% */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Search — shown only when > 30 entries */}
        {places.length > 30 && (
          <div style={{ padding: '8px 12px 0' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or type…"
              style={{
                width: '100%', padding: '6px 10px',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 11,
                color: 'var(--ciocco)', background: 'white',
                border: '1px solid hsl(37,18%,78%)', borderRadius: 8,
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Filter chips */}
        <div style={{
          display: 'flex', gap: 6, padding: '8px 12px',
          overflowX: 'auto', flexShrink: 0,
          scrollbarWidth: 'none',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 9, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 20,
                border: filter === cat ? 'none' : '1px solid hsl(37,18%,72%)',
                background: filter === cat ? 'var(--ciocco)' : 'transparent',
                color: filter === cat ? 'var(--avorio)' : 'var(--ciocco)',
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: 4,
            }}>
              <p style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontStyle: 'italic', fontSize: 16, color: 'var(--ciocco)',
              }}>
                Nothing here yet.
              </p>
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 11, color: 'hsl(37,20%,55%)',
              }}>
                Try removing a filter.
              </p>
            </div>
          ) : filtered.map(place => {
            const isSelected = preview?.id === place.id || (!preview && filtered[0]?.id === place.id);
            const tier = priceTierLabel(place.price_tier);
            const meta = [place.category, tier, place.walk_minutes != null ? `${place.walk_minutes} min` : null]
              .filter(Boolean).join(' · ');

            return (
              <button
                key={place.id}
                onClick={() => { setPreview(place); onSelect(place); }}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '10px 12px',
                  background: isSelected ? 'white' : 'transparent',
                  border: 'none', borderBottom: '1px solid hsl(37,18%,80%)',
                  cursor: 'pointer',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic', fontWeight: 300,
                  fontSize: 14, color: 'var(--ciocco)', lineHeight: 1.2,
                }}>
                  {place.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontSize: 10,
                  color: isSelected ? 'var(--terra)' : 'hsl(37,20%,55%)',
                  marginTop: 2,
                }}>
                  {meta}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
