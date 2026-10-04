import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useQuoteStore } from '@/lib/quote-store'
import { CONTACT, QUOTE_EMAIL, QUOTE_SUBJECT, SMS_DISCLOSURE, SMS_OPT_IN } from '@/lib/content'
import { SplitLead, StudioSection } from '@/components/studio-copy'
import { cn } from '@/lib/utils'

const fieldClass =
  'sl-copy w-full border-0 border-b bg-transparent px-0 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground sl-rule'
const labelClass = 'font-serif text-[1.0625rem] leading-snug text-[var(--color-body)]'

/**
 * Working quote form. Name, email and message still go through the quote
 * store. The email path stays, and the call path only when scheduling is connected.
 */
export function QuoteForm({ id }: { id?: string }) {
  const { status, error, result, scheduling, schedulingLoaded, submit, loadScheduling, reset } =
    useQuoteStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    void loadScheduling()
  }, [loadScheduling])

  const mailto = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(QUOTE_SUBJECT)}`
  const pending = status === 'submitting'
  const succeeded = status === 'success' && result

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pending || succeeded) return
    if (smsOptIn && !phone.trim()) {
      setFormError('Add a phone number to opt in to text messages.')
      return
    }
    setFormError('')
    void submit({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      phone: phone.trim(),
      smsOptIn,
    })
  }

  return (
    <StudioSection id={id} section="contact">
      <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SplitLead title={CONTACT.headline} lede={CONTACT.intro} sticky={false} />
          <p className="sl-copy mt-8 max-w-[36ch]">
            <a href={mailto} className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
              {QUOTE_EMAIL}
            </a>
          </p>
          {schedulingLoaded && scheduling.connected && scheduling.url ? (
            <p className="sl-copy mt-4">
              <a
                href={scheduling.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
              >
                Book a call
              </a>
            </p>
          ) : null}
          <p className="sl-copy mt-8 max-w-[36ch] text-muted-foreground">{CONTACT.closingNote}</p>
        </div>

        <div>
          {succeeded ? (
            <div className="flex flex-col gap-6" role="status">
              <h3 className="sl-display sl-display-md">Your brief is on Maria's desk.</h3>
              <dl className="sl-copy flex flex-col gap-4 border-t sl-rule pt-6">
                <div>
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>{result.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{result.email}</dd>
                </div>
                {result.phone ? (
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>{result.phone}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Brief</dt>
                  <dd className="mt-1 max-w-[60ch]">{result.message}</dd>
                </div>
              </dl>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button asChild className="h-12 rounded-none px-6 font-sans text-base font-medium">
                  <a href={mailto}>Add a line by email</a>
                </Button>
                <button
                  type="button"
                  onClick={reset}
                  className="sl-copy cursor-pointer underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  Send another brief
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
              <div className="flex flex-col gap-1">
                <label htmlFor="quote-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="quote-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={fieldClass}
                  placeholder="Maria Reynel"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="quote-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={fieldClass}
                  placeholder="you@company.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="quote-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className={fieldClass}
                  placeholder="Your phone number"
                />
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{SMS_DISCLOSURE}</p>
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="quote-sms"
                  name="smsOptIn"
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="mt-0.5 size-11 shrink-0 accent-foreground"
                />
                <label htmlFor="quote-sms" className="sl-copy">
                  {SMS_OPT_IN}
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="quote-message" className={labelClass}>
                  Your project
                </label>
                <textarea
                  id="quote-message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  maxLength={2000}
                  className={cn(fieldClass, 'min-h-32 resize-y')}
                  placeholder="What are you launching - what needs printing, building or finding?"
                />
              </div>
              {formError || (status === 'error' && error) ? (
                <p role="alert" className="sl-copy border-l-2 border-primary pl-4 text-foreground">
                  {formError || error}
                </p>
              ) : null}
              <p className="sl-copy">
                <a href="/privacy" className="underline decoration-foreground/30 underline-offset-4">
                  Privacy Policy
                </a>
                {' · '}
                <a href="/terms" className="underline decoration-foreground/30 underline-offset-4">
                  Terms of Service
                </a>
              </p>
              <div className="flex flex-col items-start gap-3">
                <Button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    'h-12 min-h-12 w-full rounded-none px-6 font-sans text-base font-medium min-[480px]:w-auto',
                    pending && 'cursor-wait opacity-80',
                  )}
                >
                  {pending ? 'Sending your brief' : 'Get a custom quote'}
                </Button>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {pending ? 'Saving your request.' : 'Replies come from Maria, personally.'}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </StudioSection>
  )
}
