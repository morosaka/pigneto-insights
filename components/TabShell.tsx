'use client';
import { useRef, useEffect, ReactNode } from 'react';
import { BottomNav } from './BottomNav';

const NAV_H = 'calc(66px + env(safe-area-inset-bottom, 0px))';

interface Props {
  tabs: ReactNode[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabShell({ tabs, activeTab, onTabChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  // BottomNav tap → scroll to tab programmatically
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    programmatic.current = true;
    el.scrollTo({ left: activeTab * el.clientWidth, behavior: 'smooth' });
    const t = setTimeout(() => { programmatic.current = false; }, 400);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* tab container — horizontal scroll disabled for touch, tabs switch via BottomNav only */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          bottom: NAV_H,
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          touchAction: 'pan-y',
        } as React.CSSProperties}
      >
        {tabs.map((tab, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
