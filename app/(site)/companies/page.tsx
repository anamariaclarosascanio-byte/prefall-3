/**
 * /companies — index page. Server Component fetches all companies + filter
 * taxonomy + page copy, hands them to a client shell for filtering.
 */
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {companiesIndexQuery} from '@/sanity/lib/queries'
import {CompaniesIndexClient} from '@/components/companies/CompaniesIndexClient'

type Data = {
  page: {
    heading?: string | null
    subhead?: string | null
    methodNoteHeading?: string | null
    methodNoteBody?: string | null
  } | null
  settings: {emptyNodeCompaniesMessage?: string | null} | null
  nodes: any[]
  companies: any[]
}

export const metadata: Metadata = {
  title: 'Companies — Prefall',
  description:
    'An analytical directory of companies operating across the fashion value chain.',
}

export default async function CompaniesPage() {
  const data = await sanityFetch<Data>({
    query: companiesIndexQuery,
    tags: ['companies', 'companiesPage'],
  })

  const heading = data.page?.heading ?? 'Companies'
  const subhead = data.page?.subhead

  return (
    <div id="view-companies">
      <div className="page-header">
        <h1 className="page-header__heading">{heading}</h1>
        {subhead ? <p className="page-header__subhead">{subhead}</p> : null}
      </div>

      <CompaniesIndexClient
        nodes={data.nodes}
        companies={data.companies}
        emptyMessage={data.settings?.emptyNodeCompaniesMessage}
        methodNoteHeading={data.page?.methodNoteHeading}
        methodNoteBody={data.page?.methodNoteBody}
      />
    </div>
  )
}
