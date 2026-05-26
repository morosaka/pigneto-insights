'use client';
import { useState } from 'react';
import type { Story, NewsItem, EvergreenItem } from '@/lib/types';
import { StoryDetail } from '@/components/StoryDetail';
import { NewsDetail } from '@/components/NewsDetail';
import { EvergreenDetail } from '@/components/EvergreenDetail';
import { LibraryEntryPoint } from '@/components/LibraryEntryPoint';

// ── helpers ──────────────────────────────────────────────────────────────────

const EVERGREEN_PILLS = [
  { label: 'neighbourhood history', color: 'var(--oliva)' },
  { label: 'Rome transport',        color: 'var(--ardesia)' },
  { label: 'Roman cuisine',         color: 'var(--pompei)' },
  { label: 'walking routes',        color: 'var(--oliva)' },
  { label: 'historic markets',      color: 'var(--ardesia)' },
  { label: 'street art',            color: 'var(--pompei)' },
  { label: 'parks & gardens',       color: 'var(--oliva)' },
  { label: 'free museums',          color: 'var(--ardesia)' },
  { label: 'local food',            color: 'var(--pompei)' },
];

function newsColor(category: string | null): string {
  const map: Record<string, string> = { food: 'var(--terra)', sport: 'var(--oliva)', culture: 'var(--ardesia)' };
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

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ padding: '13px 18px 11px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 3, height: 16, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span className="t-section" style={{ color }}>{label}</span>
    </div>
  );
}

function NewsRow({ item, onTap }: { item: NewsItem; onTap: () => void }) {
  return (
    <button onClick={onTap} className="news-row">
      <div className="news-dot" style={{ background: newsColor(item.category) }} />
      <div style={{ flex: 1 }}>
        <div className="t-heading" style={{ marginBottom: 4 }}>{item.title}</div>
        <div className="t-meta">
          {formatDateRange(item.date_start, item.date_end)}
          {item.location ? ` · ${item.location}` : ''}
        </div>
      </div>
    </button>
  );
}

function RecentStoryCard({ story, onTap }: { story: Story; onTap: () => void }) {
  const timeMin = story.narration_time_min ?? story.reading_time_min;
  const hasAudio = !!(story.narration_url || story.podcast_url);
  return (
    <button
      onClick={onTap}
      style={{
        display: 'block', width: 'calc(100% - 36px)', margin: '0 18px 12px',
        padding: 0, borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 3px 14px rgba(19,12,6,0.1)',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      <div style={{
        minHeight: 110,
        background: 'linear-gradient(162deg, var(--ciocco), var(--pompei))',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '11px 14px', position: 'relative',
      }}>
        {story.cover_url && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${story.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 }} />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="t-heading-sm" style={{ marginBottom: 6 }}>{story.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasAudio && <span style={{ fontSize: 13 }}>🎧</span>}
            {timeMin && (
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sans)' }}>
                {timeMin} min {story.narration_url ? 'listen' : 'read'}
              </span>
            )}
          </div>
        </div>
      </div>
      {story.summary && (
        <div className="t-meta" style={{ background: 'white', padding: '10px 14px 12px' }}>
          {story.summary}
        </div>
      )}
    </button>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

interface Props {
  ongoingNews: NewsItem[];       // multi_week events only
  recentStories: Story[];        // in discover_until window
  evergreenItems: EvergreenItem[];
}

export function DiscoverTab({ ongoingNews, recentStories, evergreenItems }: Props) {
  const [selectedStory, setSelectedStory]       = useState<Story | null>(null);
  const [selectedNews, setSelectedNews]         = useState<NewsItem | null>(null);
  const [selectedEvergreen, setSelectedEvergreen] = useState<EvergreenItem | null>(null);
  const [selectedTags, setSelectedTags]         = useState<Set<string>>(new Set());

  function toggleTag(tag: string) {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  const filteredEvergreen = selectedTags.size === 0
    ? evergreenItems
    : evergreenItems.filter(e => e.tags.some(t => selectedTags.has(t)));

  return (
    <div style={{
      minHeight: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--avorio)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      position: 'relative',
    }}>

      {/* ── Library entry ──────────────────────────────────────── */}
      <LibraryEntryPoint />

      {/* ── Ongoing in Rome (multi-week events) ────────────────── */}
      {ongoingNews.length > 0 && (
        <>
          <SectionHeader label="Ongoing in Rome" color="var(--oliva)" />
          {ongoingNews.map(item => (
            <NewsRow key={item.id} item={item} onTap={() => setSelectedNews(item)} />
          ))}
          <div style={{ height: 1, background: 'var(--avorio-dim)' }} />
        </>
      )}

      {/* ── Recent Stories (in discover_until window) ──────────── */}
      {recentStories.length > 0 && (
        <>
          <SectionHeader label="Recent Stories" color="var(--pompei)" />
          {recentStories.map(s => (
            <RecentStoryCard key={s.id} story={s} onTap={() => setSelectedStory(s)} />
          ))}
          <div style={{ height: 1, background: 'var(--avorio-dim)' }} />
        </>
      )}

      {/* ── Rome Evergreen ─────────────────────────────────────── */}
      <SectionHeader label="Rome Evergreen" color="var(--ardesia)" />
      <div className="chip-wrap">
        {EVERGREEN_PILLS.map(pill => {
          const active = selectedTags.has(pill.label);
          return (
            <button key={pill.label} onClick={() => toggleTag(pill.label)}
              className="filter-chip"
              style={active
                ? { background: pill.color, borderColor: pill.color, color: 'white' }
                : { border: `1px solid ${pill.color}`, color: pill.color }
              }>
              {pill.label}
            </button>
          );
        })}
      </div>
      {filteredEvergreen.length > 0 && (
        <div style={{ padding: '0 18px 28px' }}>
          {filteredEvergreen.map(e => (
            <button key={e.id} onClick={() => setSelectedEvergreen(e)}
              style={{
                position: 'relative', overflow: 'hidden',
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '12px 0', borderBottom: '1px solid var(--avorio-dim)',
                cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              } as React.CSSProperties}>
              {e.lead_cover_url && (
                <div style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%',
                  backgroundImage: `url(${e.lead_cover_url})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: 0.18,
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="t-heading" style={{ marginBottom: 4 }}>{e.title}</div>
                {(e.tagline || e.editorial_intro_md) && (
                  <div className="t-meta">
                    {e.tagline ?? (e.editorial_intro_md ? `${e.editorial_intro_md.slice(0, 120)}…` : null)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Overlays ───────────────────────────────────────────── */}
      {selectedStory && <StoryDetail story={selectedStory} onClose={() => setSelectedStory(null)} />}
      {selectedNews && <NewsDetail item={selectedNews} onClose={() => setSelectedNews(null)} />}
      {selectedEvergreen && <EvergreenDetail item={selectedEvergreen} onClose={() => setSelectedEvergreen(null)} />}
    </div>
  );
}
