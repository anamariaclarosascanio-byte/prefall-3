import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {jobsIndexQuery} from '@/sanity/lib/queries'
import {JobsListClient} from '@/components/jobs/JobsListClient'

type Data = {
  page: {
    heading?: string | null
    subhead?: string | null
    emptyMessage?: string | null
  } | null
  categories: any[]
  seniorities: any[]
  countries: any[]
  jobs: any[]
}

export const metadata: Metadata = {
  title: 'Jobs — Prefall',
  description:
    'Open positions in sustainability, ESG, circularity, regulation, and impact functions across fashion.',
}

export default async function JobsPage() {
  const data = await sanityFetch<Data>({
    query: jobsIndexQuery,
    tags: ['jobs', 'jobsPage'],
  })

  return (
    <div id="view-jobs">
      <div
        className="page-header"
        style={{borderBottom: 'none', paddingBottom: '32px'}}
      >
        <h1 className="page-header__heading">
          {data.page?.heading ?? 'Jobs'}
        </h1>
        {data.page?.subhead ? (
          <p className="page-header__subhead">{data.page.subhead}</p>
        ) : null}
        <p
          style={{
            fontSize: 'var(--t-small)',
            color: 'var(--gray)',
            marginTop: '16px',
          }}
        >
          Prefall does not handle applications.
        </p>
      </div>

      <JobsListClient
        categories={data.categories}
        seniorities={data.seniorities}
        countries={data.countries}
        jobs={data.jobs}
        emptyMessage={data.page?.emptyMessage}
      />
    </div>
  )
}
