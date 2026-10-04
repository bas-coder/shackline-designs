import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * Infinite horizontal scroll strip for REAL repeating content (logo bars, testimonials) — never
 * decoration for its own sake. Children are rendered twice for the seamless loop; edges fade via
 * mask. Pauses on hover. Under reduced motion the children render ONCE in a plain horizontal strip the
 * reader can scroll, not a frozen half-duplicated track.
 */
export function Marquee({
  children,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  className,
}: {
  children: ReactNode;
  /** seconds per loop */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  const { reduced } = useMotionGate();
  if (reduced) {
    return (
      <div data-fx="marquee" className={cn('flex overflow-x-auto', className)}>
        <div className="flex w-max shrink-0 items-center gap-12 pr-12">{children}</div>
      </div>
    );
  }
  return (
    <div
      data-fx="marquee"
      className={cn('group relative flex overflow-hidden', className)}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        data-fx-anim="fx-marquee"
        className={cn('flex w-max shrink-0 items-center gap-12 pr-12', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
        style={{ animation: `fx-marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
