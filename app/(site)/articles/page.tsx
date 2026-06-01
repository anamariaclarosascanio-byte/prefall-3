import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {articlesIndexQuery} from '@/sanity/lib/queries'
import {ArticlesIndexClient} from '@/components/articles/ArticlesIndexClient'

type Data = {
  page: {
    heading?: string | null
    subhead?: string | null
    emptyMessage?: string | null
  } | null
  categories: any[]
  articles: any[]
}

export const metadata: Metadata = {
  title: 'Articles — Prefall',
  description:
    "Long-form analytical work on the economics of fashion's transition.",
}

export default async function ArticlesPage() {
  const data = await sanityFetch<Data>({
    query: articlesIndexQuery,
    tags: ['articles', 'articlesPage'],
  })

  return (
    // id="view-articles" so the prototype's view-specific CSS applies
    // (e.g. hide the mobile-sort button on desktop).
    <div id="view-articles">
      <div className="page-header">
        <h1 className="page-header__heading">
          {data.page?.heading ?? 'Articles'}
        </h1>
        {data.page?.subhead ? (
          <p className="page-header__subhead">{data.page.subhead}</p>
        ) : null}
      </div>

      <ArticlesIndexClient
        categories={data.categories}
        articles={data.articles}
        emptyMessage={data.page?.emptyMessage}
      />
    </div>
  )
}
