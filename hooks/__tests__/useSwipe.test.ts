// Type-level test: verify the hook compiles and exports the right shape
import { useSwipe } from '../useSwipe';
import type { SwipeDirection } from '../useSwipe';

// These should compile without error
const _dir: SwipeDirection = 'up';
const _hook = useSwipe;

export {};
