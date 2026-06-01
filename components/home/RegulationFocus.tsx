import Link from 'next/link'
import {routes} from '@/lib/routes'

/**
 * "Regulation that matters now" — ported from prefall-prototype 1.html lines
 * 2713-2764. Featured regulation on the left, two columns of pill lists on
 * the right.
 *
 * statusSlug → dot CSS modifier mapping:
 *   in-force      → status-badge__dot--active
 *   transpos      → status-badge__dot--transit
 *   preparation   → status-badge__dot--prep
 *   withdrawn / amended → (no class — neutral grey via base style)
 */
type Reg = {
  _id: string
  name: string
  fullName?: string | null
  slug: string
  statusSlug?: string | null
  shortSummary?: string | null
  status?: {
    title: string
    slug: string
    dotColor?: string | null
    badgeBg?: string | null
    badgeText?: string | null
  } | null
}

type Props = {
  sectionLabel?: string | null
  featured: Reg | null
  inForce: Reg[]
  inPreparation: Reg[]
}

function dotClassForSlug(slug?: string | null) {
  if (!slug) return ''
  if (slug === 'in-force' || slug === 'enforced') return 'status-badge__dot--active'
  if (slug === 'transpos') return 'status-badge__dot--transit'
  if (slug === 'preparation') return 'status-badge__dot--prep'
  return ''
}

function badgeClassForSlug(slug?: string | null) {
  if (!slug) return 'status-badge'
  if (slug === 'transpos') return 'status-badge status-badge--transit'
  return 'status-badge'
}

export function RegulationFocus({sectionLabel, featured, inForce, inPreparation}: Props) {
  if (!featured) return null
  return (
    <section
      className="section"
      aria-label="Regulation in focus"
      style={{paddingTop: '40px', borderBottom: 'none'}}
    >
      {sectionLabel ? <span className="section__label">{sectionLabel}</span> : null}

      <div className="regulation-module">
        <div>
          {featured.status ? (
            <div className={badgeClassForSlug(featured.status.slug)}>
              <span
                className={`status-badge__dot ${dotClassForSlug(featured.status.slug)}`}
              />
              {featured.status.title}
            </div>
          ) : null}
          <h2 className="regulation-module__name">{featured.name}</h2>
          {featured.fullName ? (
            <p className="regulation-module__full">{featured.fullName}</p>
          ) : null}
          {featured.shortSummary ? (
            <p className="regulation-module__summary">{featured.shortSummary}</p>
          ) : null}
          <Link href={routes.regulation} className="btn btn--ghost">
            View all regulation →
          </Link>
        </div>

        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            <div>
              <span className="eyebrow" style={{display: 'block', marginBottom: '16px'}}>
                Also in force
              </span>
              <div className="regulation-list">
                {inForce.map((r) => (
                  <Link
                    key={r._id}
                    href={`${routes.regulation}/${r.slug}`}
                    className="regulation-list__item"
                  >
                    <span
                      className={`status-badge__dot ${dotClassForSlug(r.statusSlug)}`}
                      style={{flexShrink: 0, marginTop: '6px'}}
                    />
                    {r.name}
                    {r.fullName ? `: ${r.fullName}` : ''}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <span className="eyebrow" style={{display: 'block', marginBottom: '16px'}}>
                In preparation
              </span>
              <div className="regulation-list">
                {inPreparation.map((r) => (
                  <Link
                    key={r._id}
                    href={`${routes.regulation}/${r.slug}`}
                    className="regulation-list__item"
                  >
                    <span
                      className={`status-badge__dot ${dotClassForSlug(r.statusSlug)}`}
                      style={{flexShrink: 0, marginTop: '6px'}}
                    />
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
