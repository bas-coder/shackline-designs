import { RegistrationMark } from '@/components/registration-mark'
import { cn } from '@/lib/utils'

/**
 * The stage plates: the independent editorial objects the hero timeline
 * choreographs. A slot with a delivered asset (SHACKLINE_PRODUCT_01-02,
 * SHACKLINE_WEB_01-02) renders the real supplied imagery - object-cover on
 * the authored object-position from the stage table, inside the same
 * hairline press frame and caption bar, so the photographs join the
 * composition as printed objects rather than breaking it. A slot still
 * waiting on its asset keeps the honest plate composed of typography,
 * geometry and whitespace in black, white and #ED3327 - never a fabricated
 * photograph or screenshot. Swapping a plate body for its real asset never
 * touches the master timeline.
 */

/** A physical product plate: the supplied photograph as a printed object - a
 *  hairline frame, a scrimmed caption bar and the red registration dot; the
 *  undelivered fallback is the matte black sheet with the red crosshair. */
export function ProductPlate({
  caption,
  asset,
  src,
  pos,
  className,
}: {
  caption: string
  asset: string
  src?: string
  pos?: string
  className?: string
}) {
  if (src) {
    return (
      <figure
        className={cn(
          'relative m-0 aspect-[4/5] select-none overflow-hidden border border-foreground/20 bg-card text-foreground',
          className,
        )}
        aria-hidden="true"
      >
        <img
          crossOrigin="anonymous"
          src={src}
          alt={caption}
          data-aiwa-asset={asset}
          className="absolute inset-0 h-full w-full object-cover"
          style={pos ? { objectPosition: pos } : undefined}
        />
        {/* the press frame carried over the photograph */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 border border-background/45"
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-background/20 bg-foreground/60 px-5 py-3 backdrop-blur-[2px]">
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-background">
            {caption}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
        </figcaption>
      </figure>
    )
  }

  return (
    <figure
      className={cn(
        'relative m-0 flex aspect-[4/5] select-none items-center justify-center overflow-hidden bg-foreground text-background',
        className,
      )}
      aria-hidden="true"
    >
      {/* hairline inner frame */}
      <span className="absolute inset-3 border border-background/25" />
      {/* red registration crosshair - the press motif */}
      <span className="relative text-primary">
        <RegistrationMark size={64} strokeWidth={2.5} withDot />
      </span>
      {/* spec line */}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-background/15 px-5 py-3">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-background/70">
          {caption}
        </span>
        <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
      </figcaption>
    </figure>
  )
}

/** A web plate: the supplied build screenshot as the screen object - a
 *  hairline frame with a scrimmed header bar carrying the mono label and
 *  the three window dots; the undelivered fallback is the white sheet with
 *  the black hairline grid and the red anchor block. */
export function WebPlate({
  caption,
  asset,
  src,
  pos,
  className,
}: {
  caption: string
  asset: string
  src?: string
  pos?: string
  className?: string
}) {
  if (src) {
    return (
      <figure
        className={cn(
          'relative m-0 aspect-[16/10] select-none overflow-hidden border border-foreground/20 bg-card text-foreground',
          className,
        )}
        aria-hidden="true"
      >
        <img
          crossOrigin="anonymous"
          src={src}
          alt={caption}
          data-aiwa-asset={asset}
          className="absolute inset-0 h-full w-full object-cover"
          style={pos ? { objectPosition: pos } : undefined}
        />
        <figcaption className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-background/20 bg-foreground/60 px-5 py-3 backdrop-blur-[2px]">
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-background">
            {caption}
          </span>
          <span className="flex gap-1" aria-hidden="true">
            <i className="block h-1.5 w-1.5 bg-background" />
            <i className="block h-1.5 w-1.5 bg-background" />
            <i className="block h-1.5 w-1.5 bg-primary" />
          </span>
        </figcaption>
      </figure>
    )
  }

  return (
    <figure
      className={cn(
        'relative m-0 flex aspect-[16/10] select-none items-center justify-center overflow-hidden border border-foreground bg-card text-foreground',
        className,
      )}
      aria-hidden="true"
    >
      {/* hairline structure grid */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '25% 33.333%',
        }}
      />
      {/* the red anchor mass - the conversion point of the build */}
      <span className="absolute bottom-0 left-0 h-[26%] w-[38%] bg-primary" />
      <span className="absolute bottom-[26%] left-0 h-px w-full bg-foreground" />
      {/* mono label */}
      <figcaption className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-foreground/15 bg-card/85 px-5 py-3">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
          {caption}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          <i className="block h-1.5 w-1.5 bg-foreground" />
          <i className="block h-1.5 w-1.5 bg-foreground" />
          <i className="block h-1.5 w-1.5 bg-primary" />
        </span>
      </figcaption>
    </figure>
  )
}