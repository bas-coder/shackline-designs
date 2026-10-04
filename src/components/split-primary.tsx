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
