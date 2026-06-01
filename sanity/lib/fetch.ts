import {client} from './client'

/**
 * Thin wrapper around the Sanity client for server-side fetches. Centralizes
 * Next.js cache hints so we can adjust globally if needed.
 *
 * tags lets us call revalidateTag(...) from API routes / webhooks once we
 * wire that up.
 */
export async function sanityFetch<T>({
  query,
  params,
  tags,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params ?? {}, {
    next: {
      revalidate: 60, // ISR: 60s
      tags,
    },
  })
}
