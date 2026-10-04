import { Children, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * A section's children entering once as they scroll into view, with a direction and a stagger.
 * Light: use on proof bands, stat cells, feature rows, up to six per page. Not for the hero (the
 * StaggerReveal owns the entrance) and not on every card of a long list. Transform and opacity only;
 * renders its plain children under reduced motion.
 */
export function ScrollReveal({
  children,
  direction = 'up',
  distance = 24,
  stagger = 0.08,
  delay = 0,
  once = true,
  amount = 0.25,
  as = 'div',
  className,
  itemClassName,
}: {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** px, clamped 0 to 80 */
  distance?: number;
  /** seconds between children */
  stagger?: number;
  /** seconds before the first child */
  delay?: number;
  once?: boolean;
  /** the fraction of the element that must be in view */
  amount?: number;
  as?: 'div' | 'section' | 'ul';
  className?: string;
  itemClassName?: string;
}) {
  const { reduced } = useMotionGate();
  const items = Children.toArray(children);
  if (reduced) {
    const Tag = as;
    return (
      <Tag data-fx="scroll-reveal" className={className}>
        {children}
      </Tag>
    );
  }
  const d = Math.max(0, Math.min(80, distance));
  const offset = direction === 'up' ? { y: d } : direction === 'down' ? { y: -d } : direction === 'left' ? { x: d } : direction === 'right' ? { x: -d } : {};
  const container = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const item = {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 180, damping: 24 } as const },
  };
  const MotionTag = (as === 'section' ? motion.section : as === 'ul' ? motion.ul : motion.div) as typeof motion.div;
  const Item = as === 'ul' ? motion.li : motion.div;
  return (
    <MotionTag data-fx="scroll-reveal" className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once, amount }}>
      {items.map((child, i) => (
        <Item key={i} variants={item} className={cn('will-change-transform', itemClassName)}>
          {child}
        </Item>
      ))}
    </MotionTag>
  );
}
