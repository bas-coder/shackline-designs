import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * THE orchestrated entrance (motion-powered). Use ONCE per screen on the primary surface (hero,
 * login card, dashboard header) — everything else stays static or uses hover micro-interactions.
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user"> in the locked entry.
 *
 * <StaggerReveal> fades its direct children up with a spring stagger, once, on first view.
 * <BlurFade> is the single-element variant (a hero image, one headline).
 */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 180, damping: 24 } as const,
  },
};

export function StaggerReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {Array.isArray(children) ? (
        children.map((child, i) => (
          <motion.div key={i} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  );
}

export function BlurFade({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** seconds */
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 170, damping: 26, delay }}
    >
      {children}
    </motion.div>
  );
}
