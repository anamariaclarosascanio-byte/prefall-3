import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const a = await client.fetch(`*[_type == "article" && title match "*Galliano*"][0]{_id,title,body}`)
console.log('_id:', a._id)
console.log('title:', a.title)
for (const b of a.body || []) {
  if (b._type !== 'block' || !b.children) continue
  const text = b.children.map(c => c.text).join('')
  if (text.includes('reach,and') || text.includes('not actually exist keeping')) {
    console.log('\nMATCH _key=' + b._key + ':')
    console.log(JSON.stringify(b, null, 2))
  }
}
