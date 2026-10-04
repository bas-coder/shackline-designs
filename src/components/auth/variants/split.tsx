import { Check } from '@phosphor-icons/react';
import { DotPattern, GridPattern, StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/** A brand panel (logo, tagline, highlight bullets on the primary surface) beside the form card. */
export const manifest: AuthVariantManifest = {
  name: 'split',
  legacy: true,
  label: 'Split brand panel',
  mood: ['marketing', 'brand-led', 'consumer', 'saas'],
  atmosphere: 'grid',
  borderEffect: 'none',
  flush: false,
  whenToUse: 'marketing and brand-led apps with a tagline and three subject-true highlights',
  avoidWhen: 'there is nothing true to say in the panel (an empty panel is worse than none)',
};

export function Variant({ title, subtitle, logoUrl, tagline, highlights, form }: AuthVariantProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <GridPattern fade="edges" className="opacity-20" />
        {/* Brand at top. */}
        <div className="relative">
          <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
            {logoUrl ? (
              <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-9 w-auto" />
            ) : (
              <span className="font-display text-lg font-semibold tracking-tight opacity-90">{title}</span>
            )}
          </a>
        </div>
        {/* Value prop centered in the remaining space (my-auto) so the panel is never a dead middle.
            The headline is NEVER the same string as the brand above (no duplicate "Welcome"): use the
            tagline, or the subtitle when the brand wordmark already shows the title. */}
        <div className="relative my-auto max-w-md space-y-6">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight">
            {tagline ?? (logoUrl ? title : subtitle)}
          </h2>
          {highlights && highlights.length > 0 && (
            <ul className="space-y-3">
              {highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                    <Check className="h-3 w-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="relative flex items-center justify-center px-6 py-12">
        <DotPattern fade="center" className="opacity-30" />
        <div className="relative z-10 w-full max-w-sm">
          <StaggerReveal className="space-y-6">
            {/* Compact brand header for mobile (the brand panel is lg-only). */}
            <div className="flex items-center gap-2.5 lg:hidden">
              {logoUrl && (
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-8 w-auto" />
            </a>
          )}
              <span className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</span>
            </div>
            <div className="space-y-1.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{subtitle}</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account or create one.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">{form}</div>
          </StaggerReveal>
        </div>
      </div>
    </div>
  );
}
