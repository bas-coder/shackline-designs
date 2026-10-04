import { CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { CONTAINER } from '../contract';
import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { CtaLink } from '../parts/ActionCluster';
import { MicroSignals } from '../parts/MicroSignals';
import { BreadcrumbChips, type NavProps } from './shared';
import { UserCluster } from './user-cluster';

/**
 * breadcrumb-context: a first row of chained chevron chips (Org, Project, View) plus the user cluster,
 * then a second row with the page breadcrumb left and the filter, period and export cluster right.
 * Embodies Bricx "Avant Talk 357", "SpendPro 356" and "Avantpage 350" (deep hierarchies, multi-tenant
 * analytics). Chips may be pill because they are micro-chips; every other control keeps the control
 * radius. props.action on the second row is the ONE filled control, so the first row drops its CTA.
 */
export function NavBreadcrumbContext({ brand, breadcrumbs = [], title, toolbar, action, cta, secondary, controls = 'scale', microSignals, user, meter, className, children }: NavProps) {
  const page = title ?? breadcrumbs[breadcrumbs.length - 1]?.label;
  const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : undefined;
  return (
    <div className={cn('sticky top-0 z-40', className)}>
      <NavShell surface="anchored" sticky={false} className="border-b-0" innerClassName="gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <BrandCluster brand={brand} size="sm" wordmarkClassName="hidden sm:inline" />
          {breadcrumbs.length > 0 && <span aria-hidden className="hidden h-6 w-px shrink-0 bg-border sm:block" />}
          {breadcrumbs.length > 0 && <BreadcrumbChips crumbs={breadcrumbs} className="hidden sm:block" />}
        </div>
        <div className="flex items-center gap-1.5">
          <MicroSignals signals={microSignals} className="hidden md:flex" />
          <UserCluster user={user} meter={meter} cta={action ? undefined : cta} secondary={secondary} controls={controls} />
        </div>
      </NavShell>
      <div className="border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className={cn(CONTAINER, 'flex min-h-14 items-center justify-between gap-3 px-4 py-1.5 sm:px-6')}>
          <div className="flex min-w-0 items-center gap-2">
            {parent && (
              <a href={parent.href} className="hidden min-h-11 items-center truncate text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex">
                {parent.label}
              </a>
            )}
            {parent && <CaretRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/70 md:block" aria-hidden />}
            {page && <span className="truncate font-display text-base font-semibold text-foreground">{page}</span>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {toolbar}
            {children}
            {action && <CtaLink cta={{ treatment: 'filled', ...action }} controls={controls} />}
          </div>
        </div>
      </div>
    </div>
  );
}
