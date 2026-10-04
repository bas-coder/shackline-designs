import { cn } from '@/lib/utils';

/**
 * Falling light streaks for DARK, spacious surfaces only (a hero sky, an empty state). Positions
 * and delays are deterministic per index (no Math.random, stable across renders). Parent needs
 * `relative overflow-hidden`.
 */
export function Meteors({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden data-fx="meteors" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {Array.from({ length: count }, (_, i) => {
        // deterministic pseudo-random spread from the index
        const left = ((i * 37 + 11) % 100);
        const top = ((i * 53 + 7) % 60);
        const delay = ((i * 1.7) % 8).toFixed(1);
        const duration = (4 + ((i * 13) % 5)).toFixed(1);
        return (
          <span
            key={i}
            data-fx-anim="fx-meteor"
            className="absolute h-px w-px rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              boxShadow: '0 0 0 1px color-mix(in oklab, var(--color-foreground) 12%, transparent)',
              animation: `fx-meteor ${duration}s linear ${delay}s infinite`,
            }}
          >
            <span
              className="absolute top-1/2 h-px w-[70px] -translate-y-1/2"
              style={{
                background:
                  'linear-gradient(90deg, color-mix(in oklab, var(--color-primary) 65%, transparent), transparent)',
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
