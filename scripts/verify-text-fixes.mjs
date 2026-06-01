import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const resale = await client.fetch(`*[_id == "0a50f189-e1e1-46dc-b97b-667ffa5b9fd0"][0]{modalTakeaways,modalSectors}`)
console.log('--- Resale ---')
console.log('takeaways[0]:', resale.modalTakeaways[0])
console.log('sectors:', resale.modalSectors)

const eu = await client.fetch(`*[_id == "4c41c3af-1c99-4f3a-9f4f-f7e7223b5f72"][0]{sources,body}`)
console.log('\n--- Europe sources count:', eu.sources.length, '---')
for (const b of eu.sources) {
  const t = b.children?.map(c => c.text).join('') || ''
  if (t.includes('2024.') || t.includes('2025.G') || t.includes('2025.I') || t.includes('2025.M')) {
    console.log('  STILL JOINED:', t)
  }
}
console.log('\n--- Europe body check ---')
for (const b of eu.body || []) {
  if (b._type !== 'block') continue
  const t = b.children?.map(c => c.text).join('') || ''
  if (t.includes('incentives')) {
    const ok = t.includes('incentives. The')
    const bad = t.includes('incentives.The')
    console.log('  incentives.The present:', bad)
    console.log('  incentives. The present:', ok)
  }
}
