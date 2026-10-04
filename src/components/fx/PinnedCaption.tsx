import { Children, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { cn } from '@/lib/utils';
import { useMotionGate } from './motion-gate';

/**
 * A pinned claim beside scrolling evidence: the caption column sticks at a top offset while three
 * or four media blocks (a framed UI, a diagram, a data card), each at least 60vh tall, scroll past
 * on the other side; with `captions`, the caption crossfades to one sentence per block so the claim
 * always sits beside its proof. Heavy: at most one per page. Below lg, and under reduced motion, it
 * is a single column with each caption above its block and nothing pinned.
 */
export function PinnedCaption({
  caption,
  captions,
  children,
  side = 'left',
  top = 96,
  ratio = '2/5',
  className,
}: {
  /** one caption for the whole column */
  caption?: ReactNode;
  /** one caption per media block; crossfades as each block passes */
  captions?: ReactNode[];
  children: ReactNode;
  side?: 'left' | 'right';
  /** px from the top of the viewport the caption pins at */
  top?: number;
  /** caption column width as a fraction of the row */
  ratio?: '1/3' | '2/5' | '1/2';
  className?: string;
}) {
  const media = Children.toArray(children);
  const col = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: col, offset: ['start center', 'end center'] });
  const [active, setActive] = useState(0);
  const n = captions?.length ?? 0;
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (n > 1) setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n))));
  });
  const { allowed } = useMotionGate({ minWidth: 1024 });
  if (!allowed) {
    return (
      <div data-fx="pinned-caption" className={cn('flex flex-col gap-8', className)}>
        {media.map((block, i) => (
          <div key={i} className="flex flex-col gap-4">
            {captions ? <div>{captions[Math.min(i, Math.max(0, n - 1))]}</div> : i === 0 && caption ? <div>{caption}</div> : null}
            {block}
          </div>
        ))}
      </div>
    );
  }
  const cols =
    side === 'left'
      ? { '1/3': 'lg:grid-cols-[1fr_2fr]', '2/5': 'lg:grid-cols-[2fr_3fr]', '1/2': 'lg:grid-cols-2' }[ratio]
      : { '1/3': 'lg:grid-cols-[2fr_1fr]', '2/5': 'lg:grid-cols-[3fr_2fr]', '1/2': 'lg:grid-cols-2' }[ratio];
  const captionCol = (
    <div className="self-start lg:sticky" style={{ top }}>
      {captions ? (
        <div className="relative">
          {captions.map((c, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden={i !== active}
              className={cn(i === active ? 'relative' : 'pointer-events-none absolute inset-0')}
            >
              {c}
            </motion.div>
          ))}
        </div>
      ) : (
        caption
      )}
    </div>
  );
  return (
    <div data-fx="pinned-caption" className={cn('grid grid-cols-1 gap-8', cols, className)}>
      {side === 'left' ? captionCol : null}
      <div ref={col} className="flex flex-col gap-8">
        {media.map((block, i) => (
          <div key={i} className="min-h-[60vh]">
            {block}
          </div>
        ))}
      </div>
      {side === 'right' ? captionCol : null}
    </div>
  );
}
