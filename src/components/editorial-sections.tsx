import { useEffect, useRef } from 'react'
import phasePlatform from '../assets/roadmap/phase-01-platform.jpg'
import phaseStorefront from '../assets/roadmap/phase-02-storefront.jpg'
import phaseKits from '../assets/roadmap/phase-03-kits.jpg'
import { CONTACT, ECOSYSTEM, FAQ, FOOTER, PILLAR_SECTION, PILLARS, ROADMAP } from '@/lib/content'
import { displayTitle, StudioSection } from '@/components/studio-copy'
import { GlitchHeadline } from '@/components/glitch-headline'

const PHASE_COLORS = ['#260503', '#4B0B06', '#711009'] as const
const PHASE_RULE = 'rgb(255 255 255 / 5%)'
const PHASE_IMAGES = [phasePlatform, phaseStorefront, phaseKits]
const PHASE_STRIP = '4.75rem'
const PHASE_HEADER = 'calc(4 * var(--ef-nav-size))'
const PHASE_TITLE_PAD = '0.75rem'
const PHASE_TITLE_SIZE = 'clamp(1.45rem, 1rem + 1.5vw, 2.35rem)'
const PHASE_TITLE_LEADING = '1.05'
/** Distance from the top of a phase panel to the top of its title, so the copy starts on that line. */
const PHASE_COPY_START = `calc(${PHASE_STRIP} - ${PHASE_TITLE_PAD} - (${PHASE_TITLE_SIZE} * ${PHASE_TITLE_LEADING}))`

/** The three pillars, once. */
export function ManifestoPillars({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="pillars" tone="white">
      <GlitchHeadline className="sl-display sl-display-lg max-w-[16ch]">{PILLAR_SECTION.headline}</GlitchHeadline>

      <div className="mt-16 grid gap-12 border-t sl-rule pt-12 md:mt-20 md:gap-10 md:pt-14 lg:grid-cols-3">
        {PILLARS.filter((pillar) => Boolean(pillar) && pillar.name).map((pillar) => (
          <article key={pillar.id} id={pillar.id === id ? undefined : pillar.id} className="scroll-mt-24">
            <p className="sl-index text-muted-foreground">{pillar.num}</p>
            <h3 className="sl-display sl-display-sm mt-4">{displayTitle(pillar.name)}</h3>
            <p className="sl-copy mt-3">{pillar.title}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {pillar.items.map((item) => (
                <li key={item} className="sl-copy text-muted-foreground">
                  {displayTitle(item)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </StudioSection>
  )
}

/** Three short reasons. The comparison lives in the section above. */
export function EcosystemRows({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="ecosystem">
      <GlitchHeadline className="sl-display sl-display-md max-w-[18ch]">{ECOSYSTEM.headline}</GlitchHeadline>
      <ol className="mt-12 border-t sl-rule">
        {ECOSYSTEM.rows.map((row) => (
          <li
            key={row.label}
            className="grid gap-3 border-b sl-rule py-8 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:items-baseline sm:gap-10 sm:py-9"
          >
            <h3 className="sl-display sl-display-sm">
              <span className="sl-index mr-4 text-muted-foreground">{row.num}</span>
              {displayTitle(row.label)}
            </h3>
            <p className="sl-copy max-w-[46ch]">{row.body}</p>
          </li>
        ))}
      </ol>
    </StudioSection>
  )
}

/** Three phases as a full-bleed sticky stack. Each panel covers the last and leaves its title strip. */
export function RoadmapProgression({ id }: { id?: string }) {
  const phases = (ROADMAP?.phases ?? []).filter((phase) => Boolean(phase) && phase.name)
  const coveredStrips = Math.max(phases.length - 1, 0)

  return (
    <section
      id={id}
      data-section="roadmap"
      className="scroll-mt-[calc(4*var(--ef-nav-size))] bg-transparent text-foreground"
    >
      <div className="sl-wrap !pb-12 md:!pb-16">
        <GlitchHeadline className="sl-display sl-display-lg max-w-[18ch]">{ROADMAP.headline}</GlitchHeadline>
        {ROADMAP.intro ? <p className="sl-copy mt-6 max-w-[36ch]">{ROADMAP.intro}</p> : null}
      </div>
      <ol className="m-0 list-none p-0">
        {phases.map((phase, index) => {
          const color = PHASE_COLORS[index] ?? PHASE_COLORS[PHASE_COLORS.length - 1]
          const image = PHASE_IMAGES[index]
          const top = `calc(${PHASE_HEADER} + ${index} * ${PHASE_STRIP})`
          return (
            <li
              key={phase.num}
              className="sl-phase sticky motion-reduce:static motion-reduce:!min-h-0"
              style={{
                top,
                zIndex: index + 1,
                backgroundColor: color,
                borderTop: `1px solid ${PHASE_RULE}`,
                minHeight: `calc(100svh - ${PHASE_HEADER} - ${coveredStrips} * ${PHASE_STRIP})`,
                ['--phase-strip' as string]: PHASE_STRIP,
                ['--phase-copy-start' as string]: PHASE_COPY_START,
              }}
            >
              <div className="grid items-start lg:grid-cols-2">
                <div
                  className="sl-phase__title sticky z-[2] flex items-end gap-5 px-[clamp(1.25rem,4vw,2.5rem)] motion-reduce:static lg:gap-8"
                  style={{ top, height: PHASE_STRIP, backgroundColor: color, paddingBottom: PHASE_TITLE_PAD }}
                >
                  <span className="sl-index !text-white/70">{phase.num.replace('PHASE ', '')}</span>
                  <h3
                    className="sl-display !text-white"
                    style={{ fontSize: PHASE_TITLE_SIZE, lineHeight: PHASE_TITLE_LEADING }}
                  >
                    {phase.name}
                  </h3>
                </div>
                <div className="px-[clamp(1.25rem,4vw,2.5rem)] pb-12 lg:-mt-[var(--phase-strip)] lg:pt-[calc(var(--phase-strip)+var(--phase-copy-start))] lg:pr-[clamp(1.25rem,4vw,2.5rem)] lg:pl-4">
                  {phase.title ? (
                    <p className="max-w-[36ch] font-sans text-lg font-medium leading-snug text-white">{phase.title}</p>
                  ) : null}
                  <p className="max-w-[42ch] font-sans text-[1.0625rem] leading-relaxed text-white/85">{phase.body}</p>
                  {image ? (
                    <img src={image} alt={phase.name} className="mt-6 aspect-video w-full object-cover" />
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

const FAQ_CLOSE_MS = 700

/** The three supplied questions, in Junca's two-column accordion. One open at a time. */
export function FaqAccordion({ id }: { id?: string }) {
  const listRef = useRef<HTMLDivElement>(null)
  const quote = FOOTER.crown.cta

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = [...list.querySelectorAll<HTMLDetailsElement>('details')]
    const timers = new Set<number>()
    const unbind: Array<() => void> = []

    const close = (item: HTMLDetailsElement) => {
      if (!item.classList.contains('is-open')) {
        item.open = false
        return
      }
      item.classList.remove('is-open')
      const answer = item.querySelector<HTMLElement>('.sl-faq__a')
      if (!answer) {
        item.open = false
        return
      }
      const onEnd = (event: TransitionEvent) => {
        if (event.propertyName !== 'grid-template-rows') return
        answer.removeEventListener('transitionend', onEnd)
        if (!item.classList.contains('is-open')) item.open = false
      }
      answer.addEventListener('transitionend', onEnd)
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        if (!item.classList.contains('is-open')) item.open = false
      }, FAQ_CLOSE_MS)
      timers.add(timer)
    }

    const open = (item: HTMLDetailsElement) => {
      for (const other of items) {
        if (other !== item) close(other)
      }
      item.open = true
      void item.offsetHeight
      item.classList.add('is-open')
    }

    for (const item of items) {
      const summary = item.querySelector('summary')
      if (!summary) continue
      const onClick = (event: Event) => {
        event.preventDefault()
        if (item.classList.contains('is-open')) close(item)
        else open(item)
      }
      summary.addEventListener('click', onClick)
      unbind.push(() => summary.removeEventListener('click', onClick))
    }

    return () => {
      for (const detach of unbind) detach()
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [])

  return (
    <section id={id} data-section="faq" className="sl-faq bg-transparent text-foreground">
      <div className="sl-faq__container">
        <h2 className="sl-display sl-faq__heading">{FAQ.headline}</h2>
        <div className="sl-faq__grid">
          <div className="sl-faq__left">
            <p className="sl-faq__keep">
              <span className="sl-faq__dot" aria-hidden="true" />
              {CONTACT.paths.email.reassurance}
            </p>
            <a href={quote.href} className="sl-secondary">
              {quote.label}
            </a>
          </div>
          <div ref={listRef} className="sl-faq__list">
            {FAQ.items.map((item) => (
              <details key={item.question} className="sl-faq__item">
                <summary className="sl-faq__q">
                  <h3 className="sl-faq__title">{item.question}</h3>
                  <span className="sl-faq__icon" aria-hidden="true" />
                </summary>
                <div className="sl-faq__a">
                  <div className="sl-faq__a-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
