import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BAR_PAD, CONTAINER, FLOATING_PAD } from './contract';

export type NavShellSurface = 'anchored' | 'floating' | 'transparent' | 'inset';

/**
 * The bar container every navbar (and every author-written custom bar) sits in. It owns the two
 * rules the harvest measured and generated bars kept breaking: the padding floor (controls never
 * touch the bar's edges) and the container column. `floating` is the capsule (rounded-full, inset
 * from the top, its own surface and shadow); `inset` is a rounded card bar with gutters (radius
 * about 0.18 of its height, never a capsule); `anchored` spans the column with a hairline;
 * `transparent` has no surface at all and lets the hero's atmosphere pass through.
 */
export function NavShell({ surface = 'anchored', sticky = true, className, innerClassName, children, ...rest }: { surface?: NavShellSurface; sticky?: boolean; className?: string; innerClassName?: string; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  const wrapper = cn(
    'relative z-40 w-full',
    sticky && 'sticky top-0',
    surface === 'anchored' && 'border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70',
    surface === 'transparent' && 'bg-transparent',
    (surface === 'floating' || surface === 'inset') && 'bg-transparent pt-3 sm:pt-4',
    className
  );
  const inner = cn(
    'flex items-center justify-between gap-4',
    surface === 'floating' && `${FLOATING_PAD} mx-auto w-[min(100%-2rem,72rem)] rounded-full border border-border/60 bg-card/85 text-card-foreground shadow-lg shadow-black/5 backdrop-blur`,
    surface === 'inset' && `${BAR_PAD} mx-auto w-[min(100%-2rem,80rem)] rounded-xl border border-border/70 bg-card/90 text-card-foreground shadow-sm backdrop-blur`,
    (surface === 'anchored' || surface === 'transparent') && `${CONTAINER} ${BAR_PAD}`,
    innerClassName
  );
  return (
    <header className={wrapper} {...rest}>
      <div className={inner}>{children}</div>
    </header>
  );
}
