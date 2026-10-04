import { useLayoutEffect, useRef, useState } from 'react'

const GLYPHS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const GLYPHS_MIXED = `${GLYPHS_UPPER}abcdefghijklmnopqrstuvwxyz`
const SWEEP_BAND_PX = 90
const GLYPH_EVERY_MS = 45
const DURATION_BASE_S = 0.5
const DURATION_PER_CHAR_S = 1 / 220
const DURATION_CAP_S = 1.4
const STAGGER_RESET_MS = 80
const STAGGER_STEP_S = 0.09
const STAGGER_CAP = 8
const HEIGHT_TOLERANCE_PX = 8
const VIEW_INSET = 0.06
const RESCUE_MS = 4000
const RESCUE_POLL_MS = 500
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'
const SCALE_FLOOR = 0.05

type Phase = 'is-noise' | 'is-band' | 'is-final'

interface Part {
  space: boolean
  text: string
}

interface Geom {
  x: number
  w: number
  text: string
}

let staggerCount = 0
let lastStartMs = 0

function motionReduced() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCE_QUERY).matches
}

function power1InOut(progress: number) {
  if (progress < 0.5) return 2 * progress * progress
  const remaining = 1 - progress
  return 1 - 2 * remaining * remaining
}

function sweepDuration(count: number) {
  return Math.min(DURATION_CAP_S, DURATION_BASE_S + count * DURATION_PER_CHAR_S)
}

function takeDelay() {
  const now = performance.now()
  if (now - lastStartMs > STAGGER_RESET_MS) staggerCount = 0
  lastStartMs = now
  const step = Math.min(staggerCount, STAGGER_CAP)
  staggerCount += 1
  return step * STAGGER_STEP_S
}

function glyphPool(text: string, host: HTMLElement) {
  const letters = text.replace(/[^A-Za-z]/g, '')
  const upper = letters.length > 0 && letters === letters.toUpperCase()
  const transformed = getComputedStyle(host).textTransform === 'uppercase'
  return upper || transformed ? GLYPHS_UPPER : GLYPHS_MIXED
}

function randomGlyph(pool: string) {
  const index = Math.floor(Math.random() * pool.length)
  return pool[index] ?? pool[0] ?? ''
}

function partsOf(text: string): Part[] {
  return [...text].map((char) => ({ space: /\s/.test(char), text: char }))
}

function inView(host: HTMLElement) {
  const rect = host.getBoundingClientRect()
  const limit = window.innerHeight * (1 - VIEW_INSET)
  return rect.width > 0 && rect.bottom > 0 && rect.top < limit
}

function readGeom(host: HTMLElement, els: HTMLSpanElement[]): Geom[] {
  const scale = host.offsetWidth ? host.getBoundingClientRect().width / host.offsetWidth : 1
  const unit = scale > SCALE_FLOOR ? scale : 1
  const base = host.getBoundingClientRect().left
  return els.map((el) => {
    const rect = el.getBoundingClientRect()
    return {
      text: el.dataset.char ?? el.textContent ?? '',
      x: Math.max(0, (rect.left - base) / unit),
      w: rect.width / unit,
    }
  })
}

interface Frame {
  shown: string[]
  phases: Phase[]
  tick: number
}

/** Junca's headline sweep: a band of random glyphs resolves left to right, once. */
export function GlitchHeadline({ className, children }: { className?: string; children: string }) {
  const hostRef = useRef<HTMLHeadingElement>(null)
  const geomRef = useRef<Geom[] | null>(null)
  const poolRef = useRef(GLYPHS_MIXED)
  const frameRef = useRef<Frame | null>(null)
  const [settled, setSettled] = useState(motionReduced)
  const [playing, setPlaying] = useState(false)
  const [widths, setWidths] = useState<number[] | null>(null)
  const [frame, setFrame] = useState<Frame | null>(null)
  const parts = partsOf(children)

  useLayoutEffect(() => {
    if (settled) return
    const host = hostRef.current
    if (!host) return

    const els = [...host.querySelectorAll<HTMLSpanElement>('.scr-char')]
    if (!widths) {
      const before = host.getBoundingClientRect().height
      const measured = els.map((el) => el.getBoundingClientRect().width)
      els.forEach((el, index) => {
        el.style.display = 'inline-block'
        el.style.width = `${measured[index]}px`
        el.style.textAlign = 'center'
      })
      const shifted = Math.abs(host.getBoundingClientRect().height - before) > HEIGHT_TOLERANCE_PX
      if (shifted) {
        els.forEach((el) => {
          el.style.display = ''
          el.style.width = ''
          el.style.textAlign = ''
        })
        setWidths([])
        return
      }
      setWidths(measured)
      return
    }

    if (!geomRef.current) {
      geomRef.current = readGeom(host, els)
      poolRef.current = glyphPool(children, host)
    }

    let frameId = 0
    let started = false
    const begin = () => {
      if (started || !geomRef.current?.length) return
      started = true
      const delayMs = takeDelay() * 1000
      const durationMs = sweepDuration(geomRef.current.length) * 1000
      const start = performance.now()
      const step = (now: number) => {
        const linear = durationMs <= 0 ? 1 : Math.min(1, Math.max(0, (now - start - delayMs) / durationMs))
        const tick = Math.floor(now / GLYPH_EVERY_MS)
        const previous = frameRef.current
        const next = paintAt(geomRef.current ?? [], power1InOut(linear), poolRef.current, tick, previous)
        frameRef.current = next
        setPlaying(true)
        setFrame(next)
        if (linear < 1) {
          frameId = requestAnimationFrame(step)
          return
        }
        setSettled(true)
      }
      frameId = requestAnimationFrame(step)
    }

    const tryStart = () => {
      if (inView(host)) begin()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) tryStart()
      },
      { rootMargin: `0px 0px -${VIEW_INSET * 100}% 0px` },
    )
    observer.observe(host)
    window.addEventListener('scroll', tryStart, { passive: true })
    tryStart()
    let seenAt = 0
    const rescue = window.setInterval(() => {
      if (started) return
      if (!inView(host)) {
        seenAt = 0
        return
      }
      tryStart()
      if (started) return
      if (!seenAt) seenAt = performance.now()
      if (performance.now() - seenAt < RESCUE_MS) return
      setSettled(true)
    }, RESCUE_POLL_MS)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', tryStart)
      window.clearInterval(rescue)
      cancelAnimationFrame(frameId)
    }
  }, [children, settled, widths])

  if (settled) {
    return <h2 className={className}>{children}</h2>
  }

  let glyphIndex = 0
  const hostClass = playing ? `scr-host ${className ?? ''}`.trim() : `scr-host scr-wait ${className ?? ''}`.trim()

  return (
    <h2 ref={hostRef} className={hostClass}>
      <span className="scr-sr">{children}</span>
      {parts.map((part, index) => {
        if (part.space) return part.text
        const current = glyphIndex
        glyphIndex += 1
        const width = widths?.[current]
        const phase = frame?.phases[current] ?? 'is-noise'
        return (
          <span
            key={index}
            className={`scr-char ${phase}`}
            data-char={part.text}
            aria-hidden="true"
            style={width ? { display: 'inline-block', width, textAlign: 'center' } : undefined}
          >
            {frame?.shown[current] ?? part.text}
          </span>
        )
      })}
    </h2>
  )
}

function paintAt(geom: Geom[], progress: number, pool: string, tick: number, previous: Frame | null): Frame {
  const width = Math.max(...geom.map((glyph) => glyph.x + glyph.w), 1)
  const edge = progress * (width + SWEEP_BAND_PX)
  const shown: string[] = []
  const phases: Phase[] = []
  for (let index = 0; index < geom.length; index += 1) {
    const glyph = geom[index]
    if (!glyph) continue
    if (glyph.x + glyph.w <= edge - SWEEP_BAND_PX) {
      phases.push('is-final')
      shown.push(glyph.text)
      continue
    }
    if (edge > 0 && glyph.x < edge) {
      phases.push('is-band')
      const keep = previous?.tick === tick && previous.phases[index] === 'is-band' ? previous.shown[index] : undefined
      shown.push(keep ?? randomGlyph(pool))
      continue
    }
    phases.push('is-noise')
    shown.push(glyph.text)
  }
  return { shown, phases, tick }
}
