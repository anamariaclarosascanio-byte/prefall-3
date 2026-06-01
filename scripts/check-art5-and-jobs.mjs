import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

console.log('=== Article 5 (Sustainability Investment) modal ===')
const art = await client.fetch(`*[_type == "article" && title match "*Sustainability Investment*"][0]{title,modalSynopsis,modalTakeaways,modalSectors}`)
console.log('title:', art?.title)
console.log('modalSynopsis:', art?.modalSynopsis)
console.log('modalTakeaways:', art?.modalTakeaways)
console.log('modalSectors:', art?.modalSectors)

console.log('\n=== jobCountry docs ===')
const countries = await client.fetch(`*[_type == "jobCountry"]{_id,title,"slug":slug.current}`)
console.log(JSON.stringify(countries, null, 2))

console.log('\n=== jobs with country field (raw) ===')
const jobs = await client.fetch(`*[_type == "job"]{_id,title,location,city,country}`)
console.log(JSON.stringify(jobs, null, 2))
