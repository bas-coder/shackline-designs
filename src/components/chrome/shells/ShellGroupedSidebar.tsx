import { asGroups, asLinks } from '../normalize';
import type { AppShellProps, ShellDestination } from '../types';
import { ShellFrame } from './frame';
import { DestinationList, GroupedList, OrgSwitcher, ShellBrand, ShellUtilities } from './parts';

/**
 * grouped-sidebar: a 240px sidebar whose destinations sit under quiet small-caps group heads with
 * a count badge, ungrouped items first, utilities at the bottom. Embodies Bricx "Camb.ai 427"
 * (Products 5, Tools 6, System) for apps with more than ten destinations.
 */
export function ShellGroupedSidebar(props: AppShellProps) {
  const loose = asLinks(props.destinations) as ShellDestination[];
  const groups = asGroups(props.groups);
  const content = ({ onNavigate }: { onNavigate: () => void }) => (
    <>
      <ShellBrand brand={props.brand} className="mb-3" />
      <OrgSwitcher switcher={props.switcher} className="mb-4" />
      {loose.length > 0 && <DestinationList links={loose} activeHref={props.activeHref} onNavigate={onNavigate} className="mb-5" />}
      <GroupedList groups={groups} activeHref={props.activeHref} onNavigate={onNavigate} />
      <ShellUtilities utilities={props.utilities} signOut={props.signOut} activeHref={props.activeHref} onNavigate={onNavigate} />
    </>
  );
  return <ShellFrame props={props} asideClassName="w-60 px-3 py-4" aside={content} />;
}
