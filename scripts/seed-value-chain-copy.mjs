/**
 * Patch the valueChainPage subhead + hint to match prefall-prototype 1.html
 * lines 4670-4671 verbatim.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

await client
  .patch('valueChainPage')
  .set({
    subhead:
      "From raw materials to the secondary market, the fashion industry operates as a long chain of distinct economic activities. Each node has its own cost structure, its own regulatory exposure, and its own role in whether the sector's transition is economically viable.",
    mapHintLabel:
      'Click any node to open a full breakdown: companies, regulation, and Prefall analysis covering that stage.',
  })
  .commit()
console.log('✓ valueChainPage subhead + hint patched')
