import { cn } from '@/lib/utils';
import { footerLinkClass } from '../contract';
import { BrandCluster } from '../parts/BrandCluster';
import type { ChromeBrand, ChromeLink, ControlShape, FooterLegal } from '../types';
import { asLinks } from '../normalize';
import { SocialChips } from './bits';

/**
 * The minimal bar: one product-style row, logo chip left, social glyphs centre, legal links right.
 * With `links` (the compact-pro style) the inline nav takes the centre and the socials join the
 * right slot. Embodies the Hobbes app-bar footer and the Loopback single-row footer.
 */
export function FooterMinimalBar({ brand, links = [], socials, legal, controls = 'scale', className }: { brand: ChromeBrand; links?: ChromeLink[]; socials?: ChromeLink[]; legal?: FooterLegal; controls?: ControlShape; className?: string }) {
  const navLinks = asLinks(links);
  const legalLinks = asLinks(legal?.links);
  const hasNav = navLinks.length > 0;
  const linkCls = cn(footerLinkClass, 'inline-flex min-h-11 items-center px-2');
  return (
    <div className={cn('flex flex-col items-center gap-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6', className)}>
      <BrandCluster brand={brand} size="sm" className="shrink-0" />
      {hasNav ? (
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-1">
          {navLinks.slice(0, 6).map((l, i) => (
            <a key={`${l.href}-${i}`} href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})} className={linkCls}>
              {l.label}
            </a>
          ))}
        </nav>
      ) : (
        <SocialChips socials={socials} controls={controls} />
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-1 sm:justify-end">
        {hasNav && <SocialChips socials={socials} controls={controls} className="sm:mr-2" />}
        {legalLinks.length ? (
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-1">
            {legalLinks.map((l, i) => (
              <a key={`${l.href}-${i}`} href={l.href} className={cn(linkCls, 'text-xs')}>
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}
        {legal && !hasNav && <span className="px-2 text-xs text-muted-foreground">{legal.copyright}</span>}
      </div>
    </div>
  );
}
