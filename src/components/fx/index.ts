/**
 * AIWA fx kit — template-provided premium primitives. Everything re-skins from the app's theme
 * tokens automatically. Per app: at most ONE atmospheric effect (AuroraBackdrop | Spotlight |
 * a Pattern | Meteors) + ONE border/glow effect (ShineBorder | GlowCard) — see the design skill.
 *
 * 2026-09-23: the kit is the ONLY motion author. The choreography primitives (StaggerReveal, BlurFade,
 * ScrollReveal, SplitText, ParallaxLayer, MagneticButton, StickyStack, HorizontalRail, PinnedCaption)
 * are the only motion an app writes; each gates itself on reduced motion and renders its static form.
 * A hand-written useScroll, useTransform, useInView or whileInView outside this folder is a validator
 * defect. Never add `export type` lines here (the constitution's module block reads the value exports).
 */
export { AuroraBackdrop } from './AuroraBackdrop';
export { Spotlight } from './Spotlight';
export { GridPattern, DotPattern } from './Patterns';
export { ShineBorder } from './ShineBorder';
export { GlowCard } from './GlowCard';
export { BentoGrid, BentoCard } from './Bento';
export { Marquee } from './Marquee';
export { NumberTicker } from './NumberTicker';
export { ShimmerButton } from './ShimmerButton';
export { Meteors } from './Meteors';
export { GradientText } from './GradientText';
export { StaggerReveal, BlurFade } from './Reveal';
// Choreography primitives (2026-09-23): transform and opacity only, reduced-motion safe by themselves.
export { ScrollReveal } from './ScrollReveal'; // a section's children entering once on scroll (light)
export { SplitText } from './SplitText'; // one display line rising word by word or char by char (medium)
export { ParallaxLayer } from './ParallaxLayer'; // a layer drifting slower than the page (medium)
export { MagneticButton } from './MagneticButton'; // THE one CTA leaning toward the pointer (medium)
export { StickyStack } from './StickyStack'; // cards that pin and settle onto a pile (heavy, one per page)
export { HorizontalRail } from './HorizontalRail'; // chapters travelling sideways as the page scrolls (heavy)
export { PinnedCaption } from './PinnedCaption'; // a pinned claim beside scrolling evidence (heavy)
// Quality primitives (R86): use these instead of hand-rolling, so every app gets them right by default.
export { GradientCover } from './GradientCover'; // distinct per-item cover art (never repeat one image)
export { ChartTooltip } from './ChartTooltip'; // contrast-safe recharts tooltip (label AND value legible)
export { Metric } from './Metric'; // KPI/stat: big number in a tabular non-serif face
export { EmptyState } from './EmptyState'; // canonical empty state; never render contentless cards
export { AuthCTA } from './AuthCTA'; // auth-aware public nav button (swaps Sign In <-> Dashboard)
