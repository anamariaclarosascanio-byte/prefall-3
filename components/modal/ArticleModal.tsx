'use client'

/**
 * Article modal — ported from prefall-prototype 1.html lines 5318-5366.
 * Class names preserved exactly: modal-overlay, modal, modal__left,
 * modal__main-img, modal__thumbs, modal__thumb, modal__right,
 * modal__right-top, modal__close-btn, modal__date, modal__title,
 * modal__right-body, modal__section, modal__section-head, modal__section-body,
 * modal__list, modal__list--plus, modal__sectors, sector-tag, modal__cta.
 *
 * Renders globally; opens when context has an article. Clicking the overlay
 * (but not the modal itself) closes it.
 */
import Link from 'next/link'
import {useArticleModal} from './ArticleModalContext'
import {urlFor} from '@/sanity/lib/image'
import {routes} from '@/lib/routes'

function formatDate(d?: string | null) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export function ArticleModal() {
  const {article, close} = useArticleModal()
  const isOpen = !!article

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) close()
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      {article ? (
        <div className="modal" role="document">
          {/* Left: image (no thumbnails for now — one image per article) */}
          <div className="modal__left">
            <div className="modal__main-img">
              {(() => {
                // Modal preview shows the card image (matches the
                // thumbnail the user just clicked). Falls back to hero
                // when no dedicated card image has been uploaded.
                const img =
                  (article as any).cardImage ?? article.heroImage
                if (!img) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(img).width(1000).url()}
                    alt={img.alt ?? article.title}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                )
              })()}
            </div>
          </div>

          {/* Right: content */}
          <div className="modal__right">
            <div className="modal__right-top">
              <button
                type="button"
                className="modal__close-btn"
                onClick={close}
                aria-label="Close"
              >
                ×
              </button>
              {article.publishedAt ? (
                <p className="modal__date">{formatDate(article.publishedAt)}</p>
              ) : null}
              <h2 className="modal__title" id="modal-title">
                {article.title}
              </h2>
            </div>

            <div className="modal__right-body">
              {article.modalSynopsis || article.dek ? (
                <div className="modal__section">
                  <p className="modal__section-head">Synopsis</p>
                  <p className="modal__section-body">
                    {article.modalSynopsis || article.dek}
                  </p>
                </div>
              ) : null}

              {article.modalTakeaways && article.modalTakeaways.length > 0 ? (
                <div className="modal__section">
                  <p className="modal__section-head">Key Takeaways</p>
                  <ul className="modal__list modal__list--plus">
                    {article.modalTakeaways.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {article.modalPrimarySources &&
              article.modalPrimarySources.length > 0 ? (
                <div className="modal__section">
                  <p className="modal__section-head">Primary Sources</p>
                  <ul className="modal__list">
                    {article.modalPrimarySources.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {article.modalSectors && article.modalSectors.length > 0 ? (
                <div className="modal__section">
                  <p className="modal__section-head">Sectors Implicated</p>
                  <div className="modal__sectors">
                    {article.modalSectors.map((s, i) => (
                      <span key={i} className="sector-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="modal__right-foot">
              <Link
                href={`${routes.articles}/${article.slug}`}
                className="modal__cta"
                onClick={close}
              >
                Read article →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
