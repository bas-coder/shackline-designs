# AIWA migration

This document is an executable build instruction. AIWA Build mode must apply it. The current Cursor website is the source of truth for look, copy, and behavior. The AIWA project is the source of truth for platform architecture.

Do not redesign anything. Do not replace the chrome kit, fx kit, auth kit, or server runtime except for the files named below.

## SECTION 1 — SUMMARY

The finished site is the same AIWA app with a rebuilt lander. The change is large in the page itself and small in the platform.

Migrate these areas:

- Home section order, copy, hero, founder portrait, roadmap, FAQ, work, merch, quote form, and legal pages.
- Paper page ground, white secondary buttons, dark footer, and the red two-slab primary.
- New lander components and two SVG assets.
- The quote route, replaced with its current source. Endpoints and environment names stay the same.

Do not migrate the rest of the template. These original files are already correct and must not be replaced: src/lib/api.ts, src/components/ui/grid.tsx, src/components/ui/mini-button.tsx, server/db/schema.ts, server/db/schema.sql.

## SECTION 2 — FILES TO ADD

Create every file below at the exact path. Create parent directories if they are missing. Write the complete contents. Do not shorten them.

CREATE:
src/routes/legal.tsx

Why: Privacy and Terms pages. The footer already links to /privacy and /terms.

```tsx
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
```


CREATE:
src/components/studio-copy.tsx

Why: Shared section shell, display titles, and the split lead used after the hero.

```tsx
import type { ReactNode } from 'react'
import { GlitchHeadline } from '@/components/glitch-headline'

const ACRONYMS = new Set(['seo', 'roi', 'usa', 'faq', 'ai'])

/** ALL-CAPS labels become a sentence. Short acronyms stay uppercase. Mixed-case copy is left alone. */
export function displayTitle(value: string) {
  const letters = value.replace(/[^A-Za-z]/g, '')
  const shouting = letters.length > 0 && letters === letters.toUpperCase()
  if (!shouting) return value
  return value
    .toLowerCase()
    .split(/(\s+)/)
    .map((word, index) => {
      const bare = word.replace(/[^a-z]/g, '')
      if (ACRONYMS.has(bare)) return word.replace(bare, bare.toUpperCase())
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1)
      return word
    })
    .join('')
}

export function StudioSection({
  id,
  section,
  tone = 'paper',
  children,
}: {
  id?: string
  section: string
  tone?: 'paper' | 'white'
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-section={section}
      data-tone={tone}
      className="bg-transparent text-foreground"
    >
      <div className="sl-wrap">{children}</div>
    </section>
  )
}

/** Junca's "Why work with us": a sticky headline and a short lede. */
export function SplitLead({ title, lede, sticky = true }: { title: string; lede?: string; sticky?: boolean }) {
  return (
    <div className={sticky ? 'lg:sticky lg:top-28 lg:max-w-[26rem]' : 'lg:max-w-[26rem]'}>
      <GlitchHeadline className="sl-display sl-display-lg">{displayTitle(title)}</GlitchHeadline>
      {lede ? <p className="sl-copy mt-6 max-w-[36ch]">{lede}</p> : null}
    </div>
  )
}

export interface Reason {
  num: string
  title: string
  body: string
  note?: string
}

export function ReasonList({ reasons }: { reasons: Reason[] }) {
  return (
    <ol className="border-t sl-rule">
      {reasons.map((reason) => (
        <li
          key={`${reason.num}-${reason.title}`}
          className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b sl-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
        >
          <span className="sl-index pt-1 text-muted-foreground">{reason.num}</span>
          <div>
            <h3 className="sl-display sl-display-sm">{displayTitle(reason.title)}</h3>
            {reason.note ? <p className="sl-copy mt-3 max-w-[46ch]">{reason.note}</p> : null}
            <p className={reason.note ? 'sl-copy mt-2 max-w-[46ch]' : 'sl-copy mt-3 max-w-[46ch]'}>
              {reason.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
```


CREATE:
src/components/glitch-headline.tsx

Why: The headline sweep used by the lander sections.

```tsx
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
```


CREATE:
src/components/shackline-logo.tsx

Why: Header and footer wordmark. Ink follows the surface color.

```tsx
import logoRaw from '../../others/SHACKLINE_LOGO.svg?raw'

/**
 * Header wordmark. Black fills become the current text color so the mark
 * stays readable on the dark hero; the brand red stays as drawn.
 * Width is 10em of the Extrafazant nav root, height follows the viewBox.
 */
const LOGO_MARKUP = logoRaw
  .replace(/<svg\b([^>]*)>/, (_match, attrs: string) => {
    const cleaned = attrs.replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '')
    return `<svg${cleaned} class="ef-logo" aria-hidden="true" focusable="false">`
  })
  .replace(/fill="black"/g, 'fill="currentColor"')

export function ShacklineLogo() {
  return <span className="inline-flex items-center" dangerouslySetInnerHTML={{ __html: LOGO_MARKUP }} />
}
```


CREATE:
src/components/split-primary.tsx

Why: The red two-slab primary button.

```tsx
import type { CSSProperties, ReactNode } from 'react'

/** Extrafazant button-052, at whatever size the host button already uses. */
export const SPLIT_PRIMARY = 'ef-primary'

const PAD_DEFAULT = '1rem'
const PAD_WIDE = '1.5rem'
const PAD_ROOMY = '2rem'
const PAD_SNUG = '1.25rem'
const PAD_TIGHT = '0.75rem'
const HEIGHT_DEFAULT = '2.25rem'
const HEIGHT_SM = '2rem'
const HEIGHT_LG = '2.5rem'
const HEIGHT_11 = '2.75rem'
const HEIGHT_12 = '3rem'

const PAD_TOKENS: { token: string; value: string }[] = [
  { token: 'px-8', value: PAD_ROOMY },
  { token: 'px-6', value: PAD_WIDE },
  { token: 'px-5', value: PAD_SNUG },
  { token: 'px-3', value: PAD_TIGHT },
]

const HEIGHT_TOKENS: { token: string; value: string }[] = [
  { token: 'h-12', value: HEIGHT_12 },
  { token: 'h-11', value: HEIGHT_11 },
  { token: 'h-10', value: HEIGHT_LG },
  { token: 'h-9', value: HEIGHT_DEFAULT },
  { token: 'h-8', value: HEIGHT_SM },
]

const ARROW_PATH =
  'M5.70413 12.9355L7.98926 9.94463L10.3669 6.89587L12.2298 7.74049L0 7.74049L0 5.19504L12.2298 5.19504L10.3669 6.03967L7.98926 2.99091L5.70413 0L9.04793 0L14 6.46777L9.04793 12.9355H5.70413Z'

function hasToken(className: string | undefined, token: string) {
  if (!className) return false
  return new RegExp(`(?:^|\\s)${token}(?:\\s|$)`).test(className)
}

/** Outline controls pass `bg-transparent` over the default red variant. Those stay outline. */
export function isSplitPrimary(className?: string, size?: string | null) {
  if (size === 'icon') return false
  if (hasToken(className, 'bg-transparent')) return false
  return true
}

export function splitPrimaryStyle(className?: string, size?: string | null): CSSProperties {
  const pad = PAD_TOKENS.find(({ token }) => hasToken(className, token))?.value ?? PAD_DEFAULT
  const fromClass = HEIGHT_TOKENS.find(({ token }) => hasToken(className, token))?.value
  const fromSize = size === 'sm' ? HEIGHT_SM : size === 'lg' ? HEIGHT_LG : HEIGHT_DEFAULT
  return {
    '--ef-primary-pad': pad,
    '--ef-primary-height': fromClass ?? fromSize,
  } as CSSProperties
}

function Arrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13" fill="none" className="ef-primary__arrow" aria-hidden="true">
      <path d={ARROW_PATH} fill="currentColor" />
    </svg>
  )
}

function Icon({ hover }: { hover?: boolean }) {
  return (
    <span className={hover ? 'ef-primary__icon is-hover' : 'ef-primary__icon is-rest'} aria-hidden="true">
      <span className="ef-primary__plate" />
      <Arrow />
    </span>
  )
}

/** The square, the label, and the arrow that arrives on the right. */
export function SplitPrimaryParts({ children }: { children: ReactNode }) {
  return (
    <>
      <Icon />
      <span className="ef-primary__text">{children}</span>
      <Icon hover />
    </>
  )
}
```


CREATE:
src/components/street-collage.tsx

Why: The merch collage beside "Built from the street".

```tsx
import { useEffect, useRef } from 'react'
import largePhoto from '../../others/SHACKLINE_PRODUCT_02.jpeg'
import mediumPhoto from '../../others/SHACKLINE_PRODUCT_05.jpeg'
import sticker from '../../others/sticker.svg'

/** Same numbers as extrafazant.nl's interactive collage (odyn bundle). */
const FOCUS_SCALE = 1.075
const NEIGHBOR_SCALE = 0.9
const GAP_OF_WIDTH = 0.01
const SECOND_NEIGHBOR_BOOST = 1.1
const VERTICAL_SHIFT = 15
const PUSH_INFLUENCE = 0.5
const REST_ROTATION = 5
const ROTATION_STEP = 0.1
const DISTANCE_FALLOFF = 0.45
const DISTANCE_CURVE = 1.2
const SCALE_FALLOFF = 0.12
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

const ITEM_SELECTOR = '[data-interactive-collage-item]'
const INNER_SELECTOR = '[data-interactive-collage-item-inner]'

function restTilt() {
  const steps = Math.round((REST_ROTATION * 2) / ROTATION_STEP)
  return Math.round(Math.random() * steps - steps / 2) * ROTATION_STEP
}

function weightForDistance(distance: number) {
  const base = 1 / (1 + Math.pow(distance - 1, DISTANCE_CURVE) * DISTANCE_FALLOFF)
  return distance === 2 ? base * SECOND_NEIGHBOR_BOOST : base
}

function innerOf(item: HTMLElement) {
  return item.querySelector(INNER_SELECTOR) as HTMLElement | null
}

function place(item: HTMLElement, xPercent: number, yPercent: number, scale: number, rotation: number) {
  const inner = innerOf(item)
  if (!inner) return
  inner.style.transform = `translate(${xPercent}%, ${yPercent}%) rotate(${rotation}deg) scale(${scale})`
}

function centerX(item: HTMLElement) {
  const box = item.getBoundingClientRect()
  return box.left + box.width / 2
}

interface CollageCardProps {
  kind: 'large' | 'medium'
  src: string
}

function CollageCard({ kind, src }: CollageCardProps) {
  return (
    <div
      data-interactive-collage-item=""
      className={`sl-collage__item ${kind === 'large' ? 'sl-collage__large' : 'sl-collage__medium'}`}
    >
      <div data-interactive-collage-item-inner="" className="sl-collage__inner">
        <div className={`sl-collage__card ${kind === 'large' ? 'is-large' : 'is-medium'}`}>
          <div className="sl-collage__frame">
            <img src={src} alt="" className="sl-collage__photo" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** The Extrafazant intro collage: two tilted prints and a sticker.
 *  A fine pointer scales the piece under it and eases the others apart.
 *  A coarse pointer toggles the same state on tap. */
export function StreetCollage() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const list = root.querySelector('[data-interactive-collage-list]')
    const items = [...root.querySelectorAll<HTMLElement>(ITEM_SELECTOR)]
    if (!list || items.length === 0) return

    const tilts = new Map<HTMLElement, number>()
    items.forEach((item) => tilts.set(item, restTilt()))

    let focused: HTMLElement | null = null
    const controller = new AbortController()
    const { signal } = controller

    const reset = () => {
      focused = null
      items.forEach((item) => {
        item.removeAttribute('data-interactive-collage-focus')
        place(item, 0, 0, 1, 0)
      })
    }

    const focus = (item: HTMLElement) => {
      if (focused === item) return
      focused = item
      items.forEach((entry) => {
        if (entry === item) entry.setAttribute('data-interactive-collage-focus', '')
        else entry.removeAttribute('data-interactive-collage-focus')
      })

      const listBox = list.getBoundingClientRect()
      const midY = listBox.top + listBox.height / 2
      const gap = listBox.width * GAP_OF_WIDTH
      const ordered = [...items].sort((a, b) => centerX(a) - centerX(b))
      const index = ordered.indexOf(item)
      const focusBox = item.getBoundingClientRect()
      const focusCenter = focusBox.left + focusBox.width / 2
      const focusLeft = focusCenter - (focusBox.width * FOCUS_SCALE) / 2
      const focusRight = focusCenter + (focusBox.width * FOCUS_SCALE) / 2
      const previous = ordered[index - 1]
      const next = ordered[index + 1]
      let pushLeft = 0
      let pushRight = 0

      if (previous) {
        const box = previous.getBoundingClientRect()
        const edge = box.left + box.width / 2 + (box.width * NEIGHBOR_SCALE) / 2
        pushLeft = Math.min(0, focusLeft - gap - edge) * PUSH_INFLUENCE
      }
      if (next) {
        const box = next.getBoundingClientRect()
        const edge = box.left + box.width / 2 - (box.width * NEIGHBOR_SCALE) / 2
        pushRight = Math.max(0, focusRight + gap - edge) * PUSH_INFLUENCE
      }

      ordered.forEach((entry, entryIndex) => {
        if (entry === item) {
          place(entry, 0, 0, FOCUS_SCALE, 0)
          return
        }
        const box = entry.getBoundingClientRect()
        const delta = entryIndex - index
        const distance = Math.abs(delta)
        const weight = weightForDistance(distance)
        const yNorm = (midY - (box.top + box.height / 2)) / (listBox.height / 2)
        const push = delta < 0 ? pushLeft * weight : pushRight * weight
        const xPercent = (push / box.width) * 100
        const yPercent = VERTICAL_SHIFT * yNorm * weight
        const scale = NEIGHBOR_SCALE - (1 - weight) * SCALE_FALLOFF
        const rotation = (tilts.get(entry) ?? 0) * weight
        place(entry, xPercent, yPercent, scale, rotation)
      })
    }

    const itemFromPoint = (event: PointerEvent) => {
      if (focused) {
        const inner = innerOf(focused)
        const box = inner?.getBoundingClientRect()
        if (
          box &&
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom
        ) {
          return focused
        }
      }
      const hit = document.elementFromPoint(event.clientX, event.clientY)
      const item = hit?.closest(ITEM_SELECTOR)
      return item instanceof HTMLElement && root.contains(item) ? item : null
    }

    const fine = window.matchMedia(FINE_POINTER).matches
    if (fine) {
      root.addEventListener(
        'pointermove',
        (event) => {
          const item = itemFromPoint(event)
          if (item) focus(item)
          else reset()
        },
        { signal },
      )
      root.addEventListener('pointerleave', reset, { signal })
    } else {
      items.forEach((item) => {
        item.addEventListener(
          'click',
          (event) => {
            event.stopPropagation()
            if (focused === item) reset()
            else focus(item)
          },
          { signal },
        )
      })
      document.addEventListener(
        'click',
        (event) => {
          if (event.target instanceof Node && root.contains(event.target)) return
          reset()
        },
        { signal },
      )
    }

    return () => {
      controller.abort()
      items.forEach((item) => {
        const inner = innerOf(item)
        if (inner) inner.style.transform = ''
        item.removeAttribute('data-interactive-collage-focus')
      })
    }
  }, [])

  return (
    <div ref={rootRef} data-interactive-collage-init="" className="sl-collage">
      <div data-interactive-collage-list="" className="sl-collage__list">
        <CollageCard kind="large" src={largePhoto} />
        <CollageCard kind="medium" src={mediumPhoto} />
        <div data-interactive-collage-item="" className="sl-collage__item sl-collage__sticker">
          <div data-interactive-collage-item-inner="" className="sl-collage__inner">
            <div className="sl-collage__sticker-wrap">
              <img src={sticker} alt="" className="sl-collage__mark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```


CREATE:
src/components/ui/studio-gradient.tsx

Why: Hero background renderer.

```tsx
import { useEffect, useRef, useState } from 'react'
import {
  buildGradientBackgroundFallback,
  resolveGradientBackgroundConfig,
  type BalsaBackgroundConfig,
} from '@/components/ui/gradient-background'
import { GradientBackgroundRenderer } from '@/components/ui/gradient-background-renderer'

/** How strongly the live shader covers the hero. The CSS stand-in stays solid until WebGL is ready. */
const SHADER_OPACITY = 0.5

/** The Balsa studio field, as a React canvas. A CSS gradient shows until WebGL is ready. */
export function StudioGradient({ config }: { config: BalsaBackgroundConfig }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const resolved = resolveGradientBackgroundConfig({ config })
  const fallback = buildGradientBackgroundFallback(resolved.colors, resolved.direction)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const active = resolveGradientBackgroundConfig({ config })

    let renderer: GradientBackgroundRenderer | undefined
    let frame = 0
    let start = 0
    const paint = () => {
      if (!renderer) return
      const bounds = root.getBoundingClientRect()
      renderer.resize(bounds.width, bounds.height)
      renderer.render(0)
    }

    // Wait one frame so development mode can tear down its extra setup
    // before this canvas takes a WebGL context.
    start = window.requestAnimationFrame(() => {
      start = 0
      try {
        renderer = new GradientBackgroundRenderer(canvas, active, active.colors)
        paint()
        setReady(true)
      } catch {
        setReady(false)
      }
    })

    const observer = new ResizeObserver(() => {
      if (!renderer || frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        paint()
      })
    })
    observer.observe(root)

    return () => {
      observer.disconnect()
      if (start) window.cancelAnimationFrame(start)
      if (frame) window.cancelAnimationFrame(frame)
      renderer?.dispose()
    }
  }, [config])

  return (
    <div
      ref={rootRef}
      data-balsa="gradient-background"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 isolate overflow-hidden"
    >
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundImage: fallback, opacity: ready ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block size-full transition-opacity"
        style={{ opacity: ready ? SHADER_OPACITY : 0 }}
      />
    </div>
  )
}
```


CREATE:
src/backgrounds/studio-background.ts

Why: Hero background preset imported by the hero stage.

```ts
import type { BalsaBackgroundConfig } from "../components/ui/gradient-background";

/** Generated by Balsa UI. Edit this configuration in your application. */
export const studioBackground: BalsaBackgroundConfig = {
  "schemaVersion": 3,
  "preset": "obsidian-fold",
  "seed": 1847,
  "colorMode": "custom",
  "colors": [
    "#050506",
    "#111215",
    "#3F3F3F",
    "#4F3F3F",
    "#643C3C"
  ],
  "speed": 0,
  "scale": 0.85,
  "warp": 0.7,
  "wave": 1.1,
  "softness": 0.9,
  "grain": 0.02,
  "grainSize": 0.55,
  "contrast": 1.18,
  "brightness": -0.06,
  "direction": 14,
  "quality": "auto",
  "fieldOctaves": 4,
  "fieldFrequency": 0.78,
  "noiseAmount": 0.05,
  "noiseOctaves": 4,
  "noiseFrequency": 1.1,
  "warpFrequency": 1.05,
  "pattern": "blobs",
  "patternDensity": 3.2,
  "patternCenterX": 0,
  "patternCenterY": 0,
  "patternComplexity": 5,
  "effect": "none",
  "effectScale": 10,
  "effectAngle": 0,
  "effectMix": 1,
  "effectColorMode": "gradient",
  "effectInk": "#F5F5F4",
  "effectPaper": "#0A0A0B",
  "effectInvert": false,
  "effectLevels": 4,
  "effectShape": "round",
  "effectCharacters": " .:-=+*#%@"
};
```


CREATE:
others/SHACKLINE_LOGO.svg

Why: Wordmark source imported by shackline-logo.tsx. Do not redraw it.

```svg
<svg width="1145" height="186" viewBox="0 0 1145 186" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M57.9921 98.0266C41.5806 86.9131 -29.1184 27.6736 13.4281 5.65909C38.3206 -7.22101 91.5361 4.66699 118.45 13.8006C117.46 15.8456 116.591 18.4461 115.803 20.6201C95.7371 15.6541 77.8066 11.9412 57.0041 12.991C24.5906 14.6266 12.6216 32.5666 31.8496 60.5106C41.1886 74.0826 51.0806 83.0576 63.4691 93.8266C67.4316 90.9886 76.5531 84.2976 80.8861 82.4981L81.2266 82.8531L81.4301 83.3066C75.6366 86.9386 70.3996 91.0346 64.8991 95.0786C95.7761 118.481 129.452 139.729 165.65 154.032C169.365 152.77 173.1 151.576 176.855 150.451C180.365 152.087 183.86 153.743 187.35 155.419C184.02 156.63 180.495 157.72 177.115 158.82C200.675 167.518 217.115 172.776 241.815 177.477L241.445 177.814C225.76 176.4 189.63 165.76 174.43 159.748C145.343 169.348 110.903 176.872 80.4576 178.286C63.6781 178.674 38.2726 178.394 25.1431 166.414C8.87158 151.568 24.8836 129.128 36.3841 116.995C31.9916 107.986 39.5861 100.696 48.0831 105.769C51.2111 103.499 54.6146 100.514 57.9921 98.0266ZM39.9851 119.658C39.2686 120.424 38.8051 121.147 38.2321 121.964C16.5881 152.838 42.0601 166.52 70.7546 167.934C96.5216 169.204 119.067 165.572 143.961 159.787C150.068 158.368 156.098 156.506 162.14 155.354C154.172 151.484 145.109 148.157 136.976 144.236C113.142 132.746 80.4276 115.742 59.8581 99.2636C56.6691 101.83 53.2186 105.167 50.1636 107.988C52.1966 116.35 48.6291 120.7 39.9851 119.658Z" fill="black"/>
<path d="M36.384 116.995C31.9915 107.986 39.586 100.696 48.083 105.769L50.1635 107.988C52.1965 116.35 48.629 120.7 39.985 119.658L36.384 116.995Z" fill="#EF1B23"/>
<path d="M164.12 68.4766C180.55 66.6446 195.385 78.4147 197.33 94.8332C199.28 111.252 187.615 126.167 171.21 128.233C154.642 130.319 139.543 118.511 137.574 101.927C135.605 85.3421 147.52 70.3271 164.12 68.4766ZM161.723 101.979C167.565 100.851 171.785 95.7411 171.79 89.7936C171.79 86.1166 170.165 82.6271 167.35 80.2651C164.53 77.9026 160.811 76.9101 157.191 77.5541C150.402 78.7626 145.897 85.2691 147.155 92.0491C148.413 98.8286 154.952 103.286 161.723 101.979Z" fill="black"/>
<path d="M122.793 39.5247C132.615 40.6862 159.457 47.3242 168.544 51.4147C194.049 58.5017 231.379 79.0402 253.829 93.8397C260.194 98.0347 265.849 102.846 271.919 107.184C273.994 109.004 275.964 110.754 278.164 112.435C296.869 127.922 333.644 169.292 285.454 176.518C284.409 176.675 283.119 176.61 282.109 176.281L281.539 174.756C281.824 172.958 281.714 171.12 281.209 169.371C280.999 168.202 280.819 167.028 280.664 165.851C282.549 163.649 287.254 161.798 289.054 159.605C299.884 146.404 280.924 124.674 271.929 116.102C270.329 114.397 267.909 112.277 266.149 110.643C264.074 108.549 257.444 103.307 255.094 101.473C228.439 80.6797 198.604 65.3577 167.239 53.1802C151.245 47.3627 138.348 43.6197 121.587 40.5177L122.793 39.5247Z" fill="#EF1B23"/>
<path d="M310.76 57.4956C322.435 56.1056 333.02 64.4541 334.39 76.1291C335.755 87.8046 327.39 98.3746 315.71 99.7221C304.065 101.067 293.525 92.7256 292.16 81.0796C290.795 69.4336 299.12 58.8816 310.76 57.4956ZM309.705 80.9981C314.35 79.8271 317.18 75.1276 316.045 70.4741C314.905 65.8211 310.23 62.9571 305.565 64.0611C300.855 65.1761 297.96 69.9136 299.105 74.6151C300.255 79.3161 305.015 82.1816 309.705 80.9981Z" fill="black"/>
<path d="M149.072 24.6472C191.235 40.0442 246.06 72.1412 279.045 102.515L293.88 91.9662C296.05 94.5202 296.995 95.5542 299.55 97.6982C297.73 99.0027 285.745 107.323 285.125 108.295L283.68 109.348C281.515 110.066 280.06 111.172 278.165 112.435C275.965 110.754 273.995 109.004 271.92 107.184L277.475 103.369C267.18 95.8342 258.88 88.7357 247.815 81.1597C216.45 60.1262 182.6 43.0547 147.039 30.3327L149.072 24.6472Z" fill="black"/>
<path d="M128.465 7.52439C133.955 6.12524 139.774 7.79414 143.688 11.8908C147.602 15.9876 149.004 21.8756 147.356 27.2966C145.708 32.7176 141.266 36.8296 135.734 38.0546C127.366 39.9081 119.059 34.7051 117.073 26.3671C115.088 18.0291 120.16 9.64089 128.465 7.52439ZM130.187 24.1776C133.379 23.0931 135.138 19.6756 134.167 16.4481C133.196 13.2203 129.843 11.341 126.583 12.197C124.369 12.7784 122.649 14.522 122.098 16.7441C121.546 18.9656 122.252 21.3111 123.938 22.8601C125.623 24.4091 128.02 24.9141 130.187 24.1776Z" fill="#EF1B23"/>
<path d="M266.15 110.643C267.91 112.277 270.33 114.397 271.93 116.102C254.25 126.713 235.825 136.026 216.795 143.967C209.255 147.162 200.735 150.107 193.56 153.266C189.25 151.381 187.3 151.284 182.56 148.72C193.895 144.375 204.395 140.704 215.725 135.94C233.995 128.261 248.94 120.315 266.15 110.643Z" fill="black"/>
<path d="M121.27 118.708L122.996 117.378C132.991 123.735 172.04 146.771 182.56 148.72C187.3 151.284 189.25 151.381 193.56 153.266C215.07 162.223 233.405 165.783 256.15 168.481C256.04 170.936 255.98 173.392 255.97 175.848C238.85 172.82 224.915 169.31 208.51 163.457C204.16 161.905 190.495 156.171 187.35 155.419C183.86 153.743 180.365 152.087 176.855 150.451C157.535 141.274 138.723 131.136 121.27 118.708Z" fill="#EF1B23"/>
<path d="M281.54 174.756C280.55 181.032 274.995 185.555 268.645 185.253C262.3 184.95 257.2 179.919 256.805 173.578C256.415 167.236 260.86 161.617 267.125 160.537C273.385 159.458 279.455 163.264 281.21 169.371C281.715 171.12 281.825 172.958 281.54 174.756ZM267.455 174.037C270.07 173.163 271.485 170.335 270.615 167.716C269.75 165.097 266.925 163.676 264.305 164.54C261.675 165.406 260.25 168.24 261.12 170.866C261.99 173.493 264.83 174.913 267.455 174.037Z" fill="black"/>
<path d="M279.424 16.8891C310.679 16.1676 357.694 21.7791 332.334 65.2061C329.879 62.4471 328.489 60.9831 325.409 58.9126C337.454 35.5351 326.344 24.4611 302.414 19.2046C295.474 17.6796 290.354 18.3021 283.729 17.6816L279.424 16.8891Z" fill="black"/>
<path d="M81.5111 81.7172L81.701 81.7652L82.451 82.5987C95.0115 97.1902 107.35 106.335 122.996 117.378L121.27 118.708C105.71 107.721 93.7886 97.7077 81.4301 83.3067L81.2266 82.8532L81.5111 81.7172Z" fill="#EF1B23" fill-opacity="0.984314"/>
<path d="M81.7012 81.7651C88.0627 76.6646 119.552 60.0716 127.349 57.1371C124.572 59.3411 113.185 64.7991 109.147 66.9446C100.033 71.7851 91.1257 77.0076 82.4512 82.5986L81.7012 81.7651Z" fill="black" fill-opacity="0.827451"/>
<path d="M285.124 108.295C289.549 112.804 303.589 128.093 305.379 133.653C304.349 133.312 301.499 128.968 300.534 127.727C295.459 121.125 289.819 114.975 283.679 109.348L285.124 108.295Z" fill="black" fill-opacity="0.952941"/>
<path d="M95.6277 37.8251C103.426 37.7806 115.383 37.4621 122.793 39.5246L121.587 40.5176C111.466 39.3076 105.643 38.9846 95.4316 38.7476L95.6277 37.8251Z" fill="#EF1B23" fill-opacity="0.972549"/>
<path d="M80.886 82.4981C77.9935 79.2011 74.207 73.9341 73.125 69.6246C73.8935 70.1246 80.396 80.1256 81.511 81.7171L81.2265 82.8531L80.886 82.4981Z" fill="#C7525D" fill-opacity="0.878431"/>
<path d="M265.879 17.1011C268.559 16.6621 276.469 16.8681 279.424 16.8891L283.729 17.6816C279.954 17.8086 276.509 17.9646 272.724 17.7276C271.034 17.4406 267.699 17.2566 265.879 17.1011Z" fill="black" fill-opacity="0.772549"/>
<path d="M95.4315 38.7476C93.655 39.1311 90.1095 40.0276 88.526 39.3356L88.5325 39.6511L88.1445 39.5861L88.5445 39.2161L88.55 39.5516L89.5865 38.9301L88.6605 39.5391C89.3275 38.6221 94.1055 38.0906 95.6275 37.8251L95.4315 38.7476Z" fill="#C7525D" fill-opacity="0.92549"/>
<path d="M272.725 17.7276C271.2 17.7501 262.82 18.2841 262.275 18.1181C263.615 17.5636 264.46 17.4076 265.88 17.1011C267.7 17.2566 271.035 17.4406 272.725 17.7276Z" fill="#3C333C" fill-opacity="0.913725"/>
<path d="M433.449 41.9688C434.515 41.8498 435.584 41.7676 436.655 41.722C452.036 41.0404 468.709 44.1894 480.603 54.8183C485.337 59.05 488.618 65.6514 483.642 71.6585C482.261 73.3252 479.33 74.012 477.253 74.0267C467.413 74.513 469.785 62.791 464.915 59.0772C453.24 50.1723 427.971 48.8229 417.04 59.6699C412.24 64.4328 412.937 69.1537 413.208 75.0756C431.497 94.3567 482.5 79.5703 486.101 113.729C488.415 135.687 460.659 142.539 443.426 143.42C431.168 144.731 412.31 139.907 402.785 131.546C395.971 125.565 390.055 106.841 404.352 106.72C418.359 106.818 409.234 119.117 417.249 125.916C428.897 135.794 454.487 135.306 465.771 125.053C469.78 121.411 468.984 114.235 468.922 109.081C455.733 88.9211 400.662 103.532 396.128 71.9303C393.172 51.3277 417.303 43.5107 433.449 41.9688Z" fill="#EF1B23"/>
<path d="M628.225 78.0885C637.292 76.2094 662.868 81.0613 664.87 92.2932C666.293 100.28 667.98 133.426 664.415 139.528C663.39 140.276 661.356 141.518 660.122 141.603C640.214 142.978 599.794 146.487 593.389 121.987C594.759 96.3237 631.243 96.9228 649.458 101.963C646.21 71.2611 607.043 101.812 598.584 91.789C597.247 80.8486 620.685 78.7671 628.225 78.0885ZM638.449 131.779L649.145 131.909C648.749 126.094 648.575 121.944 648.691 116.086C641.845 110.219 636.087 108.649 627.026 109.306C625.992 109.382 624.958 109.47 623.926 109.569C612.358 112.474 601.964 120.275 617.509 128.797C623.819 132.255 631.385 131.833 638.449 131.779Z" fill="#EF1B23"/>
<path d="M1101.11 78.93C1101.82 78.8523 1102.54 78.8002 1103.26 78.7746C1115.26 78.3785 1129.27 80.2011 1138.38 88.7988C1142.21 92.4133 1144.41 97.1478 1144.56 102.42C1144.63 104.731 1144.82 108.507 1143.08 110.249C1138.7 114.642 1093.63 112.571 1086.08 112.558C1086.05 114.474 1085.85 120.055 1086.62 121.529C1095.21 137.914 1121.46 136.104 1128.85 119.634C1139.43 112.82 1147.86 119.784 1140.57 129.817C1126.83 148.71 1073.32 147.678 1069.92 119.91C1068.99 112.306 1068.68 97.0942 1074.15 90.8532C1080.89 82.8056 1091.23 80.2635 1101.11 78.93ZM1107.22 102.573C1110.55 102.603 1125.45 103.175 1127.58 102.182C1129.07 100.666 1128.66 101.427 1129.05 99.2418C1126.78 92.725 1113.55 88.9066 1107.05 88.6081C1098.71 89.0973 1088.21 91.1488 1086.22 100.917L1086.79 102.352C1091.8 103.122 1101.6 102.526 1107.22 102.573Z" fill="black"/>
<path d="M509.506 43.6941C513.63 44.0597 517.687 44.2785 518.81 48.9126C521.183 58.7137 519.795 72.3723 519.508 82.5001C539.018 75.8786 576.715 76.8896 577.783 104.347C577.924 107.958 578.424 138.698 576.284 139.803C558.824 148.813 559.595 132.634 560.248 120.272C560.483 115.826 560.279 106.765 560.219 101.695C560.441 100.944 560.45 99.3009 560.15 98.6232C558.513 94.9157 554.975 92.4973 551.283 91.1082C543.936 88.3448 534.631 88.4322 527.466 91.7198C511.83 98.8956 524.108 124.494 519.012 137.593C518.244 139.568 516.893 141.145 514.917 141.963C511.992 143.173 508.64 142.524 505.851 141.212C504.672 140.657 503.43 139.671 502.996 138.431C501.329 133.671 501.133 51.4345 503.157 47.5022C504.299 45.2836 507.29 44.4327 509.506 43.6941Z" fill="#EF1B23"/>
<path d="M778.232 43.8649C779.518 43.7401 780.818 43.6832 782.111 43.6958C784.763 43.7054 787.106 43.78 789.075 45.8237C792.968 49.8631 790.771 90.9805 790.595 99.7042C798.469 94.0679 827.675 71.4887 836.71 80.2486C837.753 82.7857 837.746 81.8757 837.327 84.3663C833.97 88.7218 808.452 103.199 801.973 107.107C810.619 112.232 823.694 122.062 831.965 128.15C836.145 131.01 842.3 133.899 840.258 140.086C830.951 149.157 799.028 120.895 790.654 114.337C790.61 117.261 790.632 127.109 791.131 129.626C793.298 140.493 781.949 146.666 774.876 139.562C772.775 133.676 774.112 60.0374 774.112 48.5011C774.112 46.3658 776.528 45.094 778.232 43.8649Z" fill="#EF1B23"/>
<path d="M712.998 78.3977C725.184 75.6612 745.005 81.2018 753.865 89.9077C757.859 93.1009 758.504 98.8021 754.54 102.574C748.041 108.757 738.39 95.2656 733.236 91.9353C729.514 89.5798 725.238 88.2492 720.84 88.076C712.028 87.6465 706.327 90.8706 700.065 96.5461C699.59 101.695 698.699 120.525 701.107 124.24C707.808 134.583 725.575 133.264 734.75 128.198C740.24 125.013 740.129 117.415 748.494 116.26C751.45 114.949 756.842 118.395 756.433 121.718C752.856 150.782 683.127 149.452 682.237 118.105C681.983 109.166 680.842 97.0191 687.211 89.7618C693.575 82.5111 703.763 79.2229 712.998 78.3977Z" fill="#EF1B23"/>
<path d="M1010.64 78.8831C1022.99 78.0471 1036.31 80.4193 1046.3 88.2724C1055.62 95.6881 1052.22 109.205 1052.6 119.655C1052.19 124.579 1054.11 135.11 1051.53 139.225C1049.19 142.95 1040.46 141.519 1037.43 138.807C1035.55 133.999 1036.43 105.866 1036.28 98.4742C1031.34 91.9441 1028.27 90.8153 1020.3 88.9587C979.427 86.864 1000.53 116.929 992.84 138.818C991.463 142.743 983.365 142.125 979.323 139.15C976.717 135.865 978.462 125.817 978.146 121.609C976.15 94.8339 979.677 82.2467 1010.64 78.8831Z" fill="black"/>
<path d="M861.623 44.1707C866.189 43.6494 869.646 42.9577 873.33 45.7486C875.745 48.6798 874.776 71.5509 874.776 76.5967L874.791 131.567C887.702 131.027 901.12 131.551 914.076 131.363C918.825 131.294 925.724 131.725 927.207 136.861C926.275 139.452 926.664 138.624 924.33 140.604C916.982 142.37 877.184 141.19 867.179 141.149C864.992 141.14 861.652 140.195 859.648 139.038C856.536 126.32 859.48 64.6684 858.525 48.3025C858.437 46.808 860.485 45.1549 861.623 44.1707Z" fill="black"/>
<path d="M949.895 78.7477C951.118 78.6872 952.312 78.7477 953.52 78.8922C955.899 79.1753 958.04 79.5019 959.577 81.4571C961.895 84.3995 961.321 131.436 960.419 138.229C959.371 140.146 957.153 140.726 955.034 141.573C946.033 141.527 943.692 140.112 943.83 131.108C944.067 115.121 943.08 98.731 944.381 82.8387C944.526 81.0265 948.396 79.4252 949.895 78.7477Z" fill="black"/>
<path d="M950.758 59.1487C956.052 59.1335 964.007 60.5963 961.887 67.7757C959.951 70.1396 958.795 70.4139 956.037 71.4755C950.728 71.6069 947.607 71.616 944.003 67.322C942.528 61.8949 946.554 60.7293 950.758 59.1487Z" fill="black"/>
</svg>
```


CREATE:
others/sticker.svg

Why: Sticker imported by the merch collage. Do not redraw it.

```svg
<svg width="548" height="333" viewBox="0 0 548 333" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M81.9092 31.3514C104.123 -11.2014 191.903 -9.95692 283.523 32.161C373.604 1.27567 455.051 7.595 473.523 49.9149C485.224 76.7202 469.154 112.23 434.481 146.114C442.674 152.563 448.676 161.78 451.001 172.57C454.256 187.678 449.721 202.337 440.411 212.82C440.041 213.784 439.637 214.736 439.199 215.675L504.647 222.042C529.241 224.434 548 245.107 548 269.816V284.259C548 310.768 526.51 332.259 500 332.259H48C21.4903 332.259 0 310.768 0 284.259V274.259C0.000115837 247.749 21.4904 226.259 48 226.259H112.44C89.8022 219.344 75.2001 195.53 81.3262 171.079C86.0132 152.372 101.783 138.774 120.571 136.574C83.835 98.2995 67.5645 58.8299 81.9092 31.3514Z" fill="#F2F2F2"/>
<path d="M157.799 125.292C140.884 113.837 68.017 52.7812 111.868 30.0915C137.524 16.8165 192.371 29.069 220.11 38.4827C219.09 40.5905 218.194 43.2707 217.383 45.5114C196.701 40.3931 178.221 36.5663 156.78 37.6483C123.373 39.334 111.037 57.8242 130.855 86.6252C140.48 100.613 150.675 109.864 163.444 120.963C167.528 118.038 176.929 111.142 181.395 109.287L181.746 109.653L181.956 110.12C175.984 113.864 170.587 118.085 164.918 122.253C196.741 146.373 231.45 168.272 268.758 183.015C272.587 181.714 276.436 180.483 280.306 179.323C283.924 181.01 287.526 182.717 291.123 184.444C287.691 185.692 284.058 186.816 280.574 187.949C304.857 196.914 321.801 202.333 347.258 207.178L346.877 207.525C330.711 206.069 293.473 195.102 277.807 188.906C247.828 198.8 212.332 206.555 180.953 208.012C163.659 208.412 137.475 208.123 123.942 195.776C107.172 180.475 123.675 157.347 135.528 144.842C131.001 135.557 138.828 128.042 147.586 133.272C150.81 130.931 154.318 127.855 157.799 125.292ZM139.24 147.586C138.501 148.375 138.023 149.121 137.433 149.963C115.125 181.784 141.378 195.885 170.953 197.342C197.51 198.651 220.747 194.908 246.404 188.946C252.698 187.484 258.913 185.564 265.141 184.377C256.928 180.388 247.587 176.959 239.204 172.918C214.639 161.076 180.922 143.55 159.722 126.567C156.435 129.212 152.879 132.651 149.73 135.559C151.826 144.177 148.149 148.66 139.24 147.586Z" fill="black"/>
<path d="M135.527 144.842C131 135.557 138.828 128.042 147.585 133.272L149.73 135.559C151.825 144.177 148.148 148.66 139.239 147.586L135.527 144.842Z" fill="#EF1B23"/>
<path d="M267.181 94.8355C284.115 92.9473 299.405 105.078 301.409 122C303.419 138.922 291.396 154.295 274.488 156.424C257.412 158.574 241.85 146.404 239.821 129.311C237.792 112.218 250.072 96.7427 267.181 94.8355ZM264.71 129.365C270.732 128.202 275.081 122.936 275.086 116.806C275.086 113.016 273.411 109.42 270.51 106.985C267.603 104.551 263.77 103.528 260.039 104.191C253.043 105.437 248.4 112.143 249.696 119.131C250.992 126.118 257.732 130.712 264.71 129.365Z" fill="black"/>
<path d="M224.587 64.9956C234.71 66.1927 262.375 73.0343 271.741 77.2502C298.028 84.5546 336.503 105.723 359.642 120.976C366.202 125.3 372.03 130.258 378.286 134.729C380.425 136.606 382.455 138.409 384.723 140.141C404.001 156.103 441.904 198.743 392.236 206.19C391.159 206.351 389.83 206.284 388.789 205.946L388.201 204.374C388.495 202.521 388.382 200.626 387.861 198.823C387.645 197.619 387.459 196.409 387.3 195.196C389.242 192.926 394.092 191.019 395.947 188.758C407.109 175.153 387.567 152.756 378.297 143.921C376.648 142.164 374.153 139.979 372.339 138.295C370.201 136.137 363.367 130.734 360.945 128.844C333.473 107.413 302.723 91.6208 270.396 79.0699C253.911 73.074 240.619 69.2162 223.344 66.0191L224.587 64.9956Z" fill="#EF1B23"/>
<path d="M418.318 83.5178C430.351 82.0852 441.261 90.6897 442.673 102.723C444.08 114.756 435.458 125.65 423.42 127.039C411.418 128.425 400.555 119.828 399.148 107.825C397.741 95.8219 406.321 84.9463 418.318 83.5178ZM417.231 107.741C422.019 106.534 424.935 101.69 423.766 96.8943C422.591 92.0986 417.772 89.1468 412.964 90.2846C408.11 91.4338 405.126 96.3166 406.306 101.162C407.491 106.007 412.397 108.961 417.231 107.741Z" fill="black"/>
<path d="M251.672 49.662C295.127 65.5312 351.633 98.6124 385.63 129.918L400.92 119.045C403.156 121.678 404.13 122.743 406.764 124.953C404.888 126.298 392.535 134.873 391.896 135.875L390.407 136.96C388.175 137.7 386.676 138.84 384.723 140.142C382.455 138.409 380.425 136.606 378.286 134.73L384.012 130.798C373.401 123.032 364.846 115.716 353.442 107.907C321.115 86.229 286.227 68.634 249.576 55.5218L251.672 49.662Z" fill="black"/>
<path d="M230.433 32.014C236.091 30.572 242.088 32.2921 246.122 36.5143C250.156 40.7368 251.601 46.8054 249.902 52.3926C248.204 57.9799 243.626 62.218 237.925 63.4805C229.299 65.3909 220.738 60.0283 218.691 51.4346C216.645 42.8409 221.872 34.1954 230.433 32.014ZM232.207 49.178C235.497 48.0602 237.31 44.5379 236.309 41.2114C235.308 37.8847 231.853 35.9477 228.493 36.83C226.211 37.4292 224.438 39.2263 223.87 41.5165C223.301 43.8061 224.029 46.2236 225.766 47.8201C227.504 49.4166 229.974 49.9371 232.207 49.178Z" fill="#EF1B23"/>
<path d="M372.34 138.294C374.154 139.979 376.648 142.164 378.297 143.921C360.075 154.858 341.085 164.456 321.471 172.64C313.7 175.933 304.919 178.969 297.524 182.225C293.082 180.282 291.072 180.182 286.187 177.539C297.869 173.061 308.691 169.277 320.369 164.368C339.199 156.453 354.602 148.263 372.34 138.294Z" fill="black"/>
<path d="M223.017 146.607L224.795 145.236C235.097 151.788 275.343 175.531 286.186 177.539C291.071 180.182 293.081 180.282 297.523 182.225C319.693 191.456 338.59 195.125 362.032 197.907C361.919 200.436 361.857 202.968 361.847 205.5C344.202 202.378 329.839 198.761 312.931 192.728C308.448 191.129 294.364 185.219 291.123 184.444C287.526 182.717 283.923 181.01 280.306 179.323C260.393 169.865 241.004 159.417 223.017 146.607Z" fill="#EF1B23"/>
<path d="M388.202 204.374C387.181 210.842 381.456 215.504 374.911 215.192C368.372 214.881 363.115 209.695 362.708 203.159C362.306 196.623 366.887 190.832 373.345 189.719C379.797 188.606 386.053 192.53 387.862 198.823C388.382 200.626 388.495 202.521 388.202 204.374ZM373.685 203.632C376.38 202.732 377.838 199.817 376.942 197.118C376.05 194.419 373.138 192.954 370.438 193.844C367.727 194.737 366.259 197.658 367.155 200.365C368.052 203.072 370.979 204.536 373.685 203.632Z" fill="black"/>
<path d="M386.021 41.666C418.234 40.9223 466.691 46.7059 440.553 91.4647C438.023 88.621 436.59 87.1122 433.416 84.9782C445.83 60.8838 434.379 49.4702 409.716 44.0525C402.563 42.4807 397.286 43.1223 390.458 42.4828L386.021 41.666Z" fill="black"/>
<path d="M182.039 108.482L182.235 108.532L183.008 109.391C195.954 124.43 208.671 133.855 224.796 145.236L223.018 146.607C206.98 135.283 194.693 124.963 181.956 110.12L181.746 109.653L182.039 108.482Z" fill="#EF1B23" fill-opacity="0.984314"/>
<path d="M182.235 108.532C188.792 103.275 221.247 86.1728 229.283 83.1483C226.421 85.4199 214.684 91.0453 210.523 93.2566C201.129 98.2455 191.949 103.628 183.008 109.391L182.235 108.532Z" fill="black" fill-opacity="0.827451"/>
<path d="M391.897 135.875C396.457 140.522 410.928 156.28 412.773 162.011C411.711 161.659 408.774 157.182 407.779 155.903C402.549 149.098 396.736 142.76 390.407 136.96L391.897 135.875Z" fill="black" fill-opacity="0.952941"/>
<path d="M196.589 63.244C204.626 63.1982 216.95 62.8699 224.587 64.9956L223.344 66.0191C212.912 64.772 206.911 64.4391 196.387 64.1948L196.589 63.244Z" fill="#EF1B23" fill-opacity="0.972549"/>
<path d="M181.395 109.287C178.413 105.889 174.511 100.46 173.396 96.0187C174.188 96.534 180.889 106.842 182.039 108.482L181.745 109.653L181.395 109.287Z" fill="#C7525D" fill-opacity="0.878431"/>
<path d="M372.061 41.8845C374.823 41.432 382.975 41.6443 386.021 41.666L390.458 42.4828C386.567 42.6137 383.017 42.7744 379.115 42.5302C377.374 42.2344 373.936 42.0447 372.061 41.8845Z" fill="black" fill-opacity="0.772549"/>
<path d="M196.386 64.1948C194.555 64.5901 190.901 65.5141 189.269 64.8008L189.276 65.126L188.876 65.059L189.288 64.6777L189.294 65.0235L190.362 64.3829L189.408 65.0106C190.095 64.0655 195.02 63.5177 196.588 63.244L196.386 64.1948Z" fill="#C7525D" fill-opacity="0.92549"/>
<path d="M379.117 42.5301C377.545 42.5533 368.908 43.1037 368.347 42.9326C369.728 42.3611 370.599 42.2003 372.062 41.8844C373.938 42.0447 377.375 42.2343 379.117 42.5301Z" fill="#3C333C" fill-opacity="0.913725"/>
<path d="M41.9952 247.437C42.7266 247.356 43.4605 247.299 44.1955 247.268C54.751 246.8 66.193 248.961 74.3555 256.256C77.6047 259.16 79.8564 263.69 76.4412 267.813C75.4934 268.956 73.4822 269.428 72.0571 269.438C65.3041 269.772 66.9315 261.727 63.5897 259.178C55.5771 253.067 38.2358 252.141 30.7338 259.585C27.4398 262.854 27.9182 266.094 28.1044 270.158C40.6555 283.39 75.6579 273.242 78.1289 296.684C79.717 311.754 60.669 316.456 48.8422 317.061C40.4296 317.96 27.4881 314.65 20.951 308.912C16.2751 304.808 12.215 291.957 22.0265 291.874C31.6393 291.941 25.3768 300.382 30.8777 305.048C38.8712 311.827 56.4328 311.492 64.1768 304.456C66.9284 301.956 66.3821 297.032 66.3394 293.494C57.288 279.659 19.4946 289.687 16.3827 267.999C14.3544 253.86 30.9144 248.495 41.9952 247.437Z" fill="#EF1B23"/>
<path d="M175.665 272.225C181.887 270.936 199.44 274.266 200.813 281.974C201.79 287.455 202.948 310.202 200.501 314.39C199.798 314.903 198.402 315.755 197.555 315.814C183.893 316.757 156.154 319.166 151.758 302.352C152.698 284.74 177.736 285.151 190.237 288.61C188.008 267.54 161.128 288.506 155.323 281.628C154.406 274.12 170.491 272.691 175.665 272.225ZM182.681 309.072L190.022 309.161C189.75 305.17 189.63 302.322 189.71 298.302C185.012 294.276 181.061 293.198 174.842 293.649C174.133 293.701 173.423 293.762 172.715 293.83C164.776 295.823 157.643 301.177 168.311 307.025C172.641 309.398 177.834 309.109 182.681 309.072Z" fill="#EF1B23"/>
<path d="M500.191 272.803C500.68 272.749 501.174 272.714 501.668 272.696C509.906 272.424 519.521 273.675 525.774 279.575C528.399 282.056 529.906 285.305 530.012 288.923C530.057 290.509 530.188 293.101 528.994 294.296C525.991 297.311 495.057 295.89 489.882 295.881C489.861 297.195 489.72 301.026 490.249 302.037C496.145 313.282 514.159 312.039 519.234 300.737C526.49 296.061 532.28 300.84 527.271 307.725C517.843 320.691 481.124 319.982 478.791 300.926C478.151 295.708 477.939 285.268 481.688 280.985C486.314 275.462 493.414 273.718 500.191 272.803ZM504.384 289.028C506.671 289.049 516.901 289.441 518.362 288.76C519.38 287.719 519.103 288.242 519.365 286.742C517.808 282.27 508.732 279.649 504.273 279.445C498.544 279.78 491.343 281.188 489.977 287.892L490.365 288.877C493.802 289.405 500.529 288.996 504.384 289.028Z" fill="black"/>
<path d="M94.1912 248.621C97.0216 248.872 99.8061 249.022 100.576 252.203C102.205 258.929 101.253 268.302 101.055 275.253C114.445 270.709 140.315 271.403 141.048 290.246C141.145 292.724 141.488 313.82 140.019 314.578C128.037 320.761 128.566 309.659 129.015 301.175C129.176 298.124 129.035 291.905 128.994 288.426C129.147 287.91 129.153 286.783 128.947 286.318C127.823 283.773 125.396 282.114 122.862 281.16C117.82 279.264 111.434 279.324 106.517 281.58C95.7865 286.505 104.212 304.072 100.715 313.062C100.188 314.417 99.2611 315.499 97.9046 316.061C95.8973 316.891 93.5968 316.446 91.6832 315.545C90.8737 315.164 90.0214 314.488 89.7237 313.637C88.5798 310.37 88.4453 253.933 89.834 251.235C90.6178 249.712 92.6705 249.128 94.1912 248.621Z" fill="#EF1B23"/>
<path d="M278.612 248.739C279.494 248.653 280.386 248.614 281.274 248.623C283.093 248.629 284.701 248.68 286.052 250.083C288.724 252.855 287.217 281.073 287.096 287.06C292.5 283.192 312.543 267.696 318.744 273.708C319.46 275.449 319.454 274.824 319.167 276.534C316.863 279.523 299.351 289.458 294.905 292.14C300.838 295.657 309.811 302.403 315.487 306.581C318.356 308.544 322.58 310.527 321.179 314.773C314.791 320.998 292.883 301.603 287.136 297.102C287.106 299.108 287.121 305.867 287.464 307.595C288.951 315.052 281.163 319.288 276.308 314.413C274.866 310.373 275.784 259.837 275.784 251.92C275.784 250.455 277.442 249.582 278.612 248.739Z" fill="#EF1B23"/>
<path d="M233.842 272.438C242.205 270.56 255.807 274.362 261.888 280.337C264.629 282.528 265.072 286.441 262.351 289.029C257.891 293.272 251.268 284.014 247.731 281.728C245.176 280.112 242.242 279.198 239.223 279.08C233.176 278.785 229.264 280.997 224.966 284.892C224.641 288.426 224.029 301.349 225.681 303.898C230.28 310.996 242.473 310.091 248.77 306.615C252.538 304.429 252.461 299.214 258.202 298.422C260.23 297.522 263.931 299.886 263.65 302.167C261.195 322.113 213.342 321.2 212.731 299.688C212.557 293.553 211.774 285.217 216.145 280.236C220.513 275.26 227.504 273.004 233.842 272.438Z" fill="#EF1B23"/>
<path d="M438.108 272.771C446.581 272.197 455.721 273.825 462.582 279.214C468.973 284.303 466.644 293.579 466.901 300.751C466.624 304.131 467.937 311.358 466.169 314.181C464.562 316.738 458.57 315.756 456.494 313.895C455.205 310.595 455.807 291.288 455.7 286.215C452.31 281.734 450.209 280.959 444.737 279.685C416.686 278.248 431.166 298.881 425.892 313.902C424.947 316.596 419.389 316.172 416.615 314.13C414.827 311.876 416.024 304.98 415.807 302.092C414.438 283.717 416.858 275.079 438.108 272.771Z" fill="black"/>
<path d="M335.841 248.948C338.974 248.591 341.346 248.116 343.875 250.031C345.532 252.043 344.868 267.739 344.868 271.202L344.878 308.926C353.738 308.556 362.947 308.915 371.838 308.786C375.097 308.739 379.832 309.035 380.849 312.56C380.21 314.337 380.477 313.769 378.875 315.128C373.832 316.34 346.52 315.53 339.654 315.502C338.153 315.496 335.861 314.847 334.486 314.053C332.35 305.325 334.37 263.015 333.715 251.784C333.654 250.758 335.06 249.624 335.841 248.948Z" fill="black"/>
<path d="M396.419 272.678C397.258 272.636 398.077 272.678 398.907 272.777C400.539 272.971 402.009 273.195 403.064 274.537C404.654 276.556 404.26 308.836 403.641 313.498C402.922 314.813 401.4 315.212 399.946 315.793C393.768 315.762 392.162 314.791 392.256 308.611C392.419 297.64 391.742 286.392 392.634 275.485C392.734 274.242 395.39 273.143 396.419 272.678Z" fill="black"/>
<path d="M396.953 257.259C400.664 257.247 406.24 258.43 404.754 264.237C403.397 266.149 402.587 266.371 400.653 267.229C396.932 267.335 394.744 267.343 392.218 263.87C391.184 259.48 394.006 258.537 396.953 257.259Z" fill="black"/>
</svg>
```


## SECTION 3 — FILES TO REPLACE

Replace every file below with the complete contents. Do not merge by hand. Do not keep the previous version.

REPLACE:
src/App.tsx

Why: Registers /, /privacy, and /terms, and sets the lander color tokens.

```tsx
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router'
import { ErrorScreen, NotFoundScreen } from '@/components/chrome'
import { Home } from '@/routes/home'
import { PrivacyPolicy, TermsOfService } from '@/routes/legal'

function RootLayout() {
  return (
    <>
      {/* Extrafazant neutrals (off-white, black, white, gunmetal, ash, eerie
          black). Brand red stays the accent. Inter is Helvetica Now; Instrument
          Sans is Serrif. html:root beats the template :root.dark block. */}
      <style>{`
        html:root{
          --font-display:'Instrument Sans Variable',var(--font-system-sans);
          --font-serif:'Instrument Sans Variable',var(--font-system-sans);
          --font-sans:'Inter Variable',var(--font-system-sans);
          --color-primary:#ED1C24;
          --color-primary-foreground:#FFFFFF;
          --color-background:#fbfbfb;
          --color-heading:#101010;
          --color-body:#31383b;
          --color-foreground:#101010;
          --color-card:#ffffff;
          --color-card-foreground:#101010;
          --color-secondary:#eef0f2;
          --color-secondary-foreground:#101010;
          --color-muted:#eef0f2;
          --color-muted-foreground:#7a8489;
          --color-border:color-mix(in srgb, #101010 18%, #fbfbfb);
          --color-input:color-mix(in srgb, #101010 18%, #fbfbfb);
          --color-accent:#ED1C24;
          --color-accent-foreground:#FFFFFF;
          --color-ring:#ED1C24;
          --radius:0px;
        }
        html:root.dark{
          --font-display:'Instrument Sans Variable',var(--font-system-sans);
          --font-serif:'Instrument Sans Variable',var(--font-system-sans);
          --font-sans:'Inter Variable',var(--font-system-sans);
          --color-primary:#ED1C24;
          --color-primary-foreground:#FFFFFF;
          --color-background:#101010;
          --color-heading:#f4f4f4;
          --color-body:#c8cfd3;
          --color-foreground:#f4f4f4;
          --color-card:#171c1c;
          --color-card-foreground:#f4f4f4;
          --color-secondary:#171c1c;
          --color-secondary-foreground:#f4f4f4;
          --color-muted:#171c1c;
          --color-muted-foreground:#8b969c;
          --color-border:color-mix(in srgb, #f4f4f4 22%, #101010);
          --color-input:color-mix(in srgb, #f4f4f4 22%, #101010);
          --color-accent:#ED1C24;
          --color-accent-foreground:#FFFFFF;
          --color-ring:#ED1C24;
          --radius:0px;
        }
        html{scroll-behavior:smooth}
        @media (prefers-reduced-motion: reduce){
          html{scroll-behavior:auto}
        }
        section[id]{scroll-margin-top:5rem}
      `}</style>
      <Outlet />
    </>
  )
}

const rootRoute = createRootRoute({ component: RootLayout })

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicy,
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsOfService,
})

const routeTree = rootRoute.addChildren([homeRoute, privacyRoute, termsRoute])

const router = createRouter({
  routeTree,
  defaultErrorComponent: ErrorScreen,
  defaultNotFoundComponent: NotFoundScreen,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  return <RouterProvider router={router} />
}
```


REPLACE:
src/routes/home.tsx

Why: Finished section order, including the founder frame after About.

```tsx
import { SiteChrome } from '@/components/site-chrome'
import { HeroStage } from '@/components/hero-stage'
import { ManifestoPillars, EcosystemRows, RoadmapProgression, FaqAccordion } from '@/components/editorial-sections'
import { WorkBento, MerchBand } from '@/components/work-merch'
import { AboutBand } from '@/components/about-faq'
import { FounderCrossfade } from '@/components/founder-crossfade'
import { QuoteForm } from '@/components/quote-form'

/**
 * After the hero: about, the people, why one system, the three pillars,
 * the roadmap, then the FAQ. Work and merch stay so the header links still land.
 */
export function Home() {
  return (
    <SiteChrome>
      <HeroStage />

      <AboutBand id="about" />

      <FounderCrossfade />

      <EcosystemRows id="ecosystem" />

      <ManifestoPillars id="solutions" />

      <RoadmapProgression id="roadmap" />

      <FaqAccordion id="faq" />

      <WorkBento id="work" />

      <MerchBand id="merch" />

      <QuoteForm id="contact" />
    </SiteChrome>
  )
}
```


REPLACE:
src/lib/content.ts

Why: All visible lander copy, founder captions, and footer links.

```ts
/**
 * ShackLine Designs - the single authored-content module. Everything the
 * components render as copy lives here, verbatim as supplied: no invented
 * clients, stats, testimonials, awards, case studies, biographies, dates or
 * locations. Hosted brand assets are used exactly as delivered; slots still
 * waiting on an asset compose typography, geometry and whitespace in the
 * brand inks - never a fabricated photograph.
 *
 * Quote requests route to Maria's inbox. RESEND_NOTIFY_TO (set by the owner
 * under Connectors > Resend) takes precedence server-side, so the studio's
 * live configuration always wins over this default.
 */
export const QUOTE_EMAIL = 'MariaReynel@ShackLineDesigns.com'

/** Prefilled subject for the direct email path. */
export const QUOTE_SUBJECT = 'Custom quote request - ShackLine Designs'

/** When the Calendly connector is configured, the owner sets this env var;
 *  empty means the email path stands alone (no placeholder copy ever). */
export const CALENDLY_URL = ''

/** The merch store link is intentionally empty in this build: no external
 *  merch link appears anywhere on the site until the owner supplies it. */
export const MERCH_URL = ''

export const BRAND_NAME = 'Shackline'
export const BRAND_SUFFIX = 'Designs'
export const BRAND_LOCATION = 'Nevada'

/** The supplied wordmark (hand-lettered "Shackline", transparent PNG, wide
 *  aspect). Rendered bare at a fixed height with width auto - never
 *  stretched or squeezed - with "Designs" as live text right after it. */
export const WORDMARK_URL =
  'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791042392/aiwa/attachments/gppjoscvaxsj5lsdupli.png'

/** The supplied atom logomark - the site favicon and the reference for the
 *  CTA prefix icon's brand red. */
export const LOGOMARK_URL =
  'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791042392/aiwa/attachments/kuvmqannk1jg0kovumyx.png'

/** The supplied wordmark under the name the hero stage imports it by: the
 *  hero types this exact image in character by character and renders it as
 *  the choreographed brand object - identical asset to WORDMARK_URL, never
 *  stretched (height set, width auto). The atom logomark stays
 *  LOGOMARK_URL (the favicon). */
export const LOGO_URL = WORDMARK_URL

export const BRAND_MISSION =
  'The architectural engine behind modern business growth - physical branding to digital growth under one roof.'

// ---------------------------------------------------------------- navigation

/** Anchor navigation for the single page. */
export const NAV_LINKS = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Merch', href: '#merch' },
  { label: 'Contact', href: '#contact' },
]

// ---------------------------------------------------------------- hero

/** The staged hero: the corner statements, the middle-left growth line, the
 *  live Nevada clock metadata and the CTAs, all supplied verbatim. */
export const HERO = {
  cornerLeft: 'FROM THE SIDEWALK',
  cornerRight: 'TO THE SCREEN',
  growthLead: 'We Build Your Entire',
  growthTail: 'Growth Ecosystem',
  growthLine: 'We Build Your Entire Growth Ecosystem',
  middleLeft:
    'We build your entire growth ecosystem - ShackLine Designs unifies custom corporate apparel, trend-driven promotional merchandise, high-converting web design, and hyper-local SEO dominance under one roof.',
  support:
    'ShackLine Designs unifies custom corporate apparel, trend-driven promotional merchandise, high-converting web design, and hyper-local SEO dominance under one roof.',
  primaryCta: 'GET A CUSTOM QUOTE',
  primaryCtaHref: '#contact',
  secondaryCta: 'EXPLORE OUR SOLUTIONS',
  secondaryCtaHref: '#solutions',
  reassurance: 'Apparel, merch, web and local SEO under one roof.',
}

/**
 * The choreography objects. The six delivered photographs (two product, two
 * web, two founder) render as the real supplied imagery in their slots; the
 * remaining named slots keep their editorial plates - typography, geometry
 * and whitespace in black, white and #ED3327 - until their assets arrive,
 * never a fabricated photograph or screenshot. `pos` is the authored
 * object-position so the crop is authored, not accidental.
 */
export const HERO_PRODUCTS = [
  {
    ref: 'SHACKLINE_PRODUCT_01',
    caption: 'Custom Corporate Apparel',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026764/aiwa/attachments/tcimxz0ue1f3q9jgknnr.jpg',
    pos: '30% 20%',
  },
  {
    ref: 'SHACKLINE_PRODUCT_02',
    caption: 'Promotional Merchandise',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026763/aiwa/attachments/n37edtm9gnfb3pxssakr.jpg',
    pos: '70% 60%',
  },
  { ref: 'SHACKLINE_PRODUCT_03', caption: 'Event & Launch Gear', pos: '50% 80%' },
]

export const HERO_WEB = [
  {
    ref: 'SHACKLINE_WEB_01',
    caption: 'Custom Web Build',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026884/aiwa/attachments/ifzb08cqdljhneevf3p1.jpg',
    pos: '20% 20%',
  },
  {
    ref: 'SHACKLINE_WEB_02',
    caption: 'Booking & E-Commerce Engines',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026886/aiwa/attachments/bjj7w4sdku46il217pqs.jpg',
    pos: '80% 30%',
  },
  { ref: 'SHACKLINE_WEB_03', caption: 'Local Search Dominance', pos: '60% 70%' },
]

// ---------------------------------------------------------------- manifesto + pillars

export const PILLAR_SECTION = {
  headline: 'The 3 Pillars of Our Ecosystem',
}

export const PILLARS = [
  {
    id: 'physical',
    num: '01',
    name: 'Physical Touchpoints',
    title: 'High-Impact Tangible Branding',
    items: [
      'Custom Corporate Apparel & Uniforms',
      'Eco-Friendly Promotional Products',
      'Grand Opening & Event Branding Kits',
    ],
  },
  {
    id: 'digital',
    num: '02',
    name: 'Digital Foundations',
    title: 'High-Converting Web Architecture',
    items: [
      'Custom, Lightning-Fast Web Design',
      'Mobile-First Responsive Interfaces',
      'Automated Booking & E-Commerce Engines',
    ],
  },
  {
    id: 'visibility',
    num: '03',
    name: 'Visibility Engines',
    title: 'Local Search & Review Dominance',
    items: [
      'Google Business Profile & Map Pack Optimization',
      'Multi-Channel Media Marketing',
      'Automated Customer Review & Reputation Systems',
    ],
  },
]

// ---------------------------------------------------------------- ecosystem

export const ECOSYSTEM = {
  eyebrow: 'Why a Unified Ecosystem Wins',
  headline: 'Why a Unified Ecosystem Wins',
  rows: [
    {
      num: '01',
      label: 'Zero Fragmentation',
      body: 'No more juggling a separate promo supplier, web developer, and SEO agency. We manage your entire brand under one roof.',
    },
    {
      num: '02',
      label: 'Data-Driven Results',
      body: 'From physical customer impressions to digital web conversions, our growth strategies are backed by clear metrics.',
    },
    {
      num: '03',
      label: 'Turnkey Scalability',
      body: 'Built to support ambitious startups, growing regional brands, and enterprise teams with automated onboarding merch and web tools.',
    },
  ],
}

// ---------------------------------------------------------------- founders

export const FOUNDERS = {
  eyebrow: '( The people on the line )',
  headline: 'There are a lot of shops that will take one piece of the job. We take the whole line.',
  body: 'One studio, from the printed piece to the map',
  note: 'The faces of ShackLine Designs.',
}

/** The crossfade beat order: FOUNDER_01 through FOUNDER_04. FOUNDER_01-02
 *  are delivered and crossfade as the real portraits inside the one large
 *  container; until FOUNDER_03-04 arrive the cycle runs on the delivered
 *  photographs only - a typographic plate cutting in between real
 *  portraits would read as a missing image, so the composed plates stay as
 *  the no-photographs fallback rather than mixing into the cycle. */
export const HERO_FOUNDERS = [
  {
    ref: 'FOUNDER_01',
    caption: 'FOUNDER_01 · Nevada, USA',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026762/aiwa/attachments/trcgwygsnpoya3pczwqe.jpg',
  },
  {
    ref: 'FOUNDER_02',
    caption: 'FOUNDER_02 · Nevada, USA',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026761/aiwa/attachments/nhhrm5jhztkerasdzgkj.jpg',
  },
  { ref: 'FOUNDER_03', caption: 'FOUNDER_03 · Nevada, USA' },
  { ref: 'FOUNDER_04', caption: 'FOUNDER_04 · Nevada, USA' },
]

// ---------------------------------------------------------------- silos

/** PHYSICAL -> DIGITAL -> VISIBILITY -> GROWTH: the central concept as the
 *  numbered manifesto chain. */
export const SILOS = {
  eyebrow: 'The system',
  headline: 'Physical, digital, visibility, growth',
  intro: 'One continuous line from the first printed piece to the top of the local map - four silos, one system, no seams.',
  kicker: 'PHYSICAL - DIGITAL - VISIBILITY - GROWTH',
  chain: [
    {
      num: '01',
      word: 'PHYSICAL',
      note: 'Custom corporate apparel, promotional merchandise and launch kits - the tangible brand your customers hold.',
    },
    {
      num: '02',
      word: 'DIGITAL',
      note: 'Custom, lightning-fast web design with automated booking and e-commerce engines - the storefront that never closes.',
    },
    {
      num: '03',
      word: 'VISIBILITY',
      note: 'Google Business Profile, map pack optimization and multi-channel media marketing - found first, locally.',
    },
    {
      num: '04',
      word: 'GROWTH',
      note: 'Automated review and reputation systems feeding the whole line - the ecosystem compounding on itself.',
    },
  ],
}

// ---------------------------------------------------------------- solutions

export const SOLUTIONS = {
  eyebrow: 'The solutions',
  headline: 'Three silos, one build',
  claim: {
    title: 'Every touchpoint, one system',
    body: 'Physical touchpoints, digital foundations and visibility engines - designed, printed and shipped by one studio.',
  },
  phases: [
    {
      id: 'physical',
      num: '01',
      name: 'PHYSICAL TOUCHPOINTS',
      tag: 'Apparel & merch',
      mock: 'proof',
      caption: {
        body: 'High-impact tangible branding - the sidewalk half of the system.',
      },
      items: [
        'Custom Corporate Apparel & Uniforms',
        'Eco-Friendly Promotional Products',
        'Grand Opening & Event Branding Kits',
      ],
    },
    {
      id: 'digital',
      num: '02',
      name: 'DIGITAL FOUNDATIONS',
      tag: 'Custom web',
      mock: 'browser',
      caption: {
        body: 'High-converting web architecture - the screen half of the system.',
      },
      items: [
        'Custom, Lightning-Fast Web Design',
        'Mobile-First Responsive Interfaces',
        'Automated Booking & E-Commerce Engines',
      ],
    },
    {
      id: 'visibility',
      num: '03',
      name: 'VISIBILITY ENGINES',
      tag: 'Local SEO',
      mock: 'listing',
      caption: {
        body: 'Local search and review dominance - the growth half of the system.',
      },
      items: [
        'Google Business Profile & Map Pack Optimization',
        'Multi-Channel Media Marketing',
        'Automated Customer Review & Reputation Systems',
      ],
    },
  ],
}

// ---------------------------------------------------------------- difference

export const DIFFERENCE = {
  eyebrow: 'The unified ecosystem',
  headline: 'Why one system wins',
  intro: 'The supplied reasons the unified ecosystem beats juggling separate suppliers - verbatim, no invented numbers.',
  ownColumn: 'SHACKLINE, ONE TEAM',
  otherColumn: 'SEPARATE AGENCIES',
  rows: [
    {
      label: 'CONSISTENCY',
      own: 'One studio prints the apparel, builds the site and runs the visibility - a single, recognizable brand identity across every touchpoint.',
      other: 'A promo supplier, a web developer and an SEO agency each interpreting the brand separately.',
    },
    {
      label: 'HANDOFFS',
      own: 'Zero seams between physical and digital - the launch kit and the landing page ship from the same desk.',
      other: 'Every handoff between vendors is a gap where campaigns stall.',
    },
    {
      label: 'SPEED',
      own: 'Most standard custom builds launch within 2 to 4 weeks on high-speed development frameworks.',
      other: 'Coordinating three vendors multiplies every timeline.',
    },
    {
      label: 'CAMPAIGN ROI',
      own: 'Physical customer impressions and digital web conversions work together, driving better campaign ROI.',
      other: 'Split reporting hides which half of the spend actually worked.',
    },
  ],
}

// ---------------------------------------------------------------- roadmap

export const ROADMAP = {
  eyebrow: 'Our 3-Phase Roadmap for Your Brand',
  headline: 'Our 3-Phase Roadmap for Your Brand',
  intro: '',
  phases: [
    {
      num: '01',
      name: 'Total Platform Integration',
      title: '',
      body: 'Merge your physical assets (custom apparel and promotional merch) with a fresh, modern website to establish an instantly recognizable brand identity.',
    },
    {
      num: '02',
      name: 'Hyper-Local Dominance',
      title: '',
      body: 'Activate our local visibility engines. We optimize your Google Business profile and map rankings to capture top-of-search intent in your area.',
    },
    {
      num: '03',
      name: 'Autonomous Growth',
      title: '',
      body: 'Deploy automated internal systems, such as automated customer review invites and turnkey employee onboarding merch kits.',
    },
  ],
}

// ---------------------------------------------------------------- about

/** The company description, supplied verbatim. */
export const ABOUT = {
  eyebrow: 'About Us',
  headline: 'Welcome to ShackLine Designs',
  paragraphs: [
    'At ShackLine Designs, we are the architectural engine behind modern business growth. We bridge the gap between your physical storefront and the digital world, transforming your offline presence into a high-performing, customer-attracting ecosystem.',
    'Whether you are launching a grand opening with custom corporate apparel and promotional merchandise, or scaling your digital footprint with a lightning-fast website and local Google Map dominance, ShackLine builds the exact infrastructure your brand needs to succeed.',
  ],
}

// ---------------------------------------------------------------- faq (verbatim, as supplied)

export const FAQ = {
  eyebrow: 'Frequently Asked Questions',
  headline: 'Frequently Asked Questions',
  items: [
    {
      question: 'Why should I work with ShackLine Designs instead of separate agencies?',
      answer:
        'Working with one team guarantees brand consistency across your printed apparel, promotional items, and online marketing, saving you time, reducing friction, and driving better campaign ROI.',
    },
    {
      question: 'Do you offer custom promotional packages for grand openings and events?',
      answer:
        'Yes! We craft custom physical-plus-digital launch bundles that combine on-site promotional gear with online lead capture tools.',
    },
    {
      question: 'How long does a custom web build take with ShackLine?',
      answer:
        'Most standard custom builds are launched within 2 to 4 weeks using our high-speed development frameworks.',
    },
  ],
}

// ---------------------------------------------------------------- contact

export const CONTACT = {
  eyebrow: 'Get a custom quote',
  headline: 'Tell us where your brand is going',
  intro: 'Send the brief - what you are launching, what you need printed, built or found. Every request gets a personal reply from Maria.',
  emailNote: 'Or write directly to Maria - every request gets a personal reply.',
  calendlyNote: 'Prefer a conversation? Book a call and walk the sidewalk-to-screen line together.',
  closingNote: 'No forms lost to funnels, no ticket numbers - a personal reply, every time.',
  paths: {
    email: {
      label: 'Path 01 · Direct',
      title: 'Email Maria directly',
      body: 'The brief lands in the studio inbox with a prefilled subject - the fastest way to a custom quote.',
      cta: 'Email the studio',
      reassurance: 'Replies come from Maria, personally.',
    },
    call: {
      label: 'Path 02 · Conversation',
      title: 'Book a call with the studio',
      body: 'Walk the sidewalk-to-screen line together before the quote is written.',
      connectedCta: 'Book a call',
      connectedReassurance: 'Pick a time that suits you - the studio confirms personally.',
      fallbackTitle: 'The studio scheduler is being set up',
      fallbackBody: 'The booking link is not connected yet. Email the studio and Maria will arrange a time with you directly.',
      fallbackCta: 'Request a call by email',
      fallbackReassurance: 'A time is always arranged personally - never a queue.',
    },
  },
}

// ---------------------------------------------------------------- work

/** The work sheet: five deliverable slots the studio actually produces.
 *  No invented clients, no borrowed logos - each frame is honestly marked
 *  as in production until a supplied case asset exists. */
export const WORK = {
  eyebrow: 'The work',
  headline: 'What the system ships',
  intro: 'The deliverables the studio produces every week - the same objects the hero choreographs, shown as the finished line.',
  caption: 'Case study in production',
  frames: [
    { label: 'Corporate Apparel', tag: 'Physical' },
    { label: 'Launch Merch', tag: 'Physical' },
    { label: 'Website', tag: 'Digital' },
    { label: 'Local Listing', tag: 'Visibility' },
    { label: 'The Full System', tag: 'Bundle' },
  ],
}

// ---------------------------------------------------------------- merch

export const MERCH = {
  eyebrow: 'The merch line',
  headline: 'BUILT FROM THE STREET',
  intro: 'The same heavyweight cotton the studio prints for its clients, carrying the studio\'s own mark - printed, pressed and shipped from Nevada.',
  cta: 'Visit the merch store',
  ticker: [
    'HEAVYWEIGHT TEES',
    'EMBROIDERED CAPS',
    'SCREEN-PRINTED HOODIES',
    'TOTE BAGS',
    'LAUNCH KITS',
    'UNIFORM PROGRAMS',
    'ECO PRODUCTS',
    'EVENT GEAR',
  ],
}

// ---------------------------------------------------------------- footer

export const FOOTER = {
  crown: {
    eyebrow: 'The proof is ready',
    headline: 'From the sidewalk to the screen - as one build',
    sub: 'Apparel, merch, web and local SEO, quoted as one system by one team.',
    cta: { label: 'GET A CUSTOM QUOTE', href: '#contact' },
    secondary: { label: 'EXPLORE OUR SOLUTIONS', href: '#solutions' },
    reassurance: 'Replies come from Maria, personally.',
  },
  columns: [
    {
      heading: 'Solutions',
      links: [
        { label: 'Physical touchpoints', href: '#physical' },
        { label: 'Digital foundations', href: '#digital' },
        { label: 'Visibility engines', href: '#visibility' },
        { label: 'The roadmap', href: '#roadmap' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Why one system', href: '#ecosystem' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ],
  contactRows: [
    { label: 'Email', value: QUOTE_EMAIL, href: `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(QUOTE_SUBJECT)}` },
    { label: 'Studio', value: 'Nevada, USA' },
  ],
  legal: {
    copyright: 'Shackline',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
}

export const SMS_DISCLOSURE =
  'Message frequency varies. Message & data rates may apply. Reply STOP to cancel, HELP for help.'

export const SMS_OPT_IN =
  'I agree to receive text messages from ShackLine Designs regarding order updates, project quotes, and account alerts. Message frequency varies. Message & data rates may apply. Reply STOP to opt out at any time or HELP for assistance.'

export const SMS_PRIVACY_CLAUSE =
  'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.'

export const SMS_TERMS_CLAUSE =
  "By opting into ShackLine Designs SMS notifications, you agree to receive automated or transactional text messages related to your account, project quotes, order fulfillments, and customer support inquiries. Consent to receive text messages is not a condition of purchasing any goods or services. You can cancel the SMS service at any time by texting 'STOP'. After sending 'STOP', we will send a message confirming your unsubscribed status. For help, text 'HELP' or contact us at support@shacklinedesigns.com."

export const SMS_SUPPORT_EMAIL = 'support@shacklinedesigns.com'
```


REPLACE:
src/lib/quote-store.ts

Why: Quote form submit state used by the contact section.

```ts
import { create } from 'zustand'
import { postJson, getJson } from '@/lib/api'

export type QuoteStatus = 'idle' | 'submitting' | 'success' | 'error'

export type QuoteResult = {
  id: string
  name: string
  email: string
  phone?: string
  smsOptIn?: boolean
  message: string
  created_at: string
}

export type SchedulingInfo = { connected: boolean; url: string | null }

type QuoteState = {
  status: QuoteStatus
  error: string | null
  result: QuoteResult | null
  scheduling: SchedulingInfo
  schedulingLoaded: boolean
  submit: (input: {
    name: string
    email: string
    message: string
    phone?: string
    smsOptIn?: boolean
  }) => Promise<boolean>
  loadScheduling: () => Promise<void>
  reset: () => void
}

/**
 * The one store for quote-submission state. The submit action owns the
 * lifecycle: it flips to a pending state immediately, performs the request
 * (with the api helper's single retry), and rolls back to the form on
 * failure so every subscriber renders the same truth. No sibling callbacks.
 */
export const useQuoteStore = create<QuoteState>((set) => ({
  status: 'idle',
  error: null,
  result: null,
  scheduling: { connected: false, url: null },
  schedulingLoaded: false,

  submit: async (input) => {
    set({ status: 'submitting', error: null, result: null })
    try {
      const result = await postJson<QuoteResult>('/api/quote', input)
      set({ status: 'success', result })
      return true
    } catch (err) {
      const message =
        err instanceof Error && err.message ? err.message : 'Something went wrong sending your request.'
      // Roll back to the form: the caller keeps its field values and shows
      // this inline message.
      set({ status: 'error', error: message })
      return false
    }
  },

  loadScheduling: async () => {
    try {
      const scheduling = await getJson<SchedulingInfo>('/api/quote/scheduling')
      set({ scheduling, schedulingLoaded: true })
    } catch {
      // The email path stands alone when the scheduling check cannot be
      // made - never a placeholder or an error surface on the page.
      set({ scheduling: { connected: false, url: null }, schedulingLoaded: true })
    }
  },

  reset: () => set({ status: 'idle', error: null, result: null }),
}))
```


REPLACE:
src/components/site-chrome.tsx

Why: Header, wordmark sizing, and the dark footer.

```tsx
import { useEffect, useRef, useState } from 'react'
import { NavShell, NavLinks, MobileMenu, Footer } from '@/components/chrome'
import { ShacklineLogo } from '@/components/shackline-logo'
import {
  BRAND_NAME,
  BRAND_SUFFIX,
  FOOTER,
  NAV_LINKS,
} from '@/lib/content'

/**
 * Unfilled header sized to Extrafazant's desktop nav.
 * 1em is their fluid root (--ef-nav-size): 16px at a 1920px canvas.
 * The quote control is their button-093: stacked labels, orbiting dots,
 * and a scale grown by 12px wide and 6px tall.
 */

const TRACKED = ['solutions', 'work', 'about', 'merch', 'contact']
const QUOTE_WIDTH_INCREASE = 12
const QUOTE_HEIGHT_INCREASE = 6
const WORDMARK_ON_DARK = '#ffffff'
const WORDMARK_ON_LIGHT = '#000000'
const LIGHT_SURFACE_LUMINANCE = 0.55
const LOGO_VIEWBOX_WIDTH = 1145
const LOGO_WIDTH_EM = 10
const ROUNDED_CAP_RATIO = 0.716
/** The word Shackline inside the logo, measured from the artwork, not the full viewBox. */
const SHACKLINE_LETTER_TOP = 41
const SHACKLINE_LETTER_BOTTOM = 151
const SHACKLINE_LETTER_HEIGHT = SHACKLINE_LETTER_BOTTOM - SHACKLINE_LETTER_TOP
const SUFFIX_FONT_EM = (LOGO_WIDTH_EM * SHACKLINE_LETTER_HEIGHT) / LOGO_VIEWBOX_WIDTH / ROUNDED_CAP_RATIO
const SUFFIX_OPTICAL_NUDGE = '0.06em'
const SUFFIX_STYLE = {
  fontSize: `${SUFFIX_FONT_EM}em`,
  transform: `translateY(${SUFFIX_OPTICAL_NUDGE})`,
}
const HEADER_BAND_TOP = '1em'
const HEADER_BAND = '3em'
const WORDMARK_LAYER = 50
const WORDMARK_PAD = 'max(2em, env(safe-area-inset-left))'
const WORDMARK_GAP = '0.35em'
const NAV_INK = '#131313'
const NAV_INK_HOVER = '#6b6b6b'
const NAV_PAPER = '#ffffff'

function opaqueRgb(value: string) {
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/)
  if (!match) return null
  const alpha = match[4] === undefined ? 1 : Number(match[4])
  if (alpha < 0.5) return null
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
}

function isLightSurface(red: number, green: number, blue: number) {
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
  return luminance >= LIGHT_SURFACE_LUMINANCE
}

function inkForSurface(x: number, y: number) {
  const stack = document.elementsFromPoint(x, y)
  for (const node of stack) {
    if (!(node instanceof Element) || node.closest('[data-site-wordmark]')) continue
    const color = opaqueRgb(getComputedStyle(node).backgroundColor)
    if (!color) continue
    return isLightSurface(color.r, color.g, color.b) ? WORDMARK_ON_LIGHT : WORDMARK_ON_DARK
  }
  return WORDMARK_ON_DARK
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const quoteRef = useRef<HTMLAnchorElement>(null)
  const wordmarkRef = useRef<HTMLAnchorElement>(null)
  const [activeHash, setActiveHash] = useState<string | undefined>(undefined)
  const [barInk, setBarInk] = useState(WORDMARK_ON_DARK)

  useEffect(() => {
    const mark = wordmarkRef.current
    if (!mark) return
    let frame = 0
    let current = WORDMARK_ON_DARK
    const apply = () => {
      frame = 0
      const rect = mark.getBoundingClientRect()
      const ink = inkForSurface(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5)
      if (ink === current) return
      current = ink
      mark.style.color = ink
      setBarInk(ink)
    }
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const theme = new MutationObserver(schedule)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      theme.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.38
      let current: string | undefined
      for (const id of TRACKED) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= probe) current = `#${id}`
      }
      setActiveHash(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const button = quoteRef.current
    if (!button) return
    const dots = button.querySelectorAll<HTMLElement>('.ef-quote__dot')
    dots.forEach((dot, index) => dot.style.setProperty('--index', String(index)))
    const update = () => {
      const width = button.offsetWidth
      const height = button.offsetHeight
      if (!width || !height) return
      button.style.setProperty('--button-093-scale-x', String((width + QUOTE_WIDTH_INCREASE) / width))
      button.style.setProperty('--button-093-scale-y', String((height + QUOTE_HEIGHT_INCREASE) / height))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(button)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sl-paper flex min-h-screen flex-col font-sans text-foreground antialiased">
      <NavShell
        surface="transparent"
        sticky={false}
        data-site-header=""
        className="fixed inset-x-0 top-0"
        style={{
          fontSize: 'var(--ef-nav-size)',
          '--nav-ink': NAV_INK,
          '--nav-ink-hover': NAV_INK_HOVER,
        } as React.CSSProperties}
        innerClassName="sl-header-pad !h-[4em] !max-w-none !items-center !gap-0 !pt-[1em] !pb-0"
      >
        <nav
          aria-label="Sections"
          className="pointer-events-none absolute top-[1.25em] left-1/2 z-10 hidden -translate-x-1/2 lg:block"
        >
          <div
            className="pointer-events-auto flex h-[3em] items-center px-[1.25em]"
            style={{ backgroundColor: NAV_PAPER }}
          >
            <NavLinks
              links={NAV_LINKS}
              activeHref={activeHash}
              indicator="none"
              className="ef-nav-face !gap-[1.5em] [&_a]:!h-auto [&_a]:!min-h-0 [&_a]:!rounded-none [&_a]:!bg-transparent [&_a]:!px-0 [&_a]:!py-0 [&_a]:!font-bold [&_a]:!text-[length:1em] [&_a]:!uppercase [&_a]:!tracking-normal [&_a]:![font-stretch:75%]"
            />
          </div>
        </nav>

        <div className="relative z-10 ml-auto flex items-center">
          <a
            ref={quoteRef}
            href="#contact"
            className="ef-quote ef-nav-face hidden lg:inline-grid"
            style={{ color: NAV_INK }}
          >
            <span className="ef-quote__bg" />
            <span className="ef-quote__inner">
              <span className="ef-quote__dots">
                <span className="ef-quote__dot" />
                <span className="ef-quote__dot is-a" />
                <span className="ef-quote__dot is-b" />
                <span className="ef-quote__dot is-c" />
              </span>
              <span className="ef-quote__text-wrap">
                <span className="ef-quote__text is-default">Get a Quote</span>
                <span className="ef-quote__text is-hover" aria-hidden="true">
                  Get a Quote
                </span>
              </span>
            </span>
          </a>
          <MobileMenu links={NAV_LINKS} activeHref={activeHash} ink={barInk} cta={{ label: 'Get a Custom Quote', href: '#contact' }} />
        </div>
      </NavShell>
      <a
        ref={wordmarkRef}
        href="#top"
        data-site-wordmark=""
        aria-label={`${BRAND_NAME} ${BRAND_SUFFIX}`}
        className="fixed top-0 left-0 inline-flex items-center"
        style={{
          zIndex: WORDMARK_LAYER,
          color: WORDMARK_ON_DARK,
          fontSize: 'var(--ef-nav-size)',
          height: '4em',
          paddingTop: HEADER_BAND_TOP,
          paddingLeft: WORDMARK_PAD,
          boxSizing: 'border-box',
          transition: 'none',
        }}
      >
        <ShacklineLogo />
      </a>
      <a
        href="#top"
        tabIndex={-1}
        aria-hidden="true"
        data-site-wordmark=""
        className="pointer-events-auto fixed flex items-center mix-blend-difference"
        style={{
          zIndex: WORDMARK_LAYER,
          color: WORDMARK_ON_DARK,
          fontSize: 'var(--ef-nav-size)',
          top: HEADER_BAND_TOP,
          left: `calc(${WORDMARK_PAD} + var(--ef-logo-width) + ${WORDMARK_GAP})`,
          height: HEADER_BAND,
        }}
      >
        <span className="ef-designs" style={SUFFIX_STYLE}>
          {BRAND_SUFFIX}
        </span>
      </a>

      <main id="top" className="flex-1">
        {children}
      </main>

      <Footer
        style="cta-crowned"
        className="sl-footer-dark"
        brand={{
          name: `${BRAND_NAME} ${BRAND_SUFFIX}`,
          href: '#top',
          lockup: (
            <span className="inline-flex items-center gap-[0.35em]">
              <ShacklineLogo />
              <span className="ef-designs" style={SUFFIX_STYLE}>
                {BRAND_SUFFIX}
              </span>
            </span>
          ),
        }}
        columns={FOOTER.columns}
        crown={{
          eyebrow: FOOTER.crown.eyebrow,
          headline: FOOTER.crown.headline,
          sub: FOOTER.crown.sub,
          cta: FOOTER.crown.cta,
          secondary: FOOTER.crown.secondary,
          reassurance: FOOTER.crown.reassurance,
        }}
        contact={{ rows: FOOTER.contactRows }}
        microSignals={['local-time', 'theme-toggle']}
        legal={FOOTER.legal}
      />
    </div>
  )
}
```


REPLACE:
src/components/hero-stage.tsx

Why: Hero choreography. Bottom word is ShackLine. Center word is Designs.

```tsx
import { useEffect, useRef, useState } from 'react'
import { StudioGradient } from '@/components/ui/studio-gradient'
import { studioBackground } from '@/backgrounds/studio-background'
import { BRAND_LOCATION, HERO } from '@/lib/content'
import product01 from '../../others/SHACKLINE_PRODUCT_01.jpg'
import product02 from '../../others/SHACKLINE_PRODUCT_02.jpeg'
import product03 from '../../others/SHACKLINE_PRODUCT_03.jpg'
import product04 from '../../others/SHACKLINE_PRODUCT_04.jpg'
import product05 from '../../others/SHACKLINE_PRODUCT_05.jpeg'
import web01 from '../../others/SHACKLINE_WEB_01.jpg'
import web02 from '../../others/SHACKLINE_WEB_02.jpg'
import web03 from '../../others/SHACKLINE_WEB_03.jpg'
import web04 from '../../others/SHACKLINE_WEB_04.jpg'
import web05 from '../../others/SHACKLINE_WEB_05.jpg'

/**
 * Avecanni desktop hero loop, measured from their 11.76s video.
 * The giant word types on at the bottom, holds, and types off.
 * A smaller word then types in the center and stays, with difference
 * blending, while portrait cards travel one path from right to left.
 */

const WORD = 'ShackLine'
const CENTER_WORD = 'Designs'
const GLYPHS = WORD.length
const BOTTOM_IN_MS = 1000
const BOTTOM_HOLD_MS = 1000
const BOTTOM_OUT_MS = 500
const CENTER_IN_MS = 500
const CENTER_ALONE_MS = 500
const IMAGE_MS = 6500
const CENTER_OUT_MS = 600
const GAP_MS = 1000
const CARD_STAGGER_MS = 420
const CARD_LIFE_MS = 2500
const CARD_ENTER_SHARE = 0.18
const CARD_LEAVE_SHARE = 0.18
const CARD_FLIP = 78
const CARD_RATIO = '3 / 4'
const CARD_MAX_WIDTH = 280
const CARD_ENTRY_VW = 26
const CARD_EXIT_VW = -30
const CARD_ARC_VH = 5
const CARD_TILT_DEG = 8
const CARD_ENTER_SCALE = 0.86
const CARD_LEAVE_SCALE = 0.5
const CARD_REST_GAP_VW = 3.2
const CARD_REST_TILT = 1.1
const CORNER_INSET = 20
const CORNER_LINE = 1.2
const SIDE_LINE = 1.3
const SIDE_WEIGHT = 400
const BOTTOM_LINE = 1
const BOTTOM_SEAT = '0.12em'
const BOTTOM_OFF = 120
const ROUNDED = '"Arial Rounded MT Bold", "Arial Rounded MT", sans-serif'
const HERO_BG = '#101010'
const HERO_INK = '#f4f4f4'
const DIFFERENCE_INK = '#ffffff'
const CLOCK_ZONE = 'America/Los_Angeles'
const CLOCK_INTERVAL_MS = 30_000
const CARD_PERSPECTIVE = '1400px'

const CARDS = [
  { src: product01, alt: 'Shackline product 1' },
  { src: product02, alt: 'Shackline product 2' },
  { src: product03, alt: 'Shackline product 3' },
  { src: product04, alt: 'Shackline product 4' },
  { src: product05, alt: 'Shackline product 5' },
  { src: web01, alt: 'Shackline web 1' },
  { src: web02, alt: 'Shackline web 2' },
  { src: web03, alt: 'Shackline web 3' },
  { src: web04, alt: 'Shackline web 4' },
  { src: web05, alt: 'Shackline web 5' },
]

const CARD_COUNT = CARDS.length

interface CardPose {
  x: number
  y: number
  scale: number
  flip: number
  tilt: number
  visible: boolean
}

function hiddenCard(): CardPose {
  return { x: CARD_ENTRY_VW, y: 0, scale: 0, flip: CARD_FLIP, tilt: 0, visible: false }
}

function cardPose(index: number, elapsed: number): CardPose {
  const local = elapsed - index * CARD_STAGGER_MS
  if (local <= 0 || local >= CARD_LIFE_MS) return hiddenCard()
  const along = local / CARD_LIFE_MS
  const x = CARD_ENTRY_VW + (CARD_EXIT_VW - CARD_ENTRY_VW) * along
  const y = Math.sin(along * Math.PI) * CARD_ARC_VH
  const tilt = (0.5 - along) * CARD_TILT_DEG
  if (along < CARD_ENTER_SHARE) {
    const step = 1 - (1 - along / CARD_ENTER_SHARE) ** 3
    return {
      x,
      y,
      scale: CARD_ENTER_SCALE + (1 - CARD_ENTER_SCALE) * step,
      flip: CARD_FLIP * (1 - step),
      tilt,
      visible: true,
    }
  }
  if (along > 1 - CARD_LEAVE_SHARE) {
    const step = (along - (1 - CARD_LEAVE_SHARE)) / CARD_LEAVE_SHARE
    const eased = step ** 2
    return {
      x,
      y,
      scale: 1 - (1 - CARD_LEAVE_SCALE) * eased,
      flip: -CARD_FLIP * eased,
      tilt,
      visible: step < 1,
    }
  }
  return { x, y, scale: 1, flip: 0, tilt, visible: true }
}

function restingCard(index: number): CardPose {
  const center = (CARD_COUNT - 1) / 2
  return {
    x: (index - center) * CARD_REST_GAP_VW,
    y: 0,
    scale: 1,
    flip: 0,
    tilt: (index - center) * CARD_REST_TILT,
    visible: true,
  }
}

type Beat =
  | 'bottom-in'
  | 'bottom-hold'
  | 'bottom-out'
  | 'center-in'
  | 'center-alone'
  | 'images'
  | 'center-out'
  | 'gap'

const SEQUENCE: Array<{ beat: Beat; ms: number }> = [
  { beat: 'bottom-in', ms: BOTTOM_IN_MS },
  { beat: 'bottom-hold', ms: BOTTOM_HOLD_MS },
  { beat: 'bottom-out', ms: BOTTOM_OUT_MS },
  { beat: 'center-in', ms: CENTER_IN_MS },
  { beat: 'center-alone', ms: CENTER_ALONE_MS },
  { beat: 'images', ms: IMAGE_MS },
  { beat: 'center-out', ms: CENTER_OUT_MS },
  { beat: 'gap', ms: GAP_MS },
]

const BOTTOM_BEATS: Beat[] = ['bottom-in', 'bottom-hold', 'bottom-out']
const CENTER_BEATS: Beat[] = ['center-in', 'center-alone', 'images', 'center-out']

function rightInset(revealed: number) {
  return `${(1 - revealed / GLYPHS) * 100}%`
}

function useNevadaClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: CLOCK_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, CLOCK_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function HeroStage() {
  const clock = useNevadaClock()
  const stepRef = useRef(0)
  const [beat, setBeat] = useState<Beat>('bottom-in')
  const [reduceMotion, setReduceMotion] = useState(false)
  const [bottomShown, setBottomShown] = useState(0)
  const [centerShown, setCenterShown] = useState(0)
  const [imageTime, setImageTime] = useState(0)
  const [bottomDrop, setBottomDrop] = useState(BOTTOM_OFF)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let timer = 0
    const run = () => {
      const step = SEQUENCE[stepRef.current]
      setBeat(step.beat)
      timer = window.setTimeout(() => {
        stepRef.current = (stepRef.current + 1) % SEQUENCE.length
        run()
      }, step.ms)
    }
    run()
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const timers: number[] = []
    if (beat === 'bottom-in') {
      setBottomShown(0)
      const step = BOTTOM_IN_MS / GLYPHS
      for (let index = 1; index <= GLYPHS; index += 1) {
        timers.push(window.setTimeout(() => setBottomShown(index), step * index))
      }
      return () => timers.forEach((id) => window.clearTimeout(id))
    }
    if (beat === 'bottom-hold') {
      setBottomShown(GLYPHS)
      return
    }
    if (beat === 'bottom-out') {
      setBottomShown(GLYPHS)
      const step = BOTTOM_OUT_MS / GLYPHS
      for (let index = 1; index <= GLYPHS; index += 1) {
        timers.push(window.setTimeout(() => setBottomShown(GLYPHS - index), step * index))
      }
      return () => timers.forEach((id) => window.clearTimeout(id))
    }
    setBottomShown(0)
  }, [beat, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    if (beat === 'bottom-hold') {
      setBottomDrop(0)
      return
    }
    if (beat !== 'bottom-in' && beat !== 'bottom-out') {
      setBottomDrop(BOTTOM_OFF)
      return
    }
    const from = beat === 'bottom-in' ? BOTTOM_OFF : 0
    const to = beat === 'bottom-in' ? 0 : BOTTOM_OFF
    const ms = beat === 'bottom-in' ? BOTTOM_IN_MS : BOTTOM_OUT_MS
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / ms)
      setBottomDrop(from + (to - from) * progress)
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }
    setBottomDrop(from)
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [beat, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const timers: number[] = []
    if (beat === 'center-in') {
      setCenterShown(0)
      const step = CENTER_IN_MS / GLYPHS
      for (let index = 1; index <= GLYPHS; index += 1) {
        timers.push(window.setTimeout(() => setCenterShown(index), step * index))
      }
      return () => timers.forEach((id) => window.clearTimeout(id))
    }
    if (beat === 'center-alone' || beat === 'images') {
      setCenterShown(GLYPHS)
      return
    }
    if (beat === 'center-out') {
      setCenterShown(GLYPHS)
      const step = CENTER_OUT_MS / GLYPHS
      for (let index = 1; index <= GLYPHS; index += 1) {
        timers.push(window.setTimeout(() => setCenterShown(GLYPHS - index), step * index))
      }
      return () => timers.forEach((id) => window.clearTimeout(id))
    }
    setCenterShown(0)
  }, [beat, reduceMotion])

  useEffect(() => {
    if (reduceMotion || beat !== 'images') {
      setImageTime(0)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      setImageTime(now - start)
      if (now - start < IMAGE_MS) frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [beat, reduceMotion])

  const showBottom = !reduceMotion && BOTTOM_BEATS.includes(beat)
  const showCenter = reduceMotion || CENTER_BEATS.includes(beat)
  const showImages = reduceMotion || beat === 'images'

  return (
    <section
      data-section="type-as-graphic-hero"
      aria-label="ShackLine Designs - from the sidewalk to the screen"
      className="sl-hero relative isolate h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: HERO_BG, color: HERO_INK, perspective: CARD_PERSPECTIVE }}
    >
      <StudioGradient config={studioBackground} />
      {showImages &&
        CARDS.map((card, index) => {
          const pose = reduceMotion ? restingCard(index) : cardPose(index, imageTime)
          if (!pose.visible) return null
          return (
            <img
              key={card.src}
              src={card.src}
              alt={card.alt}
              className="pointer-events-none absolute top-1/2 left-1/2 object-cover"
              style={{
                zIndex: index + 1,
                width: 'var(--sl-card-width)',
                maxWidth: CARD_MAX_WIDTH,
                minWidth: 'var(--sl-card-min)',
                aspectRatio: CARD_RATIO,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                transform: `translate(calc(-50% + ${pose.x}vw), calc(-50% + ${pose.y}vh)) scale(${pose.scale}) rotate(${pose.tilt}deg) rotateY(${pose.flip}deg)`,
              }}
            />
          )
        })}

      {showBottom && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center"
          style={{ fontSize: 'var(--sl-hero-bottom)' }}
        >
          <span
            aria-hidden="true"
            className="block whitespace-nowrap text-white"
            style={{
              fontFamily: ROUNDED,
              fontWeight: SIDE_WEIGHT,
              fontSize: '1em',
              lineHeight: BOTTOM_LINE,
              marginBottom: BOTTOM_SEAT,
              transform: `translateY(${bottomDrop}%)`,
              clipPath: `inset(0 ${rightInset(bottomShown)} 0 0)`,
            }}
          >
            {WORD}
          </span>
        </div>
      )}

      {showCenter && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 mix-blend-difference">
          <span
            className="block whitespace-nowrap text-white"
            style={{
              fontFamily: ROUNDED,
              fontWeight: SIDE_WEIGHT,
              fontSize: 'var(--sl-hero-center)',
              lineHeight: 1,
              clipPath: reduceMotion ? 'inset(0 0 0 0)' : `inset(0 ${rightInset(centerShown)} 0 0)`,
            }}
          >
            {CENTER_WORD}
          </span>
        </div>
      )}

      <div
        className="sl-hero__corners pointer-events-none absolute z-20 flex items-start justify-between"
        style={{ top: 'var(--sl-hero-corner-top)', left: CORNER_INSET, right: CORNER_INSET }}
      >
        <h1 className="ef-heading m-0" style={{ fontSize: 'var(--sl-hero-corner)', lineHeight: CORNER_LINE }}>
          {HERO.cornerLeft}
        </h1>
        <p className="ef-heading m-0 text-right" style={{ fontSize: 'var(--sl-hero-corner)', lineHeight: CORNER_LINE }}>
          {HERO.cornerRight}
        </p>
      </div>

      <div
        className="sl-hero__mid pointer-events-none absolute inset-0 flex items-center"
        style={{ paddingLeft: CORNER_INSET, paddingRight: CORNER_INSET }}
      >
        <div className="sl-hero__mid-row flex w-full items-start justify-between">
          <p
            className="ef-body relative z-20 m-0 mix-blend-difference"
            style={{
              color: DIFFERENCE_INK,
              fontSize: 'var(--sl-hero-side)',
              fontWeight: SIDE_WEIGHT,
              lineHeight: SIDE_LINE,
              letterSpacing: 'normal',
              maxWidth: 'var(--sl-hero-side-width)',
            }}
          >
            {HERO.middleLeft}
          </p>
          <div className="sl-hero__clock relative z-20 flex flex-col items-end text-right">
            <p
              className="ef-body m-0"
              style={{ fontSize: 'var(--sl-hero-side)', fontWeight: SIDE_WEIGHT, lineHeight: SIDE_LINE, letterSpacing: 'normal' }}
              aria-label={`Local time in Nevada: ${clock}`}
            >
              {clock}
            </p>
            <p
              className="ef-body m-0"
              style={{ fontSize: 'var(--sl-hero-side)', fontWeight: SIDE_WEIGHT, lineHeight: SIDE_LINE, letterSpacing: 'normal' }}
            >
              {BRAND_LOCATION}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```


REPLACE:
src/components/hero-sheet.tsx

Why: Hero sheet kept in sync with the current hero.

```tsx
import { RegistrationMark } from '@/components/registration-mark'
import { cn } from '@/lib/utils'

/**
 * The stage plates: the independent editorial objects the hero timeline
 * choreographs. A slot with a delivered asset (SHACKLINE_PRODUCT_01-02,
 * SHACKLINE_WEB_01-02) renders the real supplied imagery - object-cover on
 * the authored object-position from the stage table, inside the same
 * hairline press frame and caption bar, so the photographs join the
 * composition as printed objects rather than breaking it. A slot still
 * waiting on its asset keeps the honest plate composed of typography,
 * geometry and whitespace in black, white and #ED3327 - never a fabricated
 * photograph or screenshot. Swapping a plate body for its real asset never
 * touches the master timeline.
 */

/** A physical product plate: the supplied photograph as a printed object - a
 *  hairline frame, a scrimmed caption bar and the red registration dot; the
 *  undelivered fallback is the matte black sheet with the red crosshair. */
export function ProductPlate({
  caption,
  asset,
  src,
  pos,
  className,
}: {
  caption: string
  asset: string
  src?: string
  pos?: string
  className?: string
}) {
  if (src) {
    return (
      <figure
        className={cn(
          'relative m-0 aspect-[4/5] select-none overflow-hidden border border-foreground/20 bg-card text-foreground',
          className,
        )}
        aria-hidden="true"
      >
        <img
          crossOrigin="anonymous"
          src={src}
          alt={caption}
          data-aiwa-asset={asset}
          className="absolute inset-0 h-full w-full object-cover"
          style={pos ? { objectPosition: pos } : undefined}
        />
        {/* the press frame carried over the photograph */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 border border-background/45"
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-background/20 bg-foreground/60 px-5 py-3 backdrop-blur-[2px]">
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-background">
            {caption}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
        </figcaption>
      </figure>
    )
  }

  return (
    <figure
      className={cn(
        'relative m-0 flex aspect-[4/5] select-none items-center justify-center overflow-hidden bg-foreground text-background',
        className,
      )}
      aria-hidden="true"
    >
      {/* hairline inner frame */}
      <span className="absolute inset-3 border border-background/25" />
      {/* red registration crosshair - the press motif */}
      <span className="relative text-primary">
        <RegistrationMark size={64} strokeWidth={2.5} withDot />
      </span>
      {/* spec line */}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-background/15 px-5 py-3">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-background/70">
          {caption}
        </span>
        <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
      </figcaption>
    </figure>
  )
}

/** A web plate: the supplied build screenshot as the screen object - a
 *  hairline frame with a scrimmed header bar carrying the mono label and
 *  the three window dots; the undelivered fallback is the white sheet with
 *  the black hairline grid and the red anchor block. */
export function WebPlate({
  caption,
  asset,
  src,
  pos,
  className,
}: {
  caption: string
  asset: string
  src?: string
  pos?: string
  className?: string
}) {
  if (src) {
    return (
      <figure
        className={cn(
          'relative m-0 aspect-[16/10] select-none overflow-hidden border border-foreground/20 bg-card text-foreground',
          className,
        )}
        aria-hidden="true"
      >
        <img
          crossOrigin="anonymous"
          src={src}
          alt={caption}
          data-aiwa-asset={asset}
          className="absolute inset-0 h-full w-full object-cover"
          style={pos ? { objectPosition: pos } : undefined}
        />
        <figcaption className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-background/20 bg-foreground/60 px-5 py-3 backdrop-blur-[2px]">
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-background">
            {caption}
          </span>
          <span className="flex gap-1" aria-hidden="true">
            <i className="block h-1.5 w-1.5 bg-background" />
            <i className="block h-1.5 w-1.5 bg-background" />
            <i className="block h-1.5 w-1.5 bg-primary" />
          </span>
        </figcaption>
      </figure>
    )
  }

  return (
    <figure
      className={cn(
        'relative m-0 flex aspect-[16/10] select-none items-center justify-center overflow-hidden border border-foreground bg-card text-foreground',
        className,
      )}
      aria-hidden="true"
    >
      {/* hairline structure grid */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '25% 33.333%',
        }}
      />
      {/* the red anchor mass - the conversion point of the build */}
      <span className="absolute bottom-0 left-0 h-[26%] w-[38%] bg-primary" />
      <span className="absolute bottom-[26%] left-0 h-px w-full bg-foreground" />
      {/* mono label */}
      <figcaption className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-foreground/15 bg-card/85 px-5 py-3">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
          {caption}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          <i className="block h-1.5 w-1.5 bg-foreground" />
          <i className="block h-1.5 w-1.5 bg-foreground" />
          <i className="block h-1.5 w-1.5 bg-primary" />
        </span>
      </figcaption>
    </figure>
  )
}
```


REPLACE:
src/components/about-faq.tsx

Why: About section on the paper ground.

```tsx
import { useState } from 'react'
import { ABOUT, FAQ } from '@/lib/content'
import { StudioSection } from '@/components/studio-copy'
import { GlitchHeadline } from '@/components/glitch-headline'
import { cn } from '@/lib/utils'

/** The company description, set as a reading column. */
export function AboutBand({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="about" tone="white">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <GlitchHeadline className="sl-display sl-display-lg lg:col-span-5">{ABOUT.headline}</GlitchHeadline>
        <div className="flex max-w-[58ch] flex-col gap-5 lg:col-span-7 lg:pt-3">
          {ABOUT.paragraphs.map((paragraph) => (
            <p key={paragraph} className="sl-copy">
              {paragraph}
            </p>
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
```


REPLACE:
src/components/founder-crossfade.tsx

Why: Founder copy with the portrait on the right.

```tsx
import { useEffect, useState } from 'react'
import { FOUNDERS, HERO_FOUNDERS } from '@/lib/content'
import { StudioSection } from '@/components/studio-copy'
import { cn } from '@/lib/utils'

const CYCLE = HERO_FOUNDERS.filter((founder) => Boolean(founder.src))
const HOLD_MS = 3600

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
          <p className="font-sans text-base tracking-[-0.02em] text-foreground">{FOUNDERS.eyebrow}</p>
          <h2 className="sl-display sl-display-lg mt-6 max-w-[16ch]">{FOUNDERS.headline}</h2>
          <p className="sl-copy mt-6 max-w-[36ch]">{FOUNDERS.body}</p>
        </div>
        <div className="sl-founder-frame">
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
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none',
                  front ? 'opacity-100' : 'opacity-0',
                )}
              />
            )
          })}
        </div>
      </div>
    </StudioSection>
  )
}
```


REPLACE:
src/components/editorial-sections.tsx

Why: Ecosystem, pillars, roadmap stacks, and FAQ.

```tsx
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
```


REPLACE:
src/components/work-merch.tsx

Why: Work list and merch collage.

```tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MERCH, MERCH_URL, WORK } from '@/lib/content'
import { displayTitle } from '@/components/studio-copy'
import { GlitchHeadline } from '@/components/glitch-headline'
import { StreetCollage } from '@/components/street-collage'
import product01 from '../../others/SHACKLINE_PRODUCT_01.jpg'
import product02 from '../../others/SHACKLINE_PRODUCT_02.jpeg'
import product05 from '../../others/SHACKLINE_PRODUCT_05.jpeg'
import web01 from '../../others/SHACKLINE_WEB_01.jpg'
import web02 from '../../others/SHACKLINE_WEB_02.jpg'

const PREVIEW_SIZE = 332
const PREVIEW_RADIUS = 12
const ROW_REST_OPACITY = 0.3
const ROW_FADE_MS = 300
const PREVIEW_FADE_MS = 300
const PREVIEW_FOLLOW_MS = 500
const PREVIEW_WIPE_MS = 600
const PREVIEW_STACK_LIMIT = 20
const ROW_TITLE_SIZE = 'clamp(28px, 3.33vw, 48px)'
const ROW_TITLE_LEAD = 1.1
const ROW_TITLE_TRACK = '-0.01em'
const TAG_SIZE = 11
const WIPE_EASE = 'cubic-bezier(0.87, 0, 0.13, 1)'
const FOLLOW_EASE = 'cubic-bezier(0.165, 0.84, 0.44, 1)'
const FRAME_START = '-100%'
const PHOTO_START = '90%'
const DESKTOP_QUERY = '(min-width: 1100px) and (hover: hover) and (pointer: fine)'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

const FRAME_IMAGES = [product01, product02, web01, web02, product05]

interface PreviewShot {
  id: number
  index: number
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

function PreviewFrame({ src, alt, reduce }: { src: string; alt: string; reduce: boolean }) {
  const [settled, setSettled] = useState(reduce)
  useEffect(() => {
    if (reduce) return
    const frame = window.requestAnimationFrame(() => setSettled(true))
    return () => window.cancelAnimationFrame(frame)
  }, [reduce])
  const wipe = reduce ? 'none' : `transform ${PREVIEW_WIPE_MS}ms ${WIPE_EASE}`
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ transform: settled ? 'translateY(0)' : `translateY(${FRAME_START})`, transition: wipe }}
    >
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover"
        style={{ transform: settled ? 'translateY(0)' : `translateY(${PHOTO_START})`, transition: wipe }}
      />
    </div>
  )
}

/** Five deliverables in the Focus Areas layout. The first row rests forward.
 *  Hover selects a row and wipes its photo into a square at the center. */
export function WorkBento({ id }: { id?: string }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const shotId = useRef(0)
  const pointerY = useRef<number | null>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [shots, setShots] = useState<PreviewShot[]>([])
  const reduce = useMediaQuery(REDUCE_QUERY)
  const desktop = useMediaQuery(DESKTOP_QUERY)

  const placePreview = (clientY: number, immediate: boolean) => {
    const stage = stageRef.current
    const preview = previewRef.current
    if (!stage || !preview) return
    const y = clientY - stage.getBoundingClientRect().top
    pointerY.current = y
    preview.style.transition = immediate || reduce
      ? `opacity ${PREVIEW_FADE_MS}ms`
      : `transform ${PREVIEW_FOLLOW_MS}ms ${FOLLOW_EASE}, opacity ${PREVIEW_FADE_MS}ms`
    preview.style.transform = reduce
      ? 'translate(-50%, -50%)'
      : `translate(-50%, calc(${y}px - 50%))`
  }

  const pushShot = (index: number) => {
    const nextId = shotId.current + 1
    shotId.current = nextId
    setShots((current) => {
      const next = [...current, { id: nextId, index }]
      return next.length > PREVIEW_STACK_LIMIT ? next.slice(-PREVIEW_STACK_LIMIT) : next
    })
  }

  const select = (index: number, withPhoto: boolean) => {
    setActive(index)
    if (withPhoto && desktop) pushShot(index)
  }

  const leaveList = () => {
    setActive(0)
    setOpen(false)
    setShots([])
    pointerY.current = null
  }

  useLayoutEffect(() => {
    const preview = previewRef.current
    if (!preview || reduce || pointerY.current == null) return
    preview.style.transform = `translate(-50%, calc(${pointerY.current}px - 50%))`
  }, [shots, open, reduce])

  return (
    <section
      id={id}
      data-section="work"
      className="relative flex min-h-svh flex-col justify-center bg-transparent text-foreground"
    >
      <div ref={stageRef} className="sl-wrap relative !py-[60px] md:!py-20">
        <h2 className="sl-display sl-display-lg mb-8 md:mb-12">{WORK.headline}</h2>
        <p className="sl-copy mb-8 max-w-[46ch] md:mb-12">{WORK.intro}</p>
        <div
          className="flex flex-col gap-6 md:gap-8"
          onMouseEnter={(event) => {
            if (!desktop) return
            setOpen(true)
            placePreview(event.clientY, true)
          }}
          onMouseMove={(event) => {
            if (!desktop || reduce) return
            placePreview(event.clientY, false)
          }}
          onMouseLeave={() => {
            if (desktop) leaveList()
          }}
        >
          {WORK.frames.map((frame, index) => {
            const selected = reduce || active === index
            return (
              <div
                key={frame.label}
                className="cursor-pointer border-b border-border py-[6px]"
                onMouseEnter={() => {
                  if (desktop) select(index, true)
                }}
                onClick={() => select(index, false)}
              >
                <div
                  className="flex flex-col gap-2 transition-opacity md:flex-row md:items-end"
                  style={{
                    opacity: selected ? 1 : ROW_REST_OPACITY,
                    transitionDuration: `${ROW_FADE_MS}ms`,
                  }}
                >
                  <h2
                    className="sl-display md:w-[58%] xl:w-[75%]"
                    style={{ fontSize: ROW_TITLE_SIZE, fontWeight: 400, lineHeight: ROW_TITLE_LEAD, letterSpacing: ROW_TITLE_TRACK }}
                  >
                    {frame.label}
                  </h2>
                  <p
                    className="font-sans uppercase text-muted-foreground md:w-[42%] md:pb-[6px] xl:w-[25%]"
                    style={{ fontSize: TAG_SIZE, letterSpacing: ROW_TITLE_TRACK, lineHeight: 1.2 }}
                  >
                    {frame.tag}
                  </p>
                </div>
                {!desktop && active === index ? (
                  <img
                    src={FRAME_IMAGES[index]}
                    alt=""
                    className="mt-4 aspect-[4/3] w-full max-w-md object-cover"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
        <div
          ref={previewRef}
          aria-hidden="true"
          className={desktop ? 'pointer-events-none absolute left-1/2 overflow-hidden' : 'hidden'}
          style={{
            width: PREVIEW_SIZE,
            height: PREVIEW_SIZE,
            borderRadius: PREVIEW_RADIUS,
            top: reduce ? '50%' : 0,
            opacity: open && shots.length > 0 ? 1 : 0,
            transition: `opacity ${PREVIEW_FADE_MS}ms`,
            transform: reduce ? 'translate(-50%, -50%)' : undefined,
          }}
        >
          {shots.map((shot) => (
            <PreviewFrame
              key={shot.id}
              src={FRAME_IMAGES[shot.index]}
              alt=""
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/** The merch line, with the Extrafazant collage on the right of the headline. */
export function MerchBand({ id }: { id?: string }) {
  return (
    <section id={id} data-section="merch" className="overflow-x-clip bg-transparent text-foreground">
      <div className="sl-collage-band">
        <div className="sl-collage-copy">
          <GlitchHeadline className="sl-display sl-display-lg">{displayTitle(MERCH.headline)}</GlitchHeadline>
          <p className="sl-copy mt-6 max-w-[46ch]">{MERCH.intro}</p>
          {MERCH_URL ? (
            <a
              href={MERCH_URL}
              target="_blank"
              rel="noreferrer"
              className="sl-display sl-display-sm mt-8 inline-block underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              {MERCH.cta}
            </a>
          ) : null}
          <p className="sl-copy mt-12 max-w-[62ch] border-t sl-rule pt-8 text-muted-foreground">
            {MERCH.ticker.map((item) => displayTitle(item)).join('  ·  ')}
          </p>
        </div>
        <StreetCollage />
      </div>
    </section>
  )
}
```


REPLACE:
src/components/quote-form.tsx

Why: Working quote form.

```tsx
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
```


REPLACE:
src/components/quote-bookend.tsx

Why: Quote bookend kept with the current contact copy.

```tsx
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
```


REPLACE:
src/components/registration-chain.tsx

Why: Current registration chain.

```tsx
import { SILOS } from '@/lib/content'
import { ReasonList, SplitLead, StudioSection } from '@/components/studio-copy'

/**
 * Second section. Laid out like Junca's "Why work with us": a sticky
 * headline and lede, then a numbered list with no cards and no icons.
 */
export function RegistrationChain({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="silos">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20">
        <SplitLead title={SILOS.headline} lede={SILOS.intro} />
        <ReasonList
          reasons={SILOS.chain.map((link) => ({
            num: link.num,
            title: link.word,
            body: link.note,
          }))}
        />
      </div>
    </StudioSection>
  )
}
```


REPLACE:
src/components/registration-mark.tsx

Why: Current registration mark.

```tsx
import { cn } from '@/lib/utils'

/**
 * The studio's registration mark: a press crosshair used as the brand mark,
 * as the nodes of the signature chain, and as quiet section glyphs.
 * stroke keeps the weight stable when it scales.
 */
export function RegistrationMark({
  className,
  size = 20,
  strokeWidth = 1.25,
  withDot = false,
}: {
  className?: string
  size?: number
  strokeWidth?: number
  withDot?: boolean
}) {
  const r = size * 0.3
  const c = size / 2
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      <line x1={c} y1={0} x2={c} y2={size - 0} stroke="currentColor" strokeWidth={strokeWidth} />
      <line x1={0} y1={c} x2={size} y2={c} stroke="currentColor" strokeWidth={strokeWidth} />
      {withDot && <circle cx={c} cy={c} r={Math.max(1.25, size * 0.07)} fill="currentColor" />}
    </svg>
  )
}

/** Thin press crop marks for the four corners of a frame. */
export function CropMarks({ className, inset = 10, length = 14 }: { className?: string; inset?: number; length?: number }) {
  const l = length
  const corner = (rotation: string, style: React.CSSProperties) => (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute block', className)}
      style={{ ...style, transform: rotation }}
    >
      <svg width={l + 1} height={l + 1} viewBox={`0 0 ${l + 1} ${l + 1}`} className="text-border dark:text-border">
        <line x1={0.5} y1={0.5} x2={l + 0.5} y2={0.5} stroke="currentColor" strokeWidth={1} />
        <line x1={0.5} y1={0.5} x2={0.5} y2={l + 0.5} stroke="currentColor" strokeWidth={1} />
      </svg>
    </span>
  )
  return (
    <>
      {corner('', { top: inset, left: inset })}
      {corner('rotate(90deg)', { top: inset, right: inset })}
      {corner('rotate(180deg)', { bottom: inset, right: inset })}
      {corner('rotate(270deg)', { bottom: inset, left: inset })}
    </>
  )
}

/** Small mono eyebrow with a leading registration glyph. */
export function MonoEyebrow({ children, className, mark = true }: { children: React.ReactNode; className?: string; mark?: boolean }) {
  return (
    <p className={cn('ef-eyebrow flex items-center gap-3 text-foreground', className)}>
      {mark && <RegistrationMark size={18} className="text-accent" />}
      <span>{children}</span>
    </p>
  )
}
```


REPLACE:
src/components/solutions-scene.tsx

Why: Current solutions scene.

```tsx
import { SOLUTIONS } from '@/lib/content'
import { displayTitle, SplitLead, StudioSection } from '@/components/studio-copy'

/** The three builds, as a numbered list beside the claim. */
export function SolutionsScene({ id }: { id?: string }) {
  const phases = (SOLUTIONS?.phases ?? []).filter((phase) => Boolean(phase) && phase.name)

  return (
    <StudioSection id={id} section="solutions" tone="white">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20">
        <SplitLead title={SOLUTIONS.headline} lede={SOLUTIONS.claim.body} />
        <ol className="border-t sl-rule">
          {phases.map((phase) => (
            <li
              key={phase.id}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b sl-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
            >
              <span className="sl-index pt-1 text-muted-foreground">{phase.num}</span>
              <div>
                <h3 className="sl-display sl-display-sm">{displayTitle(phase.name)}</h3>
                <p className="sl-copy mt-3 max-w-[46ch]">{phase.caption.body}</p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="sl-copy text-muted-foreground">
                      {displayTitle(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </StudioSection>
  )
}
```


REPLACE:
src/components/system-sections.tsx

Why: Current system sections.

```tsx
import { DIFFERENCE, ROADMAP } from '@/lib/content'
import { displayTitle, SplitLead, StudioSection } from '@/components/studio-copy'

/** One studio against three vendors, set as sentences rather than a table. */
export function DifferenceRail({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="difference" tone="white">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20">
        <SplitLead title={DIFFERENCE.headline} />
        <ol className="border-t sl-rule">
          {DIFFERENCE.rows.map((row, index) => (
            <li
              key={row.label}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b sl-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
            >
              <span className="sl-index pt-1 text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="sl-display sl-display-sm">{displayTitle(row.label)}</h3>
                <p className="sl-copy mt-3 max-w-[46ch]">{row.own}</p>
                <p className="sl-copy mt-2 max-w-[46ch] text-muted-foreground">{row.other}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </StudioSection>
  )
}

/** The same three phases, for any surface that still mounts the walk. */
export function RoadmapWalk({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="roadmap" tone="white">
      <SplitLead title={ROADMAP.headline} lede={ROADMAP.intro} />
      <ol className="mt-14 grid gap-12 border-t sl-rule pt-12 md:grid-cols-3 md:gap-10">
        {ROADMAP.phases.map((phase) => (
          <li key={phase.num}>
            <p className="sl-index text-muted-foreground">{phase.num.replace('PHASE ', '')}</p>
            <h3 className="sl-display sl-display-sm mt-4">{displayTitle(phase.name)}</h3>
            <p className="sl-copy mt-3">{phase.title}</p>
            <p className="sl-copy mt-2">{phase.body}</p>
          </li>
        ))}
      </ol>
    </StudioSection>
  )
}
```


REPLACE:
src/components/ui/evidence-mocks.tsx

Why: Current evidence mocks.

```tsx
import { ArrowRight, MapPin, NavigationArrow, Printer, MagnifyingGlass, Star, StarHalf } from '@phosphor-icons/react'
import { CropMarks } from '@/components/registration-mark'
import { MiniButton } from '@/components/ui/mini-button'
import { cn } from '@/lib/utils'

/**
 * The three evidence blocks: framed UI mocks composed from the studio's own
 * artifacts - a screen-print proof sheet, a custom web build in browser
 * chrome, and a local map listing. No stock imagery, no screenshots;
 * each frame is drawn in the palette and carries crop marks.
 */
export function EvidenceMock({
  kind,
  label,
  tag,
  className,
}: {
  kind: 'proof' | 'browser' | 'listing'
  label: string
  tag: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative border border-border bg-card p-5 transition-colors duration-300 hover:border-foreground/30 sm:p-7',
        className,
      )}
    >
      <CropMarks inset={8} length={12} />

      <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <span className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {tag}
        </span>
      </div>

      {kind === 'proof' && <ProofSheet />}
      {kind === 'browser' && <BrowserFrame />}
      {kind === 'listing' && <MapListing />}
    </div>
  )
}

/* ---------------- 01 · the screen-print proof sheet ---------------- */

function ProofSheet() {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* the garment panel - heavyweight cotton as a layered ink wash */}
      <div className="relative h-44 overflow-hidden border border-border bg-foreground md:h-auto md:w-[46%]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(85% 70% at 30% 22%, color-mix(in srgb, var(--color-background) 28%, var(--color-foreground)) 0%, var(--color-foreground) 68%)' }} />
        <div className="absolute inset-0 opacity-40" style={{ background: 'linear-gradient(115deg, transparent 42%, rgba(248,250,252,0.09) 46%, transparent 52%, rgba(248,250,252,0.07) 60%, transparent 66%)' }} />
        {/* the print: brand mark screened onto the chest */}
        <svg viewBox="0 0 120 120" className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-[58%] text-background" aria-hidden="true">
          <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <line x1="60" y1="14" x2="60" y2="106" stroke="currentColor" strokeWidth="3.5" />
          <line x1="14" y1="60" x2="106" y2="60" stroke="currentColor" strokeWidth="3.5" />
        </svg>
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-background/60">
          240 gsm · black
        </span>
      </div>

      {/* the spec card */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-3 border border-border px-4 py-3">
          <Printer size={16} className="text-primary" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Method</p>
            <p className="text-sm font-medium text-foreground">Screen print - 1 colour, white on black</p>
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Placement</p>
          <div className="flex items-center gap-2">
            {['Full front', 'Left chest', 'Sleeve'].map((p, i) => (
              <span
                key={p}
                className={cn(
                  'border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]',
                  i === 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground',
                )}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Run size</p>
          <div className="grid grid-cols-4 divide-x divide-border border border-border">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <span key={s} className="py-2 text-center font-mono text-xs text-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>

        <MiniButton className="mt-auto w-full">
          Send to proof <ArrowRight size={13} aria-hidden="true" />
        </MiniButton>
      </div>
    </div>
  )
}

/* ---------------- 02 · the custom web build ---------------- */

function BrowserFrame() {
  return (
    <div className="border border-border">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="block h-2.5 w-2.5 rounded-full border border-border bg-card" />
          <i className="block h-2.5 w-2.5 rounded-full border border-border bg-card" />
          <i className="block h-2.5 w-2.5 rounded-full border border-border bg-card" />
        </span>
        <span className="flex-1 border border-border bg-card px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          yourbrand.com
        </span>
      </div>

      {/* the site mock - the same broadsheet language, miniaturised */}
      <div className="bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">Yourbrand</span>
          <span className="hidden gap-3 sm:flex">
            {['Shop', 'Story', 'Visit'].map((n) => (
              <span key={n} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {n}
              </span>
            ))}
          </span>
          <MiniButton variant="filled" className="min-h-8 px-3 py-1 text-[10px]">Shop the drop</MiniButton>
        </div>

        <div className="px-4 py-7">
          <p className="max-w-[24ch] ef-heading ef-xs text-foreground">
            The opening drop
          </p>
          <p className="mt-2 max-w-[36ch] text-xs leading-relaxed text-muted-foreground">
            Heavyweight tees, printed in one run - and a site that sells them from day one.
          </p>

          {/* lead capture - the form field artifact */}
          <div className="mt-5 flex max-w-sm">
            <label htmlFor="mock-email" className="sr-only">
              Email (mock)
            </label>
            <input
              id="mock-email"
              tabIndex={-1}
              placeholder="you@email.com"
              className="h-11 min-w-0 flex-1 rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <MiniButton variant="filled" className="rounded-none">Get the drop</MiniButton>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {['Launch gear', 'Custom build', 'Found locally'].map((c) => (
            <span key={c} className="px-3 py-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px]">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- 03 · the local map listing ---------------- */

function MapListing() {
  return (
    <div className="flex flex-col gap-0 border border-border">
      {/* the map panel - pin on a hairline grid */}
      <div className="relative h-40 overflow-hidden border-b border-border bg-background sm:h-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.55,
          }}
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 58% 40%, rgba(3,105,201,0.10), transparent 70%)' }} />
        {/* streets */}
        <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-border" aria-hidden="true">
          <path d="M0 132 C90 124 150 150 400 138" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M210 0 C202 60 226 120 218 180" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 62 C120 58 260 74 400 66" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="absolute left-[54%] top-[36%] flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center">
          <MapPin size={30} className="fill-primary text-primary drop-shadow-[0_6px_10px_rgba(3,105,201,0.35)]" aria-hidden="true" />
        </span>
        <span className="absolute bottom-2.5 right-2.5 border border-border bg-card px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          Map data · illustrative
        </span>
      </div>

      {/* the listing card - pin, stars, directions */}
      <div className="bg-card">
        <div className="flex items-start gap-3 border-b border-border px-4 py-4">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center border border-border text-primary">
            <MapPin size={15} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-foreground">Yourbrand - flagship</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Screen printing · Brand studio
            </p>
            <span className="mt-2 flex items-center gap-1.5" aria-label="Rated five stars (illustrative)">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} size={13} className="fill-primary text-primary" aria-hidden="true" />
              ))}
              <StarHalf size={13} className="fill-primary text-primary" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-4">
          <MiniButton variant="filled" className="flex-1">
            <NavigationArrow size={13} aria-hidden="true" /> Get directions
          </MiniButton>
          <MiniButton className="flex-1">
            <MagnifyingGlass size={13} aria-hidden="true" /> Website
          </MiniButton>
        </div>
      </div>
    </div>
  )
}
```


REPLACE:
src/components/ui/stage-scene.tsx

Why: Current stage scene.

```tsx
/**
 * The About full-bleed slot. No stage photograph ships with this build, so
 * the band is drawn as an offline stage composition in the brand's ink and
 * blue: spotlight cones from a radial light source, a layered stage floor
 * with perspective hairlines, and a paper-grain texture - never a flat
 * placeholder and never a silhouette. The verbatim description sits bottom
 * left on a scrim at AA contrast, exactly where the photograph's caption
 * column will live.
 */
export function StageScene() {
  const gid = 'stage-light'
  const fid = 'stage-grain'
  return (
    <div className="absolute inset-0 overflow-hidden bg-foreground text-background" aria-hidden="true">
      <svg preserveAspectRatio="xMidYMax slice" viewBox="0 0 1200 620" className="absolute inset-0 h-full w-full text-background">
        <defs>
          <radialGradient id={gid} cx="50%" cy="0%" r="85%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="45%" stopColor="var(--color-foreground)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-background)" stopOpacity="0" />
          </radialGradient>
          <filter id={fid}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* house light rising from the rig */}
        <rect x="0" y="0" width="1200" height="620" fill={`url(#${gid})`} />

        {/* spotlight cones - layered depth */}
        <g opacity="0.5">
          <polygon points="470,0 610,0 760,420 320,420" fill="currentColor" opacity="0.07" />
          <polygon points="150,0 235,0 420,420 60,420" fill="currentColor" opacity="0.05" />
          <polygon points="965,0 1050,0 1140,420 780,420" fill="currentColor" opacity="0.05" />
        </g>

        {/* the stage - platform edge and floor perspective lines */}
        <g>
          <rect x="0" y="418" width="1200" height="4" fill="var(--color-primary)" opacity="0.65" />
          <line x1="0" y1="422" x2="1200" y2="422" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          {[-140, -60, 20, 100, 180, 260, 340, 420, 500, 580, 660, 740, 820, 900, 980, 1060, 1140, 1220, 1300, 1380].map((x, i) => (
            <line
              key={i}
              x1={600 + (x - 600) * 0.55}
              y1="422"
              x2={x}
              y2="620"
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          ))}
          {[460, 505, 552, 620].map((y, i) => (
            <line key={i} x1="0" y1={y} x2="1200" y2={y} stroke="currentColor" strokeOpacity={0.1 - i * 0.02} strokeWidth="1" />
          ))}
        </g>

        {/* registration motifs on the backline */}
        <g stroke="var(--color-primary)" strokeOpacity="0.55" strokeWidth="1.3" fill="none">
          <g transform="translate(936 96)">
            <circle r="13" />
            <line x1="0" y1="-26" x2="0" y2="26" />
            <line x1="-26" y1="0" x2="26" y2="0" />
          </g>
          <g transform="translate(246 128)" opacity="0.7">
            <circle r="9" />
            <line x1="0" y1="-18" x2="0" y2="18" />
            <line x1="-18" y1="0" x2="18" y2="0" />
          </g>
        </g>

        {/* paper grain over the whole house */}
        <rect x="0" y="0" width="1200" height="620" filter={`url(#${fid})`} opacity="0.08" />
      </svg>

      {/* scrim - keeps the description column at AA contrast over any future photo */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(75deg, color-mix(in srgb, var(--color-foreground) 92%, transparent) 0%, color-mix(in srgb, var(--color-foreground) 55%, transparent) 48%, color-mix(in srgb, var(--color-foreground) 15%, transparent) 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--color-foreground) 90%, transparent), transparent)' }} />
    </div>
  )
}
```


REPLACE:
server/routes/quote.ts

Why: Quote API. Same endpoints and environment names as the original route.

```ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { sendEmail } from '../lib/email'

const app = new Hono()

/** The studio's supplied quote inbox. RESEND_NOTIFY_TO (configured by the
 *  owner under Connectors > Resend) takes precedence when set. */
const QUOTE_INBOX_EMAIL = 'MariaReynel@ShackLineDesigns.com'

// zValidator with NO hook answers a bad body with a raw ZodError object the
// UI cannot render. This hook always returns { error: string } on a 400.
const invalid = (
  result: { success: boolean; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } },
  c: any,
) => {
  if (!result.success) {
    const first = result.error?.issues[0]
    return c.json(
      { error: first ? `${first.path.join('.') || 'input'}: ${first.message}` : 'Invalid input' },
      400,
    )
  }
}

const quoteInput = z.object({
  name: z.string().trim().min(1, 'Tell us your name').max(120),
  email: z.string().trim().email('Enter a valid email address').max(200),
  message: z.string().trim().min(1, 'Add a line about your project').max(2000),
  phone: z.string().trim().max(40).optional().default(''),
  smsOptIn: z.boolean().optional().default(false),
})

/** Scheduling availability: the Calendly booking path renders on the page
 *  only when the connector is actually configured, so the live site never
 *  shows a dead or placeholder booking link. */
let cachedScheduling: { connected: boolean; url: string | null } | null = null

async function calendlyScheduling(): Promise<{ connected: boolean; url: string | null }> {
  if (cachedScheduling) return cachedScheduling
  const token = process.env.CALENDLY_API_TOKEN
  if (!token) return { connected: false, url: null }

  const api = async (path: string) => {
    const res = await fetch(`https://api.calendly.com${path}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`Calendly ${res.status}`)
    return res.json()
  }

  try {
    // Both /event_types and /scheduled_events require the user uri.
    const me = await api('/users/me')
    const userUri: string | undefined = me?.resource?.uri
    if (!userUri) return { connected: false, url: null }

    const chosen = process.env.CALENDLY_EVENT_TYPE_URI
    const list = await api(
      `/event_types?user=${encodeURIComponent(userUri)}&active=true`,
    )
    const types: Array<{ uri: string; scheduling_url?: string; active?: boolean }> =
      list?.collection ?? []
    const offered = chosen ? types.filter((t) => t.uri === chosen) : types
    if (chosen && offered.length === 0) {
      console.warn('[quote] CALENDLY_EVENT_TYPE_URI matches no active event type')
    }
    const withUrl = offered.find((t) => typeof t.scheduling_url === 'string')
    if (!withUrl) return { connected: false, url: null }

    cachedScheduling = { connected: true, url: withUrl.scheduling_url as string }
    return cachedScheduling
  } catch (err) {
    console.error('[quote] Calendly scheduling lookup failed', err)
    return { connected: false, url: null }
  }
}

app.get('/api/quote/scheduling', async (c) => {
  try {
    const scheduling = await calendlyScheduling()
    return c.json(scheduling)
  } catch (err) {
    console.error('[quote] scheduling check failed', err)
    return c.json({ connected: false, url: null })
  }
})

app.post('/api/quote', zValidator('json', quoteInput, invalid), async (c) => {
  const input = c.req.valid('json')
  try {
    // This app's schema declares no tables, so there is no quote_requests
    // row to persist. The request is recorded here as an acknowledged
    // submission with a generated reference, and the email copy to the
    // studio inbox is the record of the request.
    const saved = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      smsOptIn: input.smsOptIn,
      message: input.message,
      created_at: new Date().toISOString(),
    }

    // 2) The email is a courtesy copy to the studio inbox. It never blocks
    //    the request and its outcome is reported honestly.
    const notifyTo = process.env.RESEND_NOTIFY_TO || QUOTE_INBOX_EMAIL
    let emailed = false
    if (notifyTo) {
      emailed = await sendEmail({
        to: notifyTo,
        subject: `New quote request from ${input.name}`,
        html: [
          '<div style="font-family:Helvetica,Arial,sans-serif;color:#111;max-width:560px">',
          '<h2 style="margin:0 0 16px;font-size:20px">New quote request</h2>',
          `<p style="margin:0 0 12px"><strong>Name:</strong> ${escapeHtml(input.name)}</p>`,
          `<p style="margin:0 0 12px"><strong>Email:</strong> ${escapeHtml(input.email)}</p>`,
          `<p style="margin:0 0 12px"><strong>Phone:</strong> ${escapeHtml(input.phone || 'Not given')}</p>`,
          `<p style="margin:0 0 12px"><strong>SMS opt-in:</strong> ${input.smsOptIn ? 'Yes' : 'No'}</p>`,
          `<p style="margin:0 0 12px"><strong>Message:</strong></p>`,
          `<p style="margin:0 0 24px;white-space:pre-wrap;border-left:3px solid #ED3327;padding-left:12px">${escapeHtml(
            input.message,
          )}</p>`,
          '<p style="margin:0;color:#666;font-size:12px">Saved to the studio\'s quote requests. Reply directly to this email to answer.</p>',
          '</div>',
        ].join(''),
      })
    }

    return c.json({ ...saved, emailed }, 201)
  } catch (err) {
    console.error('[quote] create failed', err)
    return c.json({ error: 'Could not send your request. Please email the studio directly.' }, 500)
  }
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default app
```


REPLACE:
src/globals.css

Why: Platform stylesheet plus the finished lander rules: paper ground, secondary button, FAQ column gap, founder portrait, primary type, and merch collage.

```css
@import "tailwindcss";

@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(0 0% 9%);
  --color-card: hsl(0 0% 98%);
  --color-card-foreground: hsl(0 0% 9%);
  --color-primary: hsl(25 95% 53%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-secondary: hsl(0 0% 96%);
  --color-secondary-foreground: hsl(0 0% 9%);
  --color-muted: hsl(0 0% 96%);
  --color-muted-foreground: hsl(0 0% 45%);
  --color-accent: hsl(0 0% 96%);
  --color-accent-foreground: hsl(0 0% 9%);
  --color-destructive: hsl(0 72% 51%);
  --color-destructive-foreground: hsl(0 0% 100%);
  --color-border: hsl(0 0% 90%);
  --color-input: hsl(0 0% 90%);
  --color-ring: hsl(25 95% 53%);
  --radius: 0.5rem;

  /* Type — 3 bundled @fontsource-variable faces (offline-safe) + system fallbacks. Generated apps use
     font-display / font-sans / font-serif / font-mono. Mono is a system stack (no bundled mono face). */
  /* Extrafazant roles: Inter stands in for Helvetica Now (headings, body, nav).
     Instrument Sans stands in for Serrif (alt words, eyebrows, text links). */
  --font-display: "Instrument Sans Variable", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-serif: "Instrument Serif", Georgia, "Times New Roman", serif;
  --color-heading: #101010;
  --color-body: #31383b;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace;
  /* System-only stacks — a free, offline 4th type voice for diverging same-genre builds. */
  --font-system-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-system-serif: Georgia, Cambria, "Times New Roman", serif;
  --font-system-mono: ui-monospace, Menlo, Consolas, monospace;
  /* Extrafazant heading scale at a 16px root: l 96px, xl 128px, xxl 192px. */
  --text-display-lg: clamp(2.75rem, 1.1rem + 3.6vw, 6rem);
  --text-display-xl: clamp(3.5rem, 1.15rem + 4.8vw, 8rem);
  --text-display-2xl: clamp(4.75rem, 1.2rem + 7vw, 12rem);
}

/* uat R160: `--radius` is the app's CONTROL radius, the one shape token the generated :root override
   sets (the design contract names it). Tailwind v4 reads border-radius utilities from the --radius-*
   namespace, so the bare --radius above changed nothing until this block: rounded-sm/md/lg/xl/2xl now
   derive from it (the shadcn v4 scale). At the 0.5rem default every value equals Tailwind's own
   (4/6/8/12/16px), so apps that never set it do not move. `inline` keeps the calc() in the utility so
   it resolves against the override on :root rather than against this layer's default. rounded-full
   stays 9999px: the pill idiom is a stance the contract declares, not a scale step. */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
}

/* Dark palette. `:root.dark` (specificity 0,2,0) deliberately BEATS the plain `:root` block the
   generated App.tsx injects at build time (0,1,0) — relying on source order would lose, because that
   <style> tag is parsed after this stylesheet. src/lib/theme.ts owns the `dark` class on <html>.
   A generated app that ships its own palette overrides BOTH blocks (see the codegen prompt); these
   values are the fallback so the template itself, and any app that only overrides `:root`, still has
   a usable dark mode instead of black-on-white. */
:root.dark {
  --color-background: hsl(0 0% 7%);
  --color-heading: hsl(0 0% 96%);
  --color-body: hsl(0 0% 78%);
  --color-foreground: hsl(0 0% 96%);
  --color-card: hsl(0 0% 11%);
  --color-card-foreground: hsl(0 0% 96%);
  --color-primary: hsl(25 95% 58%);
  --color-primary-foreground: hsl(0 0% 10%);
  --color-secondary: hsl(0 0% 15%);
  --color-secondary-foreground: hsl(0 0% 96%);
  --color-muted: hsl(0 0% 15%);
  --color-muted-foreground: hsl(0 0% 64%);
  --color-accent: hsl(0 0% 18%);
  --color-accent-foreground: hsl(0 0% 96%);
  --color-destructive: hsl(0 72% 58%);
  --color-destructive-foreground: hsl(0 0% 100%);
  --color-border: hsl(0 0% 20%);
  --color-input: hsl(0 0% 20%);
  --color-ring: hsl(25 95% 58%);
}

/* Base surface + text color so EVERY element (incl. provided ui/* components that don't set their own
   text color) inherits the app's foreground, not the browser default black. The per-build :root override
   in App.tsx updates these vars, so body follows the app palette (fixes invisible text on dark apps). */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.4;
}

:root {
  --sl-paper: #fbfbfb;
  --sl-paper-tile: 1024px;
  --sl-secondary-fill: #ffffff;
  --sl-secondary-line: #cfcfcf;
  --sl-secondary-ink: #080808;
  --sl-control-height: 3rem;
  --sl-footer-ground: #101010;
  --sl-footer-ink: #f4f4f4;
  --sl-footer-muted: #c8cfd3;
  --sl-faq-columns: 120px;
  --sl-faq-stack: 40px;
  --sl-founder-width: 22rem;
  --sl-founder-ratio: 3 / 4;
}

.sl-paper {
  background-color: var(--color-background);
}

html:root:not(.dark) .sl-paper {
  background-color: var(--sl-paper);
  background-image: url("/paper-grain.png");
  background-repeat: repeat;
  background-size: var(--sl-paper-tile) var(--sl-paper-tile);
}

.sl-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  height: var(--sl-control-height);
  padding: 0 1rem;
  border: 1px solid var(--sl-secondary-line);
  border-radius: 0;
  background-color: var(--sl-secondary-fill);
  color: var(--sl-secondary-ink);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  font-stretch: 75%;
  font-variation-settings: "wght" 700, "wdth" 75;
  letter-spacing: 0;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
}

.sl-secondary:hover {
  background-color: var(--sl-secondary-fill);
  color: var(--sl-secondary-ink);
}

.sl-secondary:focus-visible {
  outline: 2px solid var(--sl-secondary-ink);
  outline-offset: 2px;
}

.sl-footer-dark {
  background-color: var(--sl-footer-ground);
  color: var(--sl-footer-ink);
  --color-background: var(--sl-footer-ground);
  --color-foreground: var(--sl-footer-ink);
  --color-heading: var(--sl-footer-ink);
  --color-body: var(--sl-footer-muted);
  --color-muted-foreground: var(--sl-footer-muted);
  --color-card: var(--sl-footer-ground);
  --color-card-foreground: var(--sl-footer-ink);
  --color-border: color-mix(in srgb, var(--sl-footer-ink) 18%, var(--sl-footer-ground));
}

.sl-founders {
  display: grid;
  align-items: start;
  gap: 2.5rem;
}

@media (min-width: 64rem) {
  .sl-founders {
    grid-template-columns: minmax(0, 1fr) var(--sl-founder-width);
    column-gap: 4rem;
  }
}

.sl-founder-frame {
  position: relative;
  width: min(100%, var(--sl-founder-width));
  aspect-ratio: var(--sl-founder-ratio);
  overflow: hidden;
  background-color: var(--color-foreground);
}

/* Extrafazant type + space, with ShackLine faces.
   Headings: Inter, uppercase, 700, tracking -0.02em, leading 0.8.
   Alt / eyebrow / text links: Instrument Sans (Serrif), stretch 75%.
   Section rhythm: 128px block padding, 2em page inset, 2em grid gap. */
@layer components {
  .ef-heading {
    font-family: var(--font-display);
    font-weight: 700;
    font-stretch: 75%;
    font-variation-settings: "wght" 700, "wdth" 75;
    letter-spacing: -0.02em;
    line-height: 1.05;
    text-transform: none;
    text-wrap: balance;
    hyphens: none;
    color: var(--color-heading);
  }
  .ef-xxl { font-size: clamp(4.75rem, 1.2rem + 7vw, 12rem); line-height: 0.8; }
  .ef-xl { font-size: clamp(3.5rem, 1.15rem + 4.8vw, 8rem); line-height: 0.8; }
  .ef-l { font-size: clamp(2.75rem, 1.1rem + 3.6vw, 6rem); line-height: 0.8; }
  .ef-m { font-size: clamp(2.5rem, 1rem + 2.8vw, 5rem); line-height: 0.8; }
  .ef-s { font-size: clamp(2.25rem, 1rem + 2.2vw, 4rem); line-height: 0.9; }
  .ef-xs { font-size: clamp(1.5rem, 0.9rem + 1.1vw, 2.5rem); line-height: 0.9; }
  .ef-xxs { font-size: 1.5rem; line-height: 0.9; }
  .ef-alt {
    font-family: var(--font-display);
    font-weight: 500;
    font-stretch: 75%;
    letter-spacing: -0.02em;
    line-height: 1;
    text-transform: none;
  }
  .ef-eyebrow {
    font-family: var(--font-display);
    font-weight: 500;
    font-stretch: 75%;
    font-size: clamp(1.75rem, 1rem + 1.4vw, 2.5rem);
    line-height: 1;
    letter-spacing: -0.02em;
    text-transform: none;
  }
  .ef-body {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: clamp(1.125rem, 1rem + 0.35vw, 1.25rem);
    line-height: 1.5;
    letter-spacing: -0.011em;
    color: var(--color-body);
  }
  .ef-lead {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.4;
    letter-spacing: -0.04em;
  }
  .ef-section {
    width: 100%;
    max-width: 120rem;
    margin-inline: auto;
    padding-block: clamp(4.5rem, 6vw, 8rem);
    padding-inline: clamp(1.25rem, 1.6vw, 2rem);
  }

  /* Headlines: the nav face (Instrument Sans, condensed). Body: Inter at --color-body.
     Indexes, labels and asides: muted. The dark hero keeps its own light ink. */
  .sl-wrap {
    width: 100%;
    max-width: 72rem;
    margin-inline: auto;
    padding-block: clamp(5.5rem, 9vw, 8.5rem);
    padding-inline: clamp(1.25rem, 4vw, 2.5rem);
  }
  .sl-display {
    font-family: var(--font-display);
    font-weight: 700;
    font-stretch: 75%;
    font-variation-settings: "wght" 700, "wdth" 75;
    letter-spacing: 0;
    line-height: 1.05;
    text-transform: none;
    text-wrap: balance;
    color: var(--color-heading);
  }
  .sl-display-lg {
    font-size: clamp(2.75rem, 1.4rem + 3.2vw, 4.75rem);
  }
  .sl-display-md {
    font-size: clamp(2rem, 1.2rem + 1.8vw, 3rem);
    letter-spacing: -0.03em;
  }
  .sl-display-sm {
    font-size: clamp(1.45rem, 1.1rem + 0.7vw, 1.85rem);
    letter-spacing: -0.03em;
    line-height: 1.12;
  }
  .sl-copy {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 1.0625rem;
    line-height: 1.55;
    letter-spacing: -0.011em;
    color: var(--color-body);
  }
  .sl-index {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
    color: var(--color-muted-foreground);
  }
  [data-section="type-as-graphic-hero"] :is(h1, h2, h3, .ef-heading) {
    color: #f4f4f4;
  }
  [data-section="type-as-graphic-hero"] .ef-body {
    color: color-mix(in srgb, #f4f4f4 72%, transparent);
  }
  .sl-rule {
    border-color: color-mix(in srgb, var(--color-foreground) 16%, transparent);
  }
  .ef-inset {
    padding-inline: clamp(1.25rem, 1.6vw, 2rem);
  }

  /* Extrafazant desktop root: 1em = 16px at a 1920 design width.
     body font-size = clamp(min, 100dvw, max) / (ideal / 16). */
  :root {
    --ef-nav-size: calc(clamp(992px, 100dvw, 3840px) / (1920 / 16));
    --ef-logo-width: 10em;
  }

  .ef-designs {
    font-family: "Arial Rounded MT Bold", "Arial Rounded MT", sans-serif;
    font-size: 1.15em;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
    display: inline-flex;
    align-items: center;
  }

  .ef-logo {
    display: block;
    width: var(--ef-logo-width);
    height: auto;
  }

  .ef-nav-face {
    font-family: var(--font-display);
    font-weight: 700;
    font-stretch: 75%;
    font-variation-settings: "wght" 700, "wdth" 75;
    font-size: 1em;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    color: var(--nav-ink, #131313);
  }

  .ef-nav-face a {
    color: var(--nav-ink, #131313);
    transition: color 200ms ease;
  }

  .ef-nav-face a:hover {
    color: var(--nav-ink-hover, #6b6b6b);
  }

  .ef-quote {
    --ef-quote-ease: cubic-bezier(0.32, 0.72, 0, 1);
    --ef-quote-ink: #131313;
    --ef-quote-paper: #fff;
    --ef-quote-dot: var(--color-primary);
    --ef-quote-dot-a: var(--color-primary);
    --ef-quote-dot-b: color-mix(in srgb, var(--color-primary) 55%, white);
    --ef-quote-dot-c: var(--color-primary);
    position: relative;
    display: inline-grid;
    padding: 0;
    color: var(--ef-quote-ink);
    background: transparent;
    line-height: 1;
    text-decoration: none;
    user-select: none;
    scale: 1 1;
    transition: scale 0.45s var(--ef-quote-ease);
    will-change: transform;
  }

  .ef-quote__bg,
  .ef-quote__inner {
    grid-area: 1 / 1;
    border-radius: 0;
  }

  .ef-quote__bg {
    background: var(--ef-quote-paper);
  }

  .ef-quote__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375em;
    width: 100%;
    height: 100%;
    padding: 0.75em 1em 0.75em 0.75em;
    overflow: clip;
  }

  .ef-quote__dots,
  .ef-quote__text-wrap {
    display: grid;
  }

  .ef-quote__dot,
  .ef-quote__text {
    grid-area: 1 / 1;
  }

  .ef-quote__dot {
    width: 0.5em;
    height: 0.5em;
    padding: 0;
    border-radius: 50%;
    background: var(--ef-quote-dot);
    transform-origin: calc((100% + 0.25em) * -1) 50%;
    transition:
      rotate 0.45s var(--ef-quote-ease),
      scale 0.45s var(--ef-quote-ease);
    transition-delay: calc(var(--index, 0) * 0.032s);
  }

  .ef-quote__dot.is-a,
  .ef-quote__dot.is-b,
  .ef-quote__dot.is-c {
    rotate: 120deg;
    scale: 0;
  }

  .ef-quote__dot.is-a { background: var(--ef-quote-dot-a); z-index: 3; }
  .ef-quote__dot.is-b { background: var(--ef-quote-dot-b); z-index: 2; }
  .ef-quote__dot.is-c { background: var(--ef-quote-dot-c); z-index: 1; }

  .ef-quote__text {
    transform-origin: left center;
    transition:
      translate 0.45s var(--ef-quote-ease),
      rotate 0.45s var(--ef-quote-ease);
    white-space: nowrap;
  }

  .ef-quote__text.is-hover {
    rotate: 75deg;
    translate: -0.75em 2em;
  }

  .ef-quote::after {
    content: "";
    position: absolute;
    inset: -0.125em;
    z-index: 1;
    pointer-events: none;
    transition: box-shadow 0.3s var(--ef-quote-ease);
  }

  .ef-quote:focus-visible {
    outline: none;
  }

  .ef-quote:focus-visible::after {
    box-shadow: 0 0 0 0.125em var(--ef-quote-ink);
  }
}

/* Same condensed face as the header quote button. Unlayered so it beats Tailwind's font utilities. */
.ef-button-face,
.ef-nav-face,
.ef-primary,
.ef-primary__text,
.ef-quote,
.ef-quote__text,
.font-serif {
  font-family: var(--font-display);
  font-stretch: 75%;
  font-variation-settings: "wdth" 75;
}

.ef-button-face,
.ef-nav-face,
.ef-primary,
.ef-primary__text,
.ef-quote,
.ef-quote__text {
  font-weight: 700;
  font-variation-settings: "wght" 700, "wdth" 75;
  letter-spacing: 0;
  text-transform: uppercase;
}

/* The pill stays white in both themes, so its labels keep the light-theme ink. */
[data-site-header] .ef-nav-face a {
  color: color-mix(in srgb, #101010 75%, transparent);
}

[data-site-header] .ef-nav-face a:hover,
[data-site-header] .ef-nav-face a[aria-current="page"] {
  color: #101010;
}

/* Extrafazant button-052. Height, pad, and type come from the host control.
   Unlayered so the two slabs beat the host button's fill, padding, and radius. */
  .ef-primary {
    --ef-primary-gap: 0.125em;
    --ef-primary-arrow: 0.875em;
    --ef-primary-pop: -0.325em;
    --ef-primary-lift: -0.125em;
    --ef-primary-ease: linear(0, 0.5737 7.6%, 0.8382 11.87%, 0.9463 14.19%, 1.0292 16.54%, 1.0886 18.97%, 1.1258 21.53%, 1.137 22.97%, 1.1424 24.48%, 1.1423 26.1%, 1.1366 27.86%, 1.1165 31.01%, 1.0507 38.62%, 1.0219 42.57%, 0.9995 46.99%, 0.9872 51.63%, 0.9842 58.77%, 1.0011 81.26%, 1);
    --ef-primary-soft: cubic-bezier(0.59, 1, 0.88, 1.01);
    --ef-primary-bounce: cubic-bezier(0.34, 2.27, 0.64, 1);
    --ef-primary-focus: cubic-bezier(0.32, 0.72, 0, 1);
    --ef-primary-height: 2.25rem;
    position: relative;
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    gap: var(--ef-primary-gap);
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    box-shadow: none;
    color: var(--color-primary-foreground);
    line-height: 1;
    text-decoration: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .ef-primary.w-full {
    width: 100%;
  }

  .ef-primary__icon {
    display: grid;
    flex: none;
    aspect-ratio: 1;
    height: 100%;
    pointer-events: none;
    color: var(--color-primary-foreground);
  }

  .ef-primary__icon.is-hover {
    position: absolute;
    top: var(--ef-primary-lift);
    right: var(--ef-primary-pop);
    scale: 0;
    opacity: 0;
    transition:
      scale 0.75s var(--ef-primary-ease),
      opacity 0.15s 0.1s ease-out;
  }

  .ef-primary__icon.is-rest {
    transition:
      scale 0.75s var(--ef-primary-ease),
      opacity 0.15s ease-out;
  }

  .ef-primary__plate,
  .ef-primary__arrow {
    grid-area: 1 / 1;
  }

  .ef-primary__plate {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 0;
    background-color: var(--color-primary);
  }

  .ef-primary__arrow {
    width: var(--ef-primary-arrow);
    height: var(--ef-primary-arrow);
    place-self: center;
  }

  .ef-primary__text {
    z-index: 1;
    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-width: 0;
    padding: 0 var(--ef-primary-pad, 1rem);
    border-radius: 0;
    background-color: var(--color-primary);
    color: inherit;
    font-family: var(--font-display);
    font-weight: 700;
    font-stretch: 75%;
    font-variation-settings: "wght" 700, "wdth" 75;
    letter-spacing: 0;
    text-transform: uppercase;
    white-space: nowrap;
    will-change: transform;
    transition:
      translate 0.8s var(--ef-primary-ease),
      rotate 0.8s var(--ef-primary-ease),
      scale 0.15s var(--ef-primary-soft),
      transform 0.15s var(--ef-primary-soft);
  }

  .ef-primary::after {
    content: "";
    position: absolute;
    inset: -0.125em;
    z-index: 1;
    pointer-events: none;
    border-radius: 0;
    transition: box-shadow 0.3s var(--ef-primary-focus);
  }

  .ef-primary:focus-visible {
    outline: none;
  }

  .ef-primary:focus-visible::after {
    box-shadow: 0 0 0 0.125em var(--color-foreground);
  }

@media (max-width: 991px) {
  :root {
    --ef-nav-size: calc(clamp(480px, 100dvw, 991px) / (991 / 16));
  }
}

@media (max-width: 479px) {
  :root {
    --ef-nav-size: calc(clamp(320px, 100dvw, 479px) / (479 / 16));
    --ef-logo-width: 7.25em;
  }
}

@media (min-width: 992px) and (max-width: 1439px) {
  :root {
    --ef-nav-size: 14px;
  }
}

.sl-header-pad {
  padding-left: max(2em, env(safe-area-inset-left));
  padding-right: max(2em, env(safe-area-inset-right));
}

.sl-hero {
  container-type: inline-size;
  container-name: hero;
  --sl-hero-corner: 32px;
  --sl-hero-corner-top: 80px;
  --sl-hero-side: 14px;
  --sl-hero-side-width: 32ch;
  --sl-hero-center: 36px;
  --sl-hero-bottom: clamp(7.5rem, 16vw, 18rem);
  --sl-card-width: 18vw;
  --sl-card-min: 148px;
}

@media (max-width: 1279px) {
  .sl-hero {
    --sl-hero-corner: clamp(1.25rem, 2.2vw, 2rem);
    --sl-hero-side-width: min(32ch, 38%);
    --sl-hero-bottom: min(18rem, (100cqi - 1.5rem) / 5.6);
    --sl-card-min: 120px;
  }
}

@media (max-width: 767px) {
  .sl-phase,
  .sl-phase__title {
    position: static !important;
    top: auto !important;
    height: auto !important;
    min-height: 0 !important;
  }

  #footer-crown-heading {
    line-height: 0.95;
  }

  .sl-hero {
    --sl-hero-corner: clamp(1rem, 4.6vw, 1.35rem);
    --sl-hero-corner-top: calc(4 * var(--ef-nav-size) + env(safe-area-inset-top) + 0.75rem);
    --sl-hero-center: clamp(1.35rem, 7vw, 2.25rem);
    --sl-hero-side-width: 100%;
    --sl-hero-bottom: min(18rem, (100cqi - 1.5rem) / 5.6);
    --sl-card-width: min(42vw, 200px);
    --sl-card-min: 0px;
  }

  .sl-hero__corners > * {
    max-width: 46%;
  }

  .sl-hero__mid {
    align-items: flex-end;
    padding-bottom: calc(var(--sl-hero-bottom) + 0.75rem);
  }

  .sl-hero__mid-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .sl-hero__clock {
    align-items: flex-start;
    text-align: left;
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .ef-quote:is(:hover, :focus-visible) {
    scale: var(--button-093-scale-x, 1) var(--button-093-scale-y, 1);
    transition: scale 0.45s 0.05s var(--ef-quote-ease);
  }

  .ef-quote:is(:hover, :focus-visible) .ef-quote__text {
    transition-delay: 0.05s;
  }

  .ef-quote:is(:hover, :focus-visible) .ef-quote__text.is-default {
    rotate: -75deg;
    translate: -0.75em -2em;
  }

  .ef-quote:is(:hover, :focus-visible) .ef-quote__text.is-hover {
    rotate: 0deg;
    translate: 0 0;
  }

  .ef-quote:is(:hover, :focus-visible) .ef-quote__dot {
    rotate: -120deg;
    scale: 0;
    transition-delay: calc(var(--index, 0) * 0.032s + 0.05s);
  }

  .ef-quote:is(:hover, :focus-visible) .ef-quote__dot.is-a,
  .ef-quote:is(:hover, :focus-visible) .ef-quote__dot.is-b,
  .ef-quote:is(:hover, :focus-visible) .ef-quote__dot.is-c {
    rotate: 0deg;
    scale: 1;
  }

  .ef-primary:is(:hover, :focus-visible) .ef-primary__text {
    translate: calc(var(--ef-primary-height) * -1) var(--ef-primary-pop) 0;
    rotate: -3deg;
    scale: 0.935 0.905;
    transform: scale(1.0695187166, 1.1049723757);
    transition:
      translate 0.8s 0.05s var(--ef-primary-ease),
      rotate 0.8s 0.05s var(--ef-primary-ease),
      scale 0.15s 0.05s var(--ef-primary-soft),
      transform 0.45s 0.2s var(--ef-primary-bounce);
  }

  .ef-primary:is(:hover, :focus-visible) .ef-primary__icon.is-rest {
    scale: 0;
    opacity: 0;
    transition:
      scale 0.75s 0.05s var(--ef-primary-ease),
      opacity 0.15s 0.2s ease-out;
  }

  .ef-primary:is(:hover, :focus-visible) .ef-primary__icon.is-hover {
    scale: 1;
    opacity: 1;
    transition:
      scale 0.75s 0.1s var(--ef-primary-ease),
      opacity 0.15s ease-out;
  }
}

/* ── Native-WebView baseline ───────────────────────────────────────────────────────────────────
   Everything below exists so a generated app behaves like an app, not a web page, inside an Android
   or iOS WebView. These are shipped here (locked) rather than asked of the model per build, because
   they are identical for every app and a model that forgets one produces a subtly wrong-feeling app
   that no test catches. Requires viewport-fit=cover in index.html for the safe-area values to be
   anything but 0. */

/* Rubber-band / bounce scroll at the document edges reads as "this is a web page in a browser". Kill
   it at the root only — inner scrollers keep their own overscroll behaviour (a scrollable sheet should
   still chain normally). */
html,
body {
  overscroll-behavior-y: none;
}

/* The grey flash Android draws over any tapped element. Native apps do not do this; components own
   their own pressed state. */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Safe-area utilities for notches, punch-holes, and the home indicator. Use on whatever element is
   actually flush with an edge: `pt-safe` on a fixed header, `pb-safe` on a bottom tab bar, `p-safe`
   on a full-bleed screen. max() keeps a sensible minimum on devices with no inset. */
.pt-safe { padding-top: max(env(safe-area-inset-top), 0px); }
.pr-safe { padding-right: max(env(safe-area-inset-right), 0px); }
.pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 0px); }
.pl-safe { padding-left: max(env(safe-area-inset-left), 0px); }
.p-safe {
  padding-top: max(env(safe-area-inset-top), 0px);
  padding-right: max(env(safe-area-inset-right), 0px);
  padding-bottom: max(env(safe-area-inset-bottom), 0px);
  padding-left: max(env(safe-area-inset-left), 0px);
}
/* Min-height variants for headers/tab bars that need the inset ADDED to their own height. */
.h-safe-top { min-height: calc(3.5rem + env(safe-area-inset-top)); }
.h-safe-bottom { min-height: calc(3.5rem + env(safe-area-inset-bottom)); }

/* Long-pressing app chrome should not raise a text-selection handle and a copy bubble — that is the
   single loudest "this is a website" tell in a WebView. Scoped tightly to controls and their icons,
   and gated to coarse pointers: on a desktop browser this rule made <label> and <summary> text (FAQ
   questions, field descriptions) uncopyable for no benefit; long-press does not exist with a mouse.
   Content stays selectable, and anything the app explicitly marks with `select-text` opts back in.
   The re-assertion below is REQUIRED: these rules are unlayered while Tailwind's own select-text
   utility lives in @layer utilities, and unlayered CSS beats layered CSS regardless of specificity
   or source order, so without the explicit rule the opt-out would silently do nothing. */
@media (pointer: coarse) {
  button,
  [role='button'],
  [role='tab'],
  [role='menuitem'],
  nav a,
  label,
  summary,
  svg {
    -webkit-user-select: none;
    user-select: none;
  }
}
.select-text,
.select-text * {
  -webkit-user-select: text;
  user-select: text;
}

/* iOS zooms the page when a font-size < 16px input is focused, and never zooms back out. Inside
   @layer base so any explicit Tailwind text size on the input (utilities layer beats base) still
   wins; unlayered, this clamped a text-2xl hero search field down to 16px on iPads only. An app
   that explicitly sets text-sm on an input re-accepts the zoom; that is its author's call. */
@layer base {
  @supports (-webkit-touch-callout: none) {
    input,
    select,
    textarea {
      font-size: max(16px, 1rem);
    }
  }
}

/* Premium overlay scrollbar — theme-agnostic (reads on light + dark apps) so the AIWA preview
   never shows the bare OS scrollbar. Thin, rounded, semi-transparent, floats via the padding trick. */
* { scrollbar-width: thin; scrollbar-color: rgb(140 140 140 / 0.45) transparent; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: rgb(140 140 140 / 0.4);
  background-clip: content-box;
  border: 3px solid transparent;
  border-radius: 9999px;
}
*::-webkit-scrollbar-thumb:hover { background: rgb(140 140 140 / 0.62); background-clip: content-box; }
*::-webkit-scrollbar-corner { background: transparent; }

/* ── AIWA fx layer ─────────────────────────────────────────────────────────────────────────────
   Keyframes + utilities backing src/components/fx/* (the template-provided premium kit). Animate
   transform / opacity / background-position ONLY (GPU-composited, no layout thrash). All color
   comes from the theme tokens via the components, so the per-build :root override re-skins every
   effect. The reduced-motion gate at the end silences the whole layer. */

@keyframes fx-fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fx-drift-a {
  0%, 100% { transform: translate3d(-4%, -2%, 0) scale(1); }
  50% { transform: translate3d(5%, 4%, 0) scale(1.08); }
}
@keyframes fx-drift-b {
  0%, 100% { transform: translate3d(3%, 4%, 0) scale(1.05); }
  50% { transform: translate3d(-5%, -3%, 0) scale(1); }
}
@keyframes fx-breathe {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
@keyframes fx-spin {
  to { transform: rotate(360deg); }
}
@keyframes fx-marquee {
  to { transform: translateX(-50%); }
}
@keyframes fx-shimmer {
  from { transform: translateX(-150%) skewX(-12deg); }
  to { transform: translateX(250%) skewX(-12deg); }
}
@keyframes fx-meteor {
  0% { opacity: 0; transform: rotate(215deg) translateX(0); }
  10%, 70% { opacity: 1; }
  100% { opacity: 0; transform: rotate(215deg) translateX(-620px); }
}
@keyframes fx-gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Entrance utilities — the CSS fallback for the ONE orchestrated entrance (Reveal.tsx is the
   motion-powered version). .fx-stagger fades its direct children up with a per-child delay. */
.fx-reveal { animation: fx-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
.fx-stagger > * { animation: fx-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(var(--fx-i, 0) * 90ms); }
.fx-stagger > *:nth-child(1) { --fx-i: 0; }
.fx-stagger > *:nth-child(2) { --fx-i: 1; }
.fx-stagger > *:nth-child(3) { --fx-i: 2; }
.fx-stagger > *:nth-child(4) { --fx-i: 3; }
.fx-stagger > *:nth-child(5) { --fx-i: 4; }
.fx-stagger > *:nth-child(6) { --fx-i: 5; }
.fx-stagger > *:nth-child(7) { --fx-i: 6; }
.fx-stagger > *:nth-child(8) { --fx-i: 7; }

/* Reduced motion: silence the entire fx layer (elements land in their final state). The class gate
   covers the CSS utilities; [data-fx-anim] covers every fx component that sets `animation:` inline
   (Aurora, Spotlight, Marquee, ShineBorder, ShimmerButton, Meteors, GradientText), which the class
   gate never matched before 2026-09-23. Pieces that are meaningless when frozen mid-flight are hidden
   instead. The motion/react primitives gate themselves with useReducedMotion() and render their static
   form; <MotionConfig reducedMotion="user"> in the locked main.tsx only strips positional keys. */
@media (prefers-reduced-motion: reduce) {
  [class*='fx-'],
  .fx-stagger > *,
  [data-fx-anim] {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
  [data-fx-anim='fx-shimmer'],
  [data-fx-anim='fx-meteor'],
  [data-fx-anim='fx-spin'] {
    display: none;
  }
}

/* Extrafazant intro collage. 1em follows their fluid root:
   container / (design width / 16), so 35em is the same physical size as on extrafazant.nl. */
.sl-collage-band {
  --sl-collage-em: calc(clamp(992px, 100dvw, 3840px) / (1920 / 16));
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1em;
  align-items: center;
  width: 100%;
  padding: clamp(5.5rem, 9vw, 8.5rem) 2em 5.5em;
  font-size: var(--sl-collage-em);
}

.sl-collage-copy {
  justify-self: end;
  width: min(100%, 34rem);
  padding-right: 2em;
}

.sl-collage {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-left: 4em;
}

.sl-collage__list {
  position: relative;
  width: 100%;
  height: 100%;
}

.sl-collage__item {
  transform-origin: center center;
}

.sl-collage__inner {
  width: 100%;
  height: 100%;
  transform-origin: center center;
  transition: transform 0.8s cubic-bezier(0.3, 0.075, 0, 1);
  will-change: transform;
}

.sl-collage__large {
  position: relative;
  width: 35em;
  aspect-ratio: 4 / 5;
  transform: rotate(-3deg);
}

.sl-collage__medium {
  position: absolute;
  z-index: 1;
  width: 23.75em;
  aspect-ratio: 4 / 5;
  inset: auto 0% -4em auto;
  transform: rotate(4deg);
}

.sl-collage__sticker {
  position: absolute;
  z-index: 2;
  width: 20em;
  inset: 10em 10em auto auto;
}

.sl-collage__card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
}

.sl-collage__card.is-large {
  padding: 1em;
}

.sl-collage__card.is-medium {
  padding: 1em 1em 4em;
}

.sl-collage__frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sl-collage__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}

.sl-collage__sticker-wrap {
  width: 100%;
  height: 100%;
  padding: 2.5em;
}

.sl-collage__mark {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 991px) {
  .sl-collage-band {
    --sl-collage-em: calc(clamp(768px, 100dvw, 991px) / (991 / 16));
    grid-template-columns: minmax(0, 1fr);
    gap: 4em;
    padding-bottom: 5.5em;
  }

  .sl-collage-copy {
    justify-self: stretch;
    width: 100%;
    padding-right: 0;
  }

  .sl-collage {
    justify-content: center;
    padding-left: 0;
  }

  .sl-collage__large {
    width: 28em;
    left: -8em;
  }

  .sl-collage__medium {
    width: 20em;
    right: 5em;
  }

  .sl-collage__sticker {
    width: 16em;
    top: 9em;
    right: 14em;
  }
}

@media (max-width: 767px) {
  .sl-collage-band {
    --sl-collage-em: calc(clamp(480px, 100dvw, 767px) / (767 / 16));
  }

  .sl-collage {
    height: 72vw;
    overflow: hidden;
    justify-content: center;
    padding-left: 0;
  }

  .sl-collage__list {
    height: 100%;
  }

  .sl-collage__large {
    position: absolute;
    width: 58%;
    left: 4%;
    top: 8%;
  }

  .sl-collage__medium {
    width: 46%;
    inset: auto 2% 0 auto;
  }

  .sl-collage__card.is-medium {
    padding-bottom: 3em;
  }

  .sl-collage__sticker {
    width: 34%;
    inset: 0 8% auto auto;
  }
}

@media (max-width: 479px) {
  .sl-collage-band {
    --sl-collage-em: calc(clamp(320px, 100dvw, 479px) / (479 / 16));
  }

  .sl-collage__large {
    width: 58%;
    left: 4%;
  }

  .sl-collage__medium {
    width: 46%;
    right: 2%;
  }

  .sl-collage__card.is-large {
    padding: 0.75em;
  }

  .sl-collage__card.is-medium {
    padding-top: 0.75em;
    padding-left: 0.75em;
    padding-right: 0.75em;
  }

  .sl-collage__sticker {
    width: 34%;
    top: 0;
    right: 8%;
  }

  .sl-collage__sticker-wrap {
    padding: 1.6em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sl-collage__inner {
    transition: none;
  }
}

/* Junca FAQ. Sizes and motion are theirs. Type and color stay ours. */
.sl-faq {
  --sl-faq-ease: cubic-bezier(0.22, 1, 0.36, 1);
  padding: 64px 0 120px;
}

.sl-faq__container {
  width: 95%;
  margin-inline: auto;
}

.sl-faq__heading {
  max-width: 377px;
  font-family: var(--font-display);
  font-size: clamp(26px, 7.6vw, 32px);
  font-weight: 700;
  font-stretch: 75%;
  font-variation-settings: "wght" 700, "wdth" 75;
  line-height: 1.1;
  letter-spacing: 0;
}

.sl-faq__grid {
  display: grid;
  grid-template-columns: 1fr 831px;
  justify-content: space-between;
  align-items: start;
  gap: var(--sl-faq-columns);
  margin-top: 80px;
  padding-right: 60px;
}

.sl-faq__left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sl-faq__keep {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.35;
  color: var(--color-heading);
}

.sl-faq__dot {
  flex: none;
  width: 8px;
  height: 8px;
  background: var(--color-primary);
}

.sl-faq__list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.sl-faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0;
  list-style: none;
  cursor: pointer;
}

.sl-faq__q::-webkit-details-marker {
  display: none;
}

.sl-faq__q::marker {
  content: "";
}

.sl-faq__q:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.sl-faq__title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -0.04em;
  color: var(--color-heading);
  transition: color 0.3s;
}

.sl-faq__icon {
  position: relative;
  flex: none;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  transition: transform 0.6s var(--sl-faq-ease);
}

.sl-faq__icon::before,
.sl-faq__icon::after {
  content: "";
  position: absolute;
  inset: 50% auto auto 0;
  width: 100%;
  height: 1.5px;
  background: var(--color-primary);
  transition: transform 0.45s var(--sl-faq-ease);
}

.sl-faq__icon::after {
  transform: rotate(90deg);
}

.sl-faq__item.is-open .sl-faq__icon {
  transform: rotate(180deg);
}

.sl-faq__item.is-open .sl-faq__icon::after {
  transform: rotate(0);
}

.sl-faq__a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s var(--sl-faq-ease);
}

.sl-faq__item.is-open .sl-faq__a {
  grid-template-rows: 1fr;
}

.sl-faq__a-inner {
  min-height: 0;
  overflow: hidden;
}

.sl-faq__a p {
  max-width: 72ch;
  margin: 0;
  padding: 8px 48px 24px 0;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: var(--color-body);
  opacity: 0;
  transform: translateY(-6px);
  transition:
    opacity 0.35s ease,
    transform 0.45s var(--sl-faq-ease);
}

.sl-faq__item.is-open .sl-faq__a p {
  opacity: 1;
  transform: none;
  transition-delay: 80ms;
}

@media (hover: hover) {
  .sl-faq__q:hover .sl-faq__title {
    color: var(--color-primary);
  }
}

@media (min-width: 1300px) {
  .sl-faq__heading {
    font-size: 55px;
  }
}

@media (max-width: 1199px) {
  .sl-faq__grid {
    grid-template-columns: 1fr 1.8fr;
    padding-right: 0;
  }
}

@media (max-width: 809px) {
  .sl-faq__container {
    width: 90%;
  }

  .sl-faq__grid {
    grid-template-columns: 1fr;
    gap: var(--sl-faq-stack);
  }

  .sl-faq__title {
    font-size: 17px;
    line-height: 24px;
  }

  .sl-faq__q {
    min-height: 52px;
    padding: 14px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sl-faq__a,
  .sl-faq__a p,
  .sl-faq__icon,
  .sl-faq__icon::before,
  .sl-faq__icon::after {
    transition: none;
  }
}

/* Junca headline sweep. Glyphs ahead of the band stay hidden. */
.scr-host.scr-wait {
  opacity: 0;
}

.scr-char {
  transition: none;
}

.scr-char.is-noise,
.scr-char.is-hidden {
  opacity: 0;
}

.scr-char.is-band {
  color: inherit;
}

.scr-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .scr-host.scr-wait {
    opacity: 1;
  }
}
```


REPLACE:
src/components/chrome/footers/FooterCtaCrown.tsx

Why: Footer crown. The second action is the white secondary button.

```tsx
import { cn } from '@/lib/utils';
import { columnHeadClass } from '../contract';
import { CtaLink } from '../parts/ActionCluster';
import type { ControlShape, FooterCrown } from '../types';
import { ArrowRight } from '@phosphor-icons/react';
import { visualCopy } from '../visual-copy';

/**
 * The CTA crown: a tinted rounded band (or a bordered card) holding an optional eyebrow, a 1 to 2
 * line display headline, a one-line sub, ONE filled CTA, an optional demoted text link and a
 * reassurance line. Embodies the Thrifty Traveler, Manyreach, Gigamind and PressMaster crowns from
 * the Bricx harvest: the crown and the substrate are two organs with different backgrounds. About
 * 1.6x the height of the link block beneath it.
 */
export function FooterCtaCrown({ crown, controls = 'scale', surface = 'tint', className }: { crown: FooterCrown; controls?: ControlShape; surface?: 'tint' | 'card'; className?: string }) {
  return (
    <section aria-labelledby="footer-crown-heading" className={cn('relative overflow-hidden rounded-none px-6 py-16 text-center sm:px-12 sm:py-24', surface === 'card' ? 'border border-border bg-card' : 'bg-background', className)}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        {crown.eyebrow && <p {...visualCopy(crown, 'eyebrow', 'ef-eyebrow text-foreground')}>{crown.eyebrow}</p>}
        <h2 id="footer-crown-heading" {...visualCopy(crown, 'headline', 'ef-heading ef-l text-foreground')}>
          {crown.headline}
        </h2>
        {crown.sub && <p {...visualCopy(crown, 'sub', 'ef-body max-w-xl text-foreground/75')}>{crown.sub}</p>}
        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <CtaLink cta={{ treatment: 'filled', ...crown.cta }} controls={controls} />
          {crown.secondary && (
            <a href={crown.secondary.href} className="sl-secondary">
              {crown.secondary.label}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          )}
        </div>
        {crown.reassurance && <p {...visualCopy(crown, 'reassurance', 'text-xs text-muted-foreground')}>{crown.reassurance}</p>}
      </div>
    </section>
  );
}
```


REPLACE:
src/components/ui/button.tsx

Why: Button wiring for the two-slab primary. Leave every other button variant alone.

```tsx
import { Children, cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { isSplitPrimary, SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';

const buttonVariants = cva(
  // uat R160 (run 6): rounded-lg IS the control radius (--radius); rounded-md sat 2px under it, so a
  // Button and an Input never quite matched. The chrome kit and the design contract pin rounded-lg.
  // 2026-09-24 (run 12b, Kestrel): the icon rules shadcn ships. A label and its icon sit on one
  // flex row with a fixed gap; an svg never wraps, never shrinks and never eats the click, and an
  // unsized icon is 16px. An author's `<ArrowRight size={16} />` after the label needs nothing else.
  "ef-button-face inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render the single child (a router <Link>, an <a>) AS the button: it receives the button classes
   * and props instead of being nested inside a <button>. This is shadcn's `asChild` contract, which
   * every model reaches for by reflex; before 2026-09-24 the template silently ignored it, so
   * `<Button asChild><Link>label <ArrowRight/></Link></Button>` rendered an anchor inside a button,
   * React warned about the unknown `asChild` DOM attribute, and the icon (display:block under the
   * Tailwind preflight, inside an inline anchor) dropped onto its own line under the label.
   */
  asChild?: boolean;
  /** Default red buttons use the two-part arrow. Set false for a plain red control, such as the shimmer CTA. */
  split?: boolean;
}

type SlotChild = ReactElement<{ className?: string; style?: CSSProperties; children?: ReactNode } & Record<string, unknown>>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, split = true, children, style, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    const useSplit = split && (variant ?? 'default') === 'default' && isSplitPrimary(classes, size);
    const splitStyle = useSplit ? { ...splitPrimaryStyle(classes, size), ...style } : style;
    if (asChild && isValidElement(children)) {
      // A dependency-free Slot: the child keeps its own props (they win over ours, as in Radix), the
      // class lists merge, and the ref reaches the child's DOM node.
      const child = Children.only(children) as SlotChild;
      const childClass = cn(classes, child.props.className);
      const childSplit = split && (variant ?? 'default') === 'default' && isSplitPrimary(childClass, size);
      return cloneElement(
        child,
        {
          ...props,
          ...child.props,
          className: cn(childClass, childSplit && SPLIT_PRIMARY),
          style: childSplit ? { ...splitPrimaryStyle(childClass, size), ...child.props.style, ...style } : child.props.style,
          ref,
        } as Record<string, unknown>,
        childSplit ? <SplitPrimaryParts>{child.props.children}</SplitPrimaryParts> : child.props.children,
      );
    }
    return (
      <button className={cn(classes, useSplit && SPLIT_PRIMARY)} ref={ref} style={splitStyle} {...props}>
        {useSplit ? <SplitPrimaryParts>{children}</SplitPrimaryParts> : children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```


REPLACE:
src/components/chrome/parts/MobileMenu.tsx

Why: Mobile menu wiring for the two-slab primary.

```tsx
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { List, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { filledCtaClass } from '../contract';
import { isActive } from './NavLinks';
import type { ChromeCta, ChromeLink, ControlShape } from '../types';
import { asLinks } from '../normalize';
import { visualCopy } from '../visual-copy';

/**
 * Below lg the bar collapses to wordmark plus a hamburger (a 44px square). The CTA is NOT squeezed
 * into the bar: it is re-expressed full width inside the sheet, exactly as the harvest's responsive
 * boards do. The sheet is a full-width panel under the bar, closed by Escape, a link, or the toggle.
 */
const MENU_LAYER = 60
const MENU_TOP = 'calc(4 * var(--ef-nav-size))'

export function MobileMenu({ links = [], activeHref, cta, controls = 'scale', extra, className, ink }: { links?: ChromeLink[]; activeHref?: string; cta?: ChromeCta; controls?: ControlShape; extra?: ReactNode; className?: string; ink?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const flat = asLinks(links).flatMap((l) => (l.children?.length ? [l, ...l.children] : [l]));
  const sheet = open
    ? createPortal(
        <div
          id="site-menu"
          className="fixed inset-x-0 overflow-y-auto border-b border-border bg-background/95 shadow-lg backdrop-blur"
          style={{
            zIndex: MENU_LAYER,
            top: MENU_TOP,
            maxHeight: `calc(100dvh - ${MENU_TOP})`,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <nav
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 py-4"
            style={{
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
            }}
            aria-label="Mobile"
          >
            {flat.map((link, i) => (
              <a
                key={`${link.href}-${link.label}-${i}`}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link, activeHref) ? 'page' : undefined}
                {...visualCopy(link, 'label', cn('ef-nav-face flex min-h-11 items-center rounded-lg px-3 text-base text-foreground/80 hover:bg-accent hover:text-foreground', link.children && 'text-foreground', !link.children && links.some((l) => l.children?.includes(link)) && 'pl-7 text-sm', isActive(link, activeHref) && 'bg-accent text-foreground'))}
              >
                {link.label}
              </a>
            ))}
            {extra}
            {cta && (
              <a
                href={cta.href}
                onClick={() => setOpen(false)}
                {...visualCopy(cta, 'label', cn(SPLIT_PRIMARY, filledCtaClass(controls), 'mt-3 w-full'))}
                style={splitPrimaryStyle(cn(filledCtaClass(controls), 'mt-3 w-full'))}
              >
                <SplitPrimaryParts>{cta.label}</SplitPrimaryParts>
              </a>
            )}
          </nav>
        </div>,
        document.body,
      )
    : null;
  return (
    <div className={cn('lg:hidden', className)}>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        style={ink ? { color: ink } : undefined}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <List className="h-5 w-5" aria-hidden />}
      </button>
      {sheet}
    </div>
  );
}
```


REPLACE:
src/components/chrome/parts/ActionCluster.tsx

Why: Footer and chrome CTA wiring for the two-slab primary.

```tsx
import type { ReactNode } from 'react';
import { AuthCTA, ShimmerButton } from '@/components/fx';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { filledCtaClass, ghostCtaClass, outlineCtaClass, radiusClass, CONTROL_H } from '../contract';
import type { ChromeCta, ControlShape } from '../types';
import { visualCopy } from '../visual-copy';

/** One CTA rendered by its treatment; `auth` routes it through AuthCTA so a signed-in visitor sees the app. */
export function CtaLink({ cta, controls = 'scale', className }: { cta: ChromeCta; controls?: ControlShape; className?: string }) {
  const treatment = cta.treatment ?? 'filled';
  if (cta.auth) {
    return <AuthCTA signedOutLabel={cta.label} signedOutAppearance={visualCopy(cta, 'label')} signInHref={cta.href} className={cn(treatment === 'outline' ? outlineCtaClass(controls) : treatment === 'ghost' ? ghostCtaClass(controls) : filledCtaClass(controls), 'shadow-none', className)} />;
  }
  if (treatment === 'shimmer') {
    return (
      <ShimmerButton className={cn(CONTROL_H, radiusClass(controls), 'px-5 text-sm font-medium', className)}>
        <a href={cta.href} {...visualCopy(cta, 'label', 'inline-flex items-center gap-2')}>
          {cta.icon}
          {cta.label}
        </a>
      </ShimmerButton>
    );
  }
  const filled = treatment !== 'outline' && treatment !== 'ghost';
  const cls = treatment === 'outline' ? outlineCtaClass(controls) : treatment === 'ghost' ? ghostCtaClass(controls) : filledCtaClass(controls);
  const look = cn(cls, className);
  if (!filled) {
    return (
      <a href={cta.href} {...visualCopy(cta, 'label', look)}>
        {cta.icon}
        {cta.label}
      </a>
    );
  }
  return (
    <a href={cta.href} {...visualCopy(cta, 'label', cn(SPLIT_PRIMARY, look))} style={splitPrimaryStyle(look)}>
      <SplitPrimaryParts>
        {cta.icon}
        {cta.label}
      </SplitPrimaryParts>
    </a>
  );
}

/**
 * The action cluster: a subordinate control (sign in as a text link, search, bell, avatar) and then
 * the ONE filled CTA of the bar. A vertical hairline groups the subordinate control away from the CTA.
 */
export function ActionCluster({ cta, secondary, controls = 'scale', divider = true, className }: { cta?: ChromeCta; secondary?: ReactNode; controls?: ControlShape; divider?: boolean; className?: string }) {
  if (!cta && !secondary) return null;
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {secondary}
      {secondary && cta && divider && <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />}
      {cta && <CtaLink cta={{ treatment: 'filled', ...cta }} controls={controls} />}
    </div>
  );
}
```


REPLACE:
src/components/chrome/footers/FooterCaptureCrown.tsx

Why: Capture crown wiring for the two-slab primary.

```tsx
import { useId } from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { columnHeadClass, filledCtaClass, radiusClass } from '../contract';
import type { ControlShape, FooterCapture, FooterCrown } from '../types';
import { useCaptureForm } from './bits';

/**
 * The capture crown: the crown's action is a field, not a button. An optional prefix, an h-11
 * transparent input and the ONE filled button sit inside a single enclosing shape (a hairline
 * border on the control radius, the button nested one radius step inside it). Embodies the LTV.ai
 * pill-in-pill email field and the Bookme vanity-handle field. Submit calls onSubmit, then the
 * group is replaced by a done line.
 */
export function FooterCaptureCrown({ capture, crown, controls = 'scale', doneLabel = 'Thank you', className }: { capture: FooterCapture; crown?: Partial<Pick<FooterCrown, 'eyebrow' | 'headline' | 'sub' | 'reassurance'>>; controls?: ControlShape; doneLabel?: string; className?: string }) {
  const id = useId();
  const { value, setValue, state, submit } = useCaptureForm(capture.onSubmit);
  const headline = crown?.headline ?? capture.label ?? capture.buttonLabel;
  const reassurance = crown?.reassurance ?? capture.reassurance;
  const pill = controls === 'pill';
  return (
    <section aria-labelledby={`${id}-heading`} className={cn('relative overflow-hidden rounded-2xl bg-primary/10 px-6 py-14 text-center sm:px-12 sm:py-20', className)}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        {crown?.eyebrow && <p className={columnHeadClass}>{crown.eyebrow}</p>}
        <h2 id={`${id}-heading`} className="text-balance font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-foreground">
          {headline}
        </h2>
        {crown?.sub && <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{crown.sub}</p>}
        {state === 'done' ? (
          <p role="status" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground">
            <Check className="h-4 w-4 text-primary" aria-hidden />
            {doneLabel}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-2 w-full max-w-md" noValidate>
            <label htmlFor={`${id}-field`} className="sr-only">
              {capture.label ?? capture.placeholder}
            </label>
            <div className={cn('flex items-center gap-1 border border-border bg-background p-1 shadow-sm transition-colors focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/30', radiusClass(controls))}>
              {capture.prefix && (
                <span aria-hidden className="select-none whitespace-nowrap pl-3 text-sm text-muted-foreground">
                  {capture.prefix}
                </span>
              )}
              <input
                id={`${id}-field`}
                type={capture.prefix ? 'text' : 'email'}
                autoComplete={capture.prefix ? 'off' : 'email'}
                placeholder={capture.placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={state === 'busy'}
                aria-invalid={state === 'error' || undefined}
                className={cn('h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60', capture.prefix ? 'pl-0 pr-3' : 'px-3')}
              />
              <button
                type="submit"
                disabled={state === 'busy'}
                className={cn(SPLIT_PRIMARY, filledCtaClass(controls), !pill && 'rounded-md', 'shrink-0 shadow-none focus-visible:ring-offset-0 disabled:opacity-70')}
                style={splitPrimaryStyle(filledCtaClass(controls))}
              >
                <SplitPrimaryParts>{capture.buttonLabel}</SplitPrimaryParts>
              </button>
            </div>
            {state === 'error' && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
        {reassurance && state !== 'done' && <p className="text-xs text-muted-foreground">{reassurance}</p>}
      </div>
    </section>
  );
}
```


REPLACE:
src/components/chrome/footers/FooterNewsletter.tsx

Why: Newsletter wiring for the two-slab primary.

```tsx
import { useId } from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { filledCtaClass, outlineCtaClass } from '../contract';
import type { ControlShape, FooterCapture } from '../types';
import { useCaptureForm } from './bits';

/**
 * The newsletter row: a prompt line, an input and an adjacent button on ONE radius (a utility control,
 * so one step tighter than the marketing CTA unless the whole system is pill), consent micro-copy,
 * a done state after submit. Embodies the Performance Partners, Appsecure and Camb.ai newsletter
 * splits; the mismatched input-and-pill row they warn against cannot happen here. `tone="outline"`
 * steps the button down to a hairline outline when a crown already carries the footer's one filled action.
 */
export function FooterNewsletter({ newsletter, heading, controls = 'scale', tone = 'filled', doneLabel = 'Thank you, you are on the list.', className }: { newsletter: FooterCapture; heading?: string; controls?: ControlShape; tone?: 'filled' | 'outline'; doneLabel?: string; className?: string }) {
  const id = useId();
  const { value, setValue, state, submit } = useCaptureForm(newsletter.onSubmit);
  const radius = controls === 'pill' ? 'rounded-full' : 'rounded-md';
  const prompt = heading ?? newsletter.label ?? 'Newsletter';
  return (
    <div className={cn('flex w-full max-w-md flex-col gap-3', className)}>
      <p className="text-sm font-medium text-foreground">{prompt}</p>
      {state === 'done' ? (
        <p role="status" className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground">
          <Check className="h-4 w-4 text-primary" aria-hidden />
          {doneLabel}
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" noValidate>
          <label htmlFor={`${id}-email`} className="sr-only">
            {newsletter.label ?? newsletter.placeholder}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={newsletter.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={state === 'busy'}
            aria-invalid={state === 'error' || undefined}
            className={cn('h-11 min-w-0 flex-1 border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-60', radius)}
          />
          <button
            type="submit"
            disabled={state === 'busy'}
            className={cn(tone === 'outline' ? outlineCtaClass(controls) : cn(SPLIT_PRIMARY, filledCtaClass(controls)), radius, 'shrink-0 disabled:opacity-70')}
            style={tone === 'filled' ? splitPrimaryStyle(filledCtaClass(controls)) : undefined}
          >
            {tone === 'filled' ? <SplitPrimaryParts>{newsletter.buttonLabel}</SplitPrimaryParts> : newsletter.buttonLabel}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p role="alert" className="text-xs text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
      {newsletter.reassurance && state !== 'done' && <p className="text-xs leading-relaxed text-muted-foreground">{newsletter.reassurance}</p>}
    </div>
  );
}
```


REPLACE:
src/components/fx/AuthCTA.tsx

Why: Auth CTA wiring for the two-slab primary.

```tsx
import { useSession } from '@/lib/auth';
import { buttonVariants } from '@/components/ui/button';
import { isSplitPrimary, SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { cn } from '@/lib/utils';

/**
 * An auth-aware nav CTA for PUBLIC pages. Reads the live session and swaps automatically: "Sign In"
 * when signed out, and an authed CTA (default "Dashboard") when signed in. This fixes the "logged in
 * via Google but the landing still shows Sign In" gap: a public page must never show a static Sign In
 * button. Renders a real anchor (router-agnostic; right/middle-click work). Only for apps with accounts.
 * Style it via className (it already carries the primary button look).
 */
export function AuthCTA({
  signedOutLabel = 'Sign In',
  signedInLabel = 'Dashboard',
  appHref = '/app/dashboard',
  // Defaults to appHref, NOT '/sign-in'. Auth in this template is an in-route GATE: RequireAuth renders
  // <SignIn/> IN PLACE of the page it wraps, so no standalone /sign-in route exists unless the app
  // author writes one, and the old default pointed live apps at TanStack's "Not Found" inside their own
  // layout, which reads as a broken page rather than a missing route. Sending a signed-out visitor to
  // the app's own gated route lands them on the gate, which IS the sign-in screen.
  // appHref's default is deliberately unchanged: moving it would silently redirect signed-IN users in
  // any app that passes signInHref but not appHref, breaking something that works today.
  // NOTE: appHref must stay ABOVE this line. Destructuring defaults evaluate left to right, so the
  // reverse order is a TDZ ReferenceError at runtime and a "used before declaration" error in tsc.
  signInHref = appHref,
  className,
  signedOutAppearance,
}: {
  signedOutLabel?: string;
  signedInLabel?: string;
  signInHref?: string;
  appHref?: string;
  className?: string;
  signedOutAppearance?: { className?: string; 'data-aiwa-ve'?: string; 'data-aiwa-vh'?: string };
}) {
  const { loading, user } = useSession();
  if (loading) return <div className={cn('h-9 w-24 animate-pulse rounded-md bg-muted', className)} aria-hidden />;
  const href = user ? appHref : signInHref;
  const label = user ? signedInLabel : signedOutLabel;
  const look = cn(buttonVariants(), className, !user && signedOutAppearance?.className);
  const split = isSplitPrimary(look);
  return (
    <a
      href={href}
      {...(!user ? signedOutAppearance : {})}
      className={cn(look, split && SPLIT_PRIMARY)}
      style={split ? splitPrimaryStyle(look) : undefined}
    >
      {split ? <SplitPrimaryParts>{label}</SplitPrimaryParts> : label}
    </a>
  );
}
```


## SECTION 4 — FILES TO DELETE

DELETE: none.

No file from the original AIWA export was removed. Do not delete platform files that are absent from this document.

## SECTION 5 — DEPENDENCIES

No dependency change.

The original export has no package manifest, and the finished site does not add or remove packages. Do not edit package.json. Do not change package versions. Use the packages already installed in the AIWA project.

## SECTION 6 — ASSETS

CREATE the two SVG files in Section 2:

- others/SHACKLINE_LOGO.svg
- others/sticker.svg

CREATE public/paper-grain.png by running the script below from the project root. Do not add the script to the project. Do not download a substitute texture. Do not hotlink an external image.

```js
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const SIZE = 512
const PAPER = 251

function hash(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

function sample(x, y) {
  const xi = ((x % SIZE) + SIZE) % SIZE
  const yi = ((y % SIZE) + SIZE) % SIZE
  return hash(xi, yi)
}

function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const out = new Uint32Array(256)
    for (let n = 0; n < 256; n += 1) {
      let c = n
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      out[n] = c >>> 0
    }
    return out
  })())
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i += 1) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const head = Buffer.alloc(8)
  head.writeUInt32BE(data.length, 0)
  head.write(type, 4)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), 0)
  return Buffer.concat([head, data, crc])
}

const png = Buffer.alloc(SIZE * SIZE * 4)
for (let y = 0; y < SIZE; y += 1) {
  for (let x = 0; x < SIZE; x += 1) {
    const n = sample(x, y) * 0.5 + sample(x * 2, y * 2) * 0.3 + sample(x * 4, y * 4) * 0.2
    const ink = Math.max(0, Math.min(255, PAPER + Math.round((n - 0.5) * 14)))
    const i = (y * SIZE + x) * 4
    png[i] = ink
    png[i + 1] = ink
    png[i + 2] = Math.max(0, ink - 1)
    png[i + 3] = 255
  }
}

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
for (let y = 0; y < SIZE; y += 1) {
  const row = y * (SIZE * 4 + 1)
  raw[row] = 0
  png.copy(raw, row + 1, y * SIZE * 4, (y + 1) * SIZE * 4)
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8
ihdr[9] = 6
const file = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
])

writeFileSync('public/paper-grain.png', file)
```

These photographs cannot be recreated from this document. AIWA cannot generate them. They must already be in the project, or be uploaded, at these exact paths. Do not substitute, resize, or replace them:

- others/SHACKLINE_PRODUCT_01.jpg
- others/SHACKLINE_PRODUCT_02.jpeg
- others/SHACKLINE_PRODUCT_03.jpg
- others/SHACKLINE_PRODUCT_04.jpg
- others/SHACKLINE_PRODUCT_05.jpeg
- others/SHACKLINE_WEB_01.jpg
- others/SHACKLINE_WEB_02.jpg
- others/SHACKLINE_WEB_03.jpg
- others/SHACKLINE_WEB_04.jpg
- others/SHACKLINE_WEB_05.jpg
- src/assets/roadmap/phase-01-platform.jpg
- src/assets/roadmap/phase-02-storefront.jpg
- src/assets/roadmap/phase-03-kits.jpg

Founder portraits with image URLs in src/lib/content.ts load from those remote URLs. Do not add local founder files for them.

If any photograph above is missing, stop and say which path is missing. Do not invent a stand-in.

## SECTION 7 — CONFIGURATION

No Vite, TypeScript, Tailwind, alias, or package configuration change.

Routing changes are inside the REPLACE for src/App.tsx: keep /, and add /privacy and /terms.

## SECTION 8 — ENVIRONMENT VARIABLES

No new environment variable is required. Do not print or change secret values.

Names already read by the app:

- CALENDLY_API_TOKEN
- CALENDLY_EVENT_TYPE_URI
- RESEND_NOTIFY_TO
- RESEND_API_KEY
- RESEND_FROM
- DATABASE_URL
- PORT
- APP_ORIGIN
- NEON_AUTH_BASE_URL

## SECTION 9 — SERVER / API

Apply the REPLACE for server/routes/quote.ts. That block is the complete file. Do not edit it a second time.

The route still exposes:

- GET /api/quote/scheduling
- POST /api/quote

Database schema files stay as they are. Do not replace server/index.ts, server/db/index.ts, server/lib/email.ts, server/lib/auth.ts, or server/lib/origin.ts.

## SECTION 10 — ANIMATIONS AND INTERACTIONS

Keep all of these. They live in the files above. Do not simplify them.

- Hero: the bottom word types on as ShackLine, then the center word types on as Designs. Portrait cards travel across the hero.
- Header quote control stays the existing quote control, not the white secondary button.
- Glitch headline sweep on section headlines.
- Founder portraits crossfade inside the right-hand portrait frame.
- FAQ accordion, one item open at a time. Two-column gap is 120px, and the stacked layout uses a normal row gap.
- Roadmap phases stick and stack. Their colors and top hairline stay as written.
- Work list hover preview.
- Merch collage.
- Red two-slab primary, including its hover motion. Label text is uppercase.
- White secondary button on the FAQ quote action and the footer crown.
- Dark footer, including the crown, with light text.
- Theme toggle in the footer remains.

## SECTION 11 — AIWA BUILD ORDER

1. Read this whole document before writing files.
2. Confirm the photograph paths in Section 6. If one is missing, report it before continuing.
3. CREATE the files in Section 2, including both SVG files.
4. Run the paper-grain script so public/paper-grain.png exists.
5. REPLACE the files in Section 3, starting with src/globals.css and the button wiring, then the lander components, then src/App.tsx and server/routes/quote.ts.
6. Do not delete files.
7. Do not install or upgrade packages.
8. Build the project.
9. If the build fails, fix only errors caused by this migration. Build again.
10. Check the finished page against Section 10.

## SECTION 12 — BUILD MODE RULES

AIWA performs every file operation itself.

- Create directories.
- Create and replace files using the complete contents in this document.
- Generate public/paper-grain.png with the script in Section 6.
- Do not ask the user to copy source, rename files, edit imports, or install packages.
- Do not replace @/components/chrome, @/components/fx, or auth files except the paths named in Section 3.
- Do not silently restyle, shorten, or drop an animation.
- After the edits, build and render the project. Fix migration errors and build again.
- If a photograph in Section 6 is missing, that is a real limitation. Name the missing path and stop. Do not draw a replacement.

## SECTION 13 — HOW TO RUN THIS

Upload this document into the AIWA project and run Build mode with the prompt below.

## PROMPT TO SEND WITH THIS DOCUMENT

Execute AIWA_MIGRATION.md from start to finish. Read the whole document before editing. Create every CREATE file and replace every REPLACE file with the complete contents given, at the exact paths. Generate public/paper-grain.png with the script in Section 6. Do not delete files. Do not edit package.json. Do not replace the chrome, fx, or auth kits except the files this document names. Keep every animation in Section 10. Build the project, fix only errors this migration caused, and build again. If a photograph listed in Section 6 is missing, name that path and stop. Do not substitute it.
