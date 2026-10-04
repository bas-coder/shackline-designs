import { useId } from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { filledCtaClass, outlineCtaClass } from '../contract';
import type { ControlShape, FooterCapture } from '../types';
import { useCaptureForm } from './bits';

/**
 * The newsletter row: a prompt line, an input and an adjacent button on ONE radius (a utility control,
 * so one step tighter than the marketing CTA unless the whole system is pill), consent micro-copy,
 * a done state after submit. Embodies the Performance Partners, Appsecure and Camb.ai newsletter
 * splits; the mismatched input-and-pill row they warn against cannot happen here. `tone="outline"`
 * steps the button down to a hairline outline when a crown already carries the footer's one filled action.
 */
export function FooterNewsletter({ newsletter, heading, controls = 'scale', tone = 'filled', doneLabel = 'Thank you, you are on the list.', className }: { newsletter: FooterCapture; heading?: string; controls?: ControlShape; tone?: 'filled' | 'outline'; doneLabel?: string; className?: string }) {
  const id = useId();
  const { value, setValue, state, submit } = useCaptureForm(newsletter.onSubmit);
  const radius = controls === 'pill' ? 'rounded-full' : 'rounded-md';
  const prompt = heading ?? newsletter.label ?? 'Newsletter';
  return (
    <div className={cn('flex w-full max-w-md flex-col gap-3', className)}>
      <p className="text-sm font-medium text-foreground">{prompt}</p>
      {state === 'done' ? (
        <p role="status" className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground">
          <Check className="h-4 w-4 text-primary" aria-hidden />
          {doneLabel}
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" noValidate>
          <label htmlFor={`${id}-email`} className="sr-only">
            {newsletter.label ?? newsletter.placeholder}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={newsletter.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={state === 'busy'}
            aria-invalid={state === 'error' || undefined}
            className={cn('h-11 min-w-0 flex-1 border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-60', radius)}
          />
          <button
            type="submit"
            disabled={state === 'busy'}
            className={cn(tone === 'outline' ? outlineCtaClass(controls) : cn(SPLIT_PRIMARY, filledCtaClass(controls)), radius, 'shrink-0 disabled:opacity-70')}
            style={tone === 'filled' ? splitPrimaryStyle(filledCtaClass(controls)) : undefined}
          >
            {tone === 'filled' ? <SplitPrimaryParts>{newsletter.buttonLabel}</SplitPrimaryParts> : newsletter.buttonLabel}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p role="alert" className="text-xs text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
      {newsletter.reassurance && state !== 'done' && <p className="text-xs leading-relaxed text-muted-foreground">{newsletter.reassurance}</p>}
    </div>
  );
}
