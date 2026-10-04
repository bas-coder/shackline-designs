import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { columnHeadClass, footerLinkClass, radiusClass } from '../contract';
import { BrandCluster } from '../parts/BrandCluster';
import type { ChromeBrand, ChromeLink, ControlShape, FooterColumn } from '../types';
import { asLinks } from '../normalize';
import { visualCopy } from '../visual-copy';

/**
 * Internal helpers shared by the footer parts: brand block, capped link list with sub-clusters, the
 * demoted arrow link, the capture-form state, and the inverted token field. Not in the public barrel.
 */

const external = (l: ChromeLink) => (l.external ? { target: '_blank', rel: 'noreferrer' } : {});

/** Social glyphs as 44px ghost icon links; square on the control radius, round only for a pill stance. */
export function SocialChips({ socials: rawSocials = [], controls = 'scale', className }: { socials?: ChromeLink[]; controls?: ControlShape; className?: string }) {
  const socials = asLinks(rawSocials);
  if (!socials.length) return null;
  return (
    <ul className={cn('flex flex-wrap items-center gap-1', className)} aria-label="Social">
      {socials.map((s, i) => (
        <li key={`${s.href}-${i}`}>
          <a href={s.href} aria-label={s.label} {...external(s)} className={cn('inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60', radiusClass(controls))}>
            {s.icon ?? <span aria-hidden className="font-mono text-xs font-semibold uppercase">{s.label.trim().charAt(0)}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Slot 1 of most substrates: the mark, the mission clamped to 2 lines, and the social chips. */
export function BrandBlock({ brand, socials, controls, className, children }: { brand: ChromeBrand; socials?: ChromeLink[]; controls?: ControlShape; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('flex flex-col items-start gap-4', className)}>
      {brand.lockup ? (
        <a href={brand.href ?? '/'} aria-label={brand.name} className="inline-flex min-h-11 items-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
          {brand.lockup}
        </a>
      ) : (
        <BrandCluster brand={brand} />
      )}
      {brand.mission && <p {...visualCopy(brand, 'mission', 'max-w-xs text-sm leading-relaxed text-muted-foreground line-clamp-2')}>{brand.mission}</p>}
      {children}
      <SocialChips socials={socials} controls={controls} className="-ml-3" />
    </div>
  );
}

function LinkItem({ link, mono }: { link: ChromeLink; mono?: boolean }) {
  return (
    <a href={link.href} {...external(link)} {...visualCopy(link, 'label', cn(footerLinkClass, 'inline-flex min-h-11 items-center gap-1.5', mono && 'font-mono text-xs uppercase tracking-[0.08em]'))}>
      {link.icon}
      {link.label}
    </a>
  );
}

/**
 * One link column: a quiet small-caps head, at most `cap` visible items, the rest under a native
 * "More" disclosure. A link with children renders as a labelled sub-cluster (a column never grows
 * past 6 items; the category splits instead).
 */
export function LinkList({ column, cap = 6, mono, className }: { column: FooterColumn; cap?: number; mono?: boolean; className?: string }) {
  const all = asLinks(column.links);
  const visible = all.slice(0, cap);
  const rest = all.slice(cap);
  const render = (links: ChromeLink[]) => (
    <ul className="flex flex-col">
      {links.map((l, i) =>
        l.children?.length ? (
          <li key={`${l.href}-${i}`} className="pt-2">
            <span {...visualCopy(l, 'label', cn(columnHeadClass, 'block pb-1 text-[10px] tracking-[0.1em]'))}>{l.label}</span>
            <ul className="flex flex-col">
              {l.children.slice(0, cap).map((c, j) => (
                <li key={`${c.href}-${j}`}>
                  <LinkItem link={c} mono={mono} />
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={`${l.href}-${i}`}>
            <LinkItem link={l} mono={mono} />
          </li>
        )
      )}
    </ul>
  );
  return (
    <nav aria-label={column.heading} className={cn('min-w-0', className)}>
      <h3 {...visualCopy(column, 'heading', cn(columnHeadClass, 'mb-2', mono && 'font-mono'))}>{column.heading}</h3>
      {render(visible)}
      {rest.length > 0 && (
        <details className="group">
          <summary className={cn(footerLinkClass, 'inline-flex min-h-11 cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden')}>
            <span className="group-open:hidden">More</span>
            <span className="hidden group-open:inline">Less</span>
          </summary>
          {render(rest)}
        </details>
      )}
    </nav>
  );
}

/** The demoted second option: a text link with an arrow, never a second filled button. */
export function ArrowLink({ link, className }: { link: ChromeLink; className?: string }) {
  return (
    <a href={link.href} {...external(link)} {...visualCopy(link, 'label', cn('inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60', className))}>
      {link.label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </a>
  );
}

export type CaptureState = 'idle' | 'busy' | 'done' | 'error';

/** Field value plus submit lifecycle for the capture crown and the newsletter row. */
export function useCaptureForm(onSubmit?: (value: string) => void | Promise<void>) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<CaptureState>('idle');
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = value.trim();
    if (!v || state === 'busy') return;
    setState('busy');
    try {
      await onSubmit?.(v);
      setState('done');
    } catch {
      setState('error');
    }
  };
  return { value, setValue, state, submit };
}

/**
 * Swaps the neutral tokens so a dark closing panel keeps every child on theme utilities. Two nested
 * elements, or the swap would be a custom-property cycle. Primary and ring are left alone.
 */
export function InvertedField({ className, children }: { className?: string; children: ReactNode }) {
  const capture = { '--swap-fg': 'var(--color-foreground)', '--swap-bg': 'var(--color-background)' } as CSSProperties;
  const swap = {
    '--color-background': 'var(--swap-fg)',
    '--color-foreground': 'var(--swap-bg)',
    '--color-card': 'color-mix(in oklab, var(--swap-fg) 94%, var(--swap-bg))',
    '--color-card-foreground': 'var(--swap-bg)',
    '--color-muted': 'color-mix(in oklab, var(--swap-fg) 90%, var(--swap-bg))',
    '--color-muted-foreground': 'color-mix(in oklab, var(--swap-bg) 68%, var(--swap-fg))',
    '--color-accent': 'color-mix(in oklab, var(--swap-fg) 88%, var(--swap-bg))',
    '--color-accent-foreground': 'var(--swap-bg)',
    '--color-secondary': 'color-mix(in oklab, var(--swap-fg) 88%, var(--swap-bg))',
    '--color-secondary-foreground': 'var(--swap-bg)',
    '--color-border': 'color-mix(in oklab, var(--swap-bg) 18%, var(--swap-fg))',
    '--color-input': 'color-mix(in oklab, var(--swap-bg) 22%, var(--swap-fg))',
  } as CSSProperties;
  return (
    <div style={capture}>
      <div style={swap} className={cn('text-foreground', className)}>
        {children}
      </div>
    </div>
  );
}
