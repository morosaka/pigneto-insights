'use client';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';

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
  'Grocery':      'var(--oliva)',
  'Market':       'var(--oliva)',
  'Pharmacy':     'var(--ardesia)',
  'Transport':    'var(--ardesia)',
  'Laundry':      'var(--ardesia)',
};
function catColor(cat: string) { return CAT_COLOR[cat] ?? 'var(--terra)'; }

function mapsUrl(address: string | null) {
  if (!address) return null;
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

interface InfoRowProps {
  icon: string;
  text: string;
  href?: string | null;
}
function InfoRow({ icon, text, href }: InfoRowProps) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--avorio-dim)' }}>
      <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'var(--ciocco)', lineHeight: 1.4, fontFamily: 'var(--font-sans)', flex: 1 }}>{text}</span>
      {href && <span style={{ fontSize: 12, color: 'var(--terra)', fontFamily: 'var(--font-sans)', flexShrink: 0, marginTop: 1 }}>›</span>}
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

interface Props {
  place: Place;
  onClose: () => void;
}

export function PlaceDetail({ place, onClose }: Props) {
  const price = priceTierLabel(place.price_tier);
  const color = catColor(place.category);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--avorio)',
        zIndex: 20,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* ── Photo / gradient header ─────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: 260,
          background: `linear-gradient(160deg, var(--ciocco), ${color})`,
          flexShrink: 0,
        }}
      >
        {place.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.cover_url}
            alt={place.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {/* dark overlay for text legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%)' }} />

        {/* back button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
            left: 16,
            zIndex: 10,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            color: 'white',
            fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ←
        </button>

        {/* name at bottom of header */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 16px' }}>
          <div
            style={{
              fontSize: 9, fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.65)',
              marginBottom: 4, fontFamily: 'var(--font-sans)',
            }}
          >
            {place.category}{price ? ` · ${price}` : ''}
            {place.walk_minutes ? ` · ${place.walk_minutes} min a piedi` : ''}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontWeight: 300, fontSize: 28, lineHeight: 1.1,
              color: 'white', margin: 0,
            }}
          >
            {place.name}
          </h1>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div style={{ padding: '20px 18px 32px' }}>

        {/* description */}
        {place.description && (
          <p
            style={{
              fontSize: 14, lineHeight: 1.65,
              color: 'var(--ciocco)',
              fontFamily: 'var(--font-sans)',
              marginBottom: 20,
            }}
          >
            {place.description}
          </p>
        )}

        {/* info rows */}
        <div>
          {place.address && (
            <InfoRow
              icon="📍"
              text={place.address}
              href={mapsUrl(place.address)}
            />
          )}
          {place.hours && (
            <InfoRow icon="🕐" text={place.hours} />
          )}
          {place.phone && (
            <InfoRow icon="📞" text={place.phone} href={`tel:${place.phone}`} />
          )}
          {place.website && (
            <InfoRow
              icon="🌐"
              text={place.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              href={place.website}
            />
          )}
          {place.social_url && (
            <InfoRow
              icon="↗"
              text="Social page"
              href={place.social_url}
            />
          )}
        </div>
      </div>
    </div>
  );
}
