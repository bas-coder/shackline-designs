import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useMotionGate } from '@/components/fx/motion-gate'

const INTRO_EASE = [0.22, 1, 0.36, 1] as const
const INTRO_DURATION = 0.9
const INTRO_RISE = 24
export const INTRO_STAGGER = 0.08
const INTRO_VIEW = { once: true, amount: 0.25 } as const

type IntroTag = 'p' | 'div' | 'li' | 'article' | 'h2' | 'span'

const motionTag = {
  p: motion.p,
  div: motion.div,
  li: motion.li,
  article: motion.article,
  h2: motion.h2,
  span: motion.span,
} as const

function waitFor(delay: number, index: number) {
  return delay + index * INTRO_STAGGER
}

/** A line clipped at rest, then eased up into the clip. Once, on first view. */
export function IntroMask({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { reduced } = useMotionGate()
  if (reduced) return <h2 className={className}>{children}</h2>
  return (
    <motion.div
      className="overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={INTRO_VIEW}
    >
      <motion.h2
        className={className}
        variants={{
          hidden: { y: '110%' },
          show: { y: '0%', transition: { duration: INTRO_DURATION, ease: INTRO_EASE, delay } },
        }}
      >
        {children}
      </motion.h2>
    </motion.div>
  )
}

/** A short rise and fade. Pass `index` to stagger siblings by one step. */
export function IntroRise({
  children,
  className,
  id,
  delay = 0,
  index = 0,
  as = 'div',
  distance = INTRO_RISE,
  scaleFrom,
}: {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
  index?: number
  as?: IntroTag
  distance?: number
  scaleFrom?: number
}) {
  const { reduced } = useMotionGate()
  const Tag = as
  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    )
  }
  const MotionTag = motionTag[as]
  const hidden = scaleFrom === undefined ? { opacity: 0, y: distance } : { opacity: 0, y: distance, scale: scaleFrom }
  const shown = scaleFrom === undefined ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }
  return (
    <MotionTag
      id={id}
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={INTRO_VIEW}
      transition={{ duration: INTRO_DURATION, ease: INTRO_EASE, delay: waitFor(delay, index) }}
    >
      {children}
    </MotionTag>
  )
}
