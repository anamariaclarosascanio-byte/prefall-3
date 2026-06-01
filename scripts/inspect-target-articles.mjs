import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const arts = await client.fetch(`*[_type == "article" && (title match "Resale*" || title match "Europe*Fashion Regulation*")]{_id,title,modalTakeaways,modalSectors,sources,body}`)
for (const a of arts) {
  console.log('=== ' + a.title + ' (' + a._id + ') ===')
  if (a.modalTakeaways) console.log('TAKEAWAYS:', JSON.stringify(a.modalTakeaways, null, 2))
  if (a.modalSectors) console.log('SECTORS:', JSON.stringify(a.modalSectors, null, 2))
  if (a.sources) console.log('SOURCES:', JSON.stringify(a.sources, null, 2))
  if (a.body) {
    // find blocks with text containing "incentives."
    for (const b of a.body) {
      if (b._type === 'block' && b.children) {
        const text = b.children.map(c => c.text).join('')
        if (text.includes('incentives.The') || text.includes('incentives')) {
          console.log('BODY BLOCK _key=' + b._key + ':')
          console.log(JSON.stringify(b, null, 2))
        }
      }
    }
  }
  console.log('\n')
}
