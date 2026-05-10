'use client';
import { useState, useCallback, useRef, ReactNode } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);

  const switchTab = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= tabs.length) return;
    setActive(newIndex);
    onTabChange?.(newIndex);
  }, [tabs.length, onTabChange]);

  const { onStart, onMove, onEnd, onCancel } = useSwipe({
    onSwipe(dir) {
      if (dir === 'left') switchTab(active + 1);
      if (dir === 'right') switchTab(active - 1);
    },
    onDrag(dx) {
      setIsDragging(true);
      setDragX(dx);
    },
    onRelease() {
      setIsDragging(false);
      setDragX(0);
    },
  });

  const handleCancel = useCallback(() => {
    onCancel();
    setIsDragging(false);
    setDragX(0);
  }, [onCancel]);

  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', cursor: isDragging ? 'grabbing' : 'grab' }}
      onTouchStart={e => onStart(e.nativeEvent)}
      onTouchMove={e => onMove(e.nativeEvent)}
      onTouchEnd={e => onEnd(e.nativeEvent)}
      onTouchCancel={handleCancel}
      onMouseDown={e => onStart(e.nativeEvent)}
      onMouseMove={e => { if (isDragging) onMove(e.nativeEvent); }}
      onMouseUp={e => onEnd(e.nativeEvent)}
      onMouseLeave={handleCancel}
    >
      {tabs.map((tab, i) => {
        const offset = (i - active) * 100;
        const drag = isDragging
          ? (i === active ? dragX : dragX * 0.3)
          : 0;
        const translateX = `calc(${offset}% + ${drag}px)`;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${translateX})`,
              transition: isDragging ? 'none' : `transform var(--anim-duration) var(--anim-ease)`,
              willChange: 'transform',
            }}
          >
            {tab}
          </div>
        );
      })}

      <PageNavigator activeTab={active} totalTabs={tabs.length} />
    </div>
  );
}
