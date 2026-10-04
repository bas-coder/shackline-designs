import { SOLUTIONS } from '@/lib/content'
import { displayTitle, SplitLead, StudioSection } from '@/components/studio-copy'

/** The three builds, as a numbered list beside the claim. */
export function SolutionsScene({ id }: { id?: string }) {
  const phases = (SOLUTIONS?.phases ?? []).filter((phase) => Boolean(phase) && phase.name)

  return (
    <StudioSection id={id} section="solutions" tone="white">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20">
        <SplitLead title={SOLUTIONS.headline} lede={SOLUTIONS.claim.body} />
        <ol className="border-t sl-rule">
          {phases.map((phase) => (
            <li
              key={phase.id}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b sl-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
            >
              <span className="sl-index pt-1 text-muted-foreground">{phase.num}</span>
              <div>
                <h3 className="sl-display sl-display-sm">{displayTitle(phase.name)}</h3>
                <p className="sl-copy mt-3 max-w-[46ch]">{phase.caption.body}</p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="sl-copy text-muted-foreground">
                      {displayTitle(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </StudioSection>
  )
}
