import { cn } from '@/lib/utils';

/**
 * Subtle structural texture layers (grid / dots) in the border token, with a mask fade so they
 * recede instead of dominating. Layer UNDER a light source, never as the only atmosphere on a
 * hero. Absolutely positioned; parent needs `relative`.
 */

const MASKS: Record<string, string> = {
  center: 'radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent 75%)',
  edges: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, black 85%)',
  bottom: 'linear-gradient(to bottom, transparent, black 45%)',
  top: 'linear-gradient(to top, transparent, black 45%)',
};

export function GridPattern({
  size = 44,
  fade = 'center',
  className,
}: {
  size?: number;
  fade?: 'center' | 'edges' | 'bottom' | 'top';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, color-mix(in oklab, var(--color-border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 70%, transparent) 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
        maskImage: MASKS[fade],
        WebkitMaskImage: MASKS[fade],
      }}
    />
  );
}

export function DotPattern({
  size = 26,
  fade = 'center',
  className,
}: {
  size?: number;
  fade?: 'center' | 'edges' | 'bottom' | 'top';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, color-mix(in oklab, var(--color-border) 85%, transparent) 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
        maskImage: MASKS[fade],
        WebkitMaskImage: MASKS[fade],
      }}
    />
  );
}
