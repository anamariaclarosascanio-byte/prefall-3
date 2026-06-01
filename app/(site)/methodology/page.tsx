import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {methodologyPageQuery} from '@/sanity/lib/queries'
import {PortableBlock} from '@/components/portable/PortableBlock'

export const metadata: Metadata = {
  title: 'Methodology — Prefall',
  description:
    'How Prefall selects, analyses, and updates its editorial content.',
}

export default async function MethodologyPage() {
  const data = await sanityFetch<any>({
    query: methodologyPageQuery,
    tags: ['methodologyPage'],
  })

  if (!data) return null

  return (
    <div className="prose-page">
      <div className="prose-hero">
        {data.heroHeading ? (
          <h1 className="prose-hero__heading">{data.heroHeading}</h1>
        ) : null}
        {data.heroSubhead ? (
          <p className="prose-hero__subhead">{data.heroSubhead}</p>
        ) : null}
      </div>

      {data.sections?.map((s: any) => (
        <section key={s._key} className="prose-section">
          {s.label ? <p className="prose-section__label">{s.label}</p> : null}
          <div className="prose-section__content">
            {s.heading ? (
              <h2 className="prose-section__heading">{s.heading}</h2>
            ) : null}
            {s.body ? <PortableBlock value={s.body} /> : null}
          </div>
        </section>
      ))}
    </div>
  )
}
