import { cn } from '@/lib/utils'

/**
 * The control voice for in-frame UI mocks (and the phase rail buttons):
 * a square, mono-labelled, hairline-bordered control that matches the
 * site's 0px control radius and 44px touch floor.
 */
export function MiniButton({
  children,
  variant = 'outline',
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'filled' }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-none border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'outline'
          ? 'border-border bg-transparent text-foreground hover:bg-foreground/[0.04]'
          : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}