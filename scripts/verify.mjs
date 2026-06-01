/**
 * Foundation verification script. Queries Sanity for counts of every doc type
 * and asserts they match the launch spec. Exits 0 if all good, 1 if anything
 * is missing or off.
 *
 * Run: node --env-file=.env.local scripts/verify.mjs
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const expected = [
  ['regulationStatus', 5],
  ['jobSeniority', 3],
  ['articleCategory', 9],
  ['companyTag', 4],
  ['node', 7],
  ['regulation', 14],
  ['company', 3],
  ['article', 0],
  ['job', 0],
  ['siteSettings', 1],
  ['articlesPage', 1],
  ['companiesPage', 1],
  ['regulationPage', 1],
  ['valueChainPage', 1],
  ['jobsPage', 1],
  ['newsletterPage', 1],
  ['aboutPage', 1],
  ['methodologyPage', 1],
  ['privacyPage', 1],
]

const results = []
let ok = true
for (const [type, want] of expected) {
  const got = await client.fetch(`count(*[_type == $type])`, {type})
  const pass = got === want
  results.push({type, expected: want, got, status: pass ? '✓' : '✗'})
  if (!pass) ok = false
}

console.table(results)

// Reference integrity: each regulation must reference a status; each company must reference nodes
const orphanRegs = await client.fetch(`*[_type=="regulation" && !defined(status)]._id`)
const orphanCompanies = await client.fetch(`*[_type=="company" && (!defined(nodes) || count(nodes) == 0)]._id`)
const sampleVeja = await client.fetch(`*[_id == "company.veja"][0]{name, "nodeCount": count(nodes), tagline}`)
const sampleNode = await client.fetch(`*[_id == "node.brands"][0]{title, order, slug}`)
const sampleStatus = await client.fetch(`*[_type=="regulation" && name=="CSRD"][0]{name, "statusTitle": status->title}`)

console.log('\nReference integrity:')
console.log(`  Regulations without status: ${orphanRegs.length} (want 0)`)
console.log(`  Companies without nodes:    ${orphanCompanies.length} (want 0)`)
console.log('\nSpot checks:')
console.log('  Veja sample:', sampleVeja)
console.log('  Brands node sample:', sampleNode)
console.log('  CSRD status resolves to:', sampleStatus)

if (orphanRegs.length || orphanCompanies.length) ok = false
if (!ok) {
  console.log('\n✗ Verification FAILED.')
  process.exit(1)
}
console.log('\n✓ All checks passed.')
