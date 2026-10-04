import { X } from '@phosphor-icons/react';
import { StaggerReveal } from '@/components/fx';
import type { AuthVariantManifest, AuthVariantProps } from './types';

/**
 * Gate-on-Intent (harvest T5): the sign-in is a modal over a dimmed, blurred stand-in of the app's
 * landing page (a nav block, a headline block, two card blocks in muted grey) so it reads as an
 * overlay rather than a page. The 420px modal carries the mark and title, a 44px close control that
 * points at '/', the form and a two-line legal note. On phones it becomes a bottom sheet with a
 * grab handle. Embodies Camb.ai 387 (desktop) and Bhagavad Gita 364 (mobile sheet) from the Bricx
 * harvest (structure and taste only).
 */
export const manifest: AuthVariantManifest = {
  name: 'gate-on-intent',
  label: 'Gate-on-intent modal',
  mood: ['sales', 'commercial', 'conversion', 'saas', 'b2b'],
  atmosphere: 'none',
  borderEffect: 'none',
  flush: false,
  whenToUse: 'apps with a landing page where signup is a conversion event',
  avoidWhen: 'the app is auth-walled from the first route; there is nothing behind the modal',
};

const BLOCK = 'rounded-md bg-muted-foreground/25';

export function Variant({ title, subtitle, logoUrl, tagline, highlights, form }: AuthVariantProps) {
  const points = (highlights ?? []).filter((h) => typeof h === 'string' && h.trim()).slice(0, 3);
  const monogram = title.trim().charAt(0).toUpperCase() || 'A';
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* The stand-in landing page: muted blocks, blurred and dimmed. Decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none opacity-40 blur-sm">
        <div className="mx-auto max-w-6xl space-y-16 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className={`${BLOCK} h-8 w-28`} />
            <div className="hidden gap-4 sm:flex">
              <div className={`${BLOCK} h-3 w-14`} />
              <div className={`${BLOCK} h-3 w-14`} />
              <div className={`${BLOCK} h-3 w-14`} />
            </div>
            <div className={`${BLOCK} h-9 w-24`} />
          </div>
          <div className="mx-auto max-w-2xl space-y-4 pt-8">
            <div className={`${BLOCK} mx-auto h-10 w-3/4`} />
            <div className={`${BLOCK} mx-auto h-10 w-1/2`} />
            <div className={`${BLOCK} mx-auto h-4 w-2/3 opacity-60`} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-56 rounded-2xl bg-muted-foreground/15" />
            <div className="h-56 rounded-2xl bg-muted-foreground/15" />
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-foreground/10" />

      {/* The modal: centred on sm and up, a bottom sheet on phones. */}
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-on-intent-title"
          className="relative max-h-dvh w-full max-w-[420px] overflow-y-auto rounded-t-2xl border border-border bg-card p-6 pt-3 shadow-xl sm:rounded-2xl sm:p-8"
        >
          <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/40 sm:hidden" />
          <a
            href="/"
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-5 w-5" />
          </a>
          <StaggerReveal className="space-y-6">
            <div className="flex items-center gap-3 pr-12">
              <a href="/" aria-label={`${title} home`} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
                {logoUrl ? (
                  <img src={logoUrl} crossOrigin="anonymous" alt={`${title} logo`} className="h-10 w-10 shrink-0 rounded-lg object-contain" />
                ) : (
                  <div aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary font-display text-lg font-semibold text-primary-foreground">
                    {monogram}
                  </div>
                )}
              </a>
              <div className="min-w-0">
                <h1 id="gate-on-intent-title" className="text-balance font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
                {tagline && <p className="pt-1 text-sm text-foreground/80">{tagline}</p>}
              </div>
            </div>
            {form}
            {points.length > 0 && (
              <ul className="space-y-1.5 text-sm text-muted-foreground" aria-label="Highlights">
                {points.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-center text-xs leading-relaxed text-muted-foreground/80">
              By continuing you agree to this app's terms and privacy policy.
              <br />
              Secure sign-in with Google or email. Your data stays in your account.
            </p>
          </StaggerReveal>
        </div>
      </div>
    </div>
  );
}
