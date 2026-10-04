import { cn } from '@/lib/utils';
import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { LocalTime, MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * hairline-editorial: mono uppercase tracked links between a thin top rule and a thin bottom rule,
 * a serif wordmark left, a local-time micro-signal right. Embodies the Bricx editorial stance of
 * "Billiam 356", "Webstone" and "Beyond Driven 351" (bold-type, portfolio and editorial pages).
 * The bar carries no filled control unless props.cta is given; the active link shows as a dot.
 */
export function NavHairlineEditorial({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  const rest = microSignals?.filter((s) => s !== 'local-time');
  return (
    <NavShell surface="transparent" className={cn('border-y border-border/70 bg-background', className)}>
      <BrandCluster brand={brand} size="sm" wordmarkClassName="font-serif text-xl font-medium tracking-normal" />
      <PrimaryNav>
        <NavLinks links={links} activeHref={activeHref} indicator="dot" tone="mono" />
      </PrimaryNav>
      {children}
      <div className="flex items-center gap-3">
        <LocalTime className="hidden sm:inline" />
        <MicroSignals signals={rest} className="hidden lg:flex" />
        <ActionCluster cta={cta} secondary={secondary} controls={controls} className="hidden lg:flex" />
        <MobileMenu links={links} activeHref={activeHref} cta={cta} controls={controls} />
      </div>
    </NavShell>
  );
}
