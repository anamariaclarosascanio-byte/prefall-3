'use client'

/**
 * Companies index — interactive shell with client-side filtering.
 * Ported from prefall-prototype 1.html lines 3056-3138.
 *
 * Two filter UIs ship: desktop filter-bar pills (rendered above the grid) and
 * the mobile co-filter dropdown. CSS @media queries control visibility.
 */
import {useMemo, useState} from 'react'
import {CompanyCard, type CompanyCardData} from './CompanyCard'

type Node = {
  _id: string
  title: string
  slug: string
  colorKey?: string | null
}

type Props = {
  nodes: Node[]
  companies: CompanyCardData[]
  emptyMessage?: string | null
  methodNoteHeading?: string | null
  methodNoteBody?: string | null
}

const ALL = 'all'

export function CompaniesIndexClient({nodes, companies, emptyMessage, methodNoteHeading, methodNoteBody}: Props) {
  const [filter, setFilter] = useState<string>(ALL)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Build the filter options from nodes. The 7 nodes power filtering by
  // primary node slug. "All" is always first.
  const options = useMemo(
    () => [{slug: ALL, title: 'All'}, ...nodes.map((n) => ({slug: n.slug, title: n.title}))],
    [nodes]
  )

  const filtered = useMemo(() => {
    if (filter === ALL) return companies
    return companies.filter((c) => (c.nodes ?? []).some((n) => n.slug === filter))
  }, [filter, companies])

  const activeLabel = options.find((o) => o.slug === filter)?.title ?? 'All categories'

  return (
    <>
      {/* Mobile filter dropdown */}
      <div className="co-filter-wrap">
        <button
          type="button"
          className={`co-filter-trigger${mobileOpen ? ' is-open' : ''}`}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span>{activeLabel}</span>
          <span className="co-filter-icon">+</span>
        </button>
        <div className={`co-filter-panel${mobileOpen ? ' is-open' : ''}`}>
          {options.map((opt) => (
            <button
              key={opt.slug}
              type="button"
              className={`co-filter-option${filter === opt.slug ? ' is-active' : ''}`}
              onClick={() => {
                setFilter(opt.slug)
                setMobileOpen(false)
              }}
            >
              {opt.title}
            </button>
          ))}
        </div>
      </div>

      <section className="section" aria-label="Company directory">
        {/* Desktop filter bar */}
        <div className="issues-controls">
          <div className="filter-bar">
            <span className="eyebrow" style={{marginRight: '6px'}}>
              Filter by
            </span>
            {options.map((opt) => (
              <button
                key={opt.slug}
                type="button"
                className={`filter-btn${filter === opt.slug ? ' is-active' : ''}`}
                onClick={() => setFilter(opt.slug)}
              >
                {opt.title}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="companies-grid">
            {filtered.map((c) => (
              <CompanyCard key={c._id} company={c} />
            ))}
          </div>
        ) : (
          <p
            style={{
              padding: '60px 0',
              fontSize: '14px',
              color: 'var(--subtle)',
            }}
          >
            {emptyMessage ??
              'Prefall has not yet profiled companies operating at this node.'}
          </p>
        )}

        {/* Method note — per prototype, sits inside the same <section> as the
            companies grid so its 40px margin-top creates the correct spacing,
            with no section divisor below it. */}
        {methodNoteHeading || methodNoteBody ? (
          <div className="method-note">
            {methodNoteHeading ? (
              <p className="method-note__heading">{methodNoteHeading}</p>
            ) : null}
            {methodNoteBody ? (
              <p className="method-note__body">{methodNoteBody}</p>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  )
}
