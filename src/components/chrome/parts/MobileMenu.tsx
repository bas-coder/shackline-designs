import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { List, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { filledCtaClass } from '../contract';
import { isActive } from './NavLinks';
import type { ChromeCta, ChromeLink, ControlShape } from '../types';
import { asLinks } from '../normalize';
import { visualCopy } from '../visual-copy';

/**
 * Below lg the bar collapses to wordmark plus a hamburger (a 44px square). The CTA is NOT squeezed
 * into the bar: it is re-expressed full width inside the sheet, exactly as the harvest's responsive
 * boards do. The sheet is a full-width panel under the bar, closed by Escape, a link, or the toggle.
 */
const MENU_LAYER = 60
const MENU_TOP = 'calc(4 * var(--ef-nav-size))'

export function MobileMenu({ links = [], activeHref, cta, controls = 'scale', extra, className, ink }: { links?: ChromeLink[]; activeHref?: string; cta?: ChromeCta; controls?: ControlShape; extra?: ReactNode; className?: string; ink?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const flat = asLinks(links).flatMap((l) => (l.children?.length ? [l, ...l.children] : [l]));
  const sheet = open
    ? createPortal(
        <div
          id="site-menu"
          className="fixed inset-x-0 overflow-y-auto border-b border-border bg-background/95 shadow-lg backdrop-blur"
          style={{
            zIndex: MENU_LAYER,
            top: MENU_TOP,
            maxHeight: `calc(100dvh - ${MENU_TOP})`,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <nav
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 py-4"
            style={{
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
            }}
            aria-label="Mobile"
          >
            {flat.map((link, i) => (
              <a
                key={`${link.href}-${link.label}-${i}`}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link, activeHref) ? 'page' : undefined}
                {...visualCopy(link, 'label', cn('ef-nav-face flex min-h-11 items-center rounded-lg px-3 text-base text-foreground/80 hover:bg-accent hover:text-foreground', link.children && 'text-foreground', !link.children && links.some((l) => l.children?.includes(link)) && 'pl-7 text-sm', isActive(link, activeHref) && 'bg-accent text-foreground'))}
              >
                {link.label}
              </a>
            ))}
            {extra}
            {cta && (
              <a
                href={cta.href}
                onClick={() => setOpen(false)}
                {...visualCopy(cta, 'label', cn(SPLIT_PRIMARY, filledCtaClass(controls), 'mt-3 w-full'))}
                style={splitPrimaryStyle(cn(filledCtaClass(controls), 'mt-3 w-full'))}
              >
                <SplitPrimaryParts>{cta.label}</SplitPrimaryParts>
              </a>
            )}
          </nav>
        </div>,
        document.body,
      )
    : null;
  return (
    <div className={cn('lg:hidden', className)}>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        style={ink ? { color: ink } : undefined}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <List className="h-5 w-5" aria-hidden />}
      </button>
      {sheet}
    </div>
  );
}
