import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const jobs = await client.fetch(`*[_type == "job"]{title, description}`)
jobs.forEach(j => console.log(`${j.title}: description=${j.description ? '"' + j.description.slice(0,80) + '..."' : 'null'}`))
