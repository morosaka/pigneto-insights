'use client';
import type { Story } from '@/lib/types';
import Link from 'next/link';

interface Props {
  story: Story;
}

export function DeepReadCard({ story }: Props) {
  const hasAudio = !!(story.narration_url || story.podcast_url);
  const timeLabel = story.narration_time_min
    ? `${story.narration_time_min} min listen`
    : story.reading_time_min
    ? `${story.reading_time_min} min read`
    : null;

  const href = story.slug ? `/story/${story.slug}` : null;

  const inner = (
    <div style={{
      background: 'var(--ciocco)',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 4px 18px rgba(19,12,6,0.18)',
    }}>
      {/* cover image layer */}
      {story.cover_url && (
        <div style={{
          height: 120, position: 'relative', overflow: 'hidden',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.cover_url} alt={story.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--ciocco))' }} />
        </div>
      )}

      <div style={{ padding: story.cover_url ? '0 18px 20px' : '20px 18px' }}>
        {/* eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          {hasAudio && (
            <span style={{ fontSize: 16 }}>🎧</span>
          )}
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(232,218,198,0.5)', fontFamily: 'var(--font-sans)',
          }}>
            Deep Read{hasAudio ? ' · Audio available' : ''}
          </span>
        </div>

        {/* title */}
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
          fontSize: 22, lineHeight: 1.2, color: 'var(--avorio)', margin: '0 0 10px',
        }}>
          {story.title}
        </h2>

        {/* micro intro */}
        {story.micro_intro && (
          <p style={{
            fontSize: 13, lineHeight: 1.45, color: 'rgba(232,218,198,0.6)',
            fontFamily: 'var(--font-sans)', margin: '0 0 14px',
          }}>
            {story.micro_intro}
          </p>
        )}

        {/* time label */}
        {timeLabel && (
          <span style={{
            fontSize: 12, color: 'rgba(232,218,198,0.38)',
            fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
          }}>
            {timeLabel}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ display: 'block', textDecoration: 'none', marginBottom: 4 }}>
        {inner}
      </Link>
    );
  }

  return <div style={{ marginBottom: 4 }}>{inner}</div>;
}
