'use client'

/**
 * Newsletter signup form — front-end success state only (per launch decision).
 * Provider wiring (Mailchimp/Buttondown/etc.) happens after launch.
 */
import {useState} from 'react'

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // No backend yet — show success state. Real provider wired later.
    setSubmitted(true)
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
        {submitLabel ?? 'Subscribe'}
      </button>
    </form>
  )
}
