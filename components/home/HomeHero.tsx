import Link from 'next/link'
import {routes} from '@/lib/routes'

/**
 * Hero section — ported from prefall-prototype 1.html lines 2665-2674.
 * Class names preserved exactly. All copy comes from Sanity siteSettings.
 */
type Props = {
  label?: string | null
  heading?: string | null
  body?: string | null
  primaryCtaLabel?: string | null
  secondaryCtaLabel?: string | null
}

export function HomeHero({label, heading, body, primaryCtaLabel, secondaryCtaLabel}: Props) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {label ? <p className="hero__label">{label}</p> : null}
      {heading ? (
        <h1 className="hero__heading" id="hero-heading">
          {heading.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
      ) : null}
      {body ? <p className="hero__body">{body}</p> : null}
      <div className="hero__ctas">
        {primaryCtaLabel ? (
          <Link href={routes.articles} className="btn btn--primary">
            {primaryCtaLabel}
          </Link>
        ) : null}
        {secondaryCtaLabel ? (
          <Link href={routes.about} className="btn btn--ghost">
            {secondaryCtaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
