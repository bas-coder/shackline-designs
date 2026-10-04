import type { ControlShape } from './types';

/**
 * The chrome contract in class terms. Every navbar and footer in this kit composes these, so the
 * measured rules hold by construction rather than by the author's memory (docs/design/bricx-harvest):
 * controls are h-11 (44px, the native tap floor and the SignIn input height), the bar carries py-4
 * above and below them (a 76px bar, controls at 0.58 of it: the harvest measured 0.41 to 0.62), the
 * outermost control sits at least half its own height from the bar's edge, links are 44px targets,
 * and the CTA sits on the app's control radius (rounded-lg = --radius) unless the whole system is pill.
 */

export const CONTROL_H = 'h-12';
export const CONTROL_RADIUS = 'rounded-lg';
export const PILL_RADIUS = 'rounded-full';
/** Anchored bars: px-4 keeps the outermost h-11 control 16px from the edge on phones, sm:px-6 (24px, more than half a control) on desktop. */
export const BAR_PAD = 'px-4 py-4 sm:px-6';
/** Floating capsules: a 72px pill (0.61) whose CTA nests 16px from the right edge, the brand deeper on the left. */
export const FLOATING_PAD = 'pl-6 pr-4 py-3.5';
/** Every nav link is a 44px target with breathing room. */
export const LINK_HIT = 'min-h-11 px-3';
/** The content column every bar and footer aligns to. */
export const CONTAINER = 'mx-auto w-full max-w-7xl';

export const radiusClass = (shape: ControlShape = 'scale'): string => (shape === 'pill' ? PILL_RADIUS : CONTROL_RADIUS);

/** The one filled control of a bar: h-11, the control radius, generous horizontal padding. */
export const ctaClass = (shape: ControlShape = 'scale'): string =>
  `${CONTROL_H} ${radiusClass(shape)} inline-flex items-center justify-center gap-2 px-4 font-sans text-base font-bold tracking-[-0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background`;

export const filledCtaClass = (shape: ControlShape = 'scale'): string => `${ctaClass(shape)} bg-primary text-primary-foreground shadow-sm hover:bg-primary/90`;
export const outlineCtaClass = (shape: ControlShape = 'scale'): string => `${ctaClass(shape)} border border-border bg-transparent text-foreground hover:bg-accent`;
export const ghostCtaClass = (shape: ControlShape = 'scale'): string => `${ctaClass(shape)} text-foreground/80 hover:bg-accent hover:text-foreground`;

/** Links share the control height so a row of links and a CTA align exactly. */
export const linkClass =
  `${LINK_HIT} inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60`;
export const activeLinkClass = 'text-foreground';

/** Small-caps tracked column heads (footer): quiet, never bold and large. */
export const columnHeadClass = 'ef-heading ef-xxs text-foreground';
export const footerLinkClass = 'font-display text-[1.5em] font-medium leading-none tracking-normal text-foreground/60 transition-colors hover:text-foreground';
/** The legal row is separated by a hairline, never a band. */
export const hairlineClass = 'border-t border-border/70';
