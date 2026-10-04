import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * A wrapper that leans its child toward the pointer within a radius and springs back on leave:
 * for THE one primary CTA and the closing CTA, never for links in copy. The wrapper never
 * intercepts clicks; the child keeps its own semantics and focus ring. A coarse pointer (touch) or
 * reduced motion renders a plain span with no listeners.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  radius = 120,
  className,
}: {
  children: ReactNode;
  /** 0 to 0.6: how far the child follows the pointer */
  strength?: number;
  /** px from the centre within which the pull applies */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });
  const { allowed } = useMotionGate({ finePointer: true });
  if (!allowed) {
    return (
      <span data-fx="magnetic-button" className={cn('inline-block', className)}>
        {children}
      </span>
    );
  }
  const k = Math.max(0, Math.min(0.6, strength));
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) > radius) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * k);
    y.set(dy * k);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span
      ref={ref}
      data-fx="magnetic-button"
      className={cn('inline-block will-change-transform', className)}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      {children}
    </motion.span>
  );
}
