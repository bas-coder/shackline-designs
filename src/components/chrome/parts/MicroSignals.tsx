import { useEffect, useState } from 'react';
import { ArrowUp, Moon, Sun } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useTheme, toggleTheme } from '@/lib/theme';
import type { MicroSignal } from '../types';

/**
 * Living micro-signals: text and one real endpoint, never decoration. HealthPill reads the
 * template's GET /api/health (any 200 is healthy; the template serves it before generated routes
 * mount, so an app must never write its own health handler). LocalTime ticks once a minute.
 */

export function HealthPill({ className, label = 'All systems normal', downLabel = 'Checking' }: { className?: string; label?: string; downLabel?: string }) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    const probe = () =>
      fetch('/api/health', { cache: 'no-store' })
        .then((r) => alive && setOk(r.ok))
        .catch(() => alive && setOk(false));
    probe();
    const id = window.setInterval(probe, 60_000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground', className)} role="status">
      <span aria-hidden className={cn('size-1.5 rounded-full', ok === null ? 'bg-muted-foreground/50' : ok ? 'bg-emerald-500' : 'bg-destructive', ok && 'animate-pulse')} />
      {ok === false ? 'Reconnecting' : ok === null ? downLabel : label}
    </span>
  );
}

export function LocalTime({ className, timeZone, label }: { className?: string; timeZone?: string; label?: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const text = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone });
  return (
    <span className={cn('font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground', className)}>
      {label ? `${label} ` : ''}
      <time dateTime={now.toISOString()}>{text}</time>
    </span>
  );
}

export function BackToTop({ className, label = 'Back to top' }: { className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      className={cn('inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60', className)}
    >
      <ArrowUp className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={cn('inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60', className)}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  );
}

/** Renders the named signals in order; unknown names are ignored so a contract typo never breaks a build. */
export function MicroSignals({ signals = [], className, timeZone }: { signals?: MicroSignal[]; className?: string; timeZone?: string }) {
  if (!signals.length) return null;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {signals.includes('health-status') && <HealthPill />}
      {signals.includes('local-time') && <LocalTime timeZone={timeZone} />}
      {signals.includes('theme-toggle') && <ThemeToggle />}
      {signals.includes('back-to-top') && <BackToTop />}
    </div>
  );
}
