import Link from 'next/link'
import {routes} from '@/lib/routes'
import {urlFor} from '@/sanity/lib/image'

/**
 * Featured company module — ported from prefall-prototype 1.html lines 2697-2711.
 * Auto-populated from the most-recent company in Sanity.
 */
type Props = {
  label?: string | null
  company:
    | {
        name: string
        slug: string
        tagline?: string | null
        businessModelSummary?: string | null
        logo?: any
        nodes?: {title: string; slug: string}[] | null
      }
    | null
}

export function FeaturedCompany({label, company}: Props) {
  if (!company) {
    return null
  }
  const primaryNode = company.nodes?.[0]
  return (
    <section
      className="section"
      aria-label="Featured company"
      style={{
        borderBottom: 'none',
        paddingTop: '48px',
        paddingBottom: '48px',
      }}
    >
      {label ? <p className="company-module__label">{label}</p> : null}
      <div className="company-module">
        <div className="company-module__text">
          <h2 className="company-module__name">{company.name}</h2>
          {primaryNode ? (
            <p className="company-module__node">{primaryNode.title}</p>
          ) : null}
          {company.businessModelSummary || company.tagline ? (
            <p className="company-module__body">
              {company.businessModelSummary || company.tagline}
            </p>
          ) : null}
          <Link
            href={`${routes.companies}/${company.slug}`}
            className="btn btn--ghost"
          >
            View in directory →
          </Link>
        </div>
        <div className="company-module__img">
          {company.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(company.logo).width(1000).height(1250).url()}
              alt={company.logo.alt ?? company.name}
            />
          ) : (
            <div className="img-ph" />
          )}
        </div>
      </div>
    </section>
  )
}
