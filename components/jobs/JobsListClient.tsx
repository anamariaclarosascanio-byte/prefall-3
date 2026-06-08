'use client'

/**
 * Jobs list — multi-axis filter UI with sort, count and pagination.
 *
 * Filter rows shown together (per Ana Maria's spec):
 *   1. Category    (chips: ESG · Sustainability · Regulation · Circularity)
 *   2. Seniority   (chips: Junior · Mid · Senior · Internship — driven by
 *                   whichever jobSeniority docs exist in Sanity)
 *   3. Country     (chips from jobCountry taxonomy)
 *
 * Filters AND together: a job must match the selected option in every
 * dimension that has a non-"all" selection. Each row keeps its own state
 * so multi-axis filtering reads naturally.
 *
 * Below the filters: a sober results bar (count on the left, Newest /
 * Oldest sort on the right) and, below the grid, a paginator. Default
 * sort is Newest; default page size is PAGE_SIZE. Changing filters or
 * sort resets to page 1.
 *
 * Mobile: filter rows collapse to single column; results bar stacks
 * (count above sort); paginator stays centred with tighter spacing.
 */
import {useEffect, useMemo, useState} from 'react'

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
const PAGE_SIZE = 12

type SortOrder = 'newest' | 'oldest'

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
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (fCategory !== ALL && j.category?.slug !== fCategory) return false
      if (fSeniority !== ALL && j.seniority?.slug !== fSeniority) return false
      if (fCountry !== ALL && j.country?.slug !== fCountry) return false
      return true
    })
  }, [jobs, fCategory, fSeniority, fCountry])

  // Sort by publishedAt. Server already orders by publishedAt desc, so the
  // initial render with sortOrder="newest" matches the SSR markup and there
  // is no hydration mismatch.
  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return sortOrder === 'newest' ? tb - ta : ta - tb
    })
    return copy
  }, [filtered, sortOrder])

  // Reset to page 1 whenever filters or sort change so the user is never
  // stranded on an out-of-range page after narrowing the list.
  useEffect(() => {
    setPage(1)
  }, [fCategory, fSeniority, fCountry, sortOrder])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const sliceStart = (safePage - 1) * PAGE_SIZE
  const sliceEnd = Math.min(sliceStart + PAGE_SIZE, sorted.length)
  const pageJobs = sorted.slice(sliceStart, sliceEnd)

  const activeCount = [fCategory, fSeniority, fCountry].filter(
    (v) => v !== ALL,
  ).length

  function clearAll() {
    setFCategory(ALL)
    setFSeniority(ALL)
    setFCountry(ALL)
  }

  // Counter copy:
  //   "Showing N roles"            (when result set fits on a single page)
  //   "Showing X–Y of Z roles"     (when paginated)
  const noun = sorted.length === 1 ? 'role' : 'roles'
  const counter =
    sorted.length === 0
      ? null
      : sorted.length <= PAGE_SIZE
        ? `Showing ${sorted.length} ${noun}`
        : `Showing ${sliceStart + 1}–${sliceEnd} of ${sorted.length} ${noun}`

  const pageNumbers = buildPageNumbers(safePage, totalPages)

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

      {/* Results bar: count on the left, sort on the right. Hidden when the
          result set is empty so the empty-state message stands alone. */}
      {sorted.length > 0 ? (
        <div className="jobs-results-bar">
          <div className="jobs-results-bar__count" aria-live="polite">
            {counter}
          </div>
          <div className="sort-bar" role="group" aria-label="Sort jobs">
            <span className="sort-bar__label">Sort</span>
            <button
              type="button"
              className={`sort-btn${sortOrder === 'newest' ? ' is-active' : ''}`}
              onClick={() => setSortOrder('newest')}
              aria-pressed={sortOrder === 'newest'}
            >
              Newest
            </button>
            <button
              type="button"
              className={`sort-btn${sortOrder === 'oldest' ? ' is-active' : ''}`}
              onClick={() => setSortOrder('oldest')}
              aria-pressed={sortOrder === 'oldest'}
            >
              Oldest
            </button>
          </div>
        </div>
      ) : null}

      {sorted.length === 0 ? (
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
          {pageJobs.map((j) => {
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

      {/* Paginator — only renders when there's more than one page. */}
      {totalPages > 1 ? (
        <nav className="jobs-pagination" aria-label="Pagination">
          <button
            type="button"
            className="jobs-pagination__btn"
            onClick={() => setPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <div className="jobs-pagination__pages">
            {pageNumbers.map((p, i) =>
              p === '…' ? (
                <span
                  key={`gap-${i}`}
                  className="jobs-pagination__sep"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`jobs-pagination__btn jobs-pagination__page${
                    p === safePage ? ' is-active' : ''
                  }`}
                  onClick={() => setPage(p)}
                  aria-current={p === safePage ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            className="jobs-pagination__btn"
            onClick={() => setPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      ) : null}
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

/**
 * Build a compact page-number list with ellipses for long sequences.
 * Always shows first, last, current and current ± 1.
 *   total ≤ 7  → [1, 2, 3, …, total]  (all shown)
 *   otherwise  → [1, '…', c-1, c, c+1, '…', total]  with edges flattened.
 */
function buildPageNumbers(
  current: number,
  total: number,
): (number | '…')[] {
  if (total <= 7) {
    return Array.from({length: total}, (_, i) => i + 1)
  }
  const out: (number | '…')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) out.push('…')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < total - 1) out.push('…')
  out.push(total)
  return out
}
