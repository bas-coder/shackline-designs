import type { ReactNode } from 'react';
import type { VisualCopy } from './visual-copy';

/**
 * AIWA chrome kit: the navbar and footer primitives every generated app imports instead of
 * hand-writing a bar. The names mirror the design contract's NAVBAR_STYLES and FOOTER_STYLES
 * (packages/shared/src/constants.ts); a parity test keeps them equal. Anatomy and rules come from
 * the Bricx harvest (docs/design/bricx-harvest): control height at most 0.6 of bar height, padding
 * the remainder with an 8px floor, one filled control per bar, the CTA on the control radius unless
 * the whole system is pill.
 */

export type NavbarStyle =
  | 'anchored-hairline'
  | 'announcement-stack'
  | 'inset-card'
  | 'floating-capsule'
  | 'transparent-hairline'
  | 'split-centre'
  | 'edge-asymmetric'
  | 'auth-pair'
  | 'product-bar'
  | 'tab-strip'
  | 'breadcrumb-context'
  | 'hairline-editorial'
  | 'custom';

export type FooterStyle =
  | 'cta-crowned'
  | 'monument'
  | 'columns-utility'
  | 'contact-forward'
  | 'compact-pro'
  | 'editorial-card'
  | 'bento-footer'
  | 'scene'
  | 'mega-saas'
  | 'capture-crown'
  | 'trust-column'
  | 'faq-crown'
  | 'banner-row'
  | 'minimal-bar'
  | 'fused-closing'
  | 'none'
  | 'custom';

/**
 * uat run 9: the application shells for signed-in apps, chosen by navigation load (the Bricx
 * dashboard harvest): icon-rail for 6 or fewer destinations, labelled-sidebar for 5 to 10,
 * grouped-sidebar above 10, rail-plus-panel when a section has its own hierarchy, top-bar for
 * feeds and single-surface tools. Mirrors SHELL_STYLES in packages/shared/src/constants.ts.
 */
export type ShellStyle =
  | 'icon-rail'
  | 'labelled-sidebar'
  | 'grouped-sidebar'
  | 'rail-plus-panel'
  | 'top-bar'
  | 'none'
  | 'custom';

/** 'scale' keeps every control on the app's --radius (rounded-lg); 'pill' is ONLY for a pill stance. */
export type ControlShape = 'scale' | 'pill';

export interface ChromeLink extends VisualCopy {
  label: string;
  href: string;
  /** One line for a dropdown or footer sub-cluster. */
  description?: string;
  /** Children turn the link into a dropdown (navbar) or a labelled sub-cluster (footer). */
  children?: ChromeLink[];
  external?: boolean;
  /** An optional lucide icon or glyph node rendered before the label. */
  icon?: ReactNode;
}

export interface ChromeBrand extends VisualCopy {
  name: string;
  href?: string;
  /** A logo image; when absent the mark node or a generated monogram is used. */
  logoUrl?: string;
  mark?: ReactNode;
  /** Footer brand row: replaces the mark and the name text. `name` stays the accessible label. */
  lockup?: ReactNode;
  /** A 1 to 2 line mission or positioning statement (footer brand block). */
  mission?: string;
}

export interface ChromeCta extends VisualCopy {
  label: string;
  href: string;
  /** Render through AuthCTA so a signed-in visitor sees the app instead of Sign in. */
  auth?: boolean;
  /** filled is the ONE filled control a bar carries; outline and ghost are subordinate. */
  treatment?: 'filled' | 'outline' | 'ghost' | 'shimmer';
  icon?: ReactNode;
}

/** Living details a footer or bar may carry; text and one real endpoint, never decoration. */
export type MicroSignal = 'theme-toggle' | 'local-time' | 'health-status' | 'back-to-top';

export interface NavbarUser {
  name: string;
  avatarUrl?: string;
  /** Rendered inside the avatar menu; the app decides the entries. */
  menu?: ReactNode;
}

export interface NavbarMeter {
  label: string;
  value: number;
  max: number;
  href?: string;
}

export interface NavbarProps {
  style: Exclude<NavbarStyle, 'custom'>;
  brand: ChromeBrand;
  links?: ChromeLink[];
  /** The current route; matched exactly, then by prefix, for the active-link state. */
  activeHref?: string;
  /** The ONE filled control of the bar. */
  cta?: ChromeCta;
  /** A subordinate control (sign in, search, bell, avatar) rendered before the CTA. */
  secondary?: ReactNode;
  controls?: ControlShape;
  microSignals?: MicroSignal[];
  /** announcement-stack: the strip above the bar. */
  announcement?: { text: ReactNode; href?: string; dismissible?: boolean; storageKey?: string };
  /** product-bar, tab-strip, breadcrumb-context: signed-in chrome. */
  title?: string;
  breadcrumbs?: ChromeLink[];
  tabs?: ChromeLink[];
  /** tab-strip and breadcrumb-context: the right-side action on the second row. */
  action?: ChromeCta;
  /** breadcrumb-context: the filter, period and export cluster on the second row. */
  toolbar?: ReactNode;
  user?: NavbarUser;
  meter?: NavbarMeter;
  /** auth-pair: the subtle second control. */
  secondaryCta?: ChromeCta;
  className?: string;
  /** A blend hook: extra cluster content placed after the links. */
  children?: ReactNode;
}

export interface FooterColumn extends VisualCopy {
  heading: string;
  links: ChromeLink[];
}

/** A shell destination: a link with an icon, an optional count badge and optional children (rail-plus-panel). */
export interface ShellDestination extends ChromeLink {
  badge?: string | number;
}

export interface ShellGroup {
  label: string;
  links: ShellDestination[];
}

/** The workspace or org switcher at the head of a sidebar; a native select when options are given. */
export interface ShellSwitcher {
  label: string;
  options?: string[];
  onChange?: (value: string) => void;
}

export interface AppShellProps {
  style: Exclude<ShellStyle, 'none' | 'custom'>;
  brand: ChromeBrand;
  /** The primary destinations (icon-rail up to 7, labelled up to 10, top-bar up to 8). */
  destinations?: ShellDestination[];
  /** grouped-sidebar: destinations under small-caps group heads (ungrouped `destinations` render first). */
  groups?: ShellGroup[];
  /** The current route; matched exactly, then by prefix. */
  activeHref?: string;
  user?: NavbarUser;
  meter?: NavbarMeter;
  switcher?: ShellSwitcher;
  /** Settings, help and the like, pinned at the bottom of the rail or sidebar. */
  utilities?: ShellDestination[];
  signOut?: ChromeCta;
  /** The product bar across the top: page title or breadcrumbs, the ONE filled action, a subordinate control, micro-signals. */
  bar?: Pick<NavbarProps, 'title' | 'breadcrumbs' | 'cta' | 'secondary' | 'microSignals' | 'className'>;
  /** rail-plus-panel: the contextual panel content (defaults to the active destination's children). */
  panel?: ReactNode;
  panelTitle?: string;
  /** top-bar: the docked search in the bar. */
  search?: { placeholder: string; onSubmit?: (query: string) => void };
  controls?: ControlShape;
  className?: string;
  /** The page content. */
  children?: ReactNode;
}

export interface FooterCrown extends VisualCopy {
  eyebrow?: string;
  headline: string;
  sub?: string;
  cta: ChromeCta;
  /** "No credit card required" under the CTA. */
  reassurance?: string;
  /** A subordinate second option: a text link with an arrow, never a second filled button. */
  secondary?: ChromeLink;
  /** scene: the full-bleed photograph behind the crown. */
  imageUrl?: string;
}

export interface FooterCapture {
  label?: string;
  placeholder: string;
  buttonLabel: string;
  /** "bookme.com/" before the field text for a vanity handle. */
  prefix?: string;
  onSubmit?: (value: string) => void | Promise<void>;
  reassurance?: string;
}

export interface FooterContact {
  rows: Array<{ icon?: ReactNode; label: string; value: string; href?: string }>;
  hours?: string[];
  address?: string;
}

export interface FooterTrustBadge {
  icon?: ReactNode;
  label: string;
  sub?: string;
}

export interface FooterLegal extends VisualCopy {
  copyright: string;
  links: ChromeLink[];
  /** "Designed by", an address, a registration number: the right slot of the legal row. */
  credit?: string;
}

export interface FooterProps {
  style: Exclude<FooterStyle, 'none' | 'custom'>;
  brand: ChromeBrand;
  columns?: FooterColumn[];
  crown?: FooterCrown;
  capture?: FooterCapture;
  newsletter?: FooterCapture;
  contact?: FooterContact;
  trust?: FooterTrustBadge[];
  faq?: Array<{ question: string; answer: string }>;
  socials?: ChromeLink[];
  legal: FooterLegal;
  /** monument and any style: the cropped ghost wordmark modifier. */
  wordmark?: boolean;
  microSignals?: MicroSignal[];
  controls?: ControlShape;
  className?: string;
  /** A blend hook: extra content placed in the substrate. */
  children?: ReactNode;
}
