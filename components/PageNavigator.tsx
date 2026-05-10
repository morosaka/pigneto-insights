'use client';
import { useEffect, useState } from 'react';

const TAB_NAMES = ['Home', 'Eat & Drink', 'Essentials', 'Discover'];

interface Props {
  activeTab: number;   // 0–3
  totalTabs: number;   // always 4
}

export function PageNavigator({ activeTab, totalTabs }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'none',
        zIndex: 50,
        transition: 'opacity 300ms ease',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* 4 dots */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {Array.from({ length: totalTabs }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 3.5,
              width: i === activeTab ? 16 : 3.5,
              borderRadius: 9999,
              background: 'white',
              opacity: i === activeTab ? 0.85 : 0.18,
              transition: `width var(--anim-duration) var(--anim-ease), opacity 300ms ease`,
            }}
          />
        ))}
      </div>

      {/* Tab name */}
      <span
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 10.5,
          color: 'rgba(255,255,255,0.52)',
          letterSpacing: '0.02em',
        }}
      >
        {TAB_NAMES[activeTab]}
      </span>
    </div>
  );
}
