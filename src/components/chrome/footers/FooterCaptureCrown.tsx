import { useId } from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { columnHeadClass, filledCtaClass, radiusClass } from '../contract';
import type { ControlShape, FooterCapture, FooterCrown } from '../types';
import { useCaptureForm } from './bits';

/**
 * The capture crown: the crown's action is a field, not a button. An optional prefix, an h-11
 * transparent input and the ONE filled button sit inside a single enclosing shape (a hairline
 * border on the control radius, the button nested one radius step inside it). Embodies the LTV.ai
 * pill-in-pill email field and the Bookme vanity-handle field. Submit calls onSubmit, then the
 * group is replaced by a done line.
 */
export function FooterCaptureCrown({ capture, crown, controls = 'scale', doneLabel = 'Thank you', className }: { capture: FooterCapture; crown?: Partial<Pick<FooterCrown, 'eyebrow' | 'headline' | 'sub' | 'reassurance'>>; controls?: ControlShape; doneLabel?: string; className?: string }) {
  const id = useId();
  const { value, setValue, state, submit } = useCaptureForm(capture.onSubmit);
  const headline = crown?.headline ?? capture.label ?? capture.buttonLabel;
  const reassurance = crown?.reassurance ?? capture.reassurance;
  const pill = controls === 'pill';
  return (
    <section aria-labelledby={`${id}-heading`} className={cn('relative overflow-hidden rounded-2xl bg-primary/10 px-6 py-14 text-center sm:px-12 sm:py-20', className)}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        {crown?.eyebrow && <p className={columnHeadClass}>{crown.eyebrow}</p>}
        <h2 id={`${id}-heading`} className="text-balance font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-foreground">
          {headline}
        </h2>
        {crown?.sub && <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{crown.sub}</p>}
        {state === 'done' ? (
          <p role="status" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground">
            <Check className="h-4 w-4 text-primary" aria-hidden />
            {doneLabel}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-2 w-full max-w-md" noValidate>
            <label htmlFor={`${id}-field`} className="sr-only">
              {capture.label ?? capture.placeholder}
            </label>
            <div className={cn('flex items-center gap-1 border border-border bg-background p-1 shadow-sm transition-colors focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/30', radiusClass(controls))}>
              {capture.prefix && (
                <span aria-hidden className="select-none whitespace-nowrap pl-3 text-sm text-muted-foreground">
                  {capture.prefix}
                </span>
              )}
              <input
                id={`${id}-field`}
                type={capture.prefix ? 'text' : 'email'}
                autoComplete={capture.prefix ? 'off' : 'email'}
                placeholder={capture.placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={state === 'busy'}
                aria-invalid={state === 'error' || undefined}
                className={cn('h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60', capture.prefix ? 'pl-0 pr-3' : 'px-3')}
              />
              <button
                type="submit"
                disabled={state === 'busy'}
                className={cn(SPLIT_PRIMARY, filledCtaClass(controls), !pill && 'rounded-md', 'shrink-0 shadow-none focus-visible:ring-offset-0 disabled:opacity-70')}
                style={splitPrimaryStyle(filledCtaClass(controls))}
              >
                <SplitPrimaryParts>{capture.buttonLabel}</SplitPrimaryParts>
              </button>
            </div>
            {state === 'error' && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
        {reassurance && state !== 'done' && <p className="text-xs text-muted-foreground">{reassurance}</p>}
      </div>
    </section>
  );
}
