import Link from 'next/link'
import {routes} from '@/lib/routes'

/**
 * Value chain preview — ported from prefall-prototype 1.html lines 2771-2792.
 * Shows the 7 nodes in fixed order. Each node links to its detail page.
 */
type Node = {
  _id: string
  title: string
  order: number
  slug: string
}

type Props = {
  heading?: string | null
  subhead?: string | null
  caption?: string | null
  nodes: Node[]
}

export function ValueChainPreview({heading, subhead, caption, nodes}: Props) {
  return (
    <section className="section" aria-label="Value chain" style={{borderBottom: 'none'}}>
      <div className="vc-header">
        <div>
          {heading ? (
            <h2 className="section__heading section__heading--entity">{heading}</h2>
          ) : null}
          {subhead ? <p className="section__subhead">{subhead}</p> : null}
        </div>
        <Link
          href={routes.valueChain}
          className="btn btn--ghost"
          style={{flexShrink: 0}}
        >
          Open the full map →
        </Link>
      </div>

      <nav className="vc-nodes" aria-label="Value chain nodes">
        {nodes.map((n) => (
          <Link
            key={n._id}
            href={`${routes.valueChain}/${n.slug}`}
            className="vc-node"
          >
            <span className="vc-node__num">
              {String(n.order).padStart(2, '0')}
            </span>
            <span className="vc-node__name">{n.title}</span>
            <span className="vc-node__arr">↗</span>
          </Link>
        ))}
      </nav>

      {caption ? <p className="vc-caption">{caption}</p> : null}
    </section>
  )
}
