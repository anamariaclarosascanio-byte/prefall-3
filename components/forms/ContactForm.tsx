'use client'

/**
 * Contact form (About page) — front-end success state only (per launch
 * decision). Real delivery (Resend/Formspree) wired after launch.
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
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
        />
      </div>
      <button type="submit" className="btn-contact-submit">
        Send →
      </button>
    </form>
  )
}
