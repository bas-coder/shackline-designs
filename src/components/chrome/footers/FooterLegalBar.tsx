import { cn } from '@/lib/utils';
import { footerLinkClass, hairlineClass } from '../contract';
import { MicroSignals } from '../parts/MicroSignals';
import type { ChromeLink, ControlShape, FooterLegal, MicroSignal } from '../types';
import { asLinks } from '../normalize';
import { SocialChips } from './bits';
import { visualCopy } from '../visual-copy';

/**
 * The legal bar: a hairline (never a band) above a three-slot row, copyright left, policy links
 * centre, credit right, with optional micro-signals (back to top, theme toggle, local time, health)
 * and optional square social chips at the right end. Embodies the legal row 24 of the 27 Bricx
 * footers carry.
 */
export function FooterLegalBar({ legal, microSignals, socials, controls = 'scale', timeZone, hairline = true, className }: { legal: FooterLegal; microSignals?: MicroSignal[]; socials?: ChromeLink[]; controls?: ControlShape; timeZone?: string; hairline?: boolean; className?: string }) {
  const legalLinks = asLinks(legal?.links);
  const hasRight = Boolean(legal?.credit || microSignals?.length || socials?.length);
  return (
    <div className={cn(hairline && hairlineClass, 'flex flex-col gap-3 pt-6 text-xs text-muted-foreground sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6', className)}>
      <p {...visualCopy(legal, 'copyright', 'flex min-h-11 items-center')}>{legal?.copyright}</p>
      {legalLinks.length > 0 ? (
        <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-1 sm:justify-center">
          {legalLinks.map((l, i) => (
            <a key={`${l.href}-${i}`} href={l.href} {...visualCopy(l, 'label', cn(footerLinkClass, 'inline-flex min-h-11 items-center px-2 text-xs first:-ml-2'))}>
              {l.label}
            </a>
          ))}
        </nav>
      ) : (
        <span aria-hidden />
      )}
      {hasRight && (
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {legal.credit && <span {...visualCopy(legal, 'credit', 'min-h-11 inline-flex items-center')}>{legal.credit}</span>}
          <SocialChips socials={socials} controls={controls} />
          <MicroSignals signals={microSignals} timeZone={timeZone} />
        </div>
      )}
    </div>
  );
}
