import type { ChromeCta } from '../types';
import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * split-centre: links left, the wordmark dead centre, one CTA right, on a transparent surface.
 * Embodies Bricx "Beyond Driven 351" and the centred-logo shape of Metricbooks and Surmount 366.
 * The brand is absolutely centred on lg (a larger wordmark) and returns to the left on phones,
 * where the bar is wordmark plus hamburger. The CTA is outlined by default.
 */
export function NavSplitCentre({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  const outlined: ChromeCta | undefined = cta && { treatment: 'outline', ...cta };
  return (
    <NavShell surface="transparent" className={className} innerClassName="relative">
      <BrandCluster brand={brand} wordmarkClassName="text-lg" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2" />
      <PrimaryNav>
        <NavLinks links={links} activeHref={activeHref} indicator="underline" />
      </PrimaryNav>
      <div className="flex items-center gap-2">
        {children}
        <MicroSignals signals={microSignals} className="hidden lg:flex" />
        <ActionCluster cta={outlined} secondary={secondary} controls={controls} className="hidden lg:flex" />
        <MobileMenu links={links} activeHref={activeHref} cta={cta} controls={controls} />
      </div>
    </NavShell>
  );
}
