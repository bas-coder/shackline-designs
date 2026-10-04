import { GridPattern } from '@/components/fx';
import { cn } from '@/lib/utils';
import { columnHeadClass } from '../contract';
import { CtaLink } from '../parts/ActionCluster';
import type { ControlShape, FooterCrown } from '../types';
import { ArrowLink } from './bits';

/**
 * The scene crown: a photograph is the crown, with a centred headline and ONE CTA on a scrim that
 * fades from the page background so the copy stays legible in either scheme (the photograph is the
 * colour; no accent hue is added). Without an image it falls back to a bordered grid surface.
 * Embodies the CRA, Oyappy and Podqi photo-crowned footers.
 */
export function FooterSceneCrown({ crown, controls = 'scale', className }: { crown: FooterCrown; controls?: ControlShape; className?: string }) {
  const photo = Boolean(crown.imageUrl);
  return (
    <section aria-labelledby="footer-scene-heading" className={cn('relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-2xl px-6 py-20 text-center sm:min-h-[26rem] sm:px-12', !photo && 'border border-border bg-card', className)}>
      {photo ? (
        <>
          <img src={crown.imageUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background/90 via-background/60 to-background/25" />
        </>
      ) : (
        <GridPattern fade="edges" className="-z-10" />
      )}
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        {crown.eyebrow && <p className={columnHeadClass}>{crown.eyebrow}</p>}
        <h2 id="footer-scene-heading" className="text-balance font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-foreground">
          {crown.headline}
        </h2>
        {crown.sub && <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{crown.sub}</p>}
        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <CtaLink cta={{ treatment: 'filled', ...crown.cta }} controls={controls} />
          {crown.secondary && <ArrowLink link={crown.secondary} />}
        </div>
        {crown.reassurance && <p className="text-xs text-muted-foreground">{crown.reassurance}</p>}
      </div>
    </section>
  );
}
