'use client';
import { useState } from 'react';
import type { WeeklyIssue, IssueShort, Story, Place, EvergreenItem } from '@/lib/types';
import { PlaceDetail } from '@/components/PlaceDetail';
import { EvergreenDetail } from '@/components/EvergreenDetail';
import { DeepReadCard } from '@/components/DeepReadCard';
import Link from 'next/link';

// ── markdown renderer (paragraphs, bold, italic, hr) ──────────────────────────
function renderMd(md: string) {
  return md.split(/\n{2,}/).map((block, i) => {
    const t = block.trim();
    if (!t) return null;
    if (t === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--avorio-dim)', margin: '18px 0' }} />;
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

// ── short event card ──────────────────────────────────────────────────────────
function ShortCard({ short }: { short: IssueShort }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--avorio-dim)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ciocco)', lineHeight: 1.2 }}>
          {short.title}
        </span>
        {short.date_label && (
          <span style={{ fontSize: 12, color: 'var(--terra)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {short.date_label}
          </span>
        )}
      </div>
      {renderMd(short.body_md)}
      {short.external_url && (
        <a href={short.external_url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: 'var(--ardesia)', fontFamily: 'var(--font-sans)', textDecoration: 'none' }}>
          More info ↗
        </a>
      )}
    </div>
  );
}

// ── discovery card (place or evergreen) ───────────────────────────────────────
function DiscoveryPlaceCard({ place, onTap }: { place: Place; onTap: () => void }) {
  return (
    <button onClick={onTap}
      style={{
        width: '100%', textAlign: 'left', background: 'white',
        border: '1px solid var(--avorio-dim)', borderRadius: 12, padding: '14px 16px',
        marginBottom: 10, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ciocco)' }}>
          {place.name}
        </span>
        <span style={{ fontSize: 12, color: 'var(--terra)', fontFamily: 'var(--font-sans)' }}>
          {place.category}
        </span>
      </div>
      {place.editorial_intro_md && (
        <p style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: 0 }}>
          {place.editorial_intro_md}
        </p>
      )}
    </button>
  );
}

function DiscoveryEvergreenCard({ item, onTap }: { item: EvergreenItem; onTap: () => void }) {
  return (
    <button onClick={onTap}
      style={{
        width: '100%', textAlign: 'left', background: 'white',
        border: '1px solid var(--avorio-dim)', borderRadius: 12, padding: '14px 16px',
        marginBottom: 10, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ciocco)' }}>
          {item.title}
        </span>
      </div>
      {item.editorial_intro_md && (
        <p style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: 0 }}>
          {item.editorial_intro_md}
        </p>
      )}
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

  const hasDiscoveries = discoveryPlaces.length > 0 || discoveryEvergreen.length > 0;

  return (
    <div style={{
      minHeight: standalone ? '100vh' : '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--avorio)',
      position: 'relative',
    }}>

      {/* ── Lead Hero ──────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(162deg, var(--ciocco) 0%, var(--pompei) 55%, hsl(20,50%,42%) 100%)',
        padding: standalone
          ? '80px 20px 32px'
          : 'calc(env(safe-area-inset-top, 0px) + 2.5rem) 20px 32px',
        position: 'relative', flexShrink: 0,
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

          {/* issue date */}
          <span style={{ fontSize: 12, color: 'rgba(232,218,198,0.4)', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
            {new Date(issue.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ── Lead Body ──────────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 0' }}>
        {renderMd(issue.lead_body_md)}
      </div>

      {/* ── Alerts ─────────────────────────────────────────────── */}
      {issue.alerts_md && (
        <div style={{ margin: '8px 20px 0' }}>
          <div style={{
            background: 'rgba(166,59,38,0.08)', border: '1px solid rgba(166,59,38,0.2)',
            borderRadius: 10, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pompei)', fontFamily: 'var(--font-sans)' }}>
                Transport & closures
              </span>
            </div>
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
        <div style={{ padding: '0 20px' }}>
          <SectionLabel label="This week we found" accent="var(--terra)" />
          {discoveryPlaces.map(p => (
            <DiscoveryPlaceCard key={p.id} place={p} onTap={() => setSelectedPlace(p)} />
          ))}
          {discoveryEvergreen.map(e => (
            <DiscoveryEvergreenCard key={e.id} item={e} onTap={() => setSelectedEvergreen(e)} />
          ))}
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
