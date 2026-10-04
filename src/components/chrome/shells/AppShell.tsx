import type { AppShellProps } from '../types';
import { ShellGroupedSidebar } from './ShellGroupedSidebar';
import { ShellIconRail } from './ShellIconRail';
import { ShellLabelledSidebar } from './ShellLabelledSidebar';
import { ShellRailPlusPanel } from './ShellRailPlusPanel';
import { ShellTopBar } from './ShellTopBar';

/**
 * The application shell every signed-in app renders from its design contract (uat run 9: the author
 * hand-wrote an app-shell.tsx because the kit had bars but no shell). `style` names one of the
 * SHELL_STYLES; the harvest chooses it by navigation load: icon-rail for 6 or fewer destinations,
 * labelled-sidebar for 5 to 10, grouped-sidebar above 10, rail-plus-panel when a section has its
 * own hierarchy, top-bar for feeds and single-surface tools. Every shell composes the product-bar
 * navbar across the top, so the bar rules (one filled control, 44px targets) hold by construction.
 * An unknown style falls back to the labelled sidebar. Blend by composing the shells/ parts directly.
 */
export function AppShell(props: AppShellProps) {
  switch (props.style) {
    case 'icon-rail':
      return <ShellIconRail {...props} />;
    case 'grouped-sidebar':
      return <ShellGroupedSidebar {...props} />;
    case 'rail-plus-panel':
      return <ShellRailPlusPanel {...props} />;
    case 'top-bar':
      return <ShellTopBar {...props} />;
    case 'labelled-sidebar':
    default:
      return <ShellLabelledSidebar {...props} />;
  }
}
