import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Deterministic 32-bit FNV-1a hash so the same seed always yields the same art.
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * A deterministic, fully offline cover derived from a seed string (a record/product/user title). The
 * SAME seed always renders the SAME art; DIFFERENT seeds render visibly different hues + angle, so a
 * grid of items never repeats one identical image (the "wall of the same picture" gap). Give it an
 * aspect box via className (e.g. `aspect-square` or `h-40`). `label` sets the initials overlay.
 */
export function GradientCover({
  seed,
  label,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { seed: string; label?: string }) {
  const h = hashSeed(seed || 'cover');
  const hue = h % 360;
  const hue2 = (hue + 40 + ((h >> 8) % 140)) % 360;
  const angle = (h >> 4) % 360;
  const initials = (label ?? seed ?? '?').trim().slice(0, 2).toUpperCase() || '?';
  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden rounded-xl', className)}
      style={{ backgroundImage: `linear-gradient(${angle}deg, hsl(${hue} 52% 20%), hsl(${hue2} 58% 11%))` }}
      {...props}
    >
      {/* single light source top-left for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 22% 0%, hsl(${hue} 70% 45% / 0.35), transparent 60%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -bottom-16 h-40 opacity-40"
        style={{ background: `radial-gradient(closest-side, hsl(${hue2} 72% 50% / 0.5), transparent)` }}
      />
      <span className="relative select-none font-display text-2xl font-semibold tracking-tight text-white/80">
        {initials}
      </span>
    </div>
  );
}
