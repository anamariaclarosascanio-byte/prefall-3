import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

/**
 * Server-side Sanity client. Uses SANITY_API_TOKEN so it can read every doc
 * type (this Sanity project locks unauthenticated reads to singletons only).
 *
 * SANITY_API_TOKEN has no NEXT_PUBLIC_ prefix → never exposed to the browser.
 * All Sanity queries flow through Next.js Server Components, never client.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // tokens disable the CDN anyway; explicit for clarity
  perspective: 'published',
})
