import { useState } from 'react';
import { X } from '@phosphor-icons/react';
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
 * announcement-stack: a dismissible full-bleed strip in the accent above a transparent bar. Embodies
 * Bricx "Appsecure 360" (strip about half the bar's height with a dismiss) and the Scale.jobs
 * announcement modifier. Dismissal is remembered in localStorage under announcement.storageKey; the
 * strip is the only accent surface, so the bar's CTA stays the ONE filled control of the bar itself.
 */
const DEFAULT_KEY = 'aiwa.chrome.announcement';

function readDismissed(key: string): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function NavAnnouncementStack({ brand, links = [], activeHref, cta, secondary, controls = 'scale', microSignals, announcement, className, children }: NavProps) {
  const key = announcement?.storageKey ?? DEFAULT_KEY;
  const [dismissed, setDismissed] = useState(() => readDismissed(key));
  const dismissible = announcement?.dismissible !== false;
  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(key, '1');
    } catch {
      /* storage unavailable: the strip still closes for this view */
    }
  };
  return (
    <div className={className}>
      {announcement && !dismissed && (
        <div role="region" aria-label="Announcement" className="w-full bg-primary text-primary-foreground">
          <div className={cn(CONTAINER, 'flex min-h-11 items-center justify-center gap-2 px-4 sm:px-6')}>
            {dismissible && <span aria-hidden className="hidden size-11 shrink-0 sm:block" />}
            <p className="min-w-0 flex-1 truncate text-center text-sm font-medium">
              {announcement.href ? (
                <a href={announcement.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60">
                  {announcement.text}
                </a>
              ) : (
                announcement.text
              )}
            </p>
            {dismissible && (
              <button type="button" aria-label="Dismiss announcement" onClick={dismiss} className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60">
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}
      <NavShell surface="transparent">
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
    </div>
  );
}
