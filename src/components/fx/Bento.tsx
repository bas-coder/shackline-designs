import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Asymmetric bento layout — a grid where ONE tile dominates (never a uniform card grid). Compose
 * with GlowCard/plain cards as tiles. Span classes are static string maps so Tailwind v4 sees them.
 */

const COL_SPAN = { 1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3' } as const;
const ROW_SPAN = { 1: 'md:row-span-1', 2: 'md:row-span-2', 3: 'md:row-span-3' } as const;
const COLS = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' } as const;

export function BentoGrid({
  cols = 3,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { cols?: 2 | 3 | 4 }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:auto-rows-[minmax(9rem,auto)]', COLS[cols], className)} {...props}>
      {children}
    </div>
  );
}

export function BentoCard({
  colSpan = 1,
  rowSpan = 1,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { colSpan?: 1 | 2 | 3; rowSpan?: 1 | 2 | 3 }) {
  const clickable = 'onClick' in props; // a tile with a click handler IS interactive -> show the pointer
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-6',
        clickable && 'cursor-pointer',
        COL_SPAN[colSpan],
        ROW_SPAN[rowSpan],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
