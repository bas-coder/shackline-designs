import { asLinks } from '../normalize';
import type { AppShellProps, ShellDestination } from '../types';
import { ShellFrame } from './frame';
import { DestinationList, OrgSwitcher, ShellBrand, ShellUtilities } from './parts';

/**
 * labelled-sidebar: a 208px sidebar with the brand, a workspace switcher, 5 to 10 labelled
 * destinations (icon, label, count badge; active = tinted fill plus a 2px edge indicator) and the
 * utilities at the bottom. Embodies Bricx "Categorizer 355", "BTR 358" and "Loopback 351".
 */
export function ShellLabelledSidebar(props: AppShellProps) {
  const links = asLinks(props.destinations).slice(0, 10) as ShellDestination[];
  const content = ({ onNavigate }: { onNavigate: () => void }) => (
    <>
      <ShellBrand brand={props.brand} className="mb-3" />
      <OrgSwitcher switcher={props.switcher} className="mb-4" />
      <DestinationList links={links} activeHref={props.activeHref} onNavigate={onNavigate} />
      <ShellUtilities utilities={props.utilities} signOut={props.signOut} activeHref={props.activeHref} onNavigate={onNavigate} />
    </>
  );
  return <ShellFrame props={props} asideClassName="w-52 px-3 py-4" aside={content} />;
}
