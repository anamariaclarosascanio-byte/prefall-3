import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const ID = '57dbc960-92d7-4190-9600-85c1936a98ee'
const cur = await client.fetch(`*[_id == $id][0]{body}`, {id: ID})

const REPLACEMENTS = [
  ['within reach,and the use of a named designer', 'within reach, and the use of a named designer'],
  ['does not actually exist keeping the system', 'does not actually exist, keeping the system'],
]

let totalFixes = 0
const newBody = cur.body.map((b) => {
  if (b._type !== 'block' || !b.children) return b
  let changed = false
  const newChildren = b.children.map((c) => {
    if (c._type !== 'span' || !c.text) return c
    let text = c.text
    for (const [from, to] of REPLACEMENTS) {
      if (text.includes(from)) {
        text = text.replace(from, to)
        changed = true
        totalFixes++
      }
    }
    return changed ? {...c, text} : c
  })
  return changed ? {...b, children: newChildren} : b
})

await client.patch(ID).set({body: newBody}).commit()
console.log(`✓ Galliano patched — ${totalFixes} replacements`)
