import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Alphabetical order
const ORDER = [
  ['jobCountry.france', 1],
  ['jobCountry.germany', 2],
  ['jobCountry.netherlands', 3],
  ['jobCountry.spain', 4],
  ['jobCountry.sweden', 5],
  ['jobCountry.united-kingdom', 6],
]
for (const [id, order] of ORDER) {
  await client.patch(id).set({order}).commit()
  console.log(`  ${id} → order ${order}`)
}
console.log('✓ jobCountry docs reordered alphabetically')

// Verify
const cs = await client.fetch(`*[_type == "jobCountry"] | order(order asc){title, order}`)
console.log('\nResult order:')
cs.forEach(c => console.log(`  ${c.order}. ${c.title}`))
