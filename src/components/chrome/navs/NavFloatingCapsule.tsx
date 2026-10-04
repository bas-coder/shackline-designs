import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * floating-capsule: a detached glass capsule inset from the top. Embodies the Bricx floating capsule
 * shape of Oyappy, CRA, LTV.ai 350 and Hobbes 356. ONLY the bar and the active-link indicator are
 * rounded-full; the CTA keeps the app's control radius through the controls prop (default 'scale'),
 * so a pill CTA appears only when the whole system is pill. The brand rides at size sm inside the capsule.
 */
export function NavFloatingCapsule({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  return (
    <NavShell surface="floating" className={className}>
      <BrandCluster brand={brand} size="sm" />
      <PrimaryNav>
        <NavLinks links={links} activeHref={activeHref} indicator="pill" />
      </PrimaryNav>
      {children}
      <div className="flex items-center gap-2">
        <MicroSignals signals={microSignals} className="hidden lg:flex" />
        <ActionCluster cta={cta} secondary={secondary} controls={controls} divider={false} className="hidden lg:flex" />
        <MobileMenu links={links} activeHref={activeHref} cta={cta} controls={controls} />
      </div>
    </NavShell>
  );
}
