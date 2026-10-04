import { cn } from '@/lib/utils';

/**
 * Ambient aurora glow — the "light source" layer for hero/login/empty surfaces. Two soft radial
 * gradients in the app's primary/ring tokens drift slowly behind the content. Colors come from the
 * theme tokens via color-mix, so the per-build palette re-skins it. Place inside a `relative
 * overflow-hidden` parent; it is absolutely positioned and pointer-transparent.
 */
export function AuroraBackdrop({
  intensity = 'subtle',
  position = 'top',
  className,
}: {
  /** subtle = background ambience; bold = the hero statement */
  intensity?: 'subtle' | 'bold';
  position?: 'top' | 'bottom' | 'corner';
  className?: string;
}) {
  const alpha = intensity === 'bold' ? 32 : 18;
  const alphaB = intensity === 'bold' ? 22 : 12;
  const pos =
    position === 'top'
      ? ['-top-1/4 left-1/2 -translate-x-1/2', 'top-0 right-0 translate-x-1/3 -translate-y-1/3']
      : position === 'bottom'
        ? ['-bottom-1/4 left-1/2 -translate-x-1/2', 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3']
        : ['-top-1/3 -left-1/4', '-bottom-1/4 -right-1/4'];
  return (
    <div aria-hidden data-fx="aurora" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        data-fx-anim="fx-drift-a"
        className={cn('absolute h-[60vmax] w-[60vmax] rounded-full', pos[0])}
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) ${alpha}%, transparent), transparent 70%)`,
          animation: 'fx-drift-a 32s ease-in-out infinite',
        }}
      />
      <div
        data-fx-anim="fx-drift-b"
        className={cn('absolute h-[45vmax] w-[45vmax] rounded-full', pos[1])}
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, var(--color-ring) ${alphaB}%, transparent), transparent 70%)`,
          animation: 'fx-drift-b 38s ease-in-out infinite',
        }}
      />
    </div>
  );
}
