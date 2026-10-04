import { asLinks } from '../normalize';
import type { AppShellProps, ShellDestination } from '../types';
import { ShellFrame } from './frame';
import { DestinationList, OrgSwitcher, ShellBrand, ShellUtilities } from './parts';

/**
 * icon-rail: a 72px rail of icon-plus-micro-label destinations, the mark on top, utilities pinned at
 * the bottom. Embodies Bricx "Avant Talk 353", "Avantpage 350" and "Metricbooks 354" (44 to 72px
 * rails for six or fewer destinations). Below lg the rail becomes a labelled sheet.
 */
export function ShellIconRail(props: AppShellProps) {
  const links = asLinks(props.destinations).slice(0, 7) as ShellDestination[];
  return (
    <ShellFrame
      props={props}
      asideClassName="w-[4.5rem] items-center px-2 py-4"
      aside={({ onNavigate }) => (
        <>
          <ShellBrand brand={props.brand} compact className="mb-4" />
          <OrgSwitcher switcher={props.switcher} compact className="mb-4" />
          <DestinationList links={links} activeHref={props.activeHref} compact onNavigate={onNavigate} />
          <ShellUtilities utilities={props.utilities} signOut={props.signOut} compact activeHref={props.activeHref} onNavigate={onNavigate} className="w-full" />
        </>
      )}
      sheet={({ onNavigate }) => (
        <>
          <ShellBrand brand={props.brand} className="mb-4" />
          <OrgSwitcher switcher={props.switcher} className="mb-4" />
          <DestinationList links={links} activeHref={props.activeHref} onNavigate={onNavigate} />
          <ShellUtilities utilities={props.utilities} signOut={props.signOut} activeHref={props.activeHref} onNavigate={onNavigate} />
        </>
      )}
    />
  );
}
