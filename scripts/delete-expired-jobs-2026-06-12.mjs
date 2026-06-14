/**
 * Retire 5 expired job listings from /jobs (2026-06-12 audit).
 * Deletes both the published doc and any leftover draft.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const EXPIRED = [
  {id: 'job.li-4424121830', title: 'Lead Footwear Materials Developer, Energy', company: 'Nike'},
  {id: 'job.peakperf-7733213', title: 'Sustainability & Quality Coordinator', company: 'Peak Performance'},
  {id: 'job.whitestuff-7854744', title: 'Sustainability & Responsible Materials Intern (12 months)', company: 'White Stuff'},
  {id: 'job.hugoboss-143950', title: 'Internship, Sustainable Supply Chain (m/w/d)', company: 'HUGO BOSS'},
  {id: 'job.li-gxnFd6Ga', title: 'Senior Director, Global Responsible Sourcing & Supply Chain Sustainability', company: 'Levi Strauss & Co.'},
]

const before = await client.fetch(`count(*[_type=="job"])`)
console.log(`Total jobs BEFORE: ${before}`)

for (const j of EXPIRED) {
  const tx = client.transaction()
  tx.delete(j.id)
  tx.delete(`drafts.${j.id}`)
  await tx.commit({visibility: 'async'}).catch((err) => {
    if (!String(err.message).includes('does not exist')) throw err
  })
  console.log(`  ✗ deleted: ${j.company} — ${j.title}`)
}

// give Sanity a moment to reflect the deletes before counting
await new Promise((r) => setTimeout(r, 1500))
const after = await client.fetch(`count(*[_type=="job"])`)
console.log(`\nTotal jobs AFTER: ${after}`)
console.log(`Removed: ${before - after}`)
