import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * A card with an inner top light and a primary-tinted glow (always-on or on hover) — the premium
 * elevation treatment for feature cards, pricing tiers, and bento tiles. Max one border effect per
 * app (this OR ShineBorder), per the design skill.
 */
export function GlowCard({
  glow = 'hover',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { glow?: 'hover' | 'always' }) {
  const clickable = 'onClick' in props; // a card with a click handler IS interactive -> show the pointer
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300',
        glow === 'hover' && 'hover:-translate-y-0.5',
        clickable && 'cursor-pointer',
        className
      )}
      style={{
        boxShadow:
          glow === 'always'
            ? '0 0 40px -12px color-mix(in oklab, var(--color-primary) 35%, transparent)'
            : undefined,
      }}
      {...props}
    >
      {/* inner top-center highlight */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-300',
          glow === 'hover' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        )}
        style={{
          background:
            'radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent)',
        }}
      />
      {/* hover glow shadow (kept as a class-free style so the tint tracks the palette) */}
      {glow === 'hover' && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: '0 12px 48px -12px color-mix(in oklab, var(--color-primary) 40%, transparent)' }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
