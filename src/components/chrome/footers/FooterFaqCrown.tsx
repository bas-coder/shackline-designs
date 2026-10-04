import { Minus, Plus } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { columnHeadClass } from '../contract';
import type { ControlShape, FooterCrown } from '../types';
import { FooterCtaCrown } from './FooterCtaCrown';

/**
 * The FAQ crown: native details/summary accordion rows (soft radius, a plus that turns into a minus,
 * no dividers, no card wrapper) that flow straight into a CTA crown with no gap, so the answered
 * objection lands on the conversion control. Embodies the Oyappy and Bookme faq-to-cta footers.
 */
export function FooterFaqCrown({ faq, crown, eyebrow = 'FAQ', heading = 'Questions, answered', controls = 'scale', className }: { faq: Array<{ question: string; answer: string }>; crown: FooterCrown; eyebrow?: string; heading?: string; controls?: ControlShape; className?: string }) {
  return (
    <div className={cn('flex flex-col', className)}>
      <section aria-labelledby="footer-faq-heading" className="rounded-t-2xl border border-b-0 border-border bg-card px-4 pb-8 pt-10 sm:px-10 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <p className={columnHeadClass}>{eyebrow}</p>
          <h2 id="footer-faq-heading" className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
          <div className="mt-6 flex flex-col gap-2">
            {faq.map((item, i) => (
              <details key={i} className="group rounded-xl bg-background/60 transition-colors open:bg-background">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span aria-hidden className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <FooterCtaCrown crown={crown} controls={controls} className="rounded-t-none" />
    </div>
  );
}
