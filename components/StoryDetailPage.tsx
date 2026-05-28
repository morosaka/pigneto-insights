'use client';
import { useState } from 'react';
import type { Story } from '@/lib/types';
import Link from 'next/link';

// ── markdown renderer ─────────────────────────────────────────────────────────
function renderBody(md: string) {
  return md.split(/\n{2,}/).map((block, i) => {
    const t = block.trim();
    if (!t) return null;
    if (t === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--avorio-dim)', margin: '20px 0' }} />;
    const h1 = t.match(/^#\s+(.*)/);
    if (h1) return (
      <h2 key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, lineHeight: 1.2, color: 'var(--ciocco)', margin: '24px 0 8px' }}>
        {h1[1]}
      </h2>
    );
    const h2 = t.match(/^#{2,}\s+(.*)/);
    if (h2) return (
      <h3 key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 18, lineHeight: 1.2, color: 'var(--ciocco)', margin: '20px 0 6px' }}>
        {h2[1]}
      </h3>
    );
    const html = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>');
    return (
      <p key={i} dangerouslySetInnerHTML={{ __html: html }}
        style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: '0 0 16px' }} />
    );
  });
}

// ── audio player ──────────────────────────────────────────────────────────────
type AudioMode = 'narration' | 'podcast';

function AudioPlayer({ story }: { story: Story }) {
  const hasNarration = !!story.narration_url;
  const hasPodcast = !!story.podcast_url;
  const [mode, setMode] = useState<AudioMode>(hasNarration ? 'narration' : 'podcast');
  const [showText, setShowText] = useState(false);

  const src = mode === 'narration' ? story.narration_url : story.podcast_url;
  const timeLabel = mode === 'narration'
    ? (story.narration_time_min ? `${story.narration_time_min} min` : null)
    : (story.podcast_time_min ? `${story.podcast_time_min} min` : null);

  return (
    <div style={{ marginBottom: 28 }}>
      {/* mode selector */}
      {hasNarration && hasPodcast && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['narration', 'podcast'] as AudioMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 500,
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                border: 'none',
                background: mode === m ? 'var(--ciocco)' : 'var(--avorio-dim)',
                color: mode === m ? 'var(--avorio)' : 'var(--terra)',
              }}>
              {m === 'narration' ? '🎙 Article' : '🎙 Podcast'}
              {timeLabel && mode === m ? ` · ${timeLabel}` : ''}
            </button>
          ))}
        </div>
      )}

      {/* player */}
      {src && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls src={src} style={{ width: '100%', borderRadius: 8 }} />
      )}

      {/* read instead toggle */}
      <button onClick={() => setShowText(v => !v)}
        style={{
          marginTop: 10, fontSize: 12, color: 'var(--ardesia)',
          fontFamily: 'var(--font-sans)', background: 'none',
          border: 'none', cursor: 'pointer', padding: 0,
        }}>
        {showText ? 'Hide text ↑' : 'Read instead ↓'}
      </button>

      {showText && story.body_md && (
        <div style={{ marginTop: 20 }}>{renderBody(story.body_md)}</div>
      )}
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

interface Props {
  story: Story;
}

export function StoryDetailPage({ story }: Props) {
  const hasAudio = !!(story.narration_url || story.podcast_url);
  const readingTime = story.narration_time_min ?? story.reading_time_min;

  return (
    <div className="overlay overlay--avorio">
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(162deg, var(--ciocco) 0%, var(--pompei) 55%, hsl(20,50%,42%) 100%)',
        padding: 'calc(env(safe-area-inset-top, 0px) + 54px) 18px 24px',
        position: 'relative',
      }}>
        {story.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.cover_url} alt={story.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
        )}

        <Link href="/" style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', left: 16,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 18, textDecoration: 'none', zIndex: 10,
        }}>←</Link>

        <div className="t-eyebrow" style={{ position: 'relative', zIndex: 1, marginBottom: 10 }}>
          Rome Stories{readingTime && !hasAudio ? ` · ${readingTime} min read` : ''}
        </div>

        <h1 style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontWeight: 300, fontSize: 28, lineHeight: 1.2,
          color: 'var(--avorio)', margin: 0,
        }}>
          {story.title}
        </h1>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 48px' }}>
        {hasAudio
          ? <AudioPlayer story={story} />
          : story.body_md
            ? renderBody(story.body_md)
            : story.summary && (
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)' }}>
                  {story.summary}
                </p>
              )
        }

        {/* if audio, body is inside AudioPlayer toggle — nothing more to render */}
      </div>
    </div>
  );
}
