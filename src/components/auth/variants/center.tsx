import { AuroraBackdrop, DotPattern, ShineBorder, StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/** The original atmosphere: aurora and dot grid behind a shine-border glass card. Pixel-identical for existing apps. */
export const manifest: AuthVariantManifest = {
  name: 'center',
  legacy: true,
  label: 'Centred glass card',
  mood: ['product', 'tool', 'dashboard', 'utility'],
  atmosphere: 'aurora',
  borderEffect: 'shine',
  flush: false,
  whenToUse: 'tools and dashboards where the app is the brand',
  avoidWhen: 'the brand needs proof or a marketing panel beside the form',
};

export function Variant({ title, subtitle, logoUrl, tagline, form }: AuthVariantProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <AuroraBackdrop intensity="subtle" position="top" />
      <DotPattern fade="center" className="opacity-50" />

      <div className="relative z-10 w-full max-w-sm">
        <StaggerReveal className="space-y-6">
          <div className="space-y-1.5 text-center">
            {logoUrl && (
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="mx-auto mb-3 h-9 w-auto" />
            </a>
          )}
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            {tagline && <p className="text-sm text-foreground/80">{tagline}</p>}
          </div>

          <ShineBorder duration={9} className="shadow-xl">
            <div className="rounded-[inherit] bg-card/70 p-8 backdrop-blur-xl">{form}</div>
          </ShineBorder>

          <p className="text-center text-xs text-muted-foreground/80">
            Secure sign-in with Google or email. Your data stays in your account.
          </p>
        </StaggerReveal>
      </div>
    </div>
  );
}
