'use client';
import type { Story } from '@/lib/types';

// Very simple markdown → JSX renderer (no external dep)
function renderBody(md: string) {
  const blocks = md.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // horizontal rule
    if (trimmed === '---') {
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--avorio-dim)', margin: '20px 0' }} />;
    }

    // headings
    const h1 = trimmed.match(/^#\s+(.*)/);
    if (h1) {
      return (
        <h2
          key={i}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontWeight: 300, fontSize: 22, lineHeight: 1.2,
            color: 'var(--ciocco)', margin: '24px 0 8px',
          }}
        >
          {h1[1]}
        </h2>
      );
    }

    // sub-headings
    const h2 = trimmed.match(/^#{2,}\s+(.*)/);
    if (h2) {
      return (
        <h3
          key={i}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontWeight: 300, fontSize: 18, lineHeight: 1.2,
            color: 'var(--ciocco)', margin: '20px 0 6px',
          }}
        >
          {h2[1]}
        </h3>
      );
    }

    // paragraph — inline: **bold**, _italic_
    const html = trimmed
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    return (
      <p
        key={i}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: 15, lineHeight: 1.4,
          color: 'var(--ciocco)',
          fontFamily: 'var(--font-sans)',
          margin: '0 0 16px',
        }}
      />
    );
  });
}

interface Props {
  story: Story;
  onClose: () => void;
}

export function StoryDetail({ story, onClose }: Props) {
  const readingTime = story.narration_time_min ?? story.reading_time_min;

  return (
    <div className="overlay overlay--white">
      {/* ── Header ──────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(162deg, var(--ciocco) 0%, var(--pompei) 55%, hsl(20,50%,42%) 100%)',
          padding: 'calc(env(safe-area-inset-top, 0px) + 54px) 18px 24px',
          position: 'relative',
        }}
      >
        {story.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.cover_url}
            alt={story.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
          />
        )}

        {/* back button */}
        <button onClick={onClose} className="back-btn">←</button>

        {/* eyebrow */}
        <div className="t-eyebrow" style={{ position: 'relative', zIndex: 1, marginBottom: 10 }}>
          Rome Stories{readingTime ? ` · ${readingTime} min read` : ''}
        </div>

        <h1
          style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontWeight: 300, fontSize: 28, lineHeight: 1.2,
            color: 'var(--avorio)', margin: 0,
          }}
        >
          {story.title}
        </h1>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 48px' }}>
        {story.body_md
          ? renderBody(story.body_md)
          : story.summary && (
              <p style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)' }}>
                {story.summary}
              </p>
            )}
      </div>
    </div>
  );
}
