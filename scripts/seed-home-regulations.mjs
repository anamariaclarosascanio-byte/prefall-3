/**
 * Seed the new home-page "Regulation that matters now" curated picks on
 * siteSettings. Matches the prototype's exact regulations:
 *   - featured: CSRD
 *   - also in force: ESPR, DPP, Green Claims Directive
 *   - in preparation: Italy fast fashion bill, Textile labelling revision
 *
 * Idempotent — uses .patch.set so running this twice is a no-op. Ana can
 * change the picks later in Studio at any time.
 */
import {config} from 'dotenv'
config({path: '.env.local'})
import {createClient} from '@sanity/client'

const token =
  process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('SANITY_API_TOKEN missing in env')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const ref = (id) => ({_type: 'reference', _ref: id})
const keyedRef = (id, key) => ({_type: 'reference', _ref: id, _key: key})

async function main() {
  const result = await client
    .patch('siteSettings')
    .set({
      homeFeaturedRegulation: ref('regulation.csrd'),
      homeAlsoInForceRegulations: [
        keyedRef('regulation.espr', 'also-espr'),
        keyedRef('regulation.dpp', 'also-dpp'),
        keyedRef('regulation.gcd', 'also-gcd'),
      ],
      homeInPreparationRegulations: [
        keyedRef('regulation.italy', 'prep-italy'),
        keyedRef('regulation.textile', 'prep-textile'),
      ],
    })
    .commit()
  console.log('siteSettings patched:', result._id)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
