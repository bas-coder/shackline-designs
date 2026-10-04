import type { ReactNode } from 'react';
import { NavShell, type NavShellSurface } from '../NavShell';

/**
 * custom: the bar the design contract composes itself. The author places the clusters inside it
 * (BrandCluster, then NavLinks in PrimaryNav, BreadcrumbChips or UserCluster, then ActionCluster or
 * one CtaLink, and MobileMenu for below lg) so the measured bar rules still hold by construction. It
 * exists so the parity test, the validator and the author name one thing; it renders NavShell.
 */
export function NavCustom({ surface = 'anchored', sticky = true, className, innerClassName, children, ...rest }: { surface?: NavShellSurface; sticky?: boolean; className?: string; innerClassName?: string; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <NavShell surface={surface} sticky={sticky} className={className} innerClassName={innerClassName} data-chrome="nav-custom" {...rest}>
      {children}
    </NavShell>
  );
}
