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