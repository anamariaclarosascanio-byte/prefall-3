import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const jobs = await client.fetch(`*[_type == "job"] | order(orderRank asc, _createdAt asc){title,company,location,seniority->{title},category->{title},country->{name},city,summary,link}`)
console.log(JSON.stringify(jobs, null, 2))
