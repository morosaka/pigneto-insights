'use client';
import { useState, useCallback, ReactNode } from 'react';
import { useSwipe } from '@/hooks/useSwipe';
import { PageNavigator } from './PageNavigator';

interface Props {
  tabs: ReactNode[];
  initialTab?: number;
  onTabChange?: (index: number) => void;
}

export function TabShell({ tabs, initialTab = 0, onTabChange }: Props) {
  const [active, setActive] = useState(initialTab);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);

  const switchTab = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= tabs.length) return;
    setAnimating(true);
    setActive(newIndex);
    setDragX(0);
    setTimeout(() => setAnimating(false), 400);
    onTabChange?.(newIndex);
  }, [tabs.length, onTabChange]);

  const { onStart, onMove, onEnd, onCancel } = useSwipe({
    onSwipe(dir) {
      if (dir === 'left') switchTab(active + 1);
      if (dir === 'right') switchTab(active - 1);
    },
    onDrag(dx) { setDragX(dx); },
    onRelease() { setDragX(0); },
  });

  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
      onTouchStart={e => onStart(e.nativeEvent)}
      onTouchMove={e => onMove(e.nativeEvent)}
      onTouchEnd={e => onEnd(e.nativeEvent)}
      onTouchCancel={() => onCancel()}
    >
      {tabs.map((tab, i) => {
        const offset = (i - active) * 100; // % of width
        // Active tab: full drag speed. Adjacent tabs: 30% parallax
        const drag = i === active ? dragX : dragX * 0.3;
        const translateX = `calc(${offset}% + ${drag}px)`;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${translateX})`,
              transition: animating && dragX === 0
                ? `transform var(--anim-duration) var(--anim-ease)`
                : 'none',
              willChange: 'transform',
            }}
          >
            {tab}
          </div>
        );
      })}

      {/* Navigation dots + fading tab name — always on top */}
      <PageNavigator activeTab={active} totalTabs={tabs.length} />
    </div>
  );
}
