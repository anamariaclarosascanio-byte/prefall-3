import Link from 'next/link'
import {routes} from '@/lib/routes'
import {urlFor} from '@/sanity/lib/image'

/**
 * Single company card on /companies — ported from prefall-prototype 1.html
 * lines 3093-3130. Class names preserved exactly.
 */
type Node = {
  _id: string
  title: string
  slug: string
  colorKey?: string | null
}

export type CompanyCardData = {
  _id: string
  name: string
  slug: string
  location?: string | null
  businessModelSummary?: string | null
  tagline?: string | null
  logo?: any
  nodes?: Node[] | null
}

export function CompanyCard({company}: {company: CompanyCardData}) {
  const primaryNode = company.nodes?.[0]
  const dataNode = primaryNode?.colorKey ?? primaryNode?.slug ?? ''

  return (
    <Link
      href={`${routes.companies}/${company.slug}`}
      className="company-card"
      data-node={dataNode}
    >
      <div className="company-card__logo-wrap">
        {company.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFor(company.logo).width(800).height(600).url()}
            alt={company.logo.alt ?? company.name}
          />
        ) : null}
      </div>
      <div className="company-card__body">
        <p className="company-card__name">{company.name}</p>
        {company.location || primaryNode ? (
          <p className="company-card__meta">
            {[company.location, primaryNode?.title].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        {company.businessModelSummary || company.tagline ? (
          <p className="company-card__model">
            {company.businessModelSummary || company.tagline}
          </p>
        ) : null}
        {primaryNode ? (
          <span className="node-tag" data-node={dataNode}>
            {primaryNode.title}
          </span>
        ) : null}
      </div>
    </Link>
  )
}
