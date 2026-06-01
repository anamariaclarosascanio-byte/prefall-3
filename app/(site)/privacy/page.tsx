import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {privacyPageQuery} from '@/sanity/lib/queries'
import {PortableBlock} from '@/components/portable/PortableBlock'

export const metadata: Metadata = {
  title: 'Privacy — Prefall',
  description: 'How Prefall handles your data.',
}

export default async function PrivacyPage() {
  const data = await sanityFetch<any>({
    query: privacyPageQuery,
    tags: ['privacyPage'],
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
