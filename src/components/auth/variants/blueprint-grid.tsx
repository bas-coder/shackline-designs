import { GridPattern, StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/**
 * Blueprint Grid (harvest T2): the viewport is ruled into cells by hairlines at about 10% contrast
 * and the form column sits in the centre cell, its edges landing on the two vertical rules. The
 * mark straddles the horizontal rule; the title is set in mono uppercase; the primary button is
 * the only chroma on an otherwise achromatic page. Radius 8 everywhere, no blobs, no photos.
 * Embodies Camb.ai 386 with BTR's mono discipline from the Bricx harvest (structure and taste only).
 */
export const manifest: AuthVariantManifest = {
  name: 'blueprint-grid',
  label: 'Blueprint ruled grid',
  mood: ['developer', 'technical', 'data', 'infra', 'precise', 'operational', 'finance'],
  atmosphere: 'grid',
  borderEffect: 'none',
  flush: false,
  whenToUse: 'developer tools, infrastructure, data products and crypto where exactness is the brand',
  avoidWhen: 'the brand is warm or consumer; the grid reads as cold',
};

export function Variant({ title, subtitle, logoUrl, tagline, highlights, form }: AuthVariantProps) {
  const cells = (highlights ?? []).filter((h) => typeof h === 'string' && h.trim()).slice(0, 3);
  const monogram = title.trim().charAt(0).toUpperCase() || 'A';
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Faint large-cell texture under the structural rules. */}
      <GridPattern size={120} fade="edges" className="opacity-40" />
      {/* Two vertical rules: at the 24px gutters on phones, on the form column's edges on lg (max-w-sm = 24rem). */}
      <div aria-hidden className="absolute inset-y-0 left-6 border-l border-border/40 lg:left-[calc(50%-12rem)]" />
      <div aria-hidden className="absolute inset-y-0 right-6 border-r border-border/40 lg:right-[calc(50%-12rem)]" />

      <div className="relative flex min-h-screen flex-col">
        {/* The top row of cells: empty on purpose. */}
        <div className="h-28 shrink-0 lg:h-[40vh]" />
        {/* One horizontal rule across the viewport, the mark centred on it. */}
        <div className="relative border-t border-border/40">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-background px-3">
            <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
              {logoUrl ? (
                <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-12 w-12 rounded-lg object-contain" />
              ) : (
                <div aria-hidden className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-background font-mono text-lg font-semibold text-foreground">
                  {monogram}
                </div>
              )}
            </a>
          </div>
        </div>

        {/* The centre cell: the form column, flush to the vertical rules. */}
        <div className="mx-6 pb-16 pt-14 lg:mx-auto lg:w-full lg:max-w-sm">
          <StaggerReveal className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-balance font-mono text-2xl font-semibold uppercase tracking-wide text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
              {tagline && <p className="pt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70">{tagline}</p>}
            </div>
            {form}
            {cells.length > 0 && (
              <ul className="grid grid-cols-1 divide-y divide-border/40 border-y border-border/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0" aria-label="Highlights">
                {cells.map((h, i) => (
                  <li key={i} className="px-3 py-3 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
              Secure sign-in with Google or email
            </p>
          </StaggerReveal>
        </div>
      </div>
    </div>
  );
}
