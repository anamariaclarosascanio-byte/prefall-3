'use client'

/**
 * Global error boundary — caught here whenever a render throws. Keeps the
 * brand chrome around the error so the user has a path out (Home + Reload).
 */
import {useEffect} from 'react'
import Link from 'next/link'
import {routes} from '@/lib/routes'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    // In production this is where you'd ship the error to Sentry/Logflare.
    // For now, just log it — Vercel captures the stack in build logs anyway.
    console.error('Page render failed:', error)
  }, [error])

  return (
    <div className="page-header" style={{minHeight: '60vh'}}>
      <p className="section__label" style={{marginBottom: 24}}>
        Something went wrong
      </p>
      <h1 className="page-header__heading" style={{maxWidth: 720}}>
        We hit an unexpected error.
      </h1>
      <p
        className="page-header__subhead"
        style={{maxWidth: 640, marginTop: 16}}
      >
        Try reloading. If it keeps happening, write to{' '}
        <a href="mailto:contact@pre-fall.com">contact@pre-fall.com</a> and we&apos;ll
        sort it out.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 32,
        }}
      >
        <button type="button" onClick={reset} className="btn btn--primary">
          ↻ Try again
        </button>
        <Link href={routes.home} className="btn btn--ghost">
          ← Home
        </Link>
      </div>
    </div>
  )
}
