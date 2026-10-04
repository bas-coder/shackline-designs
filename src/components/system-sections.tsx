import { DIFFERENCE, ROADMAP } from '@/lib/content'
import { displayTitle, SplitLead, StudioSection } from '@/components/studio-copy'

/** One studio against three vendors, set as sentences rather than a table. */
export function DifferenceRail({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="difference" tone="white">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20">
        <SplitLead title={DIFFERENCE.headline} />
        <ol className="border-t sl-rule">
          {DIFFERENCE.rows.map((row, index) => (
            <li
              key={row.label}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b sl-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
            >
              <span className="sl-index pt-1 text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="sl-display sl-display-sm">{displayTitle(row.label)}</h3>
                <p className="sl-copy mt-3 max-w-[46ch]">{row.own}</p>
                <p className="sl-copy mt-2 max-w-[46ch] text-muted-foreground">{row.other}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </StudioSection>
  )
}

/** The same three phases, for any surface that still mounts the walk. */
export function RoadmapWalk({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="roadmap" tone="white">
      <SplitLead title={ROADMAP.headline} lede={ROADMAP.intro} />
      <ol className="mt-14 grid gap-12 border-t sl-rule pt-12 md:grid-cols-3 md:gap-10">
        {ROADMAP.phases.map((phase) => (
          <li key={phase.num}>
            <p className="sl-index text-muted-foreground">{phase.num.replace('PHASE ', '')}</p>
            <h3 className="sl-display sl-display-sm mt-4">{displayTitle(phase.name)}</h3>
            <p className="sl-copy mt-3">{phase.title}</p>
            <p className="sl-copy mt-2">{phase.body}</p>
          </li>
        ))}
      </ol>
    </StudioSection>
  )
}
