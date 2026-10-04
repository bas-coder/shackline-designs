import { ArrowRight, ArrowUpRight, Calendar, Envelope } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { MonoEyebrow, RegistrationMark } from '@/components/registration-mark'
import { CALENDLY_URL, CONTACT, QUOTE_EMAIL, QUOTE_SUBJECT } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * The conversion bookend: Get a Custom Quote with two side-by-side paths - 
 * email Maria directly (mailto with a prefilled subject) or book a call.
 * When CALENDLY_URL is empty the booking card renders the Connect Calendly
 * state with a mailto request link; when set, it opens the scheduler in a
 * new tab. The reply promise sits under both paths.
 */
export function QuoteBookend({ id }: { id?: string }) {
  const mailto = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(QUOTE_SUBJECT)}`
  const calendlyRequest = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent('Calendly scheduler request - ShackLine Designs')}`
  const call = CONTACT.paths.call

  return (
    <section
      id={id}
      data-section="contact"
      data-pattern="conversion-bookend"
      className="relative overflow-hidden border-b border-border bg-background"
    >
      <div className="relative ef-section">
        <div className="max-w-[60ch]">
          <MonoEyebrow>{CONTACT.eyebrow}</MonoEyebrow>
          <h2 className="mt-4 ef-heading ef-xl text-foreground">
            {CONTACT.headline}
          </h2>
          <p className="ef-body mt-5 text-foreground">{CONTACT.intro}</p>
        </div>

        {/* the two paths */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* path 01 - email */}
          <article className="relative flex flex-col border border-border bg-card p-6 sm:p-8">
            <MonoEyebrow mark={false} className="text-primary">{CONTACT.paths.email.label}</MonoEyebrow>
            <h3 className="mt-4 ef-heading ef-xs text-foreground">
              {CONTACT.paths.email.title}
            </h3>
            <p className="mt-3 max-w-[46ch] text-base leading-[1.4] text-muted-foreground">{CONTACT.paths.email.body}</p>

            <div className="mt-6 flex items-center gap-3 border border-border bg-background px-4 py-3">
              <Envelope size={16} className="shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate font-mono text-xs tracking-[0.04em] text-foreground">{QUOTE_EMAIL}</span>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-11 min-h-11 rounded-none border-0 px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <a href={mailto}>
                  {CONTACT.paths.email.cta}
                  <ArrowRight size={17} />
                </a>
              </Button>
              <a
                href={mailto}
                className="group inline-flex min-h-11 cursor-pointer items-center gap-2 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <span className="relative">
                  Prefilled subject
                  <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                </span>
                <ArrowUpRight size={14} />
              </a>
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {CONTACT.paths.email.reassurance}
            </p>
          </article>

          {/* path 02 - the call */}
          <article className={cn('relative flex flex-col border bg-card p-6 sm:p-8', CALENDLY_URL ? 'border-border' : 'border-dashed border-primary/40')}>
            <MonoEyebrow mark={false} className="text-primary">{CONTACT.paths.call.label}</MonoEyebrow>

            {CALENDLY_URL ? (
              <>
                <h3 className="mt-4 ef-heading ef-xs text-foreground">
                  {CONTACT.paths.call.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-base leading-[1.4] text-muted-foreground">{CONTACT.paths.call.body}</p>
                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="h-11 min-h-11 rounded-none border border-primary bg-transparent px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                  >
                    <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                      {CONTACT.paths.call.connectedCta}
                      <Calendar size={17} />
                    </a>
                  </Button>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {CONTACT.paths.call.connectedReassurance}
                </p>
              </>
            ) : (
              <>
                <div className="mt-4 flex items-start gap-3">
                  <RegistrationMark size={22} className="mt-1 shrink-0 text-accent" />
                  <div>
                    <h3 className="ef-heading ef-xs text-foreground">
                      {CONTACT.paths.call.fallbackTitle}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-base leading-[1.4] text-muted-foreground">{CONTACT.paths.call.fallbackBody}</p>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="h-11 min-h-11 rounded-none border border-primary bg-transparent px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                  >
                    <a href={calendlyRequest}>
                      {CONTACT.paths.call.fallbackCta}
                      <Envelope size={17} />
                    </a>
                  </Button>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {CONTACT.paths.call.fallbackReassurance}
                </p>
              </>
            )}
          </article>
        </div>

        <p className="mt-8 flex items-center gap-2.5 border-t border-border pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <RegistrationMark size={12} className="text-accent" />
          {CONTACT.closingNote}
        </p>
      </div>
    </section>
  )
}