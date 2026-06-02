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

// Metadata explicitly overrides ALL OG fields. Without this the page
// inherits openGraph.title / og:description from the root layout (the
// home hero copy), which makes LinkedIn previews look identical to the
// homepage even though the og:image is the jobs creative.
const TITLE = 'Sustainability roles in fashion'
const DESCRIPTION =
  'A weekly edit of curated openings at the brands and houses shaping the next season — ESG, regulation, circularity, supply chain.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {canonical: 'https://pre-fall.com/jobs'},
  openGraph: {
    type: 'website',
    url: 'https://pre-fall.com/jobs',
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Prefall',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
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
