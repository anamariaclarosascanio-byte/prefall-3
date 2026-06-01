/**
 * 404 page — ported from prefall-prototype 1.html lines 5167-5177.
 * Lives at app root (not inside (site)) so the site chrome doesn't render —
 * matches the prototype's view-404-active body class behaviour which hid the
 * header and mobile nav.
 */
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found__inner">
        <span className="not-found__num">404</span>
        <div className="not-found__text">
          <p className="not-found__label">Page not found</p>
          <h1 className="not-found__heading">
            This page didn&apos;t make
            <br />
            it to the next season.
          </h1>
          <p className="not-found__body">
            The link may have changed or the page no longer exists. Try starting
            from the beginning.
          </p>
          <Link href="/" className="not-found__cta">
            Back to Prefall →
          </Link>
        </div>
      </div>
    </div>
  )
}
