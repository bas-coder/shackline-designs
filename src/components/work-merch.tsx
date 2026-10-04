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
