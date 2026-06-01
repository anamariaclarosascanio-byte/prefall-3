'use client'

/**
 * Global error boundary — matches the 404 page's visual language.
 * Reuses the .not-found-* class system from the prototype, with one
 * structural variant: instead of the "404" numeral we show "500" (the
 * standard HTTP server-error code), the lavender headline copy reads
 * "Something went sideways." and the CTA gets a sibling "Try again"
 * button that calls the reset() callback Next.js passes us.
 *
 * Lives at the app root so the (site) layout's header/footer don't
 * render — same chrome-suppression behaviour as not-found.tsx.
 */
import {useEffect} from 'react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    // Log so the issue surfaces in Vercel's runtime logs. Real-time
    // monitoring (Sentry, Logflare) can be wired here later.
    console.error('Page render failed:', error)
  }, [error])

  return (
    <div className="not-found-page">
      <div className="not-found__inner">
        <span className="not-found__num">500</span>
        <div className="not-found__text">
          <p className="not-found__label">Something went wrong</p>
          <h1 className="not-found__heading">
            We hit an unexpected
            <br />
            snag on our end.
          </h1>
          <p className="not-found__body">
            Try reloading the page. If it keeps happening, write to{' '}
            <a
              href="mailto:contact@pre-fall.com"
              style={{color: 'inherit', textDecoration: 'underline'}}
            >
              contact@pre-fall.com
            </a>{' '}
            and we&apos;ll sort it out.
          </p>
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <button
              type="button"
              onClick={reset}
              className="not-found__cta"
            >
              Try again ↻
            </button>
            <Link
              href="/"
              className="not-found__cta"
              style={{background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)'}}
            >
              Back to Prefall →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
