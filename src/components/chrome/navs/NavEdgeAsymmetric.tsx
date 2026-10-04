import type { ChromeCta } from '../types';
import { cn } from '@/lib/utils';
import { CONTAINER } from '../contract';
import { NavShell } from '../NavShell';
import { BrandCluster } from '../parts/BrandCluster';
import { NavLinks } from '../parts/NavLinks';
import { ActionCluster } from '../parts/ActionCluster';
import { MobileMenu } from '../parts/MobileMenu';
import { MicroSignals } from '../parts/MicroSignals';
import { PrimaryNav, type NavProps } from './shared';

/**
 * edge-asymmetric: links flush left, a large mark flush right, nothing centred, no bar surface.
 * Embodies Bricx "Beyond Driven 386" and the reversed bar of "Hobbes 356" (photography-led dark
 * heroes). The brand renders as its mark or monogram at h-10 with the wordmark kept for assistive
 * tech only; an optional eyebrow (children) sits in its own thin row above the bar, never inside it.
 */
export function NavEdgeAsymmetric({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, className, children }: NavProps) {
  const outlined: ChromeCta | undefined = cta && { treatment: 'outline', ...cta };
  return (
    <div className={className}>
      {children && <div className={cn(CONTAINER, 'px-4 pt-3 text-xs text-muted-foreground sm:px-6')}>{children}</div>}
      <NavShell surface="transparent" sticky={false}>
        <PrimaryNav>
          <NavLinks links={links} activeHref={activeHref} indicator="underline" />
        </PrimaryNav>
        <MobileMenu links={links} activeHref={activeHref} cta={cta} controls={controls} />
        <div className="flex items-center gap-3">
          <MicroSignals signals={microSignals} className="hidden lg:flex" />
          <ActionCluster cta={outlined} secondary={secondary} controls={controls} divider={false} className="hidden lg:flex" />
          <BrandCluster brand={brand} size="lg" wordmarkClassName="sr-only" />
        </div>
      </NavShell>
    </div>
  );
}
