import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { MicroSignals } from '../parts/MicroSignals';
import { BreadcrumbChips, type NavProps } from './shared';
import { UserCluster } from './user-cluster';

/**
 * product-bar: signed-in chrome on an anchored surface. Embodies Bricx "Manyreach 362 and 355"
 * (brand plus page title left; bell and avatar right), "Camb.ai 427" (a ring credits meter in the
 * right cluster) and the breadcrumb top bar of "Avant Talk 357". This is the one bar where a saturated
 * brand fill is correct: pass className (for example bg-primary with supports-[backdrop-filter]:bg-primary
 * and text-primary-foreground) to override the default surface. props.cta stays the ONE filled control.
 */
export function NavProductBar({ brand, title, breadcrumbs, cta, secondary, controls = 'scale', microSignals, user, meter, className, children }: NavProps) {
  const hasContext = !!title || !!breadcrumbs?.length;
  return (
    <NavShell surface="anchored" className={className} innerClassName="gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <BrandCluster brand={brand} size="sm" wordmarkClassName={hasContext ? 'hidden sm:inline' : undefined} />
        {hasContext && <span aria-hidden className="h-6 w-px shrink-0 bg-border" />}
        {breadcrumbs?.length ? <BreadcrumbChips crumbs={breadcrumbs} /> : title ? <span className="truncate font-display text-base font-semibold text-foreground">{title}</span> : null}
      </div>
      {children}
      <div className="flex items-center gap-1.5">
        <MicroSignals signals={microSignals} className="hidden md:flex" />
        <UserCluster user={user} meter={meter} cta={cta} secondary={secondary} controls={controls} />
      </div>
    </NavShell>
  );
}
