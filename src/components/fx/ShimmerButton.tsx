import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * The premium primary CTA: the standard Button with a periodic light sweep. Use for THE ONE main
 * action on a marketing surface (hero CTA, pricing CTA) — everywhere else use the plain Button.
 */
export const ShimmerButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} split={false} data-fx="shimmer-button" className={cn('relative overflow-hidden', className)} {...props}>
      <span
        aria-hidden
        data-fx-anim="fx-shimmer"
        className="pointer-events-none absolute inset-y-0 w-1/3"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-primary-foreground) 45%, transparent), transparent)',
          animation: 'fx-shimmer 2.6s ease-in-out infinite',
        }}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Button>
  )
);
ShimmerButton.displayName = 'ShimmerButton';
