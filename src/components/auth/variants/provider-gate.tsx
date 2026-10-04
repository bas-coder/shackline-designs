import { Heart, ChatCircle, Sparkle, Star, Users } from '@phosphor-icons/react';
import { StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/**
 * Provider Gate (harvest T1): one rounded shell inset on a near-flat page, split 45/55. The form
 * column leads with the social provider under a squircle mark; the brand panel carries a single
 * radial bloom, an orbit of soft tiles standing in for a community, and a fixed bottom text block
 * with a static dot pager. On phones the panel becomes a top band and the form continues beneath.
 * Embodies Thrust 350, 363, 353 and 411 from the Bricx harvest (structure and taste only).
 */
export const manifest: AuthVariantManifest = {
  name: 'provider-gate',
  label: 'Provider gate shell',
  mood: ['consumer', 'social', 'community', 'playful', 'marketplace', 'booking', 'warm', 'host', 'rental'],
  atmosphere: 'none',
  borderEffect: 'none',
  flush: false,
  whenToUse: 'consumer and community apps where most people arrive with a social identity',
  avoidWhen: 'enterprise SSO, regulated signup, or when email must be co-equal with the provider',
};

/** The orbit: four soft tiles placed around the larger central tile. Phones get the compact sizes. */
const ORBIT = [
  { Icon: Heart, cls: 'left-[6%] top-[14%] h-10 w-10 lg:h-14 lg:w-14' },
  { Icon: ChatCircle, cls: 'right-[10%] top-[6%] h-9 w-9 lg:h-12 lg:w-12' },
  { Icon: Star, cls: 'left-[16%] bottom-[10%] h-9 w-9 lg:h-12 lg:w-12' },
  { Icon: Users, cls: 'right-[6%] bottom-[16%] h-11 w-11 lg:h-16 lg:w-16' },
] as const;

const TILE = 'absolute grid place-items-center rounded-2xl border border-border/60 bg-background/60 text-primary shadow-sm backdrop-blur-sm';

export function Variant({ title, subtitle, logoUrl, tagline, highlights, form }: AuthVariantProps) {
  const monogram = title.trim().charAt(0).toUpperCase() || 'A';
  // The panel headline is never the title (the brand column already says it): tagline, else subtitle.
  const headline = tagline ?? subtitle;
  return (
    <div className="flex min-h-screen items-center justify-center bg-background lg:p-12">
      <div className="grid w-full max-w-5xl overflow-hidden bg-card lg:min-h-[640px] lg:grid-cols-[45fr_55fr] lg:rounded-3xl lg:border lg:border-border">
        {/* Form column. */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <StaggerReveal className="mx-auto w-full max-w-sm space-y-6 lg:mx-0">
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              {logoUrl ? (
                <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-14 w-14 rounded-2xl object-contain" />
              ) : (
                <div aria-hidden className="grid h-14 w-14 place-items-center rounded-2xl bg-primary font-display text-2xl font-semibold text-primary-foreground">
                  {monogram}
                </div>
              )}
            </a>
            <div className="space-y-1.5">
              <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {form}
            <p className="text-center text-xs text-muted-foreground/80">More ways to sign in arrive soon.</p>
          </StaggerReveal>
        </div>

        {/* Brand panel: a top band on phones (order-first), the right column on lg. */}
        <div className="relative order-first h-[40vh] min-h-[220px] overflow-hidden bg-primary/5 lg:order-last lg:h-auto lg:min-h-0">
          {/* ONE radial bloom behind the orbit. */}
          <div aria-hidden className="absolute left-1/2 top-[35%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl lg:h-96 lg:w-96" />
          {/* Orbit in the whole band on phones, the top 60% on lg. */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-full lg:h-[60%]">
            <div className="relative mx-auto h-full w-full max-w-xs">
              <div className={`${TILE} left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 lg:h-24 lg:w-24`}>
                <Sparkle className="h-6 w-6 lg:h-9 lg:w-9" />
              </div>
              {ORBIT.map(({ Icon, cls }) => (
                <div key={cls} className={`${TILE} ${cls}`}>
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
              ))}
            </div>
          </div>
          {/* Fixed bottom text block: headline, highlights, static pager (lg only). */}
          <div className="absolute inset-x-0 bottom-0 hidden h-[40%] flex-col justify-end space-y-4 p-10 lg:flex">
            <h2 className="text-balance font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">{headline}</h2>
            {highlights && highlights.length > 0 && (
              <ul className="space-y-1.5">
                {highlights.slice(0, 3).map((h) => (
                  <li key={h} className="text-sm text-muted-foreground">{h}</li>
                ))}
              </ul>
            )}
            <div aria-hidden className="flex items-center gap-1.5 pt-1">
              <span className="h-1.5 w-5 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
