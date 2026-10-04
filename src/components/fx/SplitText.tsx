import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * One display line whose words or characters rise into place in sequence: the headline as a
 * moment. Medium: at most two per page, never on body copy, never more than one headline per
 * viewport. The root carries the whole text as its accessible name and every token is hidden from
 * assistive tech, so reading and copying are untouched. Plain text under reduced motion.
 */
export function SplitText({
  text,
  as = 'h2',
  by = 'words',
  stagger,
  delay = 0,
  direction = 'up',
  distance = 24,
  once = true,
  amount = 0.5,
  className,
  tokenClassName,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  by?: 'words' | 'chars';
  /** seconds between tokens; default 0.04 for words, 0.02 for chars */
  stagger?: number;
  delay?: number;
  direction?: 'up' | 'down';
  /** px */
  distance?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  tokenClassName?: string;
}) {
  const { reduced } = useMotionGate();
  if (reduced) {
    const Tag = as;
    return (
      <Tag data-fx="split-text" className={cn('text-balance', className)}>
        {text}
      </Tag>
    );
  }
  const tokens = by === 'chars' ? Array.from(text) : text.split(/(\s+)/).filter((t) => t.length > 0);
  const step = stagger ?? (by === 'chars' ? 0.02 : 0.04);
  const container = { hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } };
  const item = {
    hidden: { opacity: 0, y: direction === 'up' ? distance : -distance },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 26 } as const },
  };
  const MotionTag = (as === 'h1' ? motion.h1 : as === 'h3' ? motion.h3 : as === 'p' ? motion.p : as === 'span' ? motion.span : motion.h2) as typeof motion.h2;
  return (
    <MotionTag
      data-fx="split-text"
      aria-label={text}
      className={cn('text-balance', className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {tokens.map((token, i) =>
        /^\s+$/.test(token) ? (
          <span key={i} aria-hidden>
            {' '}
          </span>
        ) : (
          <span key={i} aria-hidden className={cn('inline-block overflow-hidden align-bottom', tokenClassName)}>
            <motion.span className="inline-block will-change-transform" variants={item}>
              {token === ' ' ? ' ' : token}
            </motion.span>
          </span>
        )
      )}
    </MotionTag>
  );
}
