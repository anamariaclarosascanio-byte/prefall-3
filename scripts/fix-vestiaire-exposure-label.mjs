import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
await client
  .patch('company.vestiaire')
  .set({'regulatoryExposure[_key=="3be5cd953346"].displayLabel': 'Waste Framework Directive & Textile EPR'})
  .commit()
console.log('✓ Vestiaire exposure label harmonized')
// Verify
const v = await client.fetch(`*[_id == "company.vestiaire"][0]{regulatoryExposure}`)
v.regulatoryExposure.forEach(e => console.log('  ', e.displayLabel))
