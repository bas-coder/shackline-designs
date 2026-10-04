import { GridPattern } from '@/components/fx'
import { cn } from '@/lib/utils'

/**
 * The site's one atmosphere: a 48-cell technical grid, radially masked away
 * from the top-left, drawn in the palette's own border token so it re-skins
 * in dark mode. Used on the hero sheet and the contact bookend only.
 */
export function ProofGrid({ className, cell = 48 }: { className?: string; cell?: number }) {
  return (
    <GridPattern
      cell={cell}
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-border', className)}
      style={{
        maskImage: 'radial-gradient(120% 100% at 18% 0%, black 35%, transparent 88%)',
        WebkitMaskImage: 'radial-gradient(120% 100% at 18% 0%, black 35%, transparent 88%)',
      }}
    />
  )
}