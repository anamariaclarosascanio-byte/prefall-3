'use client'

/**
 * Jobs list — multi-axis filter UI.
 *
 * Filter rows shown together (per Ana Maria's spec):
 *   1. Category    (chips: ESG · Sustainability · Regulation · Circularity)
 *   2. Seniority   (chips: Junior · Mid · Senior · Internship — driven by
 *                   whichever jobSeniority docs exist in Sanity)
 *   3. Country     (chips from jobCountry taxonomy)
 *   4. City        (chips built dynamically from `city` values present
 *                   across the current job set)
 *
 * Filters AND together: a job must match the selected option in every
 * dimension that has a non-"all" selection. Each row keeps its own state
 * so multi-axis filtering reads naturally.
 *
 * Mobile: one dropdown per row stacks vertically; chips wrap.
 */
import {useMemo, useState} from 'react'

type Tax = {_id: string; title: string; slug: string; order?: number | null}
type Job = {
  _id: string
  title: string
  description?: string | null
  link?: string | null
  publishedAt?: string | null
  company?: string | null
  location?: string | null
  city?: string | null
  category?: {title: string; slug: string} | null
  seniority?: {title: string; slug: string} | null
  country?: {title: string; slug: string} | null
}

type Props = {
  categories: Tax[]
  seniorities: Tax[]
  countries: Tax[]
  jobs: Job[]
  emptyMessage?: string | null
}

const ALL = 'all'

// Map seniority slug → CSS modifier on .seniority-tag.
const SENIORITY_CLASS: Record<string, string> = {
  junior: 'seniority-tag--junior',
  mid: 'seniority-tag--mid',
  senior: 'seniority-tag--senior',
  internship: 'seniority-tag--internship',
}

export function JobsListClient({
  categories,
  seniorities,
  countries,
  jobs,
  emptyMessage,
}: Props) {
  const [fCategory, setFCategory] = useState<string>(ALL)
  const [fSeniority, setFSeniority] = useState<string>(ALL)
  const [fCountry, setFCountry] = useState<string>(ALL)

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (fCategory !== ALL && j.category?.slug !== fCategory) return false
      if (fSeniority !== ALL && j.seniority?.slug !== fSeniority) return false
      if (fCountry !== ALL && j.country?.slug !== fCountry) return false
      return true
    })
  }, [jobs, fCategory, fSeniority, fCountry])

  const activeCount = [fCategory, fSeniority, fCountry].filter((v) => v !== ALL).length

  function clearAll() {
    setFCategory(ALL)
    setFSeniority(ALL)
    setFCountry(ALL)
  }

  return (
    <section className="section" aria-label="Job listings">
      {/* Filter stack — one row per axis, label on the left, chips on the right. */}
      <div className="jobs-filters">
        <FilterRow
          label="Category"
          options={categories.map((c) => ({slug: c.slug, title: c.title, key: c._id}))}
          value={fCategory}
          onChange={setFCategory}
        />
        <FilterRow
          label="Seniority"
          options={seniorities.map((s) => ({slug: s.slug, title: s.title, key: s._id}))}
          value={fSeniority}
          onChange={setFSeniority}
        />
        <FilterRow
          label="Country"
          options={countries.map((c) => ({slug: c.slug, title: c.title, key: c._id}))}
          value={fCountry}
          onChange={setFCountry}
        />
        {activeCount > 0 ? (
          <div className="jobs-filters__clear-row">
            <button
              type="button"
              onClick={clearAll}
              className="jobs-filters__clear"
            >
              Clear filters ({activeCount}) ×
            </button>
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p
          style={{
            padding: '80px 0',
            fontSize: '14px',
            color: 'var(--subtle)',
            textAlign: 'center',
          }}
        >
          {jobs.length === 0
            ? emptyMessage ??
              'No open positions at the moment. Check back soon.'
            : 'No jobs match the selected filters.'}
        </p>
      ) : (
        <div className="jobs-grid">
          {filtered.map((j) => {
            const seniorityCls = j.seniority?.slug
              ? `seniority-tag ${SENIORITY_CLASS[j.seniority.slug] ?? ''}`
              : ''
            const inner = (
              <>
                <div>
                  <div className="job-item__title-row">
                    <p className="job-item__role">{j.title}</p>
                  </div>
                  <div className="job-item__meta">
                    {j.seniority?.title ? (
                      <span className={seniorityCls}>{j.seniority.title}</span>
                    ) : null}
                    {j.company ? <span>{j.company}</span> : null}
                    {j.company && j.location ? (
                      <span className="card__dot" />
                    ) : null}
                    {j.location ? <span>{j.location}</span> : null}
                  </div>
                  {j.description ? (
                    <p className="job-item__description">{j.description}</p>
                  ) : null}
                </div>
                <div className="job-item__right">
                  {j.publishedAt
                    ? `Posted ${new Date(j.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}`
                    : null}
                </div>
              </>
            )
            return j.link ? (
              <a
                key={j._id}
                href={j.link}
                target="_blank"
                rel="noopener noreferrer"
                className="job-item"
              >
                {inner}
              </a>
            ) : (
              <div key={j._id} className="job-item" style={{cursor: 'default'}}>
                {inner}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: {slug: string; title: string; key: string}[]
  value: string
  onChange: (v: string) => void
}) {
  if (options.length === 0) return null
  return (
    <div className="jobs-filter-row">
      <span className="jobs-filter-row__label">{label}</span>
      <div className="jobs-filter-row__chips">
        <button
          type="button"
          className={`filter-btn${value === ALL ? ' is-active' : ''}`}
          onClick={() => onChange(ALL)}
        >
          All
        </button>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`filter-btn${value === o.slug ? ' is-active' : ''}`}
            onClick={() => onChange(o.slug)}
          >
            {o.title}
          </button>
        ))}
      </div>
    </div>
  )
}
