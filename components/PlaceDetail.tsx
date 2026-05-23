'use client';
import type { Place } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';

const CAT_GRADIENT: Record<string, string> = {
  'Café':          'linear-gradient(160deg, var(--ciocco), var(--terra))',
  'Brewery':       'linear-gradient(160deg, var(--ciocco), var(--ardesia))',
  'Trattoria':     'linear-gradient(160deg, var(--pompei), var(--ciocco))',
  'Wine bar':      'linear-gradient(160deg, var(--pompei), var(--ardesia))',
  'Restaurant':    'linear-gradient(160deg, var(--pompei), var(--ciocco))',
  'Pizzeria':      'linear-gradient(160deg, var(--pompei), var(--terra))',
  'Steakhouse':    'linear-gradient(160deg, var(--pompei), var(--ciocco))',
  'Seafood':       'linear-gradient(160deg, var(--ardesia), var(--oliva))',
  'Gelateria':     'linear-gradient(160deg, var(--ardesia), var(--terra))',
  'Club':          'linear-gradient(160deg, var(--ardesia), var(--pompei))',
  'Japanese':      'linear-gradient(160deg, var(--ardesia), var(--oliva))',
  'International': 'linear-gradient(160deg, var(--oliva), var(--ardesia))',
  'Gastropub':     'linear-gradient(160deg, var(--oliva), var(--ciocco))',
  'Street food':   'linear-gradient(160deg, var(--terra), var(--pompei))',
  'Grocery':       'linear-gradient(160deg, var(--oliva), var(--terra))',
  'Market':        'linear-gradient(160deg, var(--oliva), var(--ardesia))',
};
function catGradient(cat: string) { return CAT_GRADIENT[cat] ?? 'linear-gradient(160deg, var(--ciocco), var(--terra))'; }

function mapsUrl(place: Place): string | null {
  if (place.google_maps_url) return place.google_maps_url;
  if (place.address) return `https://maps.google.com/?q=${encodeURIComponent(place.address)}`;
  return null;
}

function StarRating({ rating, count }: { rating: number; count: number | null }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return '★';
    if (i === full && half) return '⯨';
    return '☆';
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 15, color: 'var(--terra)', letterSpacing: 1 }}>{stars.join('')}</span>
      <span style={{ fontSize: 13, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)' }}>
        {rating.toFixed(1)}{count ? ` · ${count.toLocaleString()} reviews` : ''}
      </span>
    </div>
  );
}

interface InfoRowProps {
  icon: string;
  text: string;
  href?: string | null;
}
function InfoRow({ icon, text, href }: InfoRowProps) {
  const content = (
    <div className="info-row">
      <span className="info-icon">{icon}</span>
      <span className="info-text">{text}</span>
      {href && <span className="info-arrow">›</span>}
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
  const allImages = [
    ...(place.cover_url ? [place.cover_url] : []),
    ...(place.gallery_urls ?? []),
  ];

  return (
    <div className="overlay overlay--avorio">

      {/* ── Hero image / gradient header ─────────────────── */}
      <div style={{ position: 'relative', height: 260, background: catGradient(place.category), flexShrink: 0 }}>
        {place.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.cover_url}
            alt={place.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.08) 60%)' }} />
        <button onClick={onClose} className="back-btn">←</button>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.65)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
            {place.category}{price ? ` · ${price}` : ''}{place.walk_minutes ? ` · ${place.walk_minutes} min walk` : ''}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 28, lineHeight: 1.2, color: 'white', margin: 0 }}>
            {place.name}
          </h1>
        </div>
      </div>

      {/* ── Gallery strip ────────────────────────────────── */}
      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '10px 18px', scrollbarWidth: 'none' }}>
          {allImages.slice(1).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt=""
              style={{ height: 80, width: 120, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            />
          ))}
        </div>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      <div style={{ padding: '20px 18px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* editorial intro */}
        {place.editorial_intro_md && (
          <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: 0, fontStyle: 'italic' }}>
            {place.editorial_intro_md}
          </p>
        )}

        {/* practical description */}
        {place.description && (
          <p style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: 0 }}>
            {place.description}
          </p>
        )}

        {/* rating */}
        {place.google_rating != null && (
          <StarRating rating={place.google_rating} count={place.google_review_count ?? null} />
        )}

        {/* tags */}
        {place.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {place.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--ardesia)', background: 'rgba(80,90,105,0.08)',
                padding: '4px 10px', borderRadius: 20,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* action buttons */}
        {(place.booking_url || place.menu_url || place.delivery_url) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {place.booking_url && (
              <a href={place.booking_url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)',
                color: 'white', background: 'var(--pompei)',
                padding: '9px 16px', borderRadius: 24, textDecoration: 'none',
              }}>
                Reserve ›
              </a>
            )}
            {place.menu_url && (
              <a href={place.menu_url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)',
                color: 'var(--pompei)', border: '1.5px solid var(--pompei)',
                padding: '9px 16px', borderRadius: 24, textDecoration: 'none',
              }}>
                Menu ›
              </a>
            )}
            {place.delivery_url && (
              <a href={place.delivery_url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)',
                color: 'var(--ardesia)', border: '1.5px solid var(--ardesia)',
                padding: '9px 16px', borderRadius: 24, textDecoration: 'none',
              }}>
                Order delivery ›
              </a>
            )}
          </div>
        )}

        {/* info rows */}
        <div>
          {place.address && <InfoRow icon="📍" text={place.address} href={mapsUrl(place)} />}
          {place.hours && <InfoRow icon="🕐" text={place.hours} />}
          {place.phone && <InfoRow icon="📞" text={place.phone} href={`tel:${place.phone}`} />}
          {place.website && (
            <InfoRow
              icon="🌐"
              text={place.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              href={place.website}
            />
          )}
          {place.instagram_url && (
            <InfoRow
              icon="📷"
              text={place.instagram_url.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '')}
              href={place.instagram_url}
            />
          )}
          {place.social_url && !place.instagram_url && (
            <InfoRow icon="↗" text="Social page" href={place.social_url} />
          )}
          {place.video_url && <InfoRow icon="▶" text="Watch video" href={place.video_url} />}
        </div>
      </div>
    </div>
  );
}
