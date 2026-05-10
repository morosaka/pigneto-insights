'use client';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';

interface Props {
  place: Place;
  tabLabel: string;
  onBack: () => void;
}

export function DetailPage({ place, tabLabel, onBack }: Props) {
  const tier = priceTierLabel(place.price_tier);

  return (
    <div style={{
      width: '100%', height: '100%',
      overflowY: 'auto', background: 'var(--avorio)',
    }}>
      {/* Cover — top ~45% */}
      <div style={{ position: 'relative', height: '45vh', flexShrink: 0 }}>
        {place.cover_url ? (
          <img
            src={place.cover_url}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(162deg, hsl(19,34%,10%), hsl(23,55%,40%))',
          }} />
        )}

        {/* Bottom vignette */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 48, left: 16,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 7.5, fontWeight: 500,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
            border: 'none', borderRadius: 4,
            padding: '3px 8px', cursor: 'pointer',
          }}
        >
          ← {tabLabel}
        </button>

        {/* Eyebrow + title */}
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 14, height: 1.5, background: 'var(--terra)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 9, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--terra)',
            }}>
              {[place.category, tier].filter(Boolean).join(' · ')}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: 28, color: 'var(--avorio)', lineHeight: 1.1,
          }}>
            {place.name}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 48px' }}>
        {/* Meta tile */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 16,
          padding: '12px 0',
          borderBottom: '1px solid hsl(37,18%,80%)',
          marginBottom: 16,
        }}>
          {place.walk_minutes != null && (
            <div>
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 9, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'hsl(37,20%,60%)', marginBottom: 2,
              }}>Walk</p>
              <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 13, color: 'var(--ciocco)' }}>
                {place.walk_minutes} min
              </p>
            </div>
          )}
          {place.hours && (
            <div>
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 9, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'hsl(37,20%,60%)', marginBottom: 2,
              }}>Hours</p>
              <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 13, color: 'var(--ciocco)' }}>
                {place.hours}
              </p>
            </div>
          )}
          {place.price_range && (
            <div>
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 9, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'hsl(37,20%,60%)', marginBottom: 2,
              }}>Price</p>
              <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 13, color: 'var(--ciocco)' }}>
                {tier} · {place.price_range}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontWeight: 300, fontSize: 14, lineHeight: 1.6,
            color: 'var(--ciocco)', marginBottom: 24,
          }}>
            {place.description}
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {place.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 11, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--avorio)', background: 'var(--terra)',
                padding: '10px 20px', borderRadius: 20,
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Open in Maps
            </a>
          )}
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 11, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--ciocco)',
                border: '1px solid hsl(37,18%,72%)',
                padding: '10px 20px', borderRadius: 20,
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
