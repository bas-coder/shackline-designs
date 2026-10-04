import { MagnifyingGlass } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { asLinks } from '../normalize';
import { isActive } from '../parts/NavLinks';
import type { AppShellProps, ShellDestination } from '../types';
import { ShellFrame } from './frame';
import { DestinationList, OrgSwitcher, ShellBrand, ShellUtilities, focusRing } from './parts';

/**
 * top-bar: no aside; the destinations ride a second row under the product bar (an underline
 * active state) and a docked search sits in the bar. Embodies the Bricx feed and single-surface
 * tools ("Manyreach 362" brand-blue bar, "Metricbooks 354" centred search with Ctrl/K chips).
 * Below lg the row scrolls horizontally and the same destinations open in the sheet.
 */
export function ShellTopBar(props: AppShellProps) {
  const links = asLinks(props.destinations).slice(0, 8) as ShellDestination[];
  const search = props.search;
  return (
    <ShellFrame
      props={props}
      hideAside
      sheet={({ onNavigate }) => (
        <>
          <ShellBrand brand={props.brand} className="mb-4" />
          <OrgSwitcher switcher={props.switcher} className="mb-4" />
          <DestinationList links={links} activeHref={props.activeHref} onNavigate={onNavigate} />
          <ShellUtilities utilities={props.utilities} signOut={props.signOut} activeHref={props.activeHref} onNavigate={onNavigate} />
        </>
      )}
      barChildren={
        search ? (
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (new FormData(e.currentTarget).get('q') as string) ?? '';
              search.onSubmit?.(q);
            }}
            className="relative hidden min-w-0 flex-1 md:block md:max-w-md"
          >
            <MagnifyingGlass aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input name="q" type="search" placeholder={search.placeholder} aria-label={search.placeholder} className={cn('h-11 w-full rounded-lg border border-border bg-card pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground', focusRing)} />
            <kbd aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Ctrl K
            </kbd>
          </form>
        ) : undefined
      }
    >
      <SecondRow links={links} activeHref={props.activeHref} />
      {props.children}
    </ShellFrame>
  );
}

function SecondRow({ links, activeHref }: { links: ShellDestination[]; activeHref?: string }) {
  if (links.length === 0) return null;
  return (
    <nav aria-label="Sections" className="sticky top-[76px] z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <ul className="mx-auto flex w-full max-w-7xl items-stretch gap-1 overflow-x-auto px-4 sm:px-6" role="list">
        {links.map((l, i) => {
          const active = isActive(l, activeHref);
          return (
            <li key={`${l.href}-${i}`} className="flex shrink-0">
              <a
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn('relative inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground', focusRing, active && 'text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary')}
              >
                {l.icon && <span aria-hidden className="[&>svg]:h-4 [&>svg]:w-4">{l.icon}</span>}
                {l.label}
                {l.badge !== undefined && l.badge !== '' && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">{l.badge}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
