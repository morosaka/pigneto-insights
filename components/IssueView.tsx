'use client';
import { useState } from 'react';
import type { WeeklyIssue, IssueShort, Story, Place, EvergreenItem } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';
import { EvergreenDetail } from '@/components/EvergreenDetail';
import { DeepReadCard } from '@/components/DeepReadCard';
import Link from 'next/link';

// ── markdown renderer (paragraphs, bold, italic, hr, inline images) ──────────
function renderMd(md: string) {
  return md.split(/\n{2,}/).map((block, i) => {
    const t = block.trim();
    if (!t) return null;
    if (t === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--avorio-dim)', margin: '18px 0' }} />;

    // inline image: ![caption](url)
    const img = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) return (
      <figure key={i} style={{ margin: '20px 0' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img[2]} alt={img[1]} style={{ width: '100%', borderRadius: 10, display: 'block' }} />
        {img[1] && (
          <figcaption style={{ fontSize: 12, color: 'var(--ardesia)', fontFamily: 'var(--font-sans)', fontStyle: 'italic', marginTop: 6, lineHeight: 1.45 }}>
            {img[1]}
          </figcaption>
        )}
      </figure>
    );

    const h1 = t.match(/^#\s+(.*)/);
    if (h1) return (
      <h2 key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: 'var(--ciocco)', margin: '22px 0 6px' }}>
        {h1[1]}
      </h2>
    );
    const html = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>');
    return (
      <p key={i} dangerouslySetInnerHTML={{ __html: html }}
        style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: '0 0 14px' }} />
    );
  });
}

function sourceDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

function stripSourceLines(md: string): string {
  return md
    .split(/\n{2,}/)
    .filter(block => !block.trim().startsWith('Source:'))
    .join('\n\n');
}

// ── short event card ──────────────────────────────────────────────────────────
function ShortCard({ short }: { short: IssueShort }) {
  const img = short.image_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={short.image_url}
      alt={short.title}
      style={{ width: '100%', borderRadius: 8, marginBottom: 10, display: 'block', objectFit: 'cover', maxHeight: 220 }}
    />
  ) : null;

  return (
    <div style={{ padding: '4px 0 14px', borderBottom: '1px solid var(--avorio-dim)' }}>
      {short.image_position === 'above' && img}
      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 26, lineHeight: 1.15, color: 'var(--ciocco)', marginBottom: 12 }}>
        {short.title}
      </div>
      {short.image_position === 'middle' && img}
      {short.date_label && (
        <div style={{ fontSize: 12, color: 'var(--terra)', fontFamily: 'var(--font-sans)', marginBottom: 10, textAlign: 'right' }}>
          {short.date_label}
        </div>
      )}
      {renderMd(stripSourceLines(short.body_md))}
      {short.image_position === 'below' && img}
      {short.external_url && (
        <a href={short.external_url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: 'var(--ardesia)', fontFamily: 'var(--font-sans)', textDecoration: 'none' }}>
          {sourceDomain(short.external_url)} ↗
        </a>
      )}
    </div>
  );
}

// ── weekly podcast player ─────────────────────────────────────────────────────
function IssueAudioPlayer({ audioUrl, durationMin }: { audioUrl: string; durationMin: number | null }) {
  return (
    <div style={{ margin: '20px 20px 0' }}>
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--ardesia)', marginBottom: 10,
      }}>
        🎙 Weekly Podcast{durationMin ? ` · ${durationMin} min` : ''}
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls src={audioUrl} style={{ width: '100%', borderRadius: 8 }} />
    </div>
  );
}

// ── discovery carousel ────────────────────────────────────────────────────────

type DiscoveryItem =
  | { kind: 'place'; data: Place; index: number }
  | { kind: 'evergreen'; data: EvergreenItem; index: number };

const ACCENT_SWATCHES = [
  { bg: 'linear-gradient(160deg, var(--ciocco), var(--terra))', accent: 'var(--terra)' },
  { bg: 'linear-gradient(160deg, var(--ardesia), var(--oliva))', accent: 'var(--oliva)' },
  { bg: 'linear-gradient(160deg, var(--pompei), var(--ciocco))', accent: 'var(--pompei)' },
  { bg: 'linear-gradient(160deg, var(--oliva), var(--ardesia))', accent: 'var(--ardesia)' },
  { bg: 'linear-gradient(160deg, var(--terra), var(--pompei))', accent: 'var(--ciocco)' },
];

function firstSentence(text: string, maxChars = 120): string {
  const m = text.match(/^.{20,}?[.!?]/);
  if (m && m[0].length <= maxChars) return m[0];
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).replace(/\s\S+$/, '…');
}

function DiscoveryCarouselCard({ item, onTap }: { item: DiscoveryItem; onTap: () => void }) {
  const swatch = ACCENT_SWATCHES[item.index % ACCENT_SWATCHES.length];
  const category = item.kind === 'place' ? item.data.category : 'Roma Evergreen';
  const title = item.kind === 'place' ? item.data.name : item.data.title;
  const coverUrl = item.kind === 'place' ? item.data.cover_url : item.data.cover_url;
  const caption = item.kind === 'place'
    ? item.data.description
    : item.data.editorial_intro_md;

  return (
    <button onClick={onTap} style={{
      flex: '0 0 calc(100vw - 56px)', scrollSnapAlign: 'start',
      background: 'white', border: '1px solid var(--avorio-dim)',
      borderRadius: 14, overflow: 'hidden',
      cursor: 'pointer', textAlign: 'left', padding: 0,
      WebkitTapHighlightColor: 'transparent',
    } as React.CSSProperties}>
      {/* image zone */}
      <div style={{
        height: 180, position: 'relative', flexShrink: 0,
        background: swatch.bg,
      }}>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {/* category pill */}
        <div style={{
          position: 'absolute', bottom: 10, left: 12,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'white', fontFamily: 'var(--font-sans)',
          background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)',
          padding: '3px 8px', borderRadius: 20,
        }}>
          {category}
        </div>
      </div>
      {/* content zone */}
      <div style={{ padding: '13px 15px 15px' }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 18, lineHeight: 1.25, color: 'var(--ciocco)', marginBottom: 7,
        }}>
          {title}
        </div>
        {caption && (
          <p style={{
            fontSize: 13, lineHeight: 1.45, color: 'var(--ardesia)',
            fontFamily: 'var(--font-sans)', margin: '0 0 10px',
          }}>
            {firstSentence(caption)}
          </p>
        )}
        <span style={{ fontSize: 12, color: swatch.accent, fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}>
          Read more ›
        </span>
      </div>
    </button>
  );
}

// ── section header ────────────────────────────────────────────────────────────
function SectionLabel({ label, accent = 'var(--terra)' }: { label: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 12px' }}>
      <div style={{ width: 3, height: 14, borderRadius: 2, background: accent, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>
        {label}
      </span>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

interface Props {
  issue: WeeklyIssue;
  shorts: IssueShort[];
  deepRead: Story | null;
  discoveryPlaces: Place[];
  discoveryEvergreen: EvergreenItem[];
  /** If true, renders as a scrollable standalone page (no fixed positioning) */
  standalone?: boolean;
}

export function IssueView({ issue, shorts, deepRead, discoveryPlaces, discoveryEvergreen, standalone = false }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedEvergreen, setSelectedEvergreen] = useState<EvergreenItem | null>(null);
  const [articleExpanded, setArticleExpanded] = useState(false);

  const hasDiscoveries = discoveryPlaces.length > 0 || discoveryEvergreen.length > 0;

  return (
    <div style={{
      minHeight: standalone ? '100vh' : '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--avorio)',
      position: 'relative',
    }}>

      {/* ── Lead Hero ──────────────────────────────────────────── */}
      <div
        role="button"
        aria-expanded={articleExpanded}
        onClick={() => setArticleExpanded(prev => !prev)}
        style={{
          background: 'linear-gradient(162deg, var(--ciocco) 0%, var(--pompei) 55%, hsl(20,50%,42%) 100%)',
          padding: standalone
            ? '80px 20px 32px'
            : 'calc(env(safe-area-inset-top, 0px) + 2.5rem) 20px 32px',
          position: 'relative', flexShrink: 0,
          cursor: 'pointer', userSelect: 'none',
        }}>
        {/* grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
        }} />

        {/* back arrow for standalone pages */}
        {standalone && (
          <Link href="/" style={{
            position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', left: 16,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 18, textDecoration: 'none', zIndex: 10,
          }}>←</Link>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 20, height: 1, background: 'var(--terra)', opacity: 0.8, flexShrink: 0 }} />
            <span className="t-eyebrow">Pigneto Insights</span>
          </div>

          <h1 className="t-hero" style={{ marginBottom: issue.lead_subtitle ? 8 : 16 }}>
            {issue.lead_title}
          </h1>

          {issue.lead_subtitle && (
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.35, color: 'rgba(232,218,198,0.6)', marginBottom: 16, fontFamily: 'var(--font-sans)', maxWidth: 300 }}>
              {issue.lead_subtitle}
            </p>
          )}

          {/* issue date + read article affordance */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'rgba(232,218,198,0.4)', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
              {new Date(issue.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              color: 'rgba(232,218,198,0.55)',
              fontFamily: 'var(--font-sans)', fontSize: 12, letterSpacing: '0.08em',
            }}>
              <span>{articleExpanded ? 'Hide article' : 'Read article'}</span>
              <span style={{
                display: 'inline-block',
                transform: articleExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 250ms ease',
                fontSize: 14, lineHeight: 1,
              }}>▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead Body ──────────────────────────────────────────── */}
      <div style={{
        overflow: 'hidden',
        maxHeight: articleExpanded ? '2000px' : '0px',
        opacity: articleExpanded ? 1 : 0,
        transition: 'max-height 350ms ease, opacity 250ms ease',
      }}>
        <div style={{ padding: '24px 20px 8px' }}>
          {renderMd(issue.lead_body_md)}
        </div>
      </div>

      {/* ── Weekly Podcast ─────────────────────────────────────── */}
      {issue.audio_url && (
        <IssueAudioPlayer audioUrl={issue.audio_url} durationMin={issue.audio_duration_min ?? null} />
      )}

      {/* ── Alerts ─────────────────────────────────────────────── */}
      {issue.alerts_md && (
        <div style={{ padding: '0 20px' }}>
          <SectionLabel label="⚠ Transport & closures" accent="var(--pompei)" />
          <div style={{
            background: 'rgba(166,59,38,0.08)', border: '1px solid rgba(166,59,38,0.2)',
            borderRadius: 10, padding: '12px 16px',
          }}>
            {renderMd(issue.alerts_md)}
          </div>
        </div>
      )}

      {/* ── Shorts ─────────────────────────────────────────────── */}
      {shorts.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          <SectionLabel label="This week" accent="var(--oliva)" />
          {shorts.map(s => <ShortCard key={s.id} short={s} />)}
        </div>
      )}

      {/* ── Deep Read of the Month ─────────────────────────────── */}
      {deepRead && (
        <div style={{ padding: '0 20px' }}>
          <SectionLabel label="From the editor" accent="var(--ardesia)" />
          <DeepReadCard story={deepRead} />
        </div>
      )}

      {/* ── Discoveries ────────────────────────────────────────── */}
      {hasDiscoveries && (
        <div>
          <div style={{ padding: '0 20px' }}>
            <SectionLabel label="This week we found" accent="var(--terra)" />
          </div>
          <div className="hscroll" style={{
            display: 'flex', scrollSnapType: 'x mandatory',
            gap: 12, paddingLeft: 20, paddingRight: 20, paddingBottom: 16,
          }}>
            {[
              ...discoveryPlaces.map((p, i) => ({ kind: 'place' as const, data: p, index: i })),
              ...discoveryEvergreen.map((e, i) => ({ kind: 'evergreen' as const, data: e, index: discoveryPlaces.length + i })),
            ].map(item => (
              <DiscoveryCarouselCard
                key={item.kind === 'place' ? `p-${item.data.id}` : `e-${item.data.id}`}
                item={item}
                onTap={() => item.kind === 'place' ? setSelectedPlace(item.data) : setSelectedEvergreen(item.data)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Weather ────────────────────────────────────────────── */}
      {issue.weather_md && (
        <div style={{ padding: '0 20px' }}>
          <SectionLabel label="Weather" accent="var(--ardesia)" />
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', fontStyle: 'italic', margin: '0 0 4px' }}>
            {issue.weather_md}
          </p>
        </div>
      )}

      {/* ── Library link ───────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 48px', marginTop: 8 }}>
        <div style={{ height: 1, background: 'var(--avorio-dim)', marginBottom: 20 }} />
        <Link href="/library"
          style={{
            fontSize: 13, color: 'var(--ardesia)', fontFamily: 'var(--font-sans)',
            textDecoration: 'none', letterSpacing: '0.05em',
          }}>
          Read past issues →
        </Link>
      </div>

      {/* ── Overlays ───────────────────────────────────────────── */}
      {selectedPlace && <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
      {selectedEvergreen && <EvergreenDetail item={selectedEvergreen} onClose={() => setSelectedEvergreen(null)} />}
    </div>
  );
}
