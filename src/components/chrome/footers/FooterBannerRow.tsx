import { cn } from '@/lib/utils';
import { CtaLink } from '../parts/ActionCluster';
import type { ControlShape, FooterCrown } from '../types';
import { ArrowLink } from './bits';

/**
 * The banner row: a single crown row, an optional eyebrow chip plus headline left and ONE CTA right
 * on the same baseline, so the crown costs about 40% of a full band. Stacks on phones. Embodies the
 * Hobbes banner-row CTA.
 */
export function FooterBannerRow({ crown, controls = 'scale', className }: { crown: FooterCrown; controls?: ControlShape; className?: string }) {
  return (
    <section aria-labelledby="footer-banner-heading" className={cn('flex flex-col gap-6 rounded-2xl border border-border bg-card px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-9', className)}>
      <div className="flex min-w-0 flex-col items-start gap-3">
        {crown.eyebrow && <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{crown.eyebrow}</span>}
        <h2 id="footer-banner-heading" className="text-balance font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          {crown.headline}
        </h2>
        {crown.sub && <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{crown.sub}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {crown.secondary && <ArrowLink link={crown.secondary} />}
          <CtaLink cta={{ treatment: 'filled', ...crown.cta }} controls={controls} />
        </div>
        {crown.reassurance && <p className="text-xs text-muted-foreground">{crown.reassurance}</p>}
      </div>
    </section>
  );
}
