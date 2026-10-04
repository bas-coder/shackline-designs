import { cn } from '@/lib/utils';

/**
 * A single dramatic light source — an elliptical glow falling from one edge (the Aceternity
 * "spotlight/lamp" signature). Use INSTEAD of AuroraBackdrop, never together: one light source per
 * screen. Absolutely positioned; parent needs `relative overflow-hidden`.
 */
export function Spotlight({
  position = 'top',
  size = 'md',
  className,
}: {
  position?: 'top' | 'top-left' | 'top-right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dims = { sm: 'h-[40vmax] w-[55vmax]', md: 'h-[55vmax] w-[75vmax]', lg: 'h-[70vmax] w-[95vmax]' }[size];
  const pos = {
    top: 'left-1/2 -translate-x-1/2 -top-[20vmax]',
    'top-left': '-left-[15vmax] -top-[20vmax] -rotate-12',
    'top-right': '-right-[15vmax] -top-[20vmax] rotate-12',
  }[position];
  return (
    <div aria-hidden data-fx="spotlight" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        data-fx-anim="fx-breathe"
        className={cn('absolute', dims, pos)}
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in oklab, var(--color-primary) 26%, transparent), color-mix(in oklab, var(--color-primary) 8%, transparent) 45%, transparent 70%)',
          animation: 'fx-breathe 9s ease-in-out infinite',
        }}
      />
    </div>
  );
}
