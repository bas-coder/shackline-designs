import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A dashboard metric / KPI: an uppercase label + a big number rendered in a TABULAR, non-serif face.
 * Display serifs (Fraunces etc.) render large numerals poorly, so stats must not use them. Use this
 * instead of hand-styling stat numbers. `value` accepts a NumberTicker or a formatted string.
 */
export function Metric({
  label,
  value,
  sublabel,
  icon,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-sans text-3xl font-semibold tabular-nums tracking-tight text-foreground">{value}</div>
      {sublabel && <div className="text-sm text-muted-foreground">{sublabel}</div>}
    </div>
  );
}
