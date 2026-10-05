import { useEffect, useState } from 'react'
import { ShacklineLogo } from '@/components/shackline-logo'
import { BRAND_SUFFIX } from '@/lib/content'
import { criticalLeavesImmediately, criticalSnapshot, subscribeCritical } from '@/lib/critical-load'

const FADE_FALLBACK_MS = 560
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

type Phase = 'cover' | 'leaving' | 'gone'

export function LoadCover() {
  const initial = criticalSnapshot()
  const [ratio, setRatio] = useState(initial.progress)
  const [phase, setPhase] = useState<Phase>(initial.complete ? 'gone' : 'cover')

  useEffect(() => {
    return subscribeCritical((next, done) => {
      setRatio(next)
      if (!done) return
      const reduce = window.matchMedia(REDUCE_QUERY).matches
      setPhase((current) => {
        if (current === 'gone') return current
        return reduce || criticalLeavesImmediately() ? 'gone' : 'leaving'
      })
    })
  }, [])

  useEffect(() => {
    if (phase !== 'leaving') return
    const fallback = window.setTimeout(() => setPhase('gone'), FADE_FALLBACK_MS)
    return () => window.clearTimeout(fallback)
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div
      className={phase === 'leaving' ? 'sl-load-cover is-leaving' : 'sl-load-cover'}
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      onTransitionEnd={(event) => {
        if (event.propertyName !== 'opacity') return
        setPhase('gone')
      }}
    >
      <div className="sl-load-cover__lockup">
        <span className="sl-load-cover__mark">
          <ShacklineLogo />
          <span className="ef-designs">
            {BRAND_SUFFIX}
          </span>
        </span>
        <span className="sl-load-cover__track" aria-hidden="true">
          <span className="sl-load-cover__fill" style={{ transform: `scaleX(${ratio})` }} />
        </span>
      </div>
    </div>
  )
}
