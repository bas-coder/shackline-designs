import { Children, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * Cards that pin under a fixed top offset and settle onto a pile as the reader scrolls: each card
 * before the last scales down a few percent and dims once the next one arrives. Heavy: at most one
 * per page, 3 to 6 cards, never inside an `overflow-hidden` ancestor (it kills `sticky`), never on a
 * signed-in surface. Under reduced motion, or under 768px, it is a plain vertical stack.
 */
export function StickyStack({
  children,
  top = 96,
  scaleStep = 0.04,
  fade = true,
  className,
  cardClassName,
}: {
  children: ReactNode;
  /** px from the top of the viewport each card pins at */
  top?: number;
  /** how much each earlier card shrinks per card above it */
  scaleStep?: number;
  fade?: boolean;
  className?: string;
  cardClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const { allowed } = useMotionGate({ minWidth: 768 });
  const cards = Children.toArray(children).slice(0, 6);
  if (!allowed) {
    return (
      <div data-fx="sticky-stack" className={cn('flex flex-col gap-6', className)}>
        {cards.map((card, i) => (
          <div key={i} className={cardClassName}>
            {card}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div ref={ref} data-fx="sticky-stack" className={cn('relative flex flex-col gap-8', className)}>
      {cards.map((card, i) => (
        <StickyCard key={i} progress={scrollYProgress} index={i} count={cards.length} top={top} scaleStep={scaleStep} fade={fade} className={cardClassName}>
          {card}
        </StickyCard>
      ))}
    </div>
  );
}

function StickyCard({
  progress,
  index,
  count,
  top,
  scaleStep,
  fade,
  className,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  top: number;
  scaleStep: number;
  fade: boolean;
  className?: string;
  children: ReactNode;
}) {
  const start = count > 1 ? index / count : 0;
  const behind = count - 1 - index;
  const scale = useTransform(progress, [start, 1], [1, 1 - scaleStep * behind]);
  const opacity = useTransform(progress, [start, 1], [1, fade && behind > 0 ? 0.35 : 1]);
  return (
    <div className="sticky" style={{ top }}>
      <motion.div style={{ scale, opacity }} className={cn('origin-top will-change-transform', className)}>
        {children}
      </motion.div>
    </div>
  );
}
