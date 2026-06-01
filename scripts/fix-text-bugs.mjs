import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)
const bullet = (text) => ({
  _key: k(),
  _type: 'block',
  children: [{_key: k(), _type: 'span', marks: [], text}],
  level: 1,
  listItem: 'bullet',
  markDefs: [],
  style: 'normal',
})

// ── 1 & 2. Resale article ────────────────────────────────────────────────
const RESALE_ID = '0a50f189-e1e1-46dc-b97b-667ffa5b9fd0'
console.log('Patching Resale article…')
await client
  .patch(RESALE_ID)
  .set({
    modalTakeaways: [
      'Fifty-nine percent of secondhand buyers also consume new clothing at high rates.',
      'Resale platform revenue models structurally reward transaction volume, not reduced aggregate consumption.',
      'No independent measurement system validates the displacement claim resale platforms use for sustainability positioning.',
    ],
    modalSectors: ['Resale', 'Primary Market', 'Secondary Market'],
  })
  .commit()
console.log('  ✓ takeaways[0] fixed, sectors deduped')

// ── 4 & 5. Europe's Fashion Regulation article ─────────────────────────
const EU_ID = '4c41c3af-1c99-4f3a-9f4f-f7e7223b5f72'
console.log('\nPatching Europe Fashion Regulation article…')
const cur = await client.fetch(`*[_id == $id][0]{sources, body}`, {id: EU_ID})

// Split concatenated source bullets
const splitMap = {
  '8c5136a28eec': [
    'McKinsey-BoF, “The State of Fashion 2025,” 2024.',
    'McKinsey-BoF, “The State of Fashion 2026,” December 2025.',
  ],
  '51d66ce00868': [
    'Coherent Market Insights, “Sustainable Fashion Market,” 2025.',
    'GM Insights, “Fast Fashion Market Size,” 2025.',
  ],
  '74825e258665': [
    'Fortune Business Insights, “Fast Fashion Market Report,” 2025.',
    'Inditex, “FY2024 Results,” 2025.',
  ],
  '5008d3b4d101': [
    'CNBC, “Temu and Shein face massive tariffs,” May 2025.',
    'MarketMaze, “Germany eCommerce Growth 2025,” 2025.',
  ],
}

const newSources = []
for (const block of cur.sources) {
  if (splitMap[block._key]) {
    for (const text of splitMap[block._key]) {
      newSources.push(bullet(text))
    }
  } else {
    newSources.push(block)
  }
}
console.log(`  Sources: ${cur.sources.length} → ${newSources.length} bullets`)

// Fix body "incentives.The" → "incentives. The"
const newBody = cur.body.map((b) => {
  if (b._type !== 'block' || !b.children) return b
  let changed = false
  const newChildren = b.children.map((c) => {
    if (c._type === 'span' && c.text && c.text.includes('incentives.The')) {
      changed = true
      return {...c, text: c.text.replace('incentives.The', 'incentives. The')}
    }
    return c
  })
  return changed ? {...b, children: newChildren} : b
})

await client.patch(EU_ID).set({sources: newSources, body: newBody}).commit()
console.log('  ✓ sources split, body spacing fixed')

console.log('\nDone.')
