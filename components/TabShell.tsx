'use client';
import { useRef, useEffect, useCallback, ReactNode } from 'react';
import { BottomNav } from './BottomNav';

const NAV_H = 'calc(66px + env(safe-area-inset-bottom, 0px))';

interface Props {
  tabs: ReactNode[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabShell({ tabs, activeTab, onTabChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // avoid re-triggering scroll when we programmatically scroll
  const programmatic = useRef(false);

  // BottomNav click → scroll to tab
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    programmatic.current = true;
    el.scrollTo({ left: activeTab * el.clientWidth, behavior: 'smooth' });
    // clear flag after animation
    const t = setTimeout(() => { programmatic.current = false; }, 400);
    return () => clearTimeout(t);
  }, [activeTab]);

  // User swipe → detect settled tab
  const handleScroll = useCallback(() => {
    if (programmatic.current) return;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (idx !== activeTab) onTabChange(idx);
    }, 80);
  }, [activeTab, onTabChange]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* horizontal scroll-snap container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          bottom: NAV_H,
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          // iOS momentum
          WebkitOverflowScrolling: 'touch',
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
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            } as React.CSSProperties}
          >
            {tab}
          </div>
        ))}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
