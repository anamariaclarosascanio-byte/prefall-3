/**
 * Single regulation page — ported from prefall-prototype 1.html lines 3810-3868
 * (CSRD shown as the template). Structure shared by all 14 regulation pages.
 */
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {client} from '@/sanity/lib/client'
import {
  regulationBySlugQuery,
  allRegulationSlugsQuery,
} from '@/sanity/lib/queries'
import {PortableBlock} from '@/components/portable/PortableBlock'
import {DetailSidebarSection} from '@/components/detail/DetailSidebarSection'
import {StatusBadge} from '@/components/regulation/StatusBadge'
import {routes} from '@/lib/routes'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allRegulationSlugsQuery)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const r = await sanityFetch<{name: string; fullName?: string; shortSummary?: string} | null>({
    query: regulationBySlugQuery,
    params: {slug},
    tags: [`regulation:${slug}`],
  })
  if (!r) return {title: 'Regulation — Prefall'}
  const title = r.fullName ? `${r.name} — ${r.fullName}` : r.name
  const description = r.shortSummary ?? r.fullName ?? `Live tracker entry for ${r.name}.`
  const url = `https://pre-fall.com/regulation/${slug}`
  return {
    title,
    description,
    alternates: {canonical: url},
    openGraph: {
      type: 'article',
      url,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

const SECTIONS = [
  ['reg-section-what', 'What it is'],
  ['reg-section-who', 'Who it affects'],
  ['reg-section-econ', 'Key economic implications'],
  ['reg-section-stand', 'Where things stand'],
  ['reg-section-sources', 'Sources'],
] as const

function formatDate(d?: string | null) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export default async function RegulationDetailPage({params}: Props) {
  const {slug} = await params
  const reg = await sanityFetch<any>({
    query: regulationBySlugQuery,
    params: {slug},
    tags: [`regulation:${slug}`],
  })

  if (!reg) notFound()

  const enteredForce = formatDate(reg.enteredForce)
  const nextDeadline = formatDate(reg.nextDeadline)

  return (
    <>
      <div className="detail-header">
        <div className="detail-header__label">
          <Link href={routes.regulation} className="detail-header__back">
            ← Regulation
          </Link>
          <StatusBadge status={reg.status} />
        </div>
        <h1 className="detail-header__heading">{reg.name}</h1>
        {reg.fullName ? (
          <p className="detail-header__full">{reg.fullName}</p>
        ) : null}
        {reg.shortSummary ? (
          <p className="detail-header__summary">{reg.shortSummary}</p>
        ) : null}
      </div>

      <div className="detail-wrap">
        <div className="detail-layout">
          <nav className="detail-sidebar">
            <DetailSidebarSection title="On this page">
              {SECTIONS.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="detail-sidebar__link">
                  {label}
                </a>
              ))}
            </DetailSidebarSection>

            {(enteredForce || nextDeadline) ? (
              <DetailSidebarSection title="Key dates">
                <p className="detail-sidebar__text">
                  {enteredForce ? (
                    <>
                      Entered force: {enteredForce}
                      <br />
                      <br />
                    </>
                  ) : null}
                  {nextDeadline ? <>Next deadline: {nextDeadline}</> : null}
                </p>
              </DetailSidebarSection>
            ) : null}

            {reg.nodes?.length ? (
              <DetailSidebarSection title="Applies to nodes">
                {reg.nodes.map((n: any) => (
                  <Link
                    key={n._id}
                    href={`${routes.valueChain}/${n.slug}`}
                    className="detail-sidebar__link"
                  >
                    {n.title} →
                  </Link>
                ))}
              </DetailSidebarSection>
            ) : null}
          </nav>

          <div>
            <div className="detail-body__section" id="reg-section-what">
              <p className="detail-body__section-head">What it is</p>
              {reg.summary ? <PortableBlock value={reg.summary} /> : null}
              {reg.body ? <PortableBlock value={reg.body} /> : null}
              {!reg.summary && !reg.body && reg.shortSummary ? (
                <p className="detail-body__prose">{reg.shortSummary}</p>
              ) : null}
            </div>

            {reg.whoItAffects ? (
              <div className="detail-body__section" id="reg-section-who">
                <p className="detail-body__section-head">Who it affects</p>
                <PortableBlock value={reg.whoItAffects} />
              </div>
            ) : null}

            {reg.whatItRequires ? (
              <div className="detail-body__section" id="reg-section-econ">
                <p className="detail-body__section-head">
                  Key economic implications
                </p>
                <PortableBlock value={reg.whatItRequires} />
              </div>
            ) : null}

            {reg.prefallAnalysis ? (
              <div className="detail-body__section" id="reg-section-stand">
                <p className="detail-body__section-head">Where things stand</p>
                <PortableBlock value={reg.prefallAnalysis} />
              </div>
            ) : null}

            {reg.sources ? (
              <div className="detail-body__section" id="reg-section-sources">
                <p className="detail-body__section-head">Official sources</p>
                <PortableBlock value={reg.sources} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
