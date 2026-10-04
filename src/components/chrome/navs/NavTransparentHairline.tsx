import type { ChromeCta } from '../types';
import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * transparent-hairline: no surface at all, the hero's atmosphere passes through. Embodies Bricx
 * "Billiam 356 and 359" and the hairline or invisible shape of Webstone and Bricx SoundCore: a small
 * mark left, the link row, and a tight outlined CTA (the bar carries no filled control unless the
 * author asks for one). Not sticky by default; it belongs to the hero it sits on.
 */
export function NavTransparentHairline({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  const outlined: ChromeCta | undefined = cta && { treatment: 'outline', ...cta };
  return (
    <NavShell surface="transparent" sticky={false} className={className}>
      <BrandCluster brand={brand} size="sm" />
      <PrimaryNav>
        <NavLinks links={links} activeHref={activeHref} indicator="underline" />
      </PrimaryNav>
      {children}
      <div className="flex items-center gap-2">
        <MicroSignals signals={microSignals} className="hidden lg:flex" />
        <ActionCluster cta={outlined} secondary={secondary} controls={controls} divider={false} className="hidden lg:flex" />
        <MobileMenu links={links} activeHref={activeHref} cta={cta} controls={controls} />
      </div>
    </NavShell>
  );
}
