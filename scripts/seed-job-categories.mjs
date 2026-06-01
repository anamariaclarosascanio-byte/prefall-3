/**
 * Seed 4 job categories (matches the prototype's filter chips) and re-create
 * the 6 sample listings with their category ref attached.
 *
 * Run: node --env-file=.env.local scripts/seed-job-categories.mjs
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing Sanity env vars.')
  process.exit(1)
}
const client = createClient({projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false})
const ref = (id) => ({_type: 'reference', _ref: id})
const slug = (s) => ({_type: 'slug', current: s})

const categories = [
  {_id: 'jobCategory.esg', title: 'ESG & Compliance', slugStr: 'esg', order: 1},
  {_id: 'jobCategory.sustainability', title: 'Sustainability', slugStr: 'sustainability', order: 2},
  {_id: 'jobCategory.regulation', title: 'Regulation', slugStr: 'regulation', order: 3},
  {_id: 'jobCategory.circularity', title: 'Circularity', slugStr: 'circularity', order: 4},
]

// Verbatim 6 jobs from prototype (lines 4888-4965) with their category mapping.
const jobs = [
  {
    id: 'job.zalando-sustainability-reporting',
    title: 'Head of Sustainability Reporting',
    company: 'Zalando',
    location: 'Berlin, Germany',
    seniorityId: 'seniority.senior',
    categoryId: 'jobCategory.sustainability',
    publishedAt: '2026-05-10',
  },
  {
    id: 'job.kering-esg-analyst',
    title: 'ESG Analyst: Fashion & Luxury',
    company: 'Kering',
    location: 'Paris, France',
    seniorityId: 'seniority.mid',
    categoryId: 'jobCategory.esg',
    publishedAt: '2026-05-08',
  },
  {
    id: 'job.hm-circular-economy-lead',
    title: 'Circular Economy Lead',
    company: 'H&M Group',
    location: 'Stockholm, Sweden',
    seniorityId: 'seniority.senior',
    categoryId: 'jobCategory.circularity',
    publishedAt: '2026-05-03',
  },
  {
    id: 'job.pvh-regulatory-affairs',
    title: 'Regulatory Affairs Manager: EU Textiles',
    company: 'PVH Corp',
    location: 'Amsterdam, Netherlands',
    seniorityId: 'seniority.mid',
    categoryId: 'jobCategory.regulation',
    publishedAt: '2026-04-28',
  },
  {
    id: 'job.mckinsey-sustainability-consultant',
    title: 'Sustainability Strategy Consultant',
    company: 'McKinsey & Co',
    location: 'Remote / London',
    seniorityId: 'seniority.senior',
    categoryId: 'jobCategory.sustainability',
    publishedAt: '2026-04-20',
  },
  {
    id: 'job.inditex-product-lifecycle',
    title: 'Product Lifecycle Analyst',
    company: 'Inditex',
    location: 'A Coruña, Spain',
    seniorityId: 'seniority.junior',
    categoryId: 'jobCategory.circularity',
    publishedAt: '2026-04-14',
  },
]

async function main() {
  const tx = client.transaction()

  for (const c of categories) {
    tx.createOrReplace({
      _id: c._id,
      _type: 'jobCategory',
      title: c.title,
      slug: slug(c.slugStr),
      order: c.order,
    })
  }

  for (const j of jobs) {
    tx.createOrReplace({
      _id: j.id,
      _type: 'job',
      title: j.title,
      company: j.company,
      location: j.location,
      seniority: ref(j.seniorityId),
      category: ref(j.categoryId),
      publishedAt: j.publishedAt,
    })
  }

  await tx.commit()
  console.log(
    `✓ Seeded ${categories.length} job categories + ${jobs.length} jobs with category refs.`
  )
}

main().catch((err) => {
  console.error(err?.response?.body ?? err)
  process.exit(1)
})
