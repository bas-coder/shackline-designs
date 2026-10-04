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
