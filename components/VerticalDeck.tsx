'use client';
import { useState, useCallback, useRef, ReactNode } from 'react';
import { useSwipe } from '@/hooks/useSwipe';

interface Props {
  cards: ReactNode[];
  onPullUp?: () => void;
}

export function VerticalDeck({ cards, onPullUp }: Props) {
  const [index, setIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const commit = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= cards.length) return;
    setAnimating(true);
    setIndex(newIndex);
    setDragY(0);
    setTimeout(() => setAnimating(false), 400);
  }, [cards.length]);

  const { onStart, onMove, onEnd, onCancel } = useSwipe({
    onSwipe(dir) {
      if (dir === 'up') {
        if (index === cards.length - 1) onPullUp?.();
        else commit(index + 1);
      }
      if (dir === 'down') commit(index - 1);
    },
    onDrag(_dx, dy) { setDragY(dy); },
    onRelease() { setDragY(0); },
  });

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
      onTouchStart={e => onStart(e.nativeEvent)}
      onTouchMove={e => onMove(e.nativeEvent)}
      onTouchEnd={e => onEnd(e.nativeEvent)}
      onTouchCancel={() => onCancel()}
    >
      {cards.map((card, i) => {
        const offset = (i - index) * 100; // % of height
        const drag = i === index ? dragY : 0;
        const translateY = `calc(${offset}% + ${drag * 1}px)`;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateY(${translateY})`,
              transition: animating && dragY === 0
                ? `transform var(--anim-duration) var(--anim-ease)`
                : 'none',
              willChange: 'transform',
            }}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
}
