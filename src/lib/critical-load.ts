import { HERO_CARD_SRCS } from '@/lib/hero-cards'
import { DISPLAY_FONT_SPEC, whenDisplayFontReady } from '@/lib/display-font'

const IMMEDIATE_MS = 80

type Listener = (progress: number, complete: boolean) => void

let progress = 0
let complete = false
let started = false
let leaveImmediately = false
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => listener(progress, complete))
}

function decodeHero(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      const decoded = typeof image.decode === 'function' ? image.decode() : Promise.resolve()
      decoded.then(() => resolve(), () => resolve())
    }
    image.onload = finish
    image.onerror = () => {
      if (settled) return
      settled = true
      resolve()
    }
    image.src = src
    if (image.complete) finish()
  })
}

function cachedNow() {
  if (typeof document === 'undefined') return false
  try {
    if (!document.fonts.check(DISPLAY_FONT_SPEC)) return false
  } catch {
    return false
  }
  return HERO_CARD_SRCS.every((src) => {
    const image = new Image()
    image.src = src
    return image.complete && image.naturalWidth > 0
  })
}

let resolveReady: () => void = () => undefined
export const criticalReady = new Promise<void>((resolve) => {
  resolveReady = resolve
})

function finish() {
  complete = true
  progress = 1
  resolveReady()
  emit()
}

function startCriticalLoad() {
  if (started || typeof document === 'undefined') return
  started = true
  if (cachedNow()) {
    leaveImmediately = true
    finish()
    return
  }
  const total = 1 + HERO_CARD_SRCS.length
  const startedAt = performance.now()
  let done = 0
  const mark = () => {
    done += 1
    progress = done / total
    if (done < total) {
      emit()
      return
    }
    leaveImmediately = performance.now() - startedAt < IMMEDIATE_MS
    finish()
  }
  whenDisplayFontReady().then(mark, mark)
  HERO_CARD_SRCS.forEach((src) => {
    decodeHero(src).then(mark, mark)
  })
}

export function beginCriticalLoad() {
  startCriticalLoad()
}

export function criticalLeavesImmediately() {
  return leaveImmediately
}

export function criticalSnapshot() {
  return { progress, complete }
}

export function subscribeCritical(listener: Listener) {
  listeners.add(listener)
  listener(progress, complete)
  return () => {
    listeners.delete(listener)
  }
}
