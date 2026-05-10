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
  const [isDragging, setIsDragging] = useState(false);
  const isMouseDown = useRef(false);

  const commit = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= cards.length) return;
    setIndex(newIndex);
  }, [cards.length]);

  const { onStart, onMove, onEnd, onCancel } = useSwipe({
    onSwipe(dir) {
      if (dir === 'up') {
        if (index === cards.length - 1) onPullUp?.();
        else commit(index + 1);
      }
      if (dir === 'down') commit(index - 1);
    },
    onDrag(_dx, dy) {
      setIsDragging(true);
      setDragY(dy);
    },
    onRelease() {
      setIsDragging(false);
      setDragY(0);
    },
  });

  const handleCancel = useCallback(() => {
    onCancel();
    isMouseDown.current = false;
    setIsDragging(false);
    setDragY(0);
  }, [onCancel]);

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'ns-resize' }}
      onTouchStart={e => onStart(e.nativeEvent)}
      onTouchMove={e => onMove(e.nativeEvent)}
      onTouchEnd={e => onEnd(e.nativeEvent)}
      onTouchCancel={handleCancel}
      onMouseDown={e => { isMouseDown.current = true; onStart(e.nativeEvent); }}
      onMouseMove={e => { if (isMouseDown.current) onMove(e.nativeEvent); }}
      onMouseUp={e => { isMouseDown.current = false; onEnd(e.nativeEvent); }}
      onMouseLeave={() => { if (isMouseDown.current) handleCancel(); }}
    >
      {cards.map((card, i) => {
        const offset = (i - index) * 100;
        const drag = isDragging && i === index ? dragY : 0;
        const translateY = `calc(${offset}% + ${drag}px)`;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateY(${translateY})`,
              transition: isDragging ? 'none' : `transform var(--anim-duration) var(--anim-ease)`,
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
