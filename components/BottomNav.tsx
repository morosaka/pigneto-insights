'use client';

const TABS = [
  { glyph: '⌂', label: 'Home' },
  { glyph: '♨', label: 'Cibo' },
  { glyph: '◎', label: 'Quartiere' },
  { glyph: '✦', label: 'Scopri' },
];

interface Props {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(66px + env(safe-area-inset-bottom, 0px))',
        background: 'white',
        borderTop: '1px solid var(--avorio-dim)',
        display: 'flex',
        alignItems: 'stretch',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 60,
      }}
    >
      {TABS.map((tab, i) => {
        const active = i === activeTab;
        return (
          <button
            key={i}
            onClick={() => onTabChange(i)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              paddingTop: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              transition: 'opacity 0.15s',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20,
                lineHeight: 1,
                color: active ? 'var(--terra)' : 'var(--avorio-dk)',
                transition: 'color 0.2s',
              }}
            >
              {tab.glyph}
            </span>
            <span
              style={{
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
                color: active ? 'var(--terra)' : 'var(--avorio-dk)',
                transition: 'color 0.2s',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
