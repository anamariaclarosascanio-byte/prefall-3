'use client'

/**
 * Contact form (About page) — posts to /api/contact, which uses Resend to
 * email contact@pre-fall.com from noreply@send.pre-fall.com (DKIM-signed
 * subdomain). The visitor's email goes in reply_to so Ana can reply
 * directly from her inbox.
 *
 * Submission states:
 *   • idle   — show form
 *   • submitting — disable submit, show "Sending…"
 *   • success — replace with the form-success block (icon + thank you)
 *   • error  — keep form visible, show inline error above the button
 */
import {useState} from 'react'

type Props = {
  successTitle?: string | null
  successBody?: string | null
}

export function ContactForm({successTitle, successBody}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, message}),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Request failed (${res.status})`)
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-success is-visible">
        <div className="form-success__icon">✓</div>
        <h3 className="form-success__title">{successTitle ?? 'Thank you.'}</h3>
        {successBody ? (
          <p className="form-success__body">{successBody}</p>
        ) : null}
      </div>
    )
  }

  return (
    <form className="about-contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-field__label" htmlFor="contact-name">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-field__input"
          placeholder="Jane Doe"
          autoComplete="name"
          disabled={submitting}
        />
      </div>
      <div className="form-field">
        <label className="form-field__label" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-field__input"
          placeholder="jane@example.com"
          autoComplete="email"
          disabled={submitting}
        />
      </div>
      <div className="form-field">
        <label className="form-field__label" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-field__textarea"
          rows={5}
          disabled={submitting}
        />
      </div>
      {error ? (
        <p
          role="alert"
          style={{
            fontSize: 13,
            color: '#b91c1c',
            margin: '0 0 12px',
          }}
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn-contact-submit"
        disabled={submitting}
      >
        {submitting ? 'Sending…' : 'Send →'}
      </button>
    </form>
  )
}
