import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {newsletterPageQuery} from '@/sanity/lib/queries'
import {NewsletterForm} from '@/components/forms/NewsletterForm'

export const metadata: Metadata = {
  title: 'Newsletter — Prefall',
  description: 'Weekly analysis on the economics of sustainable fashion.',
}

export default async function NewsletterPage() {
  const data = await sanityFetch<any>({
    query: newsletterPageQuery,
    tags: ['newsletterPage'],
  })

  if (!data) return null

  return (
    <>
      <section className="nl-hero">
        {data.kicker ? (
          <p className="eyebrow nl-hero__kicker">{data.kicker}</p>
        ) : null}
        <div className="nl-hero__content">
          <div>
            {data.heading ? (
              <h1 className="newsletter-heading">{data.heading}</h1>
            ) : null}
            {data.body ? <p className="newsletter-body">{data.body}</p> : null}
          </div>
          <div className="nl-hero__right">
            <NewsletterForm
              inputPlaceholder={data.inputPlaceholder}
              submitLabel={data.submitLabel}
              successTitle={data.successTitle}
              successBody={data.successBody}
            />
          </div>
        </div>
      </section>

      {data.features?.length ? (
        <section className="nl-features">
          {data.features.map((f: any) => (
            <div key={f._key} className="nl-feature">
              {f.number ? <span className="nl-feature__num">{f.number}</span> : null}
              {f.text ? <p className="nl-feature__text">{f.text}</p> : null}
            </div>
          ))}
        </section>
      ) : null}
    </>
  )
}
