import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * anchored-hairline: the default marketing bar. Embodies Bricx "Writesonic 411" (hairline bar, logo
 * left, chevron dropdown links, a right cluster of text link, hairline, then the ONE filled control)
 * and the anchored full-width plus hairline shape of Surmount, Manyreach, Gigamind, ZTouch, Appsecure,
 * Pixelflow and Podqi. Below lg it collapses to wordmark plus hamburger; the CTA moves into the sheet.
 */
export function NavAnchoredHairline({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  return (
    <NavShell surface="anchored" className={className}>
      <BrandCluster brand={brand} />
      <PrimaryNav>
        <NavLinks links={links} activeHref={activeHref} indicator="underline" />
      </PrimaryNav>
      {children}
      <div className="flex items-center gap-2">
        <MicroSignals signals={microSignals} className="hidden lg:flex" />
        <ActionCluster cta={cta} secondary={secondary} controls={controls} className="hidden lg:flex" />
        <MobileMenu links={links} activeHref={activeHref} cta={cta} controls={controls} />
      </div>
    </NavShell>
  );
}
