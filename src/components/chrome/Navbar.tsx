import type { NavbarProps } from './types';
import { asLinks } from './normalize';
import {
  NavAnchoredHairline,
  NavAnnouncementStack,
  NavInsetCard,
  NavFloatingCapsule,
  NavTransparentHairline,
  NavSplitCentre,
  NavEdgeAsymmetric,
  NavAuthPair,
  NavProductBar,
  NavTabStrip,
  NavBreadcrumbContext,
  NavHairlineEditorial,
} from './navs/index';

/**
 * The navbar entry point: the design contract names a style and the app renders <Navbar style=...>.
 * Dispatches on props.style to the twelve bars in ./nav; an unknown style (a contract typo, a style
 * added to the contract before the kit) falls back to the anchored hairline bar rather than a blank.
 */
export function Navbar(raw: NavbarProps) {
  // Model-authored lists are normalised once here (see normalize.ts); the bars below assume clean arrays.
  const props: NavbarProps = {
    ...raw,
    links: asLinks(raw.links),
    ...(raw.tabs !== undefined ? { tabs: asLinks(raw.tabs) } : {}),
    ...(raw.breadcrumbs !== undefined ? { breadcrumbs: asLinks(raw.breadcrumbs) } : {}),
  };
  switch (props.style) {
    case 'announcement-stack':
      return <NavAnnouncementStack {...props} />;
    case 'inset-card':
      return <NavInsetCard {...props} />;
    case 'floating-capsule':
      return <NavFloatingCapsule {...props} />;
    case 'transparent-hairline':
      return <NavTransparentHairline {...props} />;
    case 'split-centre':
      return <NavSplitCentre {...props} />;
    case 'edge-asymmetric':
      return <NavEdgeAsymmetric {...props} />;
    case 'auth-pair':
      return <NavAuthPair {...props} />;
    case 'product-bar':
      return <NavProductBar {...props} />;
    case 'tab-strip':
      return <NavTabStrip {...props} />;
    case 'breadcrumb-context':
      return <NavBreadcrumbContext {...props} />;
    case 'hairline-editorial':
      return <NavHairlineEditorial {...props} />;
    case 'anchored-hairline':
    default:
      return <NavAnchoredHairline {...props} />;
  }
}
