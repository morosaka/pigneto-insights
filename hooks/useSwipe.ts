import { useRef, useCallback } from 'react';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

function getPoint(e: TouchEvent | MouseEvent): { x: number; y: number } {
  if ('touches' in e) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
}

interface SwipeOptions {
  onSwipe: (direction: SwipeDirection) => void;
  onDrag?: (dx: number, dy: number) => void;
  onRelease?: (dx: number, dy: number, vx: number, vy: number) => void;
  threshold?: number;          // px — default 50
  velocityThreshold?: number;  // px/ms — default 0.4
}

export function useSwipe(options: SwipeOptions) {
  const {
    onSwipe,
    onDrag,
    onRelease,
    threshold = 50,
    velocityThreshold = 0.4,
  } = options;

  const state = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    axis: null as 'h' | 'v' | null,
    active: false,
  });

  const onStart = useCallback((e: TouchEvent | MouseEvent) => {
    const { x, y } = getPoint(e);
    state.current = { startX: x, startY: y, startTime: Date.now(), axis: null, active: true };
  }, []);

  const onMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!state.current.active) return;
    const { x, y } = getPoint(e);
    const dx = x - state.current.startX;
    const dy = y - state.current.startY;

    // Lock axis after 8px of movement in either direction
    if (!state.current.axis) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        state.current.axis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
    }

    if (state.current.axis && onDrag) onDrag(dx, dy);

    // Prevent page scroll when we've locked a vertical axis
    if ('touches' in e && state.current.axis) e.preventDefault();
  }, [onDrag]);

  const onEnd = useCallback((e: TouchEvent | MouseEvent) => {
    if (!state.current.active) return;
    state.current.active = false;

    const point = 'changedTouches' in e
      ? { x: (e as TouchEvent).changedTouches[0].clientX, y: (e as TouchEvent).changedTouches[0].clientY }
      : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };

    const dx = point.x - state.current.startX;
    const dy = point.y - state.current.startY;
    const dt = Date.now() - state.current.startTime;
    const vx = dt > 0 ? Math.abs(dx) / dt : 0;
    const vy = dt > 0 ? Math.abs(dy) / dt : 0;

    if (onRelease) onRelease(dx, dy, vx, vy);

    const { axis } = state.current;
    if (!axis) return;

    if (axis === 'h') {
      if (Math.abs(dx) > threshold || vx > velocityThreshold) {
        onSwipe(dx < 0 ? 'left' : 'right');
      }
    } else {
      if (Math.abs(dy) > threshold || vy > velocityThreshold) {
        onSwipe(dy < 0 ? 'up' : 'down');
      }
    }
  }, [onSwipe, onRelease, threshold, velocityThreshold]);

  const onCancel = useCallback(() => {
    state.current.active = false;
    state.current.axis = null;
  }, []);

  return { onStart, onMove, onEnd, onCancel };
}
