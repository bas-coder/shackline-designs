/**
 * AIWA chrome kit: template-provided navbars and footers. Every piece re-skins from the app's theme
 * tokens and holds the measured bar rules by construction (see contract.ts). The design contract
 * names a style; the app renders <Navbar style=...> and <Footer style=...>, blends by composing a
 * shell with parts from another style, and writes a custom bar only inside <NavShell>/<FooterShell>.
 */
export { Navbar } from './Navbar';
export { Footer } from './Footer';
export { NavShell } from './NavShell';
export { FooterShell } from './FooterShell';
export { BrandCluster } from './parts/BrandCluster';
export { NavLinks, isActive } from './parts/NavLinks';
export { ActionCluster, CtaLink } from './parts/ActionCluster';
export { MobileMenu } from './parts/MobileMenu';
export { MicroSignals, HealthPill, LocalTime, BackToTop, ThemeToggle } from './parts/MicroSignals';
// The folder indexes are named explicitly: on a case-insensitive filesystem './footer' would resolve
// to Footer.tsx (the dispatcher) instead of the footers/ folder.
export { NavAnchoredHairline, NavAnnouncementStack, NavInsetCard, NavFloatingCapsule, NavTransparentHairline, NavSplitCentre, NavEdgeAsymmetric, NavAuthPair, NavProductBar, NavTabStrip, NavBreadcrumbContext, NavHairlineEditorial, NavCustom } from './navs/index';
// 2026-09-23: the parts a custom bar or footer composes (the contract names "custom" with an anatomy).
export { PrimaryNav, BreadcrumbChips, isTabActive } from './navs/shared';
// 2026-09-24: the app's own error screen (createRouter defaultErrorComponent), self-reporting to the preview probe.
export { ErrorScreen } from './ErrorScreen';
export { NotFoundScreen } from './NotFoundScreen';
export { UserCluster, AvatarMenu, BellButton, Meter } from './navs/user-cluster';
export { BrandBlock, LinkList, SocialChips, ArrowLink, InvertedField, useCaptureForm } from './footers/bits';
export { FooterCtaCrown, FooterCaptureCrown, FooterFaqCrown, FooterBannerRow, FooterSceneCrown, FooterColumns, FooterContactBlock, FooterTrustStack, FooterBento, FooterEditorialCard, FooterMinimalBar, FooterNewsletter, FooterLegalBar } from './footers/index';
// uat run 9: the application shells for signed-in apps (icon rail, labelled and grouped sidebars, rail plus panel, top bar).
export { AppShell, ShellIconRail, ShellLabelledSidebar, ShellGroupedSidebar, ShellRailPlusPanel, ShellTopBar, ShellFrame, ShellBrand, OrgSwitcher, DestinationRow, DestinationList, GroupedList, ShellUtilities, SheetToggle, ShellSheet, useShellSheet } from './shells/index';
export { CONTROL_H, CONTROL_RADIUS, PILL_RADIUS, BAR_PAD, FLOATING_PAD, LINK_HIT, CONTAINER, ctaClass, filledCtaClass, outlineCtaClass, ghostCtaClass, linkClass, columnHeadClass, footerLinkClass, hairlineClass } from './contract';
export type { NavbarStyle, FooterStyle, ShellStyle, NavbarProps, FooterProps, AppShellProps, ShellDestination, ShellGroup, ShellSwitcher, ChromeLink, ChromeBrand, ChromeCta, ControlShape, MicroSignal, FooterColumn, FooterCrown, FooterCapture, FooterContact, FooterTrustBadge, FooterLegal, NavbarUser, NavbarMeter } from './types';
