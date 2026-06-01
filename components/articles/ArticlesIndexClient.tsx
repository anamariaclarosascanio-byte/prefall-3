'use client'

/**
 * Articles index — interactive filter + sort. Ported from prefall-prototype 1
 * lines 2801-2944. Filters come from articleCategory taxonomy (editable in
 * Sanity). No articles at launch — empty state line shows.
 */
import {useMemo, useState} from 'react'
import {urlFor} from '@/sanity/lib/image'
import {useArticleModal} from '@/components/modal/ArticleModalContext'

type Cat = {_id: string; title: string; slug: string; order?: number | null}
type Article = {
  _id: string
  title: string
  slug: string
  dek?: string | null
  publishedAt?: string | null
  readingMinutes?: number | null
  heroImage?: any
  cardImage?: any
  category?: {title: string; slug: string} | null
  modalSynopsis?: string | null
  modalTakeaways?: string[] | null
  modalPrimarySources?: string[] | null
  modalSectors?: string[] | null
}

type Props = {
  categories: Cat[]
  articles: Article[]
  emptyMessage?: string | null
}

const ALL = 'all'

export function ArticlesIndexClient({categories, articles, emptyMessage}: Props) {
  const [filter, setFilter] = useState<string>(ALL)
  const [sortDesc, setSortDesc] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sortMobileOpen, setSortMobileOpen] = useState(false)
  const {open} = useArticleModal()

  const filtered = useMemo(() => {
    let out = filter === ALL ? articles : articles.filter((a) => a.category?.slug === filter)
    out = [...out].sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return sortDesc ? tb - ta : ta - tb
    })
    return out
  }, [filter, sortDesc, articles])

  const activeLabel =
    categories.find((c) => c.slug === filter)?.title ?? 'All categories'

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
          <button
            type="button"
            className={`co-filter-option${filter === ALL ? ' is-active' : ''}`}
            onClick={() => {
              setFilter(ALL)
              setMobileOpen(false)
            }}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              className={`co-filter-option${filter === c.slug ? ' is-active' : ''}`}
              onClick={() => {
                setFilter(c.slug)
                setMobileOpen(false)
              }}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile sort */}
      <button
        type="button"
        className={`co-filter-trigger art-sort-btn${sortMobileOpen ? ' is-open' : ''}`}
        onClick={() => {
          setSortDesc((d) => !d)
          setSortMobileOpen((o) => !o)
        }}
      >
        <span>Sort by: {sortDesc ? 'Newest' : 'Oldest'}</span>
        <span className="art-sort-arrows" aria-hidden="true">↑↓</span>
      </button>

      <section className="section" aria-label="All articles">
        <div className="issues-controls">
          <div className="filter-bar">
            <span className="eyebrow" style={{marginRight: '6px'}}>
              Filter by
            </span>
            <button
              type="button"
              className={`filter-btn${filter === ALL ? ' is-active' : ''}`}
              onClick={() => setFilter(ALL)}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                className={`filter-btn${filter === c.slug ? ' is-active' : ''}`}
                onClick={() => setFilter(c.slug)}
              >
                {c.title}
              </button>
            ))}
          </div>
          <div className="sort-bar">
            <span className="sort-bar__label">Sort</span>
            <button
              type="button"
              className={`sort-btn${sortDesc ? ' is-active' : ''}`}
              onClick={() => setSortDesc(true)}
            >
              Newest
            </button>
            <button
              type="button"
              className={`sort-btn${!sortDesc ? ' is-active' : ''}`}
              onClick={() => setSortDesc(false)}
            >
              Oldest
            </button>
          </div>
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
            {emptyMessage ?? 'New analysis is being prepared. Check back soon.'}
          </p>
        ) : (
          // Editorial grid — Ana Maria's pattern:
          // First row of 4 (block-b3), then repeating block-b1 (3 cards
          // 1:2:1) → block-b2 (3 cards 1:1:2) → block-b3 (4 cards) → loop.
          // Cards are chunked into blocks accordingly. The block class
          // drives the per-row column template (defined in globals.css).
          chunkIntoBlocks(filtered).map((blk, blockIdx) => (
            <div
              key={blockIdx}
              className={blk.className}
              style={{marginBottom: 20}}
            >
              {blk.items.map((a) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => open(a)}
                  className="card"
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div className="card__img">
                    {(() => {
                      const img = a.cardImage ?? a.heroImage
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
                          alt={img.alt ?? a.title}
                        />
                      )
                    })()}
                  </div>
                  <div className="card__body">
                    <div className="card__meta-row">
                      {a.category?.title ? (
                        <span className="card__tag">{a.category.title}</span>
                      ) : null}
                      {a.readingMinutes ? (
                        <span className="card__read-time">
                          {a.readingMinutes} min read
                        </span>
                      ) : null}
                    </div>
                    <h3 className="card__title">{a.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </section>
    </>
  )
}

// Chunk a flat article list into the editorial grid blocks. Pattern:
//   block-b3 (4 cards)  ← first, per Ana Maria's spec
//   block-b1 (3 cards, columns 1:2:1)
//   block-b2 (3 cards, columns 1:1:2)
//   block-b3 (4 cards)
//   …then loops b1 → b2 → b3 → b1 → b2 → b3 …
// Any leftover cards at the end fill a final block of the next pattern slot.
function chunkIntoBlocks<T>(items: T[]): {className: string; items: T[]}[] {
  const pattern = [
    {className: 'block-b3', size: 4},
    {className: 'block-b1', size: 3},
    {className: 'block-b2', size: 3},
    {className: 'block-b3', size: 4},
  ]
  const out: {className: string; items: T[]}[] = []
  let i = 0
  let p = 0
  while (i < items.length) {
    const spec = pattern[p % pattern.length]
    const slice = items.slice(i, i + spec.size)
    out.push({className: spec.className, items: slice})
    i += spec.size
    p++
  }
  return out
}
