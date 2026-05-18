'use client';
import { useState } from 'react';
import type { Place, Story, NewsItem } from '@/lib/types';
import { priceTierLabel } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';
import { StoryDetail } from '@/components/StoryDetail';
import { NewsDetail } from '@/components/NewsDetail';
import { EvergreenOverlay } from '@/components/EvergreenOverlay';
import type { EvergreenItem } from '@/lib/types';

// ── helpers ──────────────────────────────────────────────────────────────────

const EVERGREEN_PILLS = [
  { label: 'neighbourhood history', color: 'var(--oliva)' },
  { label: 'Rome transport',        color: 'var(--ardesia)' },
  { label: 'Roman cuisine',         color: 'var(--pompei)' },
  { label: 'walking routes',        color: 'var(--oliva)' },
  { label: 'historic markets',      color: 'var(--ardesia)' },
  { label: 'street art',            color: 'var(--pompei)' },
  { label: 'parks & gardens',       color: 'var(--oliva)' },
];

function newsColor(category: string | null): string {
  const map: Record<string, string> = {
    food:    'var(--terra)',
    sport:   'var(--oliva)',
    culture: 'var(--ardesia)',
  };
  return map[category ?? ''] ?? 'var(--pompei)';
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const s = start.split('-');
  const label = `${parseInt(s[2])} ${months[parseInt(s[1]) - 1]}`;
  if (!end || end === start) return label;
  const e = end.split('-');
  return `${label} – ${parseInt(e[2])} ${months[parseInt(e[1]) - 1]}`;
}

// ── sub-components ────────────────────────────────────────────────────────────

function HorizontalPlaceCard({ place, onTap }: { place: Place; onTap: () => void }) {
  const price = priceTierLabel(place.price_tier);
  return (
    <button
      onClick={onTap}
      style={{
        flexShrink: 0,
        width: 160,
        background: 'white',
        borderRadius: 13,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        padding: 0,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      <div style={{ height: 100, position: 'relative', overflow: 'hidden', background: 'var(--avorio-dim)' }}>
        {place.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.cover_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--ciocco), var(--pompei))' }} />
        )}
        <span
          style={{
            position: 'absolute', bottom: 6, left: 7,
            fontSize: 12, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.07em',
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          {place.category}
        </span>
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 22,
            color: 'var(--ciocco)',
            lineHeight: 1.2,
            marginBottom: 4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}
        >
          {place.name}
        </div>
        <div className="t-meta" style={{ fontSize: 16 }}>
          {[price, place.walk_minutes ? `${place.walk_minutes} min` : null].filter(Boolean).join(' · ')}
        </div>
      </div>
    </button>
  );
}

function NewsRow({ item, onTap }: { item: NewsItem; onTap: () => void }) {
  return (
    <button onClick={onTap} className="news-row">
      <div className="news-dot" style={{ background: newsColor(item.category) }} />
      <div style={{ flex: 1 }}>
        <div className="t-heading" style={{ marginBottom: 4 }}>
          {item.title}
        </div>
        <div className="t-meta">
          {formatDateRange(item.date_start, item.date_end)}
          {item.location ? ` · ${item.location}` : ''}
        </div>
      </div>
    </button>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

interface Props {
  featuredStory: Story | null;
  eatDrinkPreview: Place[];
  news: NewsItem[];
  evergreenItems: EvergreenItem[];
  onViewEatDrink: () => void;
  onViewDiscover: () => void;
}

export function HomeTab({ featuredStory, eatDrinkPreview, news, evergreenItems, onViewEatDrink, onViewDiscover }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  function toggleTag(tag: string) {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  const readingTime = featuredStory
    ? (featuredStory.audio_time_min ?? featuredStory.reading_time_min)
    : null;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--avorio)', position: 'relative' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <div
        onClick={() => featuredStory && setSelectedStory(featuredStory)}
        style={{
          minHeight: 280, position: 'relative', flexShrink: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.4rem 1.3rem 1.2rem',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2.5rem)',
          background: 'linear-gradient(162deg, var(--ciocco) 0%, var(--pompei) 55%, hsl(20,50%,42%) 100%)',
          cursor: featuredStory ? 'pointer' : 'default',
        }}
      >
        {/* grain */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 20, height: 1, background: 'var(--terra)', opacity: 0.8, flexShrink: 0 }} />
            <span className="t-eyebrow">
              {featuredStory ? 'Rome Stories' : 'Pigneto Insights'}
            </span>
          </div>

          <h1 className="t-hero" style={{ marginBottom: 8 }}>
            {featuredStory ? featuredStory.title : 'Welcome to Pigneto'}
          </h1>

          {featuredStory?.summary && (
            <p
              style={{
                fontSize: 16, fontWeight: 300, lineHeight: 1.4,
                color: 'rgba(232,218,198,0.55)', marginBottom: 14,
                maxWidth: 280, fontFamily: 'var(--font-sans)',
              }}
            >
              {featuredStory.summary}
            </p>
          )}

          {readingTime && (
            <span
              style={{
                fontSize: 14, color: 'rgba(232,218,198,0.45)',
                fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
              }}
            >
              {readingTime} min read
            </span>
          )}
        </div>
      </div>

      {/* ── Eat & Drink preview ────────────────────────────── */}
      {eatDrinkPreview.length > 0 && (
        <>
          <SectionHeader label="Where to Eat" action="see all →" onAction={onViewEatDrink} />
          <div className="hscroll">
            {eatDrinkPreview.map(p => <HorizontalPlaceCard key={p.id} place={p} onTap={() => setSelectedPlace(p)} />)}
          </div>
        </>
      )}

      <Divider />

      {/* ── News ───────────────────────────────────────────── */}
      {news.length > 0 && (
        <>
          <SectionHeader label="This Week" />
          {news.slice(0, 3).map(item => <NewsRow key={item.id} item={item} onTap={() => setSelectedNews(item)} />)}
        </>
      )}

      <Divider />

      {/* ── Roma Evergreen ─────────────────────────────────── */}
      <SectionHeader label="Rome — essentials" action="explore →" onAction={onViewDiscover} />
      <div className="chip-wrap" style={{ paddingBottom: 28 }}>
        {EVERGREEN_PILLS.map(pill => {
          const active = selectedTags.has(pill.label);
          return (
            <button
              key={pill.label}
              onClick={() => toggleTag(pill.label)}
              className="filter-chip"
              style={active
                ? { background: pill.color, borderColor: pill.color, color: 'white' }
                : { border: `1px solid ${pill.color}`, color: pill.color }
              }
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* ── Overlays ───────────────────────────────────────── */}
      {selectedPlace && (
        <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
      {selectedStory && (
        <StoryDetail story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
      {selectedNews && (
        <NewsDetail item={selectedNews} onClose={() => setSelectedNews(null)} />
      )}

    </div>
  );
}

// ── shared micro-components ────────────────────────────────────────────────────

function SectionHeader({ label, action, onAction }: { label: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-hd">
      <span className="t-section">{label}</span>
      {action && (
        <button onClick={onAction} className="section-hd-btn">
          {action}
        </button>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--avorio-dim)', margin: '0 18px' }} />;
}
