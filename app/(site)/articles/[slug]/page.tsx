import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {
  articleBySlugQuery,
  allArticleSlugsQuery,
} from '@/sanity/lib/queries'
import {PortableBlock} from '@/components/portable/PortableBlock'
import {urlFor} from '@/sanity/lib/image'
import {routes} from '@/lib/routes'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allArticleSlugsQuery)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const a = await sanityFetch<any>({
    query: articleBySlugQuery,
    params: {slug},
    tags: [`article:${slug}`],
  })
  if (!a) return {title: 'Article — Prefall'}
  const description =
    a.dek ?? a.modalSynopsis ?? a.lead ?? 'An article on Prefall.'
  const ogImage = a.heroImage
    ? urlFor(a.heroImage).width(1200).height(630).url()
    : a.cardImage
      ? urlFor(a.cardImage).width(1200).height(630).url()
      : null
  const url = `https://pre-fall.com/articles/${slug}`
  return {
    title: a.title,
    description,
    alternates: {canonical: url},
    openGraph: {
      type: 'article',
      url,
      title: a.title,
      description,
      ...(ogImage ? {images: [{url: ogImage, width: 1200, height: 630, alt: a.title}]} : {}),
      publishedTime: a.publishedAt ?? undefined,
      authors: a.author ? [a.author] : ['Ana Maria Claros'],
    },
    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description,
      ...(ogImage ? {images: [ogImage]} : {}),
    },
  }
}

function formatDate(d?: string | null) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export default async function ArticlePage({params}: Props) {
  const {slug} = await params
  const article = await sanityFetch<any>({
    query: articleBySlugQuery,
    params: {slug},
    tags: [`article:${slug}`],
  })
  if (!article) notFound()

  // ONLY show manually-picked related articles. If Ana Maria hasn't
  // designated any in Studio, the related section is hidden entirely —
  // no automatic suggestions (her explicit request: do not surface
  // articles she didn't choose).
  const related = (article.relatedArticles ?? []) as any[]

  // JSON-LD structured data — gives Google rich snippet eligibility
  // (author, date, image, headline) for this article.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.dek ?? article.modalSynopsis ?? undefined,
    image: article.heroImage
      ? [urlFor(article.heroImage).width(1200).height(630).url()]
      : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article._updatedAt ?? article.publishedAt ?? undefined,
    author: {
      '@type': 'Person',
      name: article.author ?? 'Ana Maria Claros',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prefall',
      url: 'https://pre-fall.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pre-fall.com/articles/${slug}`,
    },
  }

  return (
    <div className="article-page">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <div className="article-page__header">
        {/* Back link + category tag inline (same flex row).
            Matches the prototype's detail-header__label pattern used on
            regulation pages. Stops them visually competing as two stacked
            eyebrows. */}
        <div className="detail-header__label" style={{marginBottom: '24px'}}>
          <Link href={routes.articles} className="detail-header__back">
            ← Articles
          </Link>
          {article.category?.title ? (
            <>
              <span className="card__dot" />
              <span>{article.category.title}</span>
            </>
          ) : null}
        </div>
        <h1 className="article-page__title">{article.title}</h1>
        {article.dek ? <p className="article-page__dek">{article.dek}</p> : null}
        <div className="article-page__byline">
          {article.author ? <span>{article.author}</span> : null}
          {article.author && article.publishedAt ? (
            <span className="card__dot" />
          ) : null}
          {article.publishedAt ? <span>{formatDate(article.publishedAt)}</span> : null}
          {article.readingMinutes ? (
            <>
              <span className="card__dot" />
              <span>{article.readingMinutes} min read</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="article-page__image">
        {article.heroImage ? (
          // Reverted to natural rendering: Sanity returns the full image at
          // 2400px wide. The CSS sets aspect-ratio: 16/7 with object-fit:
          // cover so landscape images sit naturally without forced cropping.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFor(article.heroImage).width(2400).url()}
            alt={article.heroImage.alt ?? article.title}
          />
        ) : (
          <div
            className="img-ph"
            style={{background: 'linear-gradient(135deg,#E8E8E8,#D8D8D8)'}}
          />
        )}
      </div>

      <div className="article-page__body">
        {article.lead ? (
          <p className="article-page__lead">{article.lead}</p>
        ) : null}
        {article.body ? <PortableBlock value={article.body} /> : null}

        {article.sources ? (
          <details style={{marginTop: '40px'}}>
            <summary className="sources-toggle">
              <span>Sources</span>
              <span className="sources-toggle__icon">↓</span>
            </summary>
            <div className="sources-body is-open">
              <PortableBlock value={article.sources} />
            </div>
          </details>
        ) : null}

        {related.length > 0 ? (
          <section className="related-section">
            <p className="section__label">Related on Prefall</p>
            <div className="related-carousel">
              <div className="related-grid">
                {related.map((r: any) => (
                  <Link
                    key={r._id}
                    href={`${routes.articles}/${r.slug}`}
                    className="card"
                  >
                    <div className="card__img">
                      {(() => {
                        const img = r.cardImage ?? r.heroImage
                        if (!img)
                          return (
                            <div
                              className="img-ph"
                              style={{
                                background:
                                  'linear-gradient(135deg,#E8E8E8,#D8D8D8)',
                              }}
                            />
                          )
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={urlFor(img).width(600).height(800).url()}
                            alt={img.alt ?? r.title}
                          />
                        )
                      })()}
                    </div>
                    <div className="card__body">
                      {r.category?.title ? (
                        <span className="card__tag">{r.category.title}</span>
                      ) : null}
                      <h3 className="card__title">{r.title}</h3>
                      <div className="card__meta">
                        {r.readingMinutes ? (
                          <>
                            <span>{r.readingMinutes} min read</span>
                            <span className="card__dot" />
                          </>
                        ) : null}
                        {r.publishedAt ? (
                          <span>{formatDate(r.publishedAt)}</span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
