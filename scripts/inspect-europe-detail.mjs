import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const a = await client.fetch(`*[_id == "4c41c3af-1c99-4f3a-9f4f-f7e7223b5f72"][0]{sources,body}`)
console.log('SOURCES:')
console.log(JSON.stringify(a.sources, null, 2))
console.log('\n\nBODY BLOCKS WITH "incentives":')
for (const b of a.body || []) {
  if (b._type === 'block' && b.children) {
    const text = b.children.map(c => c.text).join('')
    if (text.includes('incentives')) {
      console.log(JSON.stringify(b, null, 2))
    }
  }
}
