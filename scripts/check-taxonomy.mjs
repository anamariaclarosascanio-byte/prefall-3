import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const data = await client.fetch(`{
  "seniorities": *[_type == "jobSeniority"]{_id, title, "slug": slug.current, order},
  "categories": *[_type == "jobCategory"]{_id, title, "slug": slug.current, order},
  "countries": *[_type == "jobCountry"]{_id, title, "slug": slug.current, order} | order(order asc),
  "oldJobs": *[_type == "job"]{_id, title}
}`)
console.log(JSON.stringify(data, null, 2))
