'use client'

/**
 * Newsletter signup — posts the email to Substack and shows the in-page
 * success state. Substack's API endpoint is `/api/v1/free?nojs=true` which
 * accepts the `email` form field and queues the welcome / double-opt-in
 * email from the Substack publication. We submit it via a hidden form so
 * the user never leaves prefall.com.
 *
 * Substack publication: prefall.substack.com
 */
import {useState} from 'react'

const SUBSTACK_HOST = 'prefall.substack.com'
const SUBSTACK_ENDPOINT = `https://${SUBSTACK_HOST}/api/v1/free?nojs=true`

type Props = {
  inputPlaceholder?: string | null
  submitLabel?: string | null
  successTitle?: string | null
  successBody?: string | null
}

export function NewsletterForm({
  inputPlaceholder,
  submitLabel,
  successTitle,
  successBody,
}: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('email', email)
      // Substack's `nojs=true` endpoint is a plain form POST. We use
      // `mode: no-cors` so the response is opaque (Substack does not return
      // CORS headers) but the request still reaches their server and the
      // subscriber is queued. Failure mode: network error → show fallback.
      await fetch(SUBSTACK_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body,
      })
      setSubmitted(true)
    } catch (err) {
      setError('Could not submit right now. Please try again in a moment.')
      console.error('Newsletter submit failed', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    // Match prototype line 4992-4996 verbatim: <p> tags, line break inside
    // title, no <h3>. Title may contain "\n" so we render with pre-line.
    return (
      <div className="nl-success is-visible" aria-live="polite">
        <div className="nl-success__line" />
        <p
          className="nl-success__title"
          style={{whiteSpace: 'pre-line'}}
        >
          {successTitle ?? "You're in.\nFirst issue coming soon."}
        </p>
        {successBody ? <p className="nl-success__body">{successBody}</p> : null}
      </div>
    )
  }

  return (
    // `noValidate` matches the prototype — we trust the front-end success
    // state instead of relying on the browser's native validation popup.
    <form className="nl-form" onSubmit={handleSubmit} noValidate>
      <div className="nl-form__field">
        <input
          type="email"
          required
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={inputPlaceholder ?? 'your@email.com'}
          aria-label="Email address"
          className="nl-form__input"
          autoComplete="email"
        />
      </div>
      {/* No `disabled` per prototype — the button is always active so the
          full visual treatment (filled dark, hover accent) is visible at
          rest. The success state is gated by `handleSubmit` instead. */}
      <button type="submit" className="nl-form__submit">
        {submitting ? 'Subscribing…' : (submitLabel ?? 'Subscribe')}
      </button>
      {error ? (
        <p
          role="alert"
          style={{
            gridColumn: '1 / -1',
            fontSize: 13,
            color: '#b91c1c',
            marginTop: 8,
          }}
        >
          {error}
        </p>
      ) : null}
    </form>
  )
}
