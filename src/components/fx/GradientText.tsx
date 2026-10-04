import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The emphasized span inside a display headline: a 2-stop foreground-to-primary gradient (obeys
 * the <=2-stop rule in the design skill). Use on ONE span per headline, not whole paragraphs.
 */
export function GradientText({
  children,
  animate = false,
  className,
}: {
  children: ReactNode;
  /** slow gradient drift; keep static for editorial registers */
  animate?: boolean;
  className?: string;
}) {
  return (
    <span
      data-fx="gradient-text"
      data-fx-anim={animate ? 'fx-gradient-shift' : undefined}
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        backgroundImage:
          'linear-gradient(100deg, var(--color-foreground), var(--color-primary), var(--color-foreground))',
        backgroundSize: animate ? '200% 100%' : '100% 100%',
        animation: animate ? 'fx-gradient-shift 6s ease-in-out infinite' : undefined,
      }}
    >
      {children}
    </span>
  );
}
