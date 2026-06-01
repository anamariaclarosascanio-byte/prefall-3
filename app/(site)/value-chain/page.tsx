/**
 * /value-chain — the lifecycle map page.
 * Ported from prefall-prototype 1.html lines 4666-4808.
 *
 * The entire interactive view (header layer-toggle, vc-nodes strip, animated
 * SVG, legend, tooltip, caption) is rendered inside <ValueChainView />, which
 * owns the layer state. The page is a thin server wrapper that fetches the
 * editable copy + nodes from Sanity.
 */
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {valueChainPageQuery} from '@/sanity/lib/queries'
import {ValueChainView} from '@/components/valuechain/ValueChainView'

type Data = {
  page: {
    heading?: string | null
    subhead?: string | null
    mapHintLabel?: string | null
    mapFooterNote?: string | null
  } | null
  settings: {valueChainHeroCaption?: string | null} | null
  nodes: any[]
}

export const metadata: Metadata = {
  title: 'Value chain — Prefall',
  description:
    "Seven nodes from raw materials to the secondary market. The economics of fashion's transition.",
}

export default async function ValueChainPage() {
  const data = await sanityFetch<Data>({
    query: valueChainPageQuery,
    tags: ['valueChain', 'valueChainPage', 'nodes'],
  })

  return (
    <ValueChainView
      heading={data.page?.heading ?? 'The fashion value chain'}
      subhead={data.page?.subhead ?? null}
      hint={data.page?.mapHintLabel ?? null}
      caption={
        data.settings?.valueChainHeroCaption ??
        data.page?.mapFooterNote ??
        null
      }
      nodes={data.nodes ?? []}
    />
  )
}
