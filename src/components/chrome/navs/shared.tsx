import type { ReactNode } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { isActive } from '../parts/NavLinks';
import type { ChromeLink, NavbarProps } from '../types';

/**
 * Pieces shared across the twelve bars: the props type, the nav landmark every marketing bar wraps
 * its link row in, chained chevron breadcrumb chips (Bricx "Avant Talk 357", "SpendPro 356") and the
 * tab-activity rule. The signed-in right cluster lives in ./user-cluster.tsx.
 */

export type NavProps = Omit<NavbarProps, 'style'>;

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60';

/** The nav landmark around a link row; hidden below lg so it takes no gap slot beside the hamburger. */
export function PrimaryNav({ label = 'Primary', className, children }: { label?: string; className?: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className={cn('hidden lg:block', className)}>
      {children}
    </nav>
  );
}

/** Breadcrumbs as chained chevron chips; chips are micro-chips, so the pill radius is licensed here only. */
export function BreadcrumbChips({ crumbs, className }: { crumbs: ChromeLink[]; className?: string }) {
  const last = crumbs.length - 1;
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex items-center gap-0.5" role="list">
        {crumbs.map((c, i) => (
          <li key={`${c.href}-${c.label}-${i}`} className="flex min-w-0 items-center gap-0.5">
            {i > 0 && <CaretRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden />}
            <a href={c.href} aria-current={i === last ? 'page' : undefined} className={cn('inline-flex min-h-11 items-center gap-1.5 truncate rounded-full px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground', focusRing, i === last && 'bg-accent/70 text-foreground')}>
              {c.icon}
              {c.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Tab activity: an exact match wins over prefix matching so a parent tab never lights beside its child. */
export function isTabActive(tab: ChromeLink, tabs: ChromeLink[], activeHref?: string): boolean {
  if (!activeHref) return false;
  return tabs.some((t) => t.href === activeHref) ? tab.href === activeHref : isActive(tab, activeHref);
}
