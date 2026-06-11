/**
 * Home page — Server Component, fetches everything in one Sanity round-trip.
 * Currently the home shows ONLY the Hero (plus the shared header/footer from
 * the layout). The other 5 sections are disabled — kept in the code, commented
 * out below, so they can be re-enabled at any time by uncommenting them.
 *   Hero → [disabled: Reading now → Featured company → Regulation focus →
 *   Full-width image → Value chain preview]
 */
import {sanityFetch} from '@/sanity/lib/fetch'
import {homePageQuery} from '@/sanity/lib/queries'
import {HomeHero} from '@/components/home/HomeHero'
// --- Sections disabled (uncomment to re-enable) ---
// import {ReadingNow} from '@/components/home/ReadingNow'
// import {FeaturedCompany} from '@/components/home/FeaturedCompany'
// import {RegulationFocus} from '@/components/home/RegulationFocus'
// import {HomeFullWidthImage} from '@/components/home/HomeFullWidthImage'
// import {ValueChainPreview} from '@/components/home/ValueChainPreview'

type HomeData = {
  settings: any
  latestArticles: any[]
  featuredCompany: any | null
  featuredReg: any | null
  inForceRegs: any[]
  inPreparationRegs: any[]
  nodes: any[]
}

export default async function HomePage() {
  const data = await sanityFetch<HomeData>({
    query: homePageQuery,
    tags: ['home'],
  })

  const s = data.settings ?? {}

  return (
    <>
      <HomeHero
        label={s.heroLabel}
        heading={s.heroHeading}
        body={s.heroBody}
        primaryCtaLabel={s.heroPrimaryCtaLabel}
        secondaryCtaLabel={s.heroSecondaryCtaLabel}
      />

      {/* --- Sections below are disabled. Uncomment to re-enable. ---

      <ReadingNow
        sectionLabel={s.readingNowSectionLabel}
        introBody={s.readingNowIntroBody}
        articles={data.latestArticles ?? []}
      />

      <FeaturedCompany
        label={s.fromTheDirectoryLabel}
        company={data.featuredCompany}
      />

      <RegulationFocus
        sectionLabel={s.regulationFocusLabel}
        featured={data.featuredReg}
        inForce={data.inForceRegs ?? []}
        inPreparation={data.inPreparationRegs ?? []}
      />

      <HomeFullWidthImage image={s.homeFullWidthImage} />

      <ValueChainPreview
        heading={s.valueChainHeroHeading}
        subhead={s.valueChainHeroSubhead}
        caption={s.valueChainHeroCaption}
        nodes={data.nodes ?? []}
      />

      --- end disabled sections --- */}
    </>
  )
}
