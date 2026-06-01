/**
 * /regulation — index page. Stats header, tracker (cartography), and
 * status-grouped lists of all 14 regulations.
 */
import type {Metadata} from 'next'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/fetch'
import {regulationIndexQuery} from '@/sanity/lib/queries'
import {StatusBadge} from '@/components/regulation/StatusBadge'
import {RegulationTracker} from '@/components/regulation/RegulationTracker'
import {routes} from '@/lib/routes'

type Reg = {
  _id: string
  name: string
  fullName?: string | null
  slug: string
  shortSummary?: string | null
  enteredForce?: string | null
  nextDeadline?: string | null
  countdownTheme?: string | null
  countdownDescription?: string | null
  status?: {
    _id?: string
    title: string
    slug?: string | null
    dotColor?: string | null
    badgeBg?: string | null
    badgeText?: string | null
  } | null
  milestones?: any[] | null
}

type Data = {
  page: {
    heading?: string | null
    subhead?: string | null
    trackerTitle?: string | null
    trackerSubtitle?: string | null
    trackerCtaLabel?: string | null
    trackerCtaSubLabel?: string | null
  } | null
  statuses: any[]
  regulations: Reg[]
}

export const metadata: Metadata = {
  title: 'Regulation — Prefall',
  description:
    'A live tracker of the EU and major national rules reshaping fashion economics.',
}

export default async function RegulationPage() {
  const data = await sanityFetch<Data>({
    query: regulationIndexQuery,
    tags: ['regulation', 'regulationPage'],
  })

  // Group regulations by status slug, in status.order.
  const groups = new Map<string, Reg[]>()
  for (const r of data.regulations) {
    const k = r.status?.slug ?? 'unknown'
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k)!.push(r)
  }

  // Stats
  const total = data.regulations.length
  const active = data.regulations.filter((r) =>
    ['in-force', 'enforced', 'amended'].includes(r.status?.slug ?? '')
  ).length
  const pending = data.regulations.filter((r) =>
    ['transpos', 'preparation'].includes(r.status?.slug ?? '')
  ).length

  return (
    <>
      <div className="page-header reg-page-header">
        <div>
          <h1 className="page-header__heading">
            {data.page?.heading ?? 'Regulation'}
          </h1>
          {data.page?.subhead ? (
            <p className="page-header__subhead">{data.page.subhead}</p>
          ) : null}
        </div>
        <div className="ca-stats">
          <div className="ca-stat">
            <div className="ca-sn">{total}</div>
            <div className="ca-sl">Instruments</div>
          </div>
          <div className="ca-stat">
            <div className="ca-sn">{active}</div>
            <div className="ca-sl">In force / amended</div>
          </div>
          <div className="ca-stat">
            <div className="ca-sn">{pending}</div>
            <div className="ca-sl">Pending</div>
          </div>
        </div>
      </div>

      <RegulationTracker
        title={data.page?.trackerTitle}
        subtitle={data.page?.trackerSubtitle}
        ctaLabel={data.page?.trackerCtaLabel}
        ctaSubLabel={data.page?.trackerCtaSubLabel}
        regulations={data.regulations}
        statuses={data.statuses}
      />

      <section
        className="section"
        aria-label="Regulation index"
        style={{borderBottom: 'none', borderTop: 'none'}}
      >
        {data.statuses.map((s) => {
          const items = groups.get(s.slug) ?? []
          if (items.length === 0) return null
          return (
            <div key={s._id} className="reg-status-group">
              <p className="reg-status-group__heading">
                <StatusBadge status={s} />
              </p>
              {items.map((r) => (
                <Link
                  key={r._id}
                  href={`${routes.regulation}/${r.slug}`}
                  className="reg-item"
                >
                  <div>
                    <p className="reg-item__name">{r.name}</p>
                    {r.fullName ? (
                      <p className="reg-item__full">{r.fullName}</p>
                    ) : null}
                    {r.shortSummary ? (
                      <p className="reg-item__summary">{r.shortSummary}</p>
                    ) : null}
                  </div>
                  <StatusBadge status={s} />
                </Link>
              ))}
            </div>
          )
        })}
      </section>
    </>
  )
}
