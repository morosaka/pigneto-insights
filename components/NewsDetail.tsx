'use client';
import type { NewsItem } from '@/lib/types';

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const s = start.split('-');
  const label = `${parseInt(s[2])} ${months[parseInt(s[1]) - 1]}`;
  if (!end || end === start) return label;
  const e = end.split('-');
  return `${label} – ${parseInt(e[2])} ${months[parseInt(e[1]) - 1]}`;
}

function categoryColor(cat: string | null): string {
  const map: Record<string, string> = {
    food:    'var(--terra)',
    sport:   'var(--oliva)',
    culture: 'var(--ardesia)',
  };
  return map[cat ?? ''] ?? 'var(--pompei)';
}

interface Props {
  item: NewsItem;
  onClose: () => void;
}

export function NewsDetail({ item, onClose }: Props) {
  const color = categoryColor(item.category);
  const dateRange = formatDateRange(item.date_start, item.date_end);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--avorio)',
        zIndex: 20,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(160deg, var(--ciocco), ${color})`,
          padding: 'calc(env(safe-area-inset-top, 0px) + 54px) 18px 28px',
          position: 'relative',
        }}
      >
        {/* back button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
            left: 16,
            zIndex: 10,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            color: 'white',
            fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ←
        </button>

        {/* eyebrow */}
        {(item.category || dateRange) && (
          <div
            style={{
              position: 'relative', zIndex: 1,
              fontSize: 14, fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.6)', marginBottom: 10,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {[item.category, dateRange].filter(Boolean).join(' · ')}
          </div>
        )}

        <h1
          style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontWeight: 300, fontSize: 26, lineHeight: 1.2,
            color: 'var(--avorio)', margin: 0,
          }}
        >
          {item.title}
        </h1>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div style={{ padding: '24px 18px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {item.location && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>📍</span>
            <span style={{ fontSize: 14, color: 'var(--ciocco)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
              {item.location}
            </span>
          </div>
        )}

        {item.summary && (
          <p
            style={{
              fontSize: 15, lineHeight: 1.4,
              color: 'var(--ciocco)',
              fontFamily: 'var(--font-sans)',
              margin: 0,
            }}
          >
            {item.summary}
          </p>
        )}

        {item.external_url && (
          <a
            href={item.external_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 500,
              color: 'var(--avorio)',
              background: color,
              padding: '10px 18px',
              borderRadius: 24,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              alignSelf: 'flex-start',
            }}
          >
            Find out more ↗
          </a>
        )}
      </div>
    </div>
  );
}
