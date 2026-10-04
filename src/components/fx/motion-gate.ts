import { useMemo, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * The gate every choreography primitive reads before it binds a motion value. NOT exported from the
 * fx barrel on purpose: the kit is the only motion author, and advertising the gate would advertise
 * a way to hand-write gated motion.
 *
 * Why the primitives gate themselves: <MotionConfig reducedMotion="user"> in the locked entry only
 * strips positional keys inside animateTarget, so opacity and filter still animate, and a value bound
 * through `style` from useScroll or useTransform is never touched at all. Each primitive therefore
 * calls this hook, calls its motion hooks unconditionally (rules of hooks), and renders plain elements
 * in the static branch so nothing moves, fades or blurs when the visitor asked for stillness.
 */

const NOOP = () => () => {};

function subscribeTo(query: string) {
  return (onChange: () => void) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return NOOP();
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };
}

/** SSR-safe media query: false on the server and before hydration. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => subscribeTo(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false),
    () => false
  );
}

export interface MotionGate {
  /** The visitor prefers reduced motion (null from motion/react is treated as false). */
  reduced: boolean;
  /** The viewport is narrower than `minWidth` (default 768). */
  narrow: boolean;
  /** A coarse pointer, or no hover: touch. */
  coarse: boolean;
  /** Bind motion values only when this is true. */
  allowed: boolean;
}

export function useMotionGate(opts: { minWidth?: number; finePointer?: boolean } = {}): MotionGate {
  const reduced = useReducedMotion() ?? false;
  const minWidth = opts.minWidth ?? 768;
  const narrow = useMediaQuery(`(max-width: ${minWidth - 1}px)`);
  const coarse = useMediaQuery('(hover: none), (pointer: coarse)');
  const allowed = !reduced && !(opts.minWidth !== undefined && narrow) && !(opts.finePointer && coarse);
  return { reduced, narrow, coarse, allowed };
}
