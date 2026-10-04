import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bell } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { CtaLink } from '../parts/ActionCluster';
import { focusRing } from './shared';
import type { ChromeCta, ControlShape, NavbarMeter, NavbarUser } from '../types';

/**
 * The right cluster of the signed-in bars (product-bar, tab-strip, breadcrumb-context). Embodies
 * Bricx "Manyreach 362" (bell plus avatar), "Camb.ai 427" (a ring credits meter) and the Toolbar Fill
 * Ladder of "Avant Talk 357": ghost squares, then the ONE filled control. Every element is a 44px
 * target; the avatar menu closes on Escape and outside click.
 */

/** A usage meter: a small ring plus "value of max label"; a link when the meter has somewhere to go. */
export function Meter({ meter, className }: { meter: NavbarMeter; className?: string }) {
  const pct = meter.max > 0 ? Math.min(100, Math.max(0, (meter.value / meter.max) * 100)) : 0;
  const r = 7;
  const c = 2 * Math.PI * r;
  const text = `${meter.value} of ${meter.max} ${meter.label}`;
  const body = (
    <>
      <svg viewBox="0 0 18 18" className="h-4 w-4 shrink-0 -rotate-90" aria-hidden>
        <circle cx="9" cy="9" r={r} className="fill-none stroke-border" strokeWidth="2.5" />
        <circle cx="9" cy="9" r={r} className="fill-none stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} />
      </svg>
      <span className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground">{text}</span>
    </>
  );
  const cls = cn('inline-flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors', meter.href && `hover:bg-accent ${focusRing}`, className);
  if (meter.href) {
    return (
      <a href={meter.href} className={cls} aria-label={text}>
        {body}
      </a>
    );
  }
  return (
    <span className={cls} role="meter" aria-valuenow={meter.value} aria-valuemin={0} aria-valuemax={meter.max} aria-label={meter.label}>
      {body}
    </span>
  );
}

/** The notification bell: a 44px ghost square, a plain button the app wires up. */
export function BellButton({ label = 'Notifications', onClick, className }: { label?: string; onClick?: () => void; className?: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn('inline-flex size-11 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-accent hover:text-foreground', focusRing, className)}>
      <Bell className="h-5 w-5" aria-hidden />
    </button>
  );
}

/** A 36px round avatar (image or initials) inside a 44px button, opening the app's menu entries. */
export function AvatarMenu({ user, className }: { user: NavbarUser; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
  const initials =
    user.name
      .split(/\s+/)
      .map((w) => w.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';
  return (
    <div ref={ref} className={cn('relative', className)}>
      <button type="button" aria-label={`Account menu for ${user.name}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={cn('inline-flex size-11 items-center justify-center rounded-full', focusRing)}>
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-9 rounded-full object-cover" /> : <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-accent-foreground">{initials}</span>}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 min-w-56 rounded-xl border border-border bg-card p-2 text-card-foreground shadow-lg">
          <div className="truncate px-3 py-2 text-sm font-medium text-foreground">{user.name}</div>
          {user.menu}
        </div>
      )}
    </div>
  );
}

/** The right cluster of a signed-in bar: meter, subordinate control, the ONE filled CTA, bell, avatar. */
export function UserCluster({ user, meter, cta, secondary, controls = 'scale', className }: { user?: NavbarUser; meter?: NavbarMeter; cta?: ChromeCta; secondary?: ReactNode; controls?: ControlShape; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {meter && <Meter meter={meter} className="hidden md:inline-flex" />}
      {secondary}
      {cta && <CtaLink cta={{ treatment: 'filled', ...cta }} controls={controls} className="hidden sm:inline-flex" />}
      {user && <BellButton />}
      {user && <AvatarMenu user={user} />}
    </div>
  );
}
