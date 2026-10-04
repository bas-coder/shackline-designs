import { ArrowRight, MapPin, NavigationArrow, Printer, MagnifyingGlass, Star, StarHalf } from '@phosphor-icons/react'
import { CropMarks } from '@/components/registration-mark'
import { MiniButton } from '@/components/ui/mini-button'
import { cn } from '@/lib/utils'

/**
 * The three evidence blocks: framed UI mocks composed from the studio's own
 * artifacts - a screen-print proof sheet, a custom web build in browser
 * chrome, and a local map listing. No stock imagery, no screenshots;
 * each frame is drawn in the palette and carries crop marks.
 */
export function EvidenceMock({
  kind,
  label,
  tag,
  className,
}: {
  kind: 'proof' | 'browser' | 'listing'
  label: string
  tag: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative border border-border bg-card p-5 transition-colors duration-300 hover:border-foreground/30 sm:p-7',
        className,
      )}
    >
      <CropMarks inset={8} length={12} />

      <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <span className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {tag}
        </span>
      </div>

      {kind === 'proof' && <ProofSheet />}
      {kind === 'browser' && <BrowserFrame />}
      {kind === 'listing' && <MapListing />}
    </div>
  )
}

/* ---------------- 01 · the screen-print proof sheet ---------------- */

function ProofSheet() {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* the garment panel - heavyweight cotton as a layered ink wash */}
      <div className="relative h-44 overflow-hidden border border-border bg-foreground md:h-auto md:w-[46%]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(85% 70% at 30% 22%, color-mix(in srgb, var(--color-background) 28%, var(--color-foreground)) 0%, var(--color-foreground) 68%)' }} />
        <div className="absolute inset-0 opacity-40" style={{ background: 'linear-gradient(115deg, transparent 42%, rgba(248,250,252,0.09) 46%, transparent 52%, rgba(248,250,252,0.07) 60%, transparent 66%)' }} />
        {/* the print: brand mark screened onto the chest */}
        <svg viewBox="0 0 120 120" className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-[58%] text-background" aria-hidden="true">
          <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <line x1="60" y1="14" x2="60" y2="106" stroke="currentColor" strokeWidth="3.5" />
          <line x1="14" y1="60" x2="106" y2="60" stroke="currentColor" strokeWidth="3.5" />
        </svg>
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-background/60">
          240 gsm · black
        </span>
      </div>

      {/* the spec card */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-3 border border-border px-4 py-3">
          <Printer size={16} className="text-primary" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Method</p>
            <p className="text-sm font-medium text-foreground">Screen print - 1 colour, white on black</p>
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Placement</p>
          <div className="flex items-center gap-2">
            {['Full front', 'Left chest', 'Sleeve'].map((p, i) => (
              <span
                key={p}
                className={cn(
                  'border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]',
                  i === 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground',
                )}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Run size</p>
          <div className="grid grid-cols-4 divide-x divide-border border border-border">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <span key={s} className="py-2 text-center font-mono text-xs text-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>

        <MiniButton className="mt-auto w-full">
          Send to proof <ArrowRight size={13} aria-hidden="true" />
        </MiniButton>
      </div>
    </div>
  )
}

/* ---------------- 02 · the custom web build ---------------- */

function BrowserFrame() {
  return (
    <div className="border border-border">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="block h-2.5 w-2.5 rounded-full border border-border bg-card" />
          <i className="block h-2.5 w-2.5 rounded-full border border-border bg-card" />
          <i className="block h-2.5 w-2.5 rounded-full border border-border bg-card" />
        </span>
        <span className="flex-1 border border-border bg-card px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          yourbrand.com
        </span>
      </div>

      {/* the site mock - the same broadsheet language, miniaturised */}
      <div className="bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">Yourbrand</span>
          <span className="hidden gap-3 sm:flex">
            {['Shop', 'Story', 'Visit'].map((n) => (
              <span key={n} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {n}
              </span>
            ))}
          </span>
          <MiniButton variant="filled" className="min-h-8 px-3 py-1 text-[10px]">Shop the drop</MiniButton>
        </div>

        <div className="px-4 py-7">
          <p className="max-w-[24ch] ef-heading ef-xs text-foreground">
            The opening drop
          </p>
          <p className="mt-2 max-w-[36ch] text-xs leading-relaxed text-muted-foreground">
            Heavyweight tees, printed in one run - and a site that sells them from day one.
          </p>

          {/* lead capture - the form field artifact */}
          <div className="mt-5 flex max-w-sm">
            <label htmlFor="mock-email" className="sr-only">
              Email (mock)
            </label>
            <input
              id="mock-email"
              tabIndex={-1}
              placeholder="you@email.com"
              className="h-11 min-w-0 flex-1 rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <MiniButton variant="filled" className="rounded-none">Get the drop</MiniButton>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {['Launch gear', 'Custom build', 'Found locally'].map((c) => (
            <span key={c} className="px-3 py-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px]">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- 03 · the local map listing ---------------- */

function MapListing() {
  return (
    <div className="flex flex-col gap-0 border border-border">
      {/* the map panel - pin on a hairline grid */}
      <div className="relative h-40 overflow-hidden border-b border-border bg-background sm:h-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.55,
          }}
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 58% 40%, rgba(3,105,201,0.10), transparent 70%)' }} />
        {/* streets */}
        <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-border" aria-hidden="true">
          <path d="M0 132 C90 124 150 150 400 138" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M210 0 C202 60 226 120 218 180" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0 62 C120 58 260 74 400 66" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="absolute left-[54%] top-[36%] flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center">
          <MapPin size={30} className="fill-primary text-primary drop-shadow-[0_6px_10px_rgba(3,105,201,0.35)]" aria-hidden="true" />
        </span>
        <span className="absolute bottom-2.5 right-2.5 border border-border bg-card px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          Map data · illustrative
        </span>
      </div>

      {/* the listing card - pin, stars, directions */}
      <div className="bg-card">
        <div className="flex items-start gap-3 border-b border-border px-4 py-4">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center border border-border text-primary">
            <MapPin size={15} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-foreground">Yourbrand - flagship</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Screen printing · Brand studio
            </p>
            <span className="mt-2 flex items-center gap-1.5" aria-label="Rated five stars (illustrative)">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} size={13} className="fill-primary text-primary" aria-hidden="true" />
              ))}
              <StarHalf size={13} className="fill-primary text-primary" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-4">
          <MiniButton variant="filled" className="flex-1">
            <NavigationArrow size={13} aria-hidden="true" /> Get directions
          </MiniButton>
          <MiniButton className="flex-1">
            <MagnifyingGlass size={13} aria-hidden="true" /> Website
          </MiniButton>
        </div>
      </div>
    </div>
  )
}