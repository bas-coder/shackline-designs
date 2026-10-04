import type { ReactNode } from 'react'
import { SiteChrome } from '@/components/site-chrome'
import { SMS_PRIVACY_CLAUSE, SMS_SUPPORT_EMAIL, SMS_TERMS_CLAUSE } from '@/lib/content'

function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SiteChrome>
      <article className="sl-wrap" style={{ paddingTop: '8rem' }}>
        <p className="sl-copy">
          <a href="/" className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
            ShackLine Designs
          </a>
        </p>
        <h1 className="sl-display sl-display-lg mt-8 max-w-[16ch]">{title}</h1>
        <div className="mt-10 flex max-w-[68ch] flex-col gap-6">{children}</div>
      </article>
    </SiteChrome>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="sl-copy">
        ShackLine Designs collects the name, email, phone number, and project notes you submit on a quote or contact form so the studio can reply to that request.
      </p>
      <h2 className="sl-display sl-display-sm">SMS Mobile Information Protection</h2>
      <p className="sl-copy">{SMS_PRIVACY_CLAUSE}</p>
      <p className="sl-copy">
        Questions about this policy can be sent to{' '}
        <a href={`mailto:${SMS_SUPPORT_EMAIL}`} className="underline decoration-foreground/30 underline-offset-4">
          {SMS_SUPPORT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  )
}

export function TermsOfService() {
  return (
    <LegalPage title="Terms of Service">
      <p className="sl-copy">
        Quotes, printed goods, websites, and visibility work are agreed with ShackLine Designs in writing. A form submission is a request, not a purchase.
      </p>
      <h2 className="sl-display sl-display-sm">Text Messaging Program Terms</h2>
      <p className="sl-copy">{SMS_TERMS_CLAUSE}</p>
    </LegalPage>
  )
}
