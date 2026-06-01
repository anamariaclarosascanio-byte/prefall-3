'use client'

import Link from 'next/link'
import {routes} from '@/lib/routes'
import {urlFor} from '@/sanity/lib/image'
import {useArticleModal} from '@/components/modal/ArticleModalContext'

/**
 * "Reading now" section — ported from prefall-prototype 1.html lines 2677-2695.
 *
 * Per launch spec: structure is shown, articles render only after Sanity
 * has any. At launch the cards render as empty .card placeholders so the grid
 * layout is intact.
 *
 * Row 1: editorial intro (cols 1-2) + 3 cards (cols 3-5)
 * Row 2: featured big card (3fr) + featured-text (2fr)
 */
type Article = {
  _id: string
  title: string
  slug: string
  category?: {title: string; slug: string} | null
  readingMinutes?: number | null
  heroImage?: any
  cardImage?: any
  publishedAt?: string | null
  dek?: string | null
  modalSynopsis?: string | null
  modalTakeaways?: string[] | null
  modalPrimarySources?: string[] | null
  modalSectors?: string[] | null
}

type Props = {
  sectionLabel?: string | null
  introBody?: string | null
  articles: Article[]
}

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg,#E8E8E8,#D8D8D8)',
  'linear-gradient(135deg,#EDEDED,#E0E0E0)',
  'linear-gradient(135deg,#E8E8E8,#D4D4D4)',
  'linear-gradient(135deg,#EFEFEF,#E2E2E2)',
]

function ArticleCard({
  article,
  variant,
  gradient,
}: {
  article?: Article
  variant?: 'big' | 'feat'
  gradient: string
}) {
  const cls = ['card']
  if (variant === 'big') cls.push('card--big')
  if (variant === 'feat') cls.push('card--feat')
  const {open} = useArticleModal()

  if (!article) {
    return (
      <article className={cls.join(' ')} aria-hidden="true">
        <div className="card__img">
          <div className="img-ph" style={{background: gradient}} />
        </div>
        <div className="card__body" />
      </article>
    )
  }

  // Per prototype: row-2 featured card (.card--feat) shows ONLY the image.
  // Per launch decision: home + articles index open a modal preview; full
  // page navigation is via the modal's "Read article" CTA.
  const isFeat = variant === 'feat'

  return (
    <button
      type="button"
      onClick={() => open(article)}
      className={cls.join(' ')}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="card__img">
        {(() => {
          // Prefer the dedicated card image; fall back to hero image when
          // Ana Maria hasn't uploaded a card-specific crop yet.
          const img = article.cardImage ?? article.heroImage
          if (!img) {
            return <div className="img-ph" style={{background: gradient}} />
          }
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(img).width(800).height(1000).url()}
              alt={img.alt ?? article.title}
            />
          )
        })()}
      </div>
      {isFeat ? null : (
        <div className="card__body">
          <div className="card__meta-row">
            {article.category?.title ? (
              <span className="card__tag">{article.category.title}</span>
            ) : null}
            {article.readingMinutes ? (
              <span className="card__read-time">
                {article.readingMinutes} min read
              </span>
            ) : null}
          </div>
          <h3 className="card__title">{article.title}</h3>
        </div>
      )}
    </button>
  )
}

function FeaturedText({article}: {article?: Article}) {
  const {open} = useArticleModal()
  if (!article) {
    return (
      <div className="featured-text" aria-hidden="true">
        <p className="featured-text__label">&nbsp;</p>
        <h3 className="featured-text__title">&nbsp;</h3>
        <p className="featured-text__excerpt">&nbsp;</p>
        <span className="featured-text__cta">&nbsp;</span>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => open(article)}
      className="featured-text"
      // Surgical reset only — preserve .featured-text's flex-column layout
      // so the CTA's animated underline stretches the full panel width like
      // the "View all →" intro CTA above. `all: unset` was nuking the flex.
      style={{
        background: 'none',
        border: 0,
        padding: 0,
        margin: 0,
        font: 'inherit',
        color: 'inherit',
        textAlign: 'left',
        appearance: 'none',
        cursor: 'pointer',
      }}
    >
      {article.category?.title ? (
        <p className="featured-text__label">{article.category.title}</p>
      ) : null}
      <h3 className="featured-text__title">{article.title}</h3>
      {article.dek ? <p className="featured-text__excerpt">{article.dek}</p> : null}
      {/* Prototype uses both classes: featured-text__cta + link-u so the
          animated underline on hover matches the other "View all →" CTAs. */}
      <span className="featured-text__cta link-u">Read article →</span>
    </button>
  )
}

export function ReadingNow({sectionLabel, introBody, articles}: Props) {
  // Row 1: 3 article slots after the editorial intro.
  // Row 2: a big image card (.card--feat) + a featured text panel.
  // Per Ana Maria's spec: the featured slots must NOT repeat any article
  // already shown in row 1. If we don't yet have a 4th / 5th published
  // article, the row-2 slots render as empty placeholders instead.
  // Featured slot (row 2) shows the same article in BOTH the image card
  // and the text panel — they must always refer to the same piece (per
  // prototype line 5591: `const feat = latest[3]`).
  const row1 = articles.slice(0, 3)
  const featured = articles[3]
  const row2Big = featured
  const row2Text = featured

  return (
    <section className="section" aria-label="Reading now" style={{borderBottom: 'none'}}>
      {sectionLabel ? (
        <span className="section__label">{sectionLabel}</span>
      ) : null}

      <div className="home-grid__row1">
        <div className="home-grid__intro">
          {introBody ? <p className="home-grid__intro-body">{introBody}</p> : null}
          <Link href={routes.articles} className="home-grid__intro-cta link-u">
            View all →
          </Link>
        </div>

        {/* Per prototype renderReadingNow(): row 1 = 3 EQUAL .card (no .card--big).
            Wrapper uses display:contents so children flow directly into the
            5-col grid (intro takes cols 1-2, cards take cols 3-5). */}
        <div style={{display: 'contents'}}>
          {[0, 1, 2].map((i) => (
            <ArticleCard
              key={row1[i]?._id ?? `ph-${i}`}
              article={row1[i]}
              gradient={PLACEHOLDER_GRADIENTS[i]}
            />
          ))}
        </div>
      </div>

      <div className="home-grid__row2">
        <ArticleCard
          article={row2Big}
          variant="feat"
          gradient={PLACEHOLDER_GRADIENTS[3]}
        />
        <FeaturedText article={row2Text} />
      </div>
    </section>
  )
}
