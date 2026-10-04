import { useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { CaretUpDown, SignOut, List, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../parts/MicroSignals';
import { isActive } from '../parts/NavLinks';
import { asLinks } from '../normalize';
import type { ChromeBrand, ChromeCta, ShellDestination, ShellGroup, ShellSwitcher } from '../types';

/**
 * The parts every application shell composes (uat run 9, from the Bricx dashboard harvest,
 * docs/design/bricx-harvest/sites-saas-dashboards-reports.md): a destination row is a 44px target
 * whose active state is a tinted fill plus a 2px edge indicator; heads are quiet small-caps; count
 * badges are chips; the utilities (settings, help, theme, sign out) pin to the bottom; a workspace
 * switcher sits at the top of a labelled sidebar. Below lg the whole rail becomes a sheet behind a
 * 44px hamburger, because a 240px sidebar on a phone leaves no room for the work.
 */

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60';

export function activeDestination(links: ShellDestination[], activeHref?: string): ShellDestination | undefined {
  return links.find((l) => isActive(l, activeHref)) ?? links.flatMap((l) => l.children ?? []).find((l) => isActive(l, activeHref));
}

/** The brand at the head of a rail or sidebar: the mark at 36px, the wordmark when the rail is wide. */
export function ShellBrand({ brand, compact, className }: { brand: ChromeBrand; compact?: boolean; className?: string }) {
  const monogram = brand.name.trim().charAt(0).toUpperCase() || 'A';
  return (
    <a href={brand.href ?? '/'} className={cn('flex min-h-11 items-center gap-3 rounded-lg px-2', focusRing, compact && 'justify-center px-0', className)} aria-label={compact ? brand.name : undefined}>
      {brand.logoUrl ? (
        <img src={brand.logoUrl} crossOrigin="anonymous" alt="" className="h-9 w-9 shrink-0 rounded-lg object-contain" />
      ) : (
        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-base font-semibold text-primary-foreground">
          {brand.mark ?? monogram}
        </span>
      )}
      {!compact && <span className="truncate font-display text-base font-semibold text-foreground">{brand.name}</span>}
    </a>
  );
}

/** A workspace or org switcher chip (a native select when options are given, a static chip otherwise). */
export function OrgSwitcher({ switcher, compact, className }: { switcher?: ShellSwitcher; compact?: boolean; className?: string }) {
  if (!switcher) return null;
  const options = (switcher.options ?? []).filter((o): o is string => typeof o === 'string' && !!o.trim());
  const initial = switcher.label.trim().charAt(0).toUpperCase();
  if (compact) {
    return (
      <span aria-label={switcher.label} title={switcher.label} className={cn('grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-xs font-semibold text-foreground', className)}>
        {initial}
      </span>
    );
  }
  if (options.length > 1) {
    return (
      <label className={cn('relative block', className)}>
        <span className="sr-only">Workspace</span>
        <select
          value={switcher.label}
          onChange={(e) => switcher.onChange?.(e.target.value)}
          className={cn('h-11 w-full appearance-none rounded-lg border border-border bg-card pl-3 pr-9 text-sm font-medium text-foreground', focusRing)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <CaretUpDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </label>
    );
  }
  return (
    <div className={cn('flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground', className)}>
      <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
        {initial}
      </span>
      <span className="truncate">{switcher.label}</span>
    </div>
  );
}

function Badge({ value }: { value?: string | number }) {
  if (value === undefined || value === null || value === '') return null;
  return <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">{value}</span>;
}

/** One destination row: icon, label, optional badge; active = tinted fill plus an edge indicator. */
export function DestinationRow({ link, active, compact, onNavigate }: { link: ShellDestination; active: boolean; compact?: boolean; onNavigate?: () => void }) {
  return (
    <a
      href={link.href}
      aria-current={active ? 'page' : undefined}
      aria-label={compact ? link.label : undefined}
      title={compact ? link.label : undefined}
      onClick={onNavigate}
      className={cn(
        'relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-foreground',
        focusRing,
        compact && 'h-11 w-11 justify-center px-0',
        active && 'bg-primary/10 text-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary'
      )}
    >
      {link.icon && <span aria-hidden className="shrink-0 [&>svg]:h-5 [&>svg]:w-5">{link.icon}</span>}
      {!link.icon && compact && <span aria-hidden className="text-xs font-semibold uppercase">{link.label.trim().charAt(0)}</span>}
      {!compact && <span className="truncate">{link.label}</span>}
      {!compact && <Badge value={link.badge} />}
    </a>
  );
}

/** A flat list of destinations (rail or sidebar). */
export function DestinationList({ links, activeHref, compact, onNavigate, className }: { links: ShellDestination[]; activeHref?: string; compact?: boolean; onNavigate?: () => void; className?: string }) {
  const active = activeDestination(links, activeHref);
  return (
    <ul className={cn('flex flex-col gap-0.5', compact && 'items-center', className)} role="list">
      {links.map((l, i) => (
        <li key={`${l.href}-${i}`} className={cn(compact && 'flex flex-col items-center')}>
          <DestinationRow link={l} active={active === l} compact={compact} onNavigate={onNavigate} />
          {compact && <span className="mt-0.5 max-w-[4.5rem] truncate text-center text-[10px] leading-tight text-muted-foreground">{l.label}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Grouped destinations under quiet small-caps heads with a count badge. */
export function GroupedList({ groups, activeHref, onNavigate, className }: { groups: ShellGroup[]; activeHref?: string; onNavigate?: () => void; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {groups.map((g, i) => (
        <section key={`${g.label}-${i}`} aria-label={g.label}>
          <h3 className="mb-1 flex items-center px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <span className="truncate">{g.label}</span>
            <span className="ml-auto tabular-nums">{g.links.length}</span>
          </h3>
          <DestinationList links={g.links} activeHref={activeHref} onNavigate={onNavigate} />
        </section>
      ))}
    </div>
  );
}

/** Settings, help and the like, then theme and sign out: the bottom of every rail and sidebar. */
export function ShellUtilities({ utilities, signOut, compact, activeHref, onNavigate, className }: { utilities?: ShellDestination[]; signOut?: ChromeCta; compact?: boolean; activeHref?: string; onNavigate?: () => void; className?: string }) {
  const links = asLinks(utilities) as ShellDestination[];
  return (
    <div className={cn('mt-auto flex flex-col gap-1 border-t border-border/70 pt-3', compact && 'items-center', className)}>
      {links.length > 0 && <DestinationList links={links} activeHref={activeHref} compact={compact} onNavigate={onNavigate} />}
      <div className={cn('flex items-center gap-1', compact ? 'flex-col' : 'px-1')}>
        <ThemeToggle />
        {signOut && (
          <a href={signOut.href} className={cn('inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-foreground/75 hover:bg-accent hover:text-foreground', focusRing, compact && 'h-11 w-11 justify-center px-0')} aria-label={compact ? signOut.label : undefined} title={compact ? signOut.label : undefined}>
            <SignOut className="h-4 w-4" aria-hidden />
            {!compact && signOut.label}
          </a>
        )}
      </div>
    </div>
  );
}

/** The 44px hamburger that opens the rail as a sheet below lg, plus the sheet itself. */
export function useShellSheet(): { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> } {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return { open, setOpen };
}

export function SheetToggle({ open, onToggle, className }: { open: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      aria-expanded={open}
      onClick={onToggle}
      className={cn('inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent lg:hidden', focusRing, className)}
    >
      {open ? <X className="h-5 w-5" aria-hidden /> : <List className="h-5 w-5" aria-hidden />}
    </button>
  );
}

export function ShellSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="NavigationArrow">
      <button type="button" aria-label="Close navigation" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-background p-4 shadow-xl">{children}</div>
    </div>
  );
}
