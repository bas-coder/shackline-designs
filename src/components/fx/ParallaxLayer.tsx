import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useMotionGate } from './motion-gate';

/**
 * A layer that drifts slower (or faster) than the page as it passes through the viewport: a
 * background texture, a product artefact, a caption behind a headline. Medium: at most two per
 * page, never two in one section, never under copy that must be read while it moves. The parent
 * supplies `overflow-hidden` when bleed is unwanted. Transform only; plain under reduced motion.
 */
export function ParallaxLayer({
  children,
  speed = 0.2,
  clamp = true,
  className,
}: {
  children: ReactNode;
  /** -1 to 1; negative moves against the scroll */
  speed?: number;
  clamp?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const s = Math.max(-1, Math.min(1, speed));
  const travel = Math.min(160, Math.abs(s) * 200) * (s < 0 ? -1 : 1);
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel], { clamp });
  const { reduced } = useMotionGate();
  // Transform the sized root itself. An extra zero-height wrapper collapses absolute media.
  return (
    <motion.div ref={ref} data-fx="parallax-layer" className={className} style={{ y: reduced ? 0 : y }}>
      {children}
    </motion.div>
  );
}
