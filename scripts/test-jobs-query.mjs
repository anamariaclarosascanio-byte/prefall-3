import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
// Same query the page uses
const data = await client.fetch(`{
  "categories": *[_type == "jobCategory"] | order(order asc){_id, title, "slug": slug.current},
  "seniorities": *[_type == "jobSeniority"] | order(order asc){_id, title, "slug": slug.current},
  "countries": *[_type == "jobCountry"] | order(order asc){_id, title, "slug": slug.current},
  "jobs": *[_type == "job"] | order(publishedAt desc){
    _id, title,
    "category": category->{title, "slug": slug.current},
    "seniority": seniority->{title, "slug": slug.current},
    "country": country->{title, "slug": slug.current}
  }
}`)
console.log('COUNTRIES (filter chips):')
data.countries.forEach(c => console.log(`  - ${c.title} (slug: ${c.slug})`))
console.log('\nJOBS (resolved):')
data.jobs.forEach(j => console.log(`  - ${j.title}: country=${j.country?.title} slug=${j.country?.slug}`))
