'use client';
import { useState } from 'react';
import type { EvergreenItem } from '@/lib/types';
import { EvergreenDetail } from './EvergreenDetail';

function ItemRow({ item, onTap }: { item: EvergreenItem; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      style={{
        display: 'flex', alignItems: 'center', width: '100%',
        padding: '14px 18px',
        background: 'none', border: 'none',
        borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--avorio-dim)',
        cursor: 'pointer', textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ciocco)', lineHeight: 1.25, marginBottom: 3 }}>
          {item.title}
        </div>
        {item.tags.length > 0 && (
          <div style={{ fontSize: 9.5, color: 'var(--avorio-dk)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {item.tags.join(' · ')}
          </div>
        )}
      </div>
      <span style={{ fontSize: 14, color: 'var(--avorio-dim)', paddingLeft: 8 }}>›</span>
    </button>
  );
}

interface Props {
  tag: string;
  items: EvergreenItem[];
  onClose: () => void;
}

export function EvergreenOverlay({ tag, items, onClose }: Props) {
  const [selected, setSelected] = useState<EvergreenItem | null>(null);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--avorio)', zIndex: 20, overflowY: 'auto', overflowX: 'hidden' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(160deg, var(--ardesia), var(--oliva))',
          padding: 'calc(env(safe-area-inset-top, 0px) + 54px) 18px 20px',
          position: 'relative', flexShrink: 0,
        }}
      >
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

        <div style={{ position: 'relative', zIndex: 1, fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
          Rome Evergreen
        </div>
        <h1 style={{ position: 'relative', zIndex: 1, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 24, lineHeight: 1.15, color: 'var(--avorio)', margin: 0, textTransform: 'capitalize' }}>
          {tag}
        </h1>
      </div>

      {/* ── List ───────────────────────────────────────── */}
      {items.length > 0
        ? items.map(item => (
            <ItemRow key={item.id} item={item} onTap={() => setSelected(item)} />
          ))
        : (
          <div style={{ padding: '40px 18px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--avorio-dk)', marginBottom: 8 }}>
              Coming soon
            </div>
            <div style={{ fontSize: 12, color: 'var(--avorio-dk)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
              We&apos;re working on articles for this topic.
            </div>
          </div>
        )}

      {/* ── Article detail ─────────────────────────────── */}
      {selected && (
        <EvergreenDetail item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
