import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
// Dump every doc and grep for "María" (with accent)
const all = await client.fetch(`*[!(_id in path("drafts.**"))]`)
const hits = []
function walk(doc, prefix='') {
  for (const [k,v] of Object.entries(doc)) {
    if (k.startsWith('_')) continue
    if (typeof v === 'string') {
      if (v.includes('María') || v.includes('Marí')) hits.push({id: doc._id, type: doc._type, field: prefix+k, text: v})
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'string') {
          if (item.includes('María') || item.includes('Marí')) hits.push({id: doc._id, type: doc._type, field: `${prefix}${k}[${i}]`, text: item})
        } else if (item && typeof item === 'object') {
          // Portable text or nested
          if (item._type === 'block' && item.children) {
            const txt = item.children.map(c => c.text || '').join('')
            if (txt.includes('María') || txt.includes('Marí')) hits.push({id: doc._id, type: doc._type, field: `${prefix}${k}[${i}]`, text: txt})
          } else {
            walk(item, `${prefix}${k}[${i}].`)
          }
        }
      })
    } else if (v && typeof v === 'object') {
      walk(v, `${prefix}${k}.`)
    }
  }
}
all.forEach(d => walk(d))
console.log(`Found ${hits.length} hits with "María"/"Marí":`)
hits.forEach(h => console.log(`  [${h.type}/${h.id}] ${h.field}: ${h.text.slice(0,140)}`))
