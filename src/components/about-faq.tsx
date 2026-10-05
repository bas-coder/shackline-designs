import { useState } from 'react'
import { ABOUT, FAQ } from '@/lib/content'
import { StudioSection } from '@/components/studio-copy'
import { GlitchHeadline } from '@/components/glitch-headline'
import { IntroRise, INTRO_STAGGER } from '@/components/scroll-intro'
import { cn } from '@/lib/utils'

/** The company description, set as a reading column. */
export function AboutBand({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="about" tone="white">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <GlitchHeadline className="sl-display sl-display-lg lg:col-span-5">{ABOUT.headline}</GlitchHeadline>
        <div className="flex max-w-[58ch] flex-col gap-5 lg:col-span-7 lg:pt-3">
          {ABOUT.paragraphs.map((paragraph, index) => (
            <IntroRise key={paragraph} as="p" className="sl-copy" delay={INTRO_STAGGER} index={index}>
              {paragraph}
            </IntroRise>
          ))}
        </div>
      </div>
    </StudioSection>
  )
}

export function FaqRows({ id }: { id?: string }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <StudioSection id={id} section="faq">
      <h2 className="sl-display sl-display-lg max-w-[12ch]">{FAQ.headline}</h2>
      <div className="mt-12 border-t sl-rule">
        {FAQ.items.map((item, index) => {
          const isOpen = open === index
          return (
            <div key={item.question} className="border-b sl-rule">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-rows-panel-${index}`}
                  id={`faq-rows-button-${index}`}
                  className="flex w-full cursor-pointer items-baseline gap-4 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-8"
                >
                  <span className="sl-index text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span className="sl-display sl-display-sm flex-1">{item.question}</span>
                  <span aria-hidden="true" className="sl-index text-muted-foreground">
                    {isOpen ? '–' : '+'}
                  </span>
                </button>
              </h3>
              <div
                id={`faq-rows-panel-${index}`}
                role="region"
                aria-labelledby={`faq-rows-button-${index}`}
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <p className="sl-copy max-w-[62ch] pb-7 pl-12 sm:pl-16">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </StudioSection>
  )
}
