import { Check } from '@phosphor-icons/react';
import { Spotlight, StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/**
 * Cinematic Scene (harvest T4): the left half is a full-bleed lit scene with a small wordmark over
 * its top-left and an optional tagline set large at its bottom-left; the right half is a flat
 * column with a small-caps eyebrow, a display title, the form and three highlight lines. No real
 * photograph exists in the template, so the scene is a dark field lit by one spotlight, one bloom
 * and one soft arc, all in tokens. On phones the scene becomes a 38% top band.
 * Embodies Bricx SoundCore 351, with BTR 350 as the mono variant (structure and taste only).
 */
export const manifest: AuthVariantManifest = {
  name: 'cinematic-scene',
  label: 'Cinematic lit scene',
  mood: ['launch', 'editorial', 'media', 'creator', 'luxury', 'hospitality', 'warm', 'hospitable', 'travel'],
  atmosphere: 'spotlight',
  borderEffect: 'none',
  flush: false,
  whenToUse: 'marketing-led launches, media and creator tools with a tagline worth setting large',
  avoidWhen: 'the brand is a quiet utility; the scene overstates a plain tool',
};

export function Variant({ title, subtitle, logoUrl, tagline, highlights, form }: AuthVariantProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* The scene: bg-foreground as the dark field (light in dark mode by construction). */}
      <div className="relative h-[38vh] min-h-[240px] overflow-hidden bg-foreground lg:h-auto lg:min-h-screen">
        <Spotlight position="top-right" size="lg" />
        <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl lg:h-96 lg:w-96" />
        {/* One large soft arc, cropped by the scene's edge. */}
        <div aria-hidden className="absolute -bottom-[45%] -right-[25%] aspect-square w-[110%] rounded-full border border-primary/30 lg:-bottom-[30%] lg:-right-[35%] lg:w-[120%]" />
        {logoUrl && (
          <div className="absolute left-6 top-6 rounded-md bg-background/90 px-2 py-1 lg:left-10 lg:top-10">
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-6 w-auto" />
            </a>
          </div>
        )}
        {tagline && (
          <p className="absolute bottom-6 left-6 right-6 text-balance font-display text-2xl font-semibold leading-[1.05] tracking-tight text-background lg:bottom-10 lg:left-10 lg:right-20 lg:text-4xl">
            {tagline}
          </p>
        )}
      </div>

      {/* The flat column. */}
      <div className="flex items-center justify-center px-6 py-12 lg:px-16">
        <StaggerReveal className="w-full max-w-sm space-y-7">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</p>
            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground">{title}</h1>
          </div>
          {form}
          {highlights && highlights.length > 0 && (
            <ul className="space-y-2 border-t border-border/60 pt-5">
              {highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </StaggerReveal>
      </div>
    </div>
  );
}
