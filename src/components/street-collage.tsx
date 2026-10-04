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
