import { SiteChrome } from '@/components/site-chrome'
import { HeroStage } from '@/components/hero-stage'
import { ManifestoPillars, EcosystemRows, RoadmapProgression, FaqAccordion } from '@/components/editorial-sections'
import { WorkBento, MerchBand } from '@/components/work-merch'
import { AboutBand } from '@/components/about-faq'
import { FounderCrossfade } from '@/components/founder-crossfade'
import { QuoteForm } from '@/components/quote-form'

/**
 * After the hero: about, the people, why one system, the three pillars,
 * the roadmap, then the FAQ. Work and merch stay so the header links still land.
 */
export function Home() {
  return (
    <SiteChrome>
      <HeroStage />

      <AboutBand id="about" />

      <FounderCrossfade />

      <EcosystemRows id="ecosystem" />

      <ManifestoPillars id="solutions" />

      <RoadmapProgression id="roadmap" />

      <FaqAccordion id="faq" />

      <WorkBento id="work" />

      <MerchBand id="merch" />

      <QuoteForm id="contact" />
    </SiteChrome>
  )
}
