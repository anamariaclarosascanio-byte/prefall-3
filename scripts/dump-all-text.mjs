/**
 * Dump every piece of editorial prose in the dataset for proofreading.
 * Outputs to stdout in a structured form so it's easy to scan line by line.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Extract plain text from a Portable Text block array.
function plainText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text).join(''))
    .filter(Boolean)
    .join('\n\n')
}

function section(title) {
  console.log('\n' + '═'.repeat(80))
  console.log('  ' + title)
  console.log('═'.repeat(80))
}

function field(label, value) {
  if (!value) return
  if (typeof value === 'string') {
    console.log(`\n[${label}]\n${value}`)
  } else {
    console.log(`\n[${label}]\n${plainText(value)}`)
  }
}

// ─── Site settings ────────────────────────────────────────────────────────
section('SITE SETTINGS')
const s = await client.fetch(`*[_id == "siteSettings"][0]`)
;[
  'logoText',
  'heroLabel',
  'heroHeading',
  'heroBody',
  'heroPrimaryCtaLabel',
  'heroSecondaryCtaLabel',
  'readingNowSectionLabel',
  'readingNowIntroBody',
  'fromTheDirectoryLabel',
  'regulationFocusLabel',
  'valueChainHeroHeading',
  'valueChainHeroSubhead',
  'valueChainHeroCaption',
  'footerCtaTitle',
  'footerNewsletterCtaLabel',
  'footerContactCtaLabel',
  'footerTagline',
  'footerCopyright',
  'cookieBannerText',
  'cookieAcceptLabel',
  'cookieEssentialLabel',
  'emptyNodeCompaniesMessage',
  'emptyArticlesMessage',
  'emptyJobsMessage',
].forEach((k) => field(k, s?.[k]))

// ─── Singleton prose pages ─────────────────────────────────────────────────
for (const id of [
  'aboutPage',
  'methodologyPage',
  'privacyPage',
  'newsletterPage',
  'articlesPage',
  'companiesPage',
  'regulationPage',
  'valueChainPage',
  'jobsPage',
]) {
  const doc = await client.fetch(`*[_id == $id][0]`, {id})
  if (!doc) continue
  section(`SINGLETON: ${id}`)
  Object.entries(doc).forEach(([k, v]) => {
    if (k.startsWith('_')) return
    if (typeof v === 'string') field(k, v)
    else if (Array.isArray(v)) {
      v.forEach((item, idx) => {
        if (item && item._type === 'block') {
          field(`${k}[${idx}]`, plainText([item]))
        } else if (item && typeof item === 'object') {
          ;['label', 'heading', 'text', 'number', 'body'].forEach((sk) => {
            if (item[sk]) field(`${k}[${idx}].${sk}`, item[sk])
          })
        }
      })
    }
  })
}

// ─── Articles ─────────────────────────────────────────────────────────────
const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc)`)
articles.forEach((a) => {
  section(`ARTICLE: ${a.title}`)
  field('title', a.title)
  field('dek', a.dek)
  field('lead', a.lead)
  field('body', a.body)
  field('sources', a.sources)
  field('modalSynopsis', a.modalSynopsis)
  if (a.modalTakeaways)
    a.modalTakeaways.forEach((t, i) => field(`modalTakeaways[${i}]`, t))
  if (a.modalPrimarySources)
    a.modalPrimarySources.forEach((t, i) => field(`modalPrimarySources[${i}]`, t))
  if (a.modalSectors)
    a.modalSectors.forEach((t, i) => field(`modalSectors[${i}]`, t))
})

// ─── Regulations ──────────────────────────────────────────────────────────
const regs = await client.fetch(`*[_type == "regulation"] | order(name asc)`)
regs.forEach((r) => {
  section(`REGULATION: ${r.name}`)
  field('fullName', r.fullName)
  field('shortSummary', r.shortSummary)
  field('summary', r.summary)
  field('body', r.body)
  field('whoItAffects', r.whoItAffects)
  field('whatItRequires', r.whatItRequires)
  field('prefallAnalysis', r.prefallAnalysis)
  field('sources', r.sources)
  field('countdownDescription', r.countdownDescription)
})

// ─── Companies ────────────────────────────────────────────────────────────
const cos = await client.fetch(`*[_type == "company"] | order(name asc)`)
cos.forEach((c) => {
  section(`COMPANY: ${c.name}`)
  field('tagline', c.tagline)
  field('businessModelSummary', c.businessModelSummary)
  field('headquarters', c.headquarters)
  field('founded', c.founded)
  field('ownership', c.ownership)
  field('leadership', c.leadership)
  field('approximateSize', c.approximateSize)
  field('businessModel', c.businessModel)
  field('companySays', c.companySays)
  field('prefallAnalysis', c.prefallAnalysis)
  field('sources', c.sources)
  if (c.regulatoryExposure)
    c.regulatoryExposure.forEach((e, i) => {
      field(`regulatoryExposure[${i}].displayLabel`, e.displayLabel)
      field(`regulatoryExposure[${i}].directionShort`, e.directionShort)
      field(`regulatoryExposure[${i}].note`, e.note)
    })
  if (c.verifiableSignals)
    c.verifiableSignals.forEach((sig, i) => {
      field(`verifiableSignals[${i}].label`, sig.label)
      field(`verifiableSignals[${i}].body`, sig.body)
    })
})

// ─── Nodes ────────────────────────────────────────────────────────────────
const nodes = await client.fetch(`*[_type == "node"] | order(order asc)`)
nodes.forEach((n) => {
  section(`NODE: ${n.title}`)
  field('shortBlurb', n.shortBlurb)
  field('heroSummary', n.heroSummary)
  field('description', n.description)
  field('economics', n.economics)
  field('tensions', n.tensions)
})

console.log('\n\n[END OF DUMP]')
