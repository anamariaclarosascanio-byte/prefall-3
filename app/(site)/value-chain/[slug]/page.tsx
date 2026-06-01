/**
 * Single value chain node page (/value-chain/[slug]).
 * Ported from prefall-prototype 1.html lines 4814-4844.
 *
 * Shows the node's editorial sections (description, economics, tensions),
 * plus the companies and regulations that map to this node, plus related
 * articles. Per launch spec: when a node has no companies, render the
 * "Prefall has not yet profiled..." line from siteSettings.
 */
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {nodeBySlugQuery, allNodeSlugsQuery} from '@/sanity/lib/queries'
import {PortableBlock} from '@/components/portable/PortableBlock'
import {DetailSidebarSection} from '@/components/detail/DetailSidebarSection'
import {CompanyCard} from '@/components/companies/CompanyCard'
import {StatusBadge} from '@/components/regulation/StatusBadge'
import {urlFor} from '@/sanity/lib/image'
import {routes} from '@/lib/routes'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allNodeSlugsQuery)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const data = await sanityFetch<any>({
    query: nodeBySlugQuery,
    params: {slug},
    tags: [`node:${slug}`],
  })
  if (!data?.node) return {title: 'Value chain — Prefall'}
  return {
    title: `${data.node.title} — Value chain — Prefall`,
    description: data.node.shortBlurb ?? data.node.heroSummary ?? undefined,
  }
}

const SECTIONS = [
  ['vn-what', 'What happens here'],
  ['vn-economics', 'The economics'],
  ['vn-tensions', 'Tensions'],
  ['vn-companies', 'Companies'],
  ['vn-regulation', 'Regulation'],
  ['vn-articles', 'Articles'],
] as const

export default async function NodePage({params}: Props) {
  const {slug} = await params
  const data = await sanityFetch<any>({
    query: nodeBySlugQuery,
    params: {slug},
    tags: [`node:${slug}`],
  })

  if (!data?.node) notFound()

  const {node, siblings, companies, regulations, articles, settings} = data
  const emptyNodeMessage = settings?.emptyNodeCompaniesMessage

  return (
    <div id="view-vc-node">
      <div className="detail-header">
        <div className="detail-header__label">
          <Link href={routes.valueChain} className="detail-header__back">
            ← Value Chain
          </Link>
          <span className="eyebrow">
            Node {String(node.order).padStart(2, '0')}
          </span>
        </div>
        <h1 className="detail-header__heading">
          {node.heroHeading ?? node.title}
        </h1>
        {node.heroSummary ?? node.shortBlurb ? (
          <p className="detail-header__summary">
            {node.heroSummary ?? node.shortBlurb}
          </p>
        ) : null}
      </div>

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

            <DetailSidebarSection title="Other nodes">
              {siblings
                .filter((s: any) => s._id !== node._id)
                .map((s: any) => (
                  <Link
                    key={s._id}
                    href={`${routes.valueChain}/${s.slug}`}
                    className="detail-sidebar__link"
                  >
                    {String(s.order).padStart(2, '0')} — {s.title} →
                  </Link>
                ))}
            </DetailSidebarSection>
          </nav>

          <div>
            <div className="detail-body__section" id="vn-what">
              <p className="detail-body__section-head">What happens here</p>
              {node.description ? (
                <PortableBlock value={node.description} />
              ) : node.shortBlurb ? (
                <p className="detail-body__prose">{node.shortBlurb}</p>
              ) : null}
            </div>

            {node.economics ? (
              <div className="detail-body__section" id="vn-economics">
                <p className="detail-body__section-head">The economics</p>
                <PortableBlock value={node.economics} />
              </div>
            ) : null}

            {node.tensions ? (
              <div className="detail-body__section" id="vn-tensions">
                <p className="detail-body__section-head">Tensions</p>
                <PortableBlock value={node.tensions} />
              </div>
            ) : null}

            <div className="detail-body__section" id="vn-companies">
              <p className="detail-body__section-head">
                Companies operating at this node
              </p>
              {companies.length > 0 ? (
                <div className="companies-grid">
                  {companies.map((c: any) => (
                    <CompanyCard key={c._id} company={c} />
                  ))}
                </div>
              ) : (
                <p className="detail-body__prose">
                  {emptyNodeMessage ??
                    'Prefall has not yet profiled companies operating at this node.'}
                </p>
              )}
            </div>

            <div className="detail-body__section" id="vn-regulation">
              <p className="detail-body__section-head">
                Regulations applying here
              </p>
              {regulations.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  {regulations.map((r: any) => (
                    <Link
                      key={r._id}
                      href={`${routes.regulation}/${r.slug}`}
                      className="reg-item"
                    >
                      <div>
                        <p className="reg-item__name">{r.name}</p>
                        {r.fullName ? (
                          <p className="reg-item__full">{r.fullName}</p>
                        ) : null}
                        {r.shortSummary ? (
                          <p className="reg-item__summary">{r.shortSummary}</p>
                        ) : null}
                      </div>
                      <StatusBadge status={r.status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="detail-body__prose">
                  No regulations are currently mapped to this node.
                </p>
              )}
            </div>

            <div className="detail-body__section" id="vn-articles">
              <p className="detail-body__section-head">Articles</p>
              {articles.length > 0 ? (
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
                            src={urlFor(a.heroImage)
                              .width(600)
                              .height(800)
                              .url()}
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
              ) : (
                <p className="detail-body__prose">
                  No articles yet cover this node.
                </p>
              )}
            </div>

            {node.nodeExplanation ? (
              <div className="detail-body__section">
                <p className="detail-body__section-head">Why this node matters</p>
                <PortableBlock value={node.nodeExplanation} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
