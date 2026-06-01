import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {
  companyBySlugQuery,
  articlesForCompanyQuery,
  allCompanySlugsQuery,
} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import {PortableBlock} from '@/components/portable/PortableBlock'
import {DetailSidebarSection} from '@/components/detail/DetailSidebarSection'
import {routes} from '@/lib/routes'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allCompanySlugsQuery)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const c = await sanityFetch<{name: string; tagline?: string; businessModelSummary?: string; logo?: any} | null>({
    query: companyBySlugQuery,
    params: {slug},
    tags: [`company:${slug}`],
  })
  if (!c) return {title: 'Company — Prefall'}
  const description = c.tagline ?? c.businessModelSummary ?? `Prefall's profile of ${c.name}.`
  const url = `https://pre-fall.com/companies/${slug}`
  const ogImage = c.logo ? urlFor(c.logo).width(1200).height(630).url() : null
  return {
    title: c.name,
    description,
    alternates: {canonical: url},
    openGraph: {
      type: 'profile',
      url,
      title: c.name,
      description,
      ...(ogImage ? {images: [{url: ogImage, width: 1200, height: 630, alt: c.name}]} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: c.name,
      description,
      ...(ogImage ? {images: [ogImage]} : {}),
    },
  }
}

const SECTIONS = [
  ['co-section-business-model', 'Business model'],
  ['co-section-company-says', 'What the company says'],
  ['co-section-analysis', "Prefall's analysis"],
  ['co-section-regulatory', 'Regulatory exposure'],
  ['co-section-signals', 'Verifiable signals'],
  ['co-section-articles', 'Prefall articles'],
  ['co-section-sources', 'Sources'],
] as const

function materialityBadgeClass(m?: string | null) {
  // Per prototype: badge--transpos covers Medium colour scheme.
  return 'badge badge--transpos'
}

export default async function CompanyPage({params}: Props) {
  const {slug} = await params
  const company = await sanityFetch<any>({
    query: companyBySlugQuery,
    params: {slug},
    tags: [`company:${slug}`],
  })

  if (!company) notFound()

  const articles = await sanityFetch<any[]>({
    query: articlesForCompanyQuery,
    params: {companyId: company._id},
    tags: [`company:${slug}:articles`],
  })

  const primaryNode = company.nodes?.[0]
  const dataNode = primaryNode?.colorKey ?? primaryNode?.slug ?? ''

  return (
    <div className="company-profile">
      {/* Hero */}
      <div className="company-profile__hero">
        <div>
          <div className="company-profile__identity-row">
            <Link href={routes.companies} className="detail-header__back">
              ← Companies
            </Link>
          </div>
          <h1 className="company-profile__name">{company.name}</h1>
          {company.tagline ? (
            <p className="company-profile__tagline">{company.tagline}</p>
          ) : null}
          {(company.nodes?.length || company.tags?.length) ? (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '24px',
                flexWrap: 'wrap',
              }}
            >
              {company.nodes?.map((n: any) => (
                <span
                  key={`n-${n._id}`}
                  className="node-tag"
                  data-node={n.colorKey ?? n.slug}
                >
                  {n.title}
                </span>
              ))}
              {company.tags?.map((t: any) => (
                <span key={`t-${t._id}`} className="node-tag">
                  {t.title}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="company-profile__meta-box">
          {company.headquarters ? (
            <div className="company-profile__meta-item">
              <p className="company-profile__meta-label">Headquarters</p>
              <p className="company-profile__meta-value">{company.headquarters}</p>
            </div>
          ) : null}
          {company.founded ? (
            <div className="company-profile__meta-item">
              <p className="company-profile__meta-label">Founded</p>
              <p className="company-profile__meta-value">{company.founded}</p>
            </div>
          ) : null}
          {company.ownership ? (
            <div className="company-profile__meta-item">
              <p className="company-profile__meta-label">Ownership</p>
              <p className="company-profile__meta-value">{company.ownership}</p>
            </div>
          ) : null}
          {company.leadership ? (
            <div className="company-profile__meta-item">
              <p className="company-profile__meta-label">Leadership</p>
              <p className="company-profile__meta-value">{company.leadership}</p>
            </div>
          ) : null}
          {company.approximateSize ? (
            <div className="company-profile__meta-item">
              <p className="company-profile__meta-label">Approx. size</p>
              <p className="company-profile__meta-value">
                {company.approximateSize}
              </p>
            </div>
          ) : null}
          {company.website ? (
            <div className="company-profile__meta-item">
              <p className="company-profile__meta-label">Website</p>
              <p className="company-profile__meta-value">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u"
                >
                  {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Hero gallery image */}
      <div className="company-gallery">
        <div className="company-gallery__main">
          {company.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(company.heroImage).width(2400).url()}
              alt={company.heroImage.alt ?? company.name}
            />
          ) : (
            <div className="img-ph" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="detail-wrap">
        <div className="detail-layout">
          <nav className="detail-sidebar">
            <DetailSidebarSection title="On this page">
              {SECTIONS.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="detail-sidebar__link">
                  {label}
                </a>
              ))}
            </DetailSidebarSection>
            {company.nodes?.length ? (
              <DetailSidebarSection title="Value chain position">
                {company.nodes.map((n: any) => (
                  <Link
                    key={n._id}
                    href={`${routes.valueChain}/${n.slug}`}
                    className="detail-sidebar__link"
                  >
                    {n.title} →
                  </Link>
                ))}
              </DetailSidebarSection>
            ) : null}
          </nav>

          <div>
            {company.businessModel ? (
              <div className="detail-body__section" id="co-section-business-model">
                <p className="detail-body__section-head">Business model</p>
                <PortableBlock value={company.businessModel} />
              </div>
            ) : null}

            {company.companySays ? (
              <div className="detail-body__section" id="co-section-company-says">
                <p className="detail-body__section-head">
                  What the company says about itself
                </p>
                <PortableBlock value={company.companySays} />
              </div>
            ) : null}

            {company.prefallAnalysis ? (
              <div className="detail-body__section" id="co-section-analysis">
                <p className="detail-body__section-head">Prefall&apos;s analysis</p>
                <PortableBlock value={company.prefallAnalysis} />
              </div>
            ) : null}

            {company.regulatoryExposure?.length ? (
              <div className="detail-body__section" id="co-section-regulatory">
                <p className="detail-body__section-head">EU regulatory exposure</p>
                <div
                  style={{display: 'flex', flexDirection: 'column', gap: '16px'}}
                >
                  {company.regulatoryExposure.map((item: any) => (
                    <div key={item._key}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        {item.materiality ? (
                          <span className={materialityBadgeClass(item.materiality)}>
                            {item.materiality
                              .split('-')
                              .map(
                                (w: string) =>
                                  w.charAt(0).toUpperCase() + w.slice(1)
                              )
                              .join('-')}
                          </span>
                        ) : null}
                        {item.displayLabel || item.regulation || item.directionShort ? (
                          <span style={{fontSize: '13px', color: 'var(--gray)'}}>
                            {item.displayLabel ?? item.regulation?.name}
                            {item.directionShort ? `, ${item.directionShort}` : ''}
                          </span>
                        ) : null}
                      </div>
                      {item.note ? (
                        <p
                          className="detail-body__prose"
                          style={{fontSize: '14px'}}
                        >
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {company.verifiableSignals?.length ? (
              <div className="detail-body__section" id="co-section-signals">
                <p className="detail-body__section-head">
                  Publicly verifiable signals
                </p>
                <div
                  style={{display: 'flex', flexDirection: 'column', gap: '12px'}}
                >
                  {company.verifiableSignals.map((sig: any) => (
                    <div
                      key={sig._key}
                      className="article-row"
                      style={{padding: '16px 0', cursor: 'default'}}
                    >
                      <div>
                        <p className="article-row__tag">{sig.label}</p>
                        <p
                          className="article-row__title"
                          style={{fontSize: '14px'}}
                        >
                          {sig.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="detail-body__section" id="co-section-articles">
              <p className="detail-body__section-head">Prefall on this company</p>
              {articles.length ? (
                <div className="related-carousel">
                  <div className="related-grid">
                    {articles.map((a: any) => (
                      <Link
                        key={a._id}
                        href={`${routes.articles}/${a.slug}`}
                        className="card"
                      >
                        <div className="card__img">
                          {a.heroImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={urlFor(a.heroImage).width(600).height(800).url()}
                              alt={a.heroImage.alt ?? a.title}
                            />
                          ) : (
                            <div
                              className="img-ph"
                              style={{
                                background:
                                  'linear-gradient(135deg,#E8E8E8,#D8D8D8)',
                              }}
                            />
                          )}
                        </div>
                        <div className="card__body">
                          <div className="card__meta-row">
                            {a.category?.title ? (
                              <span className="card__tag">
                                {a.category.title}
                              </span>
                            ) : null}
                            {a.readingMinutes ? (
                              <span className="card__read-time">
                                {a.readingMinutes} min read
                              </span>
                            ) : null}
                          </div>
                          <h3 className="card__title">{a.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="detail-body__prose">
                  Prefall has not yet published analysis on this company.
                </p>
              )}
            </div>

            {company.sources ? (
              <div className="detail-body__section" id="co-section-sources">
                <p className="detail-body__section-head">Sources</p>
                <PortableBlock value={company.sources} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
