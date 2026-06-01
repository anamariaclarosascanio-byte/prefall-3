/**
 * Adds:
 *   • Internship seniority (4th level alongside Junior/Mid/Senior)
 *   • 6 countries matching the seeded jobs (Germany, France, Sweden,
 *     Netherlands, United Kingdom, Spain)
 *   • Patches the 6 existing jobs with country + city refs so the new
 *     filter rows on /jobs have something to filter against.
 *
 * Run: node --env-file=.env.local scripts/seed-job-filters.mjs
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const ref = (id) => ({_type: 'reference', _ref: id})
const slug = (s) => ({_type: 'slug', current: s})

// Internship seniority (order 0 — appears first on the filter bar before
// Junior, since interns come earlier in the career arc).
const internship = {
  _id: 'seniority.internship',
  _type: 'jobSeniority',
  title: 'Internship',
  slug: slug('internship'),
  order: 0,
}

const countries = [
  {_id: 'jobCountry.germany', title: 'Germany', slugStr: 'germany', order: 1},
  {_id: 'jobCountry.france', title: 'France', slugStr: 'france', order: 2},
  {_id: 'jobCountry.sweden', title: 'Sweden', slugStr: 'sweden', order: 3},
  {_id: 'jobCountry.netherlands', title: 'Netherlands', slugStr: 'netherlands', order: 4},
  {_id: 'jobCountry.united-kingdom', title: 'United Kingdom', slugStr: 'united-kingdom', order: 5},
  {_id: 'jobCountry.spain', title: 'Spain', slugStr: 'spain', order: 6},
]

// Patch existing jobs with country + city (parsed from their location strings).
const jobPatches = [
  {id: 'job.zalando-sustainability-reporting', countryId: 'jobCountry.germany', city: 'Berlin'},
  {id: 'job.kering-esg-analyst',               countryId: 'jobCountry.france',  city: 'Paris'},
  {id: 'job.hm-circular-economy-lead',         countryId: 'jobCountry.sweden',  city: 'Stockholm'},
  {id: 'job.pvh-regulatory-affairs',           countryId: 'jobCountry.netherlands', city: 'Amsterdam'},
  {id: 'job.mckinsey-sustainability-consultant', countryId: 'jobCountry.united-kingdom', city: 'London'},
  {id: 'job.inditex-product-lifecycle',        countryId: 'jobCountry.spain',   city: 'A Coruña'},
]

async function main() {
  const tx = client.transaction()

  tx.createOrReplace(internship)

  for (const c of countries) {
    tx.createOrReplace({
      _id: c._id,
      _type: 'jobCountry',
      title: c.title,
      slug: slug(c.slugStr),
      order: c.order,
    })
  }

  for (const j of jobPatches) {
    tx.patch(j.id, {set: {country: ref(j.countryId), city: j.city}})
  }

  await tx.commit()
  console.log(
    `✓ Added Internship seniority + ${countries.length} countries + patched ${jobPatches.length} jobs.`
  )
}

main().catch((err) => {
  console.error(err?.response?.body ?? err)
  process.exit(1)
})
