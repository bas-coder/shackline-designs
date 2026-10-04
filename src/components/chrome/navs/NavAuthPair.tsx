import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { CtaLink } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import type { NavProps } from './shared';

/**
 * auth-pair: brand left; right side exactly two equal-height controls and no link row. Embodies
 * Bricx "Bookme 362" (single-action products: sign-up funnels, link-in-bio, waitlists). props.cta is
 * the ONE filled control; props.secondaryCta is a hairline outline (no fill, so the bar keeps exactly
 * one filled control in both schemes) at the same h-11. Below lg both controls re-express full width inside the sheet.
 */
export function NavAuthPair({ brand, cta, secondaryCta, controls = 'scale', microSignals, className, children }: NavProps) {
  const secondary = (extra?: string) => secondaryCta && <CtaLink cta={{ ...secondaryCta, treatment: 'outline' }} controls={controls} className={extra} />;
  return (
    <NavShell surface="anchored" className={className}>
      <BrandCluster brand={brand} />
      <div className="flex items-center gap-2">
        {children}
        <MicroSignals signals={microSignals} className="hidden lg:flex" />
        <div className="hidden items-center gap-2 lg:flex">
          {secondary()}
          {cta && <CtaLink cta={{ treatment: 'filled', ...cta }} controls={controls} />}
        </div>
        <MobileMenu cta={cta} controls={controls} extra={secondary('mt-2 w-full')} />
      </div>
    </NavShell>
  );
}
