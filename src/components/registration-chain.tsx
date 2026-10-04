import { SILOS } from '@/lib/content'
import { ReasonList, SplitLead, StudioSection } from '@/components/studio-copy'

/**
 * Second section. Laid out like Junca's "Why work with us": a sticky
 * headline and lede, then a numbered list with no cards and no icons.
 */
export function RegistrationChain({ id }: { id?: string }) {
  return (
    <StudioSection id={id} section="silos">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-20">
        <SplitLead title={SILOS.headline} lede={SILOS.intro} />
        <ReasonList
          reasons={SILOS.chain.map((link) => ({
            num: link.num,
            title: link.word,
            body: link.note,
          }))}
        />
      </div>
    </StudioSection>
  )
}
