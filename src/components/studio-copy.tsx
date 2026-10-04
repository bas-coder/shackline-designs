import type { ReactNode } from 'react'
import { GlitchHeadline } from '@/components/glitch-headline'

const ACRONYMS = new Set(['seo', 'roi', 'usa', 'faq', 'ai'])

/** ALL-CAPS labels become a sentence. Short acronyms stay uppercase. Mixed-case copy is left alone. */
export function displayTitle(value: string) {
  const letters = value.replace(/[^A-Za-z]/g, '')
  const shouting = letters.length > 0 && letters === letters.toUpperCase()
  if (!shouting) return value
  return value
    .toLowerCase()
    .split(/(\s+)/)
    .map((word, index) => {
      const bare = word.replace(/[^a-z]/g, '')
      if (ACRONYMS.has(bare)) return word.replace(bare, bare.toUpperCase())
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1)
      return word
    })
    .join('')
}

export function StudioSection({
  id,
  section,
  tone = 'paper',
  children,
}: {
  id?: string
  section: string
  tone?: 'paper' | 'white'
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-section={section}
      data-tone={tone}
      className="bg-transparent text-foreground"
    >
      <div className="sl-wrap">{children}</div>
    </section>
  )
}

/** Junca's "Why work with us": a sticky headline and a short lede. */
export function SplitLead({ title, lede, sticky = true }: { title: string; lede?: string; sticky?: boolean }) {
  return (
    <div className={sticky ? 'lg:sticky lg:top-28 lg:max-w-[26rem]' : 'lg:max-w-[26rem]'}>
      <GlitchHeadline className="sl-display sl-display-lg">{displayTitle(title)}</GlitchHeadline>
      {lede ? <p className="sl-copy mt-6 max-w-[36ch]">{lede}</p> : null}
    </div>
  )
}

export interface Reason {
  num: string
  title: string
  body: string
  note?: string
}

export function ReasonList({ reasons }: { reasons: Reason[] }) {
  return (
    <ol className="border-t sl-rule">
      {reasons.map((reason) => (
        <li
          key={`${reason.num}-${reason.title}`}
          className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b sl-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
        >
          <span className="sl-index pt-1 text-muted-foreground">{reason.num}</span>
          <div>
            <h3 className="sl-display sl-display-sm">{displayTitle(reason.title)}</h3>
            {reason.note ? <p className="sl-copy mt-3 max-w-[46ch]">{reason.note}</p> : null}
            <p className={reason.note ? 'sl-copy mt-2 max-w-[46ch]' : 'sl-copy mt-3 max-w-[46ch]'}>
              {reason.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
