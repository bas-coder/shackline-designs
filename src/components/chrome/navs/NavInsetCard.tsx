import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * inset-card: a tinted rounded bar with a hairline border floating inside the page container with
 * gutters. Embodies Bricx "Appsecure 371": brand left, the link row pushed right of centre, the ONE
 * filled CTA far right. The bar radius (rounded-xl, about 0.18 of its height) stays softer than the
 * CTA's control radius relative to their own sizes, never a capsule.
 */
export function NavInsetCard({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  return (
    <NavShell surface="inset" className={className}>
      <BrandCluster brand={brand} />
      <PrimaryNav className="lg:ml-auto">
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
