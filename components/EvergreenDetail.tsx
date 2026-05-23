'use client';
import type { EvergreenItem } from '@/lib/types';

function renderBody(md: string) {
  const blocks = md.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (!t) return null;

    if (t === '---') {
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--avorio-dim)', margin: '20px 0' }} />;
    }

    // inline image: ![caption](url)
    const img = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      return (
        <figure key={i} style={{ margin: '24px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img[2]}
            alt={img[1]}
            style={{ width: '100%', borderRadius: 10, display: 'block' }}
          />
          {img[1] && (
            <figcaption style={{
              fontSize: 12, color: 'var(--ardesia)', fontFamily: 'var(--font-sans)',
              fontStyle: 'italic', marginTop: 7, lineHeight: 1.45,
            }}>
              {img[1]}
            </figcaption>
          )}
        </figure>
      );
    }

    const h1 = t.match(/^#\s+(.*)/);
    if (h1) {
      return (
        <h2 key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, lineHeight: 1.2, color: 'var(--ciocco)', margin: '24px 0 8px' }}>
          {h1[1]}
        </h2>
      );
    }

    const h2 = t.match(/^#{2,}\s+(.*)/);
    if (h2) {
      return (
        <h3 key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 18, lineHeight: 1.25, color: 'var(--ciocco)', margin: '20px 0 6px' }}>
          {h2[1]}
        </h3>
      );
    }

    const html = t
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
    return (
      <p key={i} // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', margin: '0 0 16px' }}
      />
    );
  });
}

interface Props {
  item: EvergreenItem;
  onClose: () => void;
}

export function EvergreenDetail({ item, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--avorio)', zIndex: 30, overflowY: 'auto', overflowX: 'hidden' }}>

      {/* ── Hero image / gradient header ─────────────────── */}
      <div style={{
        position: 'relative',
        height: 260,
        background: 'linear-gradient(162deg, var(--ardesia) 0%, var(--oliva) 100%)',
        flexShrink: 0,
      }}>
        {item.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover_url}
            alt={item.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.08) 60%)' }} />

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
            left: 16, zIndex: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
            border: 'none', color: 'white', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >
          ←
        </button>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 16px' }}>
          {item.tags.length > 0 && (
            <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.65)', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
              {item.tags.join(' · ')}
            </div>
          )}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 26, lineHeight: 1.2, color: 'white', margin: 0 }}>
            {item.title}
          </h1>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 56px' }}>

        {/* editorial intro */}
        {item.editorial_intro_md && (
          <p style={{
            fontSize: 16, lineHeight: 1.55, color: 'var(--ciocco)',
            fontFamily: 'var(--font-sans)', fontStyle: 'italic',
            margin: '0 0 24px',
            paddingBottom: 20,
            borderBottom: '1px solid var(--avorio-dim)',
          }}>
            {item.editorial_intro_md}
          </p>
        )}

        {/* body with inline images */}
        {item.body_md
          ? renderBody(item.body_md)
          : (
            <p style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--ardesia)', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
              Content coming soon.
            </p>
          )}
      </div>
    </div>
  );
}
