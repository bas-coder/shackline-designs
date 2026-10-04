import { cn } from '@/lib/utils';
import { LocalTime } from '../parts/MicroSignals';
import type { ChromeBrand, FooterColumn } from '../types';
import { LinkList } from './bits';

/**
 * The editorial card: a bordered card with hairline rules and no fills, a masthead wordmark in the
 * serif face, a one-line colophon, 2 to 3 short link lists set in mono small-caps, and an issue or
 * date micro-signal with the live local time. No Bricx footer is a broadsheet; this carries the
 * harvest's hairline-not-fill rule (the BTR and Podqi stat cells, 22 of 27 legal bars) and its quiet
 * tracked heads into an editorial register.
 */
export function FooterEditorialCard({ brand, columns = [], colophon, issueLabel = 'Edition', timeZone, className }: { brand: ChromeBrand; columns?: FooterColumn[]; colophon?: string; issueLabel?: string; timeZone?: string; className?: string }) {
  const today = new Date();
  const dateText = today.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric', timeZone });
  return (
    <div className={cn('rounded-xl border border-border px-6 py-8 sm:px-10 sm:py-10', className)}>
      <div className="flex flex-col gap-4 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <a href={brand.href ?? '/'} className="inline-flex min-h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
            <span className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">{brand.name}</span>
          </a>
          {(colophon ?? brand.mission) && <p className="mt-2 max-w-xl text-sm italic leading-relaxed text-muted-foreground">{colophon ?? brand.mission}</p>}
        </div>
        <p className="flex flex-col items-start gap-1 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground sm:items-end">
          <span>
            {issueLabel} <time dateTime={today.toISOString().slice(0, 10)}>{dateText}</time>
          </span>
          <LocalTime timeZone={timeZone} />
        </p>
      </div>
      {columns.length > 0 && (
        <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-3">
          {columns.slice(0, 3).map((c) => (
            <LinkList key={c.heading} column={c} mono />
          ))}
        </div>
      )}
    </div>
  );
}
