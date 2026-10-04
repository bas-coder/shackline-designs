import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * Chapters that travel sideways as the page scrolls down: a sticky full-height viewport whose
 * track moves one panel per viewport height, with a hairline progress rule underneath. Heavy: at
 * most one per page, 3 to 5 panels that can each be read in a glance, never panels that must be
 * read at length. Under 768px it is a native swipe rail with snap points; under reduced motion a
 * vertical stack. Each panel carries `data-rail-panel`.
 */
export function HorizontalRail({
  children,
  gap = 32,
  panelClassName,
  className,
  progress = true,
  ariaLabel = 'Chapters',
}: {
  children: ReactNode;
  /** px between panels */
  gap?: number;
  panelClassName?: string;
  className?: string;
  progress?: boolean;
  ariaLabel?: string;
}) {
  const panels = Children.toArray(children).slice(0, 6);
  const n = panels.length;
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const { allowed, reduced } = useMotionGate({ minWidth: 768 });
  useEffect(() => {
    if (!allowed) return;
    const el = track.current;
    const vp = outer.current;
    if (!el || !vp || typeof ResizeObserver === 'undefined') return;
    const measure = () => setShift(Math.max(0, el.scrollWidth - vp.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [allowed, n]);
  if (reduced) {
    return (
      <section data-fx="horizontal-rail" aria-label={ariaLabel} className={cn('flex flex-col', className)} style={{ gap }}>
        {panels.map((panel, i) => (
          <div key={i} data-rail-panel className={panelClassName}>
            {panel}
          </div>
        ))}
      </section>
    );
  }
  if (!allowed) {
    return (
      <section data-fx="horizontal-rail" aria-label={ariaLabel} className={cn('flex snap-x snap-mandatory overflow-x-auto pb-4', className)} style={{ gap }}>
        {panels.map((panel, i) => (
          <div key={i} data-rail-panel className={cn('w-[85vw] shrink-0 snap-start', panelClassName)}>
            {panel}
          </div>
        ))}
      </section>
    );
  }
  return (
    <section ref={outer} data-fx="horizontal-rail" aria-label={ariaLabel} className={cn('relative', className)} style={{ height: `${Math.max(1, n) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div ref={track} className="flex h-full items-stretch will-change-transform" style={{ x, gap }}>
          {panels.map((panel, i) => (
            <div key={i} data-rail-panel className={cn('h-full w-[min(100vw,72rem)] shrink-0', panelClassName)}>
              {panel}
            </div>
          ))}
        </motion.div>
        {progress ? <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary" style={{ scaleX: scrollYProgress }} /> : null}
      </div>
    </section>
  );
}
