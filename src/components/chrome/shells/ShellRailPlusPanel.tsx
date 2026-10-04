import { asLinks } from '../normalize';
import type { AppShellProps, ShellDestination } from '../types';
import { ShellFrame } from './frame';
import { DestinationList, OrgSwitcher, ShellBrand, ShellUtilities, activeDestination } from './parts';

/**
 * rail-plus-panel: a 72px icon rail plus a 240px contextual panel that lists the active section's
 * own hierarchy (its children) or whatever `panel` supplies (a document list, a history). Embodies
 * Bricx "SpendPro 351" (dual rail plus list panel) and "Avant Talk 357" (rail plus section panel
 * with helper-text rows). Below lg both collapse into one labelled sheet.
 */
export function ShellRailPlusPanel(props: AppShellProps) {
  const links = asLinks(props.destinations).slice(0, 7) as ShellDestination[];
  const active = activeDestination(links, props.activeHref);
  const panelLinks = (active?.children ?? []) as ShellDestination[];
  const panelTitle = props.panelTitle ?? active?.label;
  return (
    <ShellFrame
      props={props}
      asideClassName="w-[calc(4.5rem+15rem)] flex-row p-0"
      aside={({ onNavigate }) => (
        <>
          <div className="flex w-[4.5rem] shrink-0 flex-col items-center border-r border-border/70 px-2 py-4">
            <ShellBrand brand={props.brand} compact className="mb-4" />
            <OrgSwitcher switcher={props.switcher} compact className="mb-4" />
            <DestinationList links={links} activeHref={props.activeHref} compact onNavigate={onNavigate} />
            <ShellUtilities utilities={props.utilities} signOut={props.signOut} compact activeHref={props.activeHref} onNavigate={onNavigate} className="w-full" />
          </div>
          <div className="flex w-60 flex-col overflow-y-auto px-3 py-4">
            {panelTitle && <h2 className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{panelTitle}</h2>}
            {props.panel ?? (panelLinks.length > 0 ? <DestinationList links={panelLinks} activeHref={props.activeHref} onNavigate={onNavigate} /> : null)}
          </div>
        </>
      )}
      sheet={({ onNavigate }) => (
        <>
          <ShellBrand brand={props.brand} className="mb-4" />
          <OrgSwitcher switcher={props.switcher} className="mb-4" />
          <DestinationList links={links} activeHref={props.activeHref} onNavigate={onNavigate} />
          {panelLinks.length > 0 && (
            <div className="mt-4 border-t border-border/70 pt-4">
              {panelTitle && <h2 className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{panelTitle}</h2>}
              <DestinationList links={panelLinks} activeHref={props.activeHref} onNavigate={onNavigate} />
            </div>
          )}
          <ShellUtilities utilities={props.utilities} signOut={props.signOut} activeHref={props.activeHref} onNavigate={onNavigate} />
        </>
      )}
    />
  );
}
