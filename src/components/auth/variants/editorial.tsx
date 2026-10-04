import { DotPattern, StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/** No card chrome: a flat surface, display type, hairline fields. Editorial, luxury, high-trust. */
export const manifest: AuthVariantManifest = {
  name: 'editorial',
  legacy: true,
  label: 'Editorial hairline form',
  mood: ['editorial', 'luxury', 'high-trust', 'broadsheet'],
  atmosphere: 'dot',
  borderEffect: 'none',
  flush: true,
  whenToUse: 'editorial, luxury or high-trust products where type does the work',
  avoidWhen: 'consumer apps that expect a card and social providers first',
};

export function Variant({ title, subtitle, logoUrl, tagline, form }: AuthVariantProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <DotPattern fade="center" className="opacity-30" />
      <div className="relative z-10 mx-auto w-full max-w-md px-6 py-24">
        <StaggerReveal className="space-y-10">
          {logoUrl && (
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-8 w-auto" />
            </a>
          )}
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="text-base text-muted-foreground">{subtitle}</p>
            {tagline && <p className="font-serif text-base italic text-foreground/80">{tagline}</p>}
          </div>
          {form}
          <p className="text-xs text-muted-foreground/80">Secure sign-in with Google or email. Your data stays in your account.</p>
        </StaggerReveal>
      </div>
    </div>
  );
}
