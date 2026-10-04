import { useEffect, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { activeLinkClass, linkClass } from '../contract';
import type { ChromeLink } from '../types';
import { asLinks } from '../normalize';
import { visualCopy } from '../visual-copy';

export function isActive(link: ChromeLink, activeHref?: string): boolean {
  if (!activeHref) return false;
  if (link.href === activeHref) return true;
  if (link.href !== '/' && !link.href.startsWith('#') && activeHref.startsWith(link.href)) return true;
  return !!link.children?.some((c) => isActive(c, activeHref));
}

/**
 * The nav cluster: 3 to 6 links at 44px targets with a visible active state. A link with children
 * opens a dropdown panel on hover, focus or click (Escape and outside click close it). The active
 * indicator is an underline rule by default; 'pill' draws a filled capsule behind the active link
 * (pill and mixed stances), 'dot' a small dot beneath (editorial bars).
 */
export function NavLinks({ links, activeHref, indicator = 'underline', tone = 'default', className }: { links: ChromeLink[]; activeHref?: string; indicator?: 'underline' | 'pill' | 'dot' | 'none'; tone?: 'default' | 'mono'; className?: string }) {
  return (
    <ul className={cn('hidden items-center gap-1 lg:flex', className)} role="list">
      {asLinks(links).map((link, i) => (
        <li key={`${link.href}-${link.label}-${i}`} className="relative">
          {link.children?.length ? (
            <Dropdown link={link} activeHref={activeHref} indicator={indicator} tone={tone} />
          ) : (
            <NavLink link={link} active={isActive(link, activeHref)} indicator={indicator} tone={tone} />
          )}
        </li>
      ))}
    </ul>
  );
}

function NavLink({ link, active, indicator, tone, ...rest }: { link: ChromeLink; active: boolean; indicator: 'underline' | 'pill' | 'dot' | 'none'; tone: 'default' | 'mono' } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={link.href}
      aria-current={active ? 'page' : undefined}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer' : undefined}
      {...visualCopy(link, 'label', cn(
        linkClass,
        'relative',
        tone === 'mono' && 'font-mono text-xs uppercase tracking-[0.14em]',
        active && activeLinkClass,
        active && indicator === 'pill' && 'rounded-full bg-accent text-accent-foreground',
        active && indicator === 'underline' && 'after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary',
        active && indicator === 'dot' && 'after:absolute after:left-1/2 after:top-full after:h-1 after:w-1 after:-translate-x-1/2 after:-translate-y-1.5 after:rounded-full after:bg-primary'
      ))}
      {...rest}
    >
      {link.icon}
      {link.label}
    </a>
  );
}

function Dropdown({ link, activeHref, indicator, tone }: { link: ChromeLink; activeHref?: string; indicator: 'underline' | 'pill' | 'dot' | 'none'; tone: 'default' | 'mono' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isActive(link, activeHref);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        {...visualCopy(link, 'label', cn(linkClass, tone === 'mono' && 'font-mono text-xs uppercase tracking-[0.14em]', active && activeLinkClass, active && indicator === 'pill' && 'rounded-full bg-accent text-accent-foreground'))}
      >
        {link.label}
        <CaretDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 mt-2 min-w-64 rounded-xl border border-border bg-card p-2 text-card-foreground shadow-lg">
          {link.children!.map((child, i) => (
            <a key={`${child.href}-${i}`} href={child.href} role="menuitem" className={cn('flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60', isActive(child, activeHref) && 'bg-accent')}>
              {child.icon && <span className="mt-0.5 shrink-0 text-primary">{child.icon}</span>}
              <span className="min-w-0">
                <span {...visualCopy(child, 'label', 'block text-sm font-medium text-foreground')}>{child.label}</span>
                {child.description && <span {...visualCopy(child, 'description', 'block text-xs leading-relaxed text-muted-foreground')}>{child.description}</span>}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
