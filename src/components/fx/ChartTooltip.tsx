import { cn } from '@/lib/utils';

interface TooltipEntry {
  name?: string | number;
  value?: string | number;
  color?: string;
}

/**
 * Drop-in recharts tooltip content with GUARANTEED contrast on dark surfaces. Recharts' default tooltip
 * renders the value in a low-contrast color that is often invisible on a dark theme (the "Spins: 0 is
 * illegible" gap). Both the label AND the value render in high-contrast theme tokens here.
 * Use: `<Tooltip content={<ChartTooltip />} />`.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  className,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  className?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card/95 px-3 py-2 text-card-foreground shadow-xl backdrop-blur-sm',
        className
      )}
    >
      {label != null && label !== '' && (
        <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <div className="space-y-0.5">
        {payload.map((e, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {e.color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} aria-hidden />}
            {e.name != null && <span className="text-foreground">{e.name}</span>}
            <span className="ml-auto font-semibold tabular-nums text-foreground">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
