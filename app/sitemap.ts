/**
 * Dynamic sitemap — auto-built from Sanity content at build time.
 *
 * Lists every URL Google should know about: static pages + every article,
 * regulation, company and value-chain node. Updated on every deploy.
 *
 * Next.js serves this at /sitemap.xml automatically.
 */
import type {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {groq} from 'next-sanity'

const SITE = 'https://pre-fall.com'

type DocRef = {slug: string; updated?: string | null}

const sitemapQuery = groq`{
  "articles": *[_type == "article" && defined(slug.current)]{"slug": slug.current, "updated": _updatedAt},
  "regulations": *[_type == "regulation" && defined(slug.current)]{"slug": slug.current, "updated": _updatedAt},
  "companies": *[_type == "company" && defined(slug.current)]{"slug": slug.current, "updated": _updatedAt},
  "nodes": *[_type == "node" && defined(slug.current)]{"slug": slug.current, "updated": _updatedAt}
}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<{
    articles: DocRef[]
    regulations: DocRef[]
    companies: DocRef[]
    nodes: DocRef[]
  }>({query: sitemapQuery, tags: ['sitemap']})

  const now = new Date()

  // Static pages — relative priorities reflect editorial importance.
  const staticPages: MetadataRoute.Sitemap = [
    {url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0},
    {url: `${SITE}/articles`, lastModified: now, changeFrequency: 'daily', priority: 0.9},
    {url: `${SITE}/regulation`, lastModified: now, changeFrequency: 'weekly', priority: 0.9},
    {url: `${SITE}/companies`, lastModified: now, changeFrequency: 'weekly', priority: 0.8},
    {url: `${SITE}/value-chain`, lastModified: now, changeFrequency: 'monthly', priority: 0.8},
    {url: `${SITE}/jobs`, lastModified: now, changeFrequency: 'weekly', priority: 0.6},
    {url: `${SITE}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.6},
    {url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5},
    {url: `${SITE}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5},
    {url: `${SITE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2},
  ]

  const articleUrls: MetadataRoute.Sitemap = (data.articles ?? []).map((a) => ({
    url: `${SITE}/articles/${a.slug}`,
    lastModified: a.updated ? new Date(a.updated) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const regulationUrls: MetadataRoute.Sitemap = (data.regulations ?? []).map((r) => ({
    url: `${SITE}/regulation/${r.slug}`,
    lastModified: r.updated ? new Date(r.updated) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const companyUrls: MetadataRoute.Sitemap = (data.companies ?? []).map((c) => ({
    url: `${SITE}/companies/${c.slug}`,
    lastModified: c.updated ? new Date(c.updated) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const nodeUrls: MetadataRoute.Sitemap = (data.nodes ?? []).map((n) => ({
    url: `${SITE}/value-chain/${n.slug}`,
    lastModified: n.updated ? new Date(n.updated) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...articleUrls,
    ...regulationUrls,
    ...companyUrls,
    ...nodeUrls,
  ]
}
