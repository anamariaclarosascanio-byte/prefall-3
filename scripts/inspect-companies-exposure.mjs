import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const cos = await client.fetch(`*[_type == "company"]{_id,name,regulatoryExposure}`)
for (const c of cos) {
  console.log(`\n=== ${c.name} (${c._id}) ===`)
  ;(c.regulatoryExposure || []).forEach((e, i) => {
    console.log(`  [${i}] _key=${e._key}  displayLabel="${e.displayLabel}"`)
  })
}
