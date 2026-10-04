import { cn } from '@/lib/utils';
import { columnHeadClass } from '../contract';
import { CtaLink } from '../parts/ActionCluster';
import type { ControlShape, FooterCrown } from '../types';
import { ArrowRight } from '@phosphor-icons/react';
import { visualCopy } from '../visual-copy';

/**
 * The CTA crown: a tinted rounded band (or a bordered card) holding an optional eyebrow, a 1 to 2
 * line display headline, a one-line sub, ONE filled CTA, an optional demoted text link and a
 * reassurance line. Embodies the Thrifty Traveler, Manyreach, Gigamind and PressMaster crowns from
 * the Bricx harvest: the crown and the substrate are two organs with different backgrounds. About
 * 1.6x the height of the link block beneath it.
 */
export function FooterCtaCrown({ crown, controls = 'scale', surface = 'tint', className }: { crown: FooterCrown; controls?: ControlShape; surface?: 'tint' | 'card'; className?: string }) {
  return (
    <section aria-labelledby="footer-crown-heading" className={cn('relative overflow-hidden rounded-none px-6 py-16 text-center sm:px-12 sm:py-24', surface === 'card' ? 'border border-border bg-card' : 'bg-background', className)}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        {crown.eyebrow && <p {...visualCopy(crown, 'eyebrow', 'ef-eyebrow text-foreground')}>{crown.eyebrow}</p>}
        <h2 id="footer-crown-heading" {...visualCopy(crown, 'headline', 'ef-heading ef-l text-foreground')}>
          {crown.headline}
        </h2>
        {crown.sub && <p {...visualCopy(crown, 'sub', 'ef-body max-w-xl text-foreground/75')}>{crown.sub}</p>}
        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <CtaLink cta={{ treatment: 'filled', ...crown.cta }} controls={controls} />
          {crown.secondary && (
            <a href={crown.secondary.href} className="sl-secondary">
              {crown.secondary.label}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          )}
        </div>
        {crown.reassurance && <p {...visualCopy(crown, 'reassurance', 'text-xs text-muted-foreground')}>{crown.reassurance}</p>}
      </div>
    </section>
  );
}
