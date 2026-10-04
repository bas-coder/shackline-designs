import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { NavProductBar } from '../navs/NavProductBar';
import type { AppShellProps } from '../types';
import { SheetToggle, ShellSheet, useShellSheet } from './parts';

/**
 * The frame every shell shares: a fixed-width aside on lg and up, the same content as a sheet below
 * lg behind a 44px hamburger in the top bar, the product bar across the top of the work column, and
 * the page content in a scrolling main. The aside owns the brand; the bar owns the page context
 * (title or breadcrumbs), the user cluster and the ONE filled action.
 */
export function ShellFrame({
  props,
  asideClassName,
  aside,
  sheet,
  hideAside,
  barChildren,
  children,
}: {
  props: AppShellProps;
  /** Width and surface classes of the desktop aside. */
  asideClassName?: string;
  /** The aside content for lg and up. */
  aside?: (ctx: { onNavigate: () => void }) => ReactNode;
  /** The sheet content below lg; defaults to `aside`. */
  sheet?: (ctx: { onNavigate: () => void }) => ReactNode;
  /** top-bar: no aside at all. */
  hideAside?: boolean;
  /** Extra bar content (a docked search, a page switcher). */
  barChildren?: ReactNode;
  /** Overrides the main content (top-bar prepends its section row); defaults to props.children. */
  children?: ReactNode;
}) {
  const { open, setOpen } = useShellSheet();
  const onNavigate = () => setOpen(false);
  const bar = props.bar ?? {};
  const sheetContent = (sheet ?? aside)?.({ onNavigate });
  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', props.className)}>
      {!hideAside && aside && (
        <aside className={cn('sticky top-0 hidden h-screen shrink-0 flex-col overflow-y-auto border-r border-border/70 bg-card/40 lg:flex', asideClassName)} aria-label="Primary">
          {aside({ onNavigate })}
        </aside>
      )}
      {sheetContent && (
        <ShellSheet open={open} onClose={() => setOpen(false)}>
          {sheetContent}
        </ShellSheet>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <NavProductBar
          brand={props.brand}
          title={bar.title}
          breadcrumbs={bar.breadcrumbs}
          cta={bar.cta}
          secondary={bar.secondary}
          microSignals={bar.microSignals}
          user={props.user}
          meter={props.meter}
          controls={props.controls}
          className={bar.className}
        >
          {sheetContent && <SheetToggle open={open} onToggle={() => setOpen((v) => !v)} className="order-first" />}
          {barChildren}
        </NavProductBar>
        <main id="main" className="min-w-0 flex-1">
          {children ?? props.children}
        </main>
      </div>
    </div>
  );
}
