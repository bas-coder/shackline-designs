import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Animated gradient border — a slow conic sweep of the primary token around the wrapped card
 * (the MagicUI "border beam / shine border" signature). The child supplies its own background
 * (e.g. `bg-card rounded-2xl`); this wraps it in a 1px gradient frame. Max one border effect per
 * app (this OR GlowCard), per the design skill.
 */
export function ShineBorder({
  children,
  duration = 8,
  className,
}: {
  children: ReactNode;
  /** seconds per rotation */
  duration?: number;
  className?: string;
}) {
  return (
    <div data-fx="shine-border" className={cn('relative overflow-hidden rounded-2xl p-px', className)}>
      <div
        aria-hidden
        data-fx-anim="fx-spin"
        className="absolute -inset-[100%]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, color-mix(in oklab, var(--color-primary) 80%, transparent) 12%, transparent 26%, transparent 55%, color-mix(in oklab, var(--color-ring) 45%, transparent) 68%, transparent 80%)',
          animation: `fx-spin ${duration}s linear infinite`,
        }}
      />
      <div className="relative rounded-[inherit] border border-border/40 bg-transparent">{children}</div>
    </div>
  );
}
