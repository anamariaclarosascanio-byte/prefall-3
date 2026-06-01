/**
 * Articles audit. Lists every article + which of its image / related fields
 * are populated, and which `cardImage` / `heroImage` assets they reference.
 * Surfaces:
 *   • duplicate image assets (two articles pointing at the same upload)
 *   • articles with no relatedArticles set (so the section won't render)
 *   • missing cardImage (will fall back to hero)
 *   • orphan refs (relatedArticles pointing at deleted docs)
 *
 * Read-only. Run:
 *   node --env-file=.env.local scripts/audit-articles.mjs
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "heroImageRef":  heroImage.asset._ref,
  "cardImageRef":  cardImage.asset._ref,
  "category":      category->{title, "slug": slug.current},
  "nodes":         nodes[]->{_id, title},
  "relatedRefs":   relatedArticles[]._ref,
  "relatedArticles": relatedArticles[]->{_id, title, "slug": slug.current}
}`)

console.log(`\n━━━ ARTICLES AUDIT (${articles.length} docs) ━━━\n`)

// Per-article report
articles.forEach((a, i) => {
  console.log(`${i + 1}. ${a.title}`)
  console.log(`   _id:           ${a._id}`)
  console.log(`   slug:          ${a.slug}`)
  console.log(`   publishedAt:   ${a.publishedAt ?? '— (no date)'}`)
  console.log(`   category:      ${a.category?.title ?? '— (none)'}`)
  console.log(`   heroImage:     ${a.heroImageRef ?? '— (none)'}`)
  console.log(`   cardImage:     ${a.cardImageRef ?? '— (none — will fall back to hero)'}`)
  console.log(`   nodes:         ${a.nodes?.map((n) => n.title).join(', ') || '— (none)'}`)
  if (a.relatedRefs?.length) {
    console.log(`   relatedArticles (${a.relatedRefs.length} manual):`)
    a.relatedArticles.forEach((r) => {
      console.log(`     → ${r?.title ?? '⚠ MISSING/DELETED'}  [${r?._id ?? a.relatedRefs[0]}]`)
    })
    // Orphan check
    const resolvedIds = new Set(a.relatedArticles.map((r) => r?._id).filter(Boolean))
    const orphans = a.relatedRefs.filter((id) => !resolvedIds.has(id))
    if (orphans.length) {
      console.log(`   ⚠ ORPHAN REFS: ${orphans.join(', ')}`)
    }
  } else {
    console.log(`   relatedArticles: — (none set; "Related on Prefall" section will NOT render)`)
  }
  console.log()
})

// Duplicate-asset check
console.log('━━━ DUPLICATE IMAGE ASSETS ━━━')
const heroBy = new Map()
const cardBy = new Map()
articles.forEach((a) => {
  if (a.heroImageRef) {
    if (!heroBy.has(a.heroImageRef)) heroBy.set(a.heroImageRef, [])
    heroBy.get(a.heroImageRef).push(a.title)
  }
  if (a.cardImageRef) {
    if (!cardBy.has(a.cardImageRef)) cardBy.set(a.cardImageRef, [])
    cardBy.get(a.cardImageRef).push(a.title)
  }
})
let dupes = 0
for (const [ref, titles] of heroBy) {
  if (titles.length > 1) {
    console.log(`⚠ Hero image ${ref} used by: ${titles.join(' · ')}`)
    dupes++
  }
}
for (const [ref, titles] of cardBy) {
  if (titles.length > 1) {
    console.log(`⚠ Card image ${ref} used by: ${titles.join(' · ')}`)
    dupes++
  }
}
if (dupes === 0) console.log('No duplicates.')

console.log('\n━━━ SUMMARY ━━━')
console.log(`Total articles:                 ${articles.length}`)
console.log(`With cardImage:                 ${articles.filter((a) => a.cardImageRef).length}`)
console.log(`With heroImage:                 ${articles.filter((a) => a.heroImageRef).length}`)
console.log(`With manual relatedArticles:    ${articles.filter((a) => a.relatedRefs?.length).length}`)
console.log(`With nodes (for auto-related):  ${articles.filter((a) => a.nodes?.length).length}`)
