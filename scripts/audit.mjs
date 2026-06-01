/**
 * General audit. Counts every document type and singleton, flags missing or
 * empty content fields. Read-only.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const q = (s) => client.fetch(s)

const out = []
const log = (s) => out.push(s)

log('━━━ SANITY CONTENT AUDIT ━━━\n')

// Counts
const counts = await q(`{
  "nodes":       count(*[_type == "node"]),
  "companies":   count(*[_type == "company"]),
  "regulations": count(*[_type == "regulation"]),
  "articles":    count(*[_type == "article"]),
  "jobs":        count(*[_type == "job"]),
  "jobCategories": count(*[_type == "jobCategory"]),
  "jobSeniorities": count(*[_type == "jobSeniority"]),
  "articleCategories": count(*[_type == "articleCategory"]),
  "regulationStatuses": count(*[_type == "regulationStatus"]),
  "companyTags": count(*[_type == "companyTag"]),
}`)
log('DOCUMENT COUNTS')
Object.entries(counts).forEach(([k, v]) => log(`  ${k.padEnd(22)} ${v}`))

// Singletons existence
const singletons = await q(`{
  "siteSettings":    defined(*[_id == "siteSettings"][0]._id),
  "aboutPage":       defined(*[_id == "aboutPage"][0]._id),
  "methodologyPage": defined(*[_id == "methodologyPage"][0]._id),
  "privacyPage":     defined(*[_id == "privacyPage"][0]._id),
  "newsletterPage":  defined(*[_id == "newsletterPage"][0]._id),
  "jobsPage":        defined(*[_id == "jobsPage"][0]._id),
  "articlesPage":    defined(*[_id == "articlesPage"][0]._id),
  "companiesPage":   defined(*[_id == "companiesPage"][0]._id),
  "regulationPage":  defined(*[_id == "regulationPage"][0]._id),
  "valueChainPage":  defined(*[_id == "valueChainPage"][0]._id),
}`)
log('\nSINGLETONS')
Object.entries(singletons).forEach(([k, v]) =>
  log(`  ${k.padEnd(22)} ${v ? 'OK' : 'MISSING'}`)
)

// Per-node body coverage
const nodesAudit = await q(`*[_type == "node"] | order(order asc){
  "slug": slug.current,
  title,
  "shortBlurb":   defined(shortBlurb),
  "heroSummary":  defined(heroSummary),
  "description":  count(description) > 0,
  "economics":    count(economics) > 0,
  "tensions":     count(tensions) > 0
}`)
log('\nNODES — prose coverage (shortBlurb · heroSummary · description · economics · tensions)')
nodesAudit.forEach((n) => {
  const flags = [n.shortBlurb, n.heroSummary, n.description, n.economics, n.tensions]
    .map((v) => (v ? '✓' : '✗'))
    .join(' ')
  log(`  ${(n.slug ?? '?').padEnd(22)} ${flags}  ${n.title}`)
})

// Per-regulation body coverage
const regsAudit = await q(`*[_type == "regulation"] | order(name asc){
  "slug": slug.current,
  name,
  "shortSummary":    defined(shortSummary),
  "body":            count(body) > 0,
  "whoItAffects":    count(whoItAffects) > 0,
  "whatItRequires":  count(whatItRequires) > 0,
  "prefallAnalysis": count(prefallAnalysis) > 0,
  "sources":         count(sources) > 0,
  "status":          defined(status._ref)
}`)
log('\nREGULATIONS — prose coverage (shortSummary · body · whoItAffects · whatItRequires · prefallAnalysis · sources · status)')
regsAudit.forEach((r) => {
  const flags = [
    r.shortSummary,
    r.body,
    r.whoItAffects,
    r.whatItRequires,
    r.prefallAnalysis,
    r.sources,
    r.status,
  ]
    .map((v) => (v ? '✓' : '✗'))
    .join(' ')
  log(`  ${(r.slug ?? '?').padEnd(14)} ${flags}  ${r.name}`)
})

// Per-company coverage
const cosAudit = await q(`*[_type == "company"] | order(name asc){
  "slug": slug.current,
  name,
  "tagline":            defined(tagline),
  "headquarters":       defined(headquarters),
  "founded":            defined(founded),
  "ownership":          defined(ownership),
  "leadership":         defined(leadership),
  "approximateSize":    defined(approximateSize),
  "businessModel":      count(businessModel) > 0,
  "companySays":        count(companySays) > 0,
  "prefallAnalysis":    count(prefallAnalysis) > 0,
  "regulatoryExposure": count(regulatoryExposure) > 0,
  "verifiableSignals":  count(verifiableSignals) > 0,
  "sources":            count(sources) > 0
}`)
log('\nCOMPANIES — coverage (tagline · hq · founded · ownership · leadership · size · model · says · analysis · exposure · signals · sources)')
cosAudit.forEach((c) => {
  const flags = [
    c.tagline, c.headquarters, c.founded, c.ownership, c.leadership, c.approximateSize,
    c.businessModel, c.companySays, c.prefallAnalysis, c.regulatoryExposure, c.verifiableSignals, c.sources,
  ].map((v) => (v ? '✓' : '✗')).join(' ')
  log(`  ${(c.slug ?? '?').padEnd(14)} ${flags}  ${c.name}`)
})

// Per-job coverage
const jobsAudit = await q(`*[_type == "job"] | order(publishedAt desc){
  _id, title,
  "company":   defined(company),
  "location":  defined(location),
  "publishedAt": defined(publishedAt),
  "category":  defined(category._ref),
  "seniority": defined(seniority._ref),
  "link":      defined(link)
}`)
log('\nJOBS — coverage (company · location · publishedAt · category · seniority · link)')
jobsAudit.forEach((j) => {
  const flags = [j.company, j.location, j.publishedAt, j.category, j.seniority, j.link]
    .map((v) => (v ? '✓' : '✗')).join(' ')
  log(`  ${j._id.padEnd(40)} ${flags}  ${j.title}`)
})

// Singleton field coverage (about, methodology, privacy, newsletter, jobsPage)
const singletonsAudit = await q(`{
  "about": *[_id == "aboutPage"][0]{heroHeading, heroSubhead, "sections": count(sections), contactFormTitle},
  "newsletter": *[_id == "newsletterPage"][0]{kicker, heading, body, "features": count(features), submitLabel, successTitle},
  "methodology": *[_id == "methodologyPage"][0]{heroHeading, "sections": count(sections)},
  "privacy": *[_id == "privacyPage"][0]{heroHeading, "sections": count(sections)},
  "jobsPage": *[_id == "jobsPage"][0]{heading, subhead, emptyMessage},
  "siteSettings": *[_id == "siteSettings"][0]{heroHeading, "homeAlsoInForce": count(homeAlsoInForceRegulations), "homeInPrep": count(homeInPreparationRegulations), homeFeaturedRegulation}
}`)
log('\nSINGLETON FIELDS')
log(JSON.stringify(singletonsAudit, null, 2))

console.log(out.join('\n'))
