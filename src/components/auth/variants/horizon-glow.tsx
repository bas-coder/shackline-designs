import { StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/**
 * Horizon Glow (harvest T3): no card, no panel. A narrow column sits slightly above optical centre
 * (mark, display title, one-line subtitle, the form) and a wide gradient horizon rises from the
 * bottom 35% of the viewport; the legal line is pinned 32px above the page bottom. Light and dark
 * are one token pair by construction, so the same file is both Miraei moods.
 * Embodies Miraei 350 (dark) and 351 (light) from the Bricx harvest (structure and taste only).
 */
export const manifest: AuthVariantManifest = {
  name: 'horizon-glow',
  label: 'Horizon glow column',
  mood: ['ai', 'wellness', 'calm', 'premium', 'professional', 'quiet'],
  atmosphere: 'aurora',
  borderEffect: 'none',
  flush: false,
  whenToUse: 'AI products, wellness and anything where the brand is a feeling rather than a proof',
  avoidWhen: 'you need proof beside the form; there is nowhere for a testimonial or a logo grid',
};

export function Variant({ title, subtitle, logoUrl, tagline, highlights, form }: AuthVariantProps) {
  const points = (highlights ?? []).filter((h) => typeof h === 'string' && h.trim()).slice(0, 3);
  const monogram = title.trim().charAt(0).toUpperCase() || 'A';
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* The horizon: the aurora of this frame. One gradient field rising from the bottom 35% and one
          blurred ellipse at the bottom centre. Nothing else carries colour. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[35vh] bg-gradient-to-t from-primary/25 via-primary/5 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -bottom-[22vh] left-1/2 h-[44vh] w-[120vw] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[400px] px-6 pt-12 lg:px-0 lg:pt-[18vh]">
        <StaggerReveal className="space-y-8">
          <div className="flex justify-center">
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              {logoUrl ? (
                <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-12 w-auto" />
              ) : (
                <div aria-hidden className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 font-display text-xl font-semibold text-primary">
                  {monogram}
                </div>
              )}
            </a>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            {tagline && <p className="text-balance pt-1 font-display text-base text-foreground/80">{tagline}</p>}
          </div>
          {form}
          {points.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Highlights">
              {points.map((h, i) => (
                <li key={i} className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-primary/70" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </StaggerReveal>
      </div>

      {/* Legal, pinned 32px above the page bottom; flows down when the form is taller than the viewport. */}
      <p className="relative z-10 mt-auto px-6 pb-8 pt-12 text-center text-xs text-muted-foreground/80">
        Secure sign-in with Google or email. Your data stays in your account.
      </p>
    </div>
  );
}
