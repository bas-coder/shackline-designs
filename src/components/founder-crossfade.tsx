import { useEffect, useState } from 'react'
import { FOUNDERS, HERO_FOUNDERS } from '@/lib/content'
import { StudioSection } from '@/components/studio-copy'
import { IntroMask, IntroRise, INTRO_STAGGER } from '@/components/scroll-intro'
import { cn } from '@/lib/utils'

const CYCLE = HERO_FOUNDERS.filter((founder) => Boolean(founder.src))
const HOLD_MS = 3600
const PORTRAIT_SCALE = 1.06

/** Founder portraits sit to the right of the line. Every delivered photo crossfades in the frame. */
export function FounderCrossfade({ id }: { id?: string }) {
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion || CYCLE.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % CYCLE.length)
    }, HOLD_MS)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const active = CYCLE[index] ?? CYCLE[0]

  return (
    <StudioSection id={id} section="founders">
      <div className="sl-founders">
        <div>
          <IntroRise as="p" className="font-sans text-base tracking-[-0.02em] text-foreground">
            {FOUNDERS.eyebrow}
          </IntroRise>
          <IntroMask className="sl-display sl-display-lg mt-6 max-w-[16ch]" delay={INTRO_STAGGER}>
            {FOUNDERS.headline}
          </IntroMask>
          <IntroRise as="p" className="sl-copy mt-6 max-w-[36ch]" index={2}>
            {FOUNDERS.body}
          </IntroRise>
        </div>
        <div className="sl-founder-frame">
          <IntroRise className="absolute inset-0" distance={0} scaleFrom={PORTRAIT_SCALE} delay={INTRO_STAGGER}>
          {CYCLE.map((founder) => {
            if (!founder.src) return null
            const front = founder === active
            return (
              <img
                key={founder.ref}
                src={founder.src}
                alt={front ? FOUNDERS.note : ''}
                data-aiwa-asset={founder.ref}
                crossOrigin="anonymous"
                loading="lazy"
                decoding="async"
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none',
                  front ? 'opacity-100' : 'opacity-0',
                )}
              />
            )
          })}
          </IntroRise>
        </div>
      </div>
    </StudioSection>
  )
}
