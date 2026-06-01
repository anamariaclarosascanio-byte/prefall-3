/**
 * Robots policy — tells crawlers what they can index.
 *
 * Allow everything except /studio (Sanity admin UI) and /api/* (server-only).
 * Point bots at the sitemap so they find every article without having to
 * crawl the whole site.
 *
 * Next.js serves this at /robots.txt automatically.
 */
import type {MetadataRoute} from 'next'

const SITE = 'https://pre-fall.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/studio/', '/api/'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
