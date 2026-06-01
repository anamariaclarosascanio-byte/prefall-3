'use client'

/**
 * Value chain page shell. Owns layer state for the LifecycleMap and arranges
 * the prototype's exact DOM:
 *
 *   vc-map-page
 *     vc-map-header
 *       <heading group>            ← left column
 *       vc-map-layers              ← right column (4 buttons)
 *     lc-wrap
 *       lc-svg-wrap
 *         vc-nodes lc-nodes-desktop  (7-node strip)
 *         lc-fade > svg
 *       lc-legend-wrap
 *     pill-tooltip                 (positioned fixed)
 *     vc-map-footer
 *       vc-caption
 *
 * Splitting the layers + body into separate elements is necessary because
 * .vc-map-header is a CSS grid that places the buttons in its right column,
 * while the SVG sits in its own .lc-wrap below.
 */
import {useEffect, useMemo, useRef, useState} from 'react'
import Link from 'next/link'
import {routes} from '@/lib/routes'
import {
  LAYERS,
  Layer,
  LegendsTable,
  Tooltip,
  SvgBody,
  type NodeData,
  DEFAULT_NODES,
} from './LifecycleMap'

type Props = {
  heading: string
  subhead?: string | null
  hint?: string | null
  caption?: string | null
  nodes: NodeData[]
}

// Mobile-only short cards — verbatim from prefall-prototype 1.html
// lines 4702-4778. Intentionally distinct (and shorter) than the desktop
// node.shortBlurb so they fit two-line headings in the narrow card column.
const MOBILE_CARDS = [
  {
    id: 'rawmat',
    slug: 'raw-materials',
    num: '01',
    name: 'Raw<br>Materials',
    themes: 'Cotton · Polyester<br>Bio-fibres · Wool',
    signal: 'Largest environmental footprint. Smallest direct regulatory obligation.',
  },
  {
    id: 'spinmill',
    slug: 'yarn-fabric',
    num: '02',
    name: 'Yarn &amp;<br>Fabric',
    themes: 'Spinning · Dyeing<br>Finishing · PFAS',
    signal: 'Where chemical pollution concentrates. Data provider burden lands here first.',
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    num: '03',
    name: 'Manu-<br>facturing',
    themes: 'Cut-make-trim<br>Labour · Audit',
    signal: 'Lowest margin in the chain. Highest incoming compliance ask.',
  },
  {
    id: 'brands',
    slug: 'brands',
    num: '04',
    name: 'Brands',
    themes: 'Brief · Claims<br>Disclosure · DTC',
    signal: "Most regulated, highest-margin node. The chain's primary obligated actor.",
  },
  {
    id: 'retail',
    slug: 'retail',
    num: '05',
    name: 'Logistics<br>&amp; Retail',
    themes: 'Freight · Returns<br>Platforms · EPR',
    signal: 'Return rate is an unpriced structural waste. Freight emissions newly visible under CSRD.',
  },
  {
    id: 'consumer',
    slug: 'consumer',
    num: '06',
    name: 'Consumer',
    themes: 'Purchase · Use<br>Care · Disposal',
    signal: 'Use-phase emissions often exceed production. Behaviour is the unregulated variable.',
  },
  {
    id: 'secondary',
    slug: 'secondary-market',
    num: '07',
    name: 'Secondary<br>Market',
    themes: 'Resale · Repair<br>Rental · Recycling',
    signal: 'Value recovery at end of first life. Rebound risk offsets circularity gains.',
  },
]

export function ValueChainView({heading, subhead, hint, caption, nodes}: Props) {
  const [active, setActive] = useState<Layer>('physical')
  const [fading, setFading] = useState(false)
  const [animated, setAnimated] = useState(false)
  const [tooltip, setTooltip] = useState<{x: number; y: number; text: string; color: string} | null>(
    null
  )

  function switchLayer(next: Layer) {
    if (next === active) return
    setFading(true)
    window.setTimeout(() => {
      setActive(next)
      setFading(false)
    }, 220)
  }

  // The staggered SVG entrance (left-to-right reveal of nodes + connectors)
  // was driven by a fixed 800 ms setTimeout. Problem: on tall viewports the
  // user has to scroll down to reach the map, and by then the animation has
  // already finished off-screen — looking like it never fired. Switch to an
  // IntersectionObserver tied to the SVG container so the animation triggers
  // the moment the map enters the viewport (with a 50 ms breath so the
  // initial layout settles). Falls back to the timer if IO is unavailable.
  const lcWrapRef = useRef<HTMLDivElement | null>(null)
  const mobileWrapRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (animated) return
    if (typeof window === 'undefined') return
    const targets = [lcWrapRef.current, mobileWrapRef.current].filter(
      Boolean
    ) as Element[]
    if (targets.length === 0 || !('IntersectionObserver' in window)) {
      const id = window.setTimeout(() => setAnimated(true), 800)
      return () => window.clearTimeout(id)
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            window.setTimeout(() => setAnimated(true), 50)
            io.disconnect()
            return
          }
        }
      },
      {threshold: 0.15, rootMargin: '0px 0px -10% 0px'}
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [animated])

  // hintIdx: index of the layer button currently being "hinted" (cycling
  // animation that runs once on mount, prototype lines 5746-5759). The
  // hinted button visually appears active + plays the `ltogLift` bounce.
  // After the cycle finishes (~3.8 s) hintIdx returns to null and the
  // real active state takes over.
  const [hintIdx, setHintIdx] = useState<number | null>(null)
  const hintCancelled = useRef(false)

  useEffect(() => {
    const STEP = 950
    // Order matches the prototype: cycle through 1 → 2 → 3 → 0, leaving the
    // visual indicator back on Physical Flow at the end.
    const order = [1, 2, 3, 0]
    const timers: number[] = []
    order.forEach((idx, i) => {
      const t = window.setTimeout(() => {
        if (hintCancelled.current) return
        setHintIdx(idx)
      }, STEP * (i + 1))
      timers.push(t)
    })
    // Clear the hint after the last bounce finishes so the real active layer
    // takes over the visual highlight.
    const endTimer = window.setTimeout(
      () => setHintIdx(null),
      STEP * (order.length + 1)
    )
    timers.push(endTimer)
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  // Any user click on a layer cancels the hint cycle — otherwise the cycling
  // would fight with the user's chosen layer.
  function handleLayerClick(next: Layer) {
    hintCancelled.current = true
    setHintIdx(null)
    switchLayer(next)
  }

  const sortedNodes = useMemo(() => {
    if (nodes && nodes.length > 0) return [...nodes].sort((a, b) => a.order - b.order)
    return DEFAULT_NODES
  }, [nodes])

  return (
    <div className="vc-map-page">
      <div className="vc-map-header">
        <div>
          <h1 className="page-header__heading">{heading}</h1>
          {subhead ? <p className="page-header__subhead">{subhead}</p> : null}
          {hint ? <p className="vc-map-header__hint">{hint}</p> : null}
        </div>

        <div className="vc-map-layers">
          {LAYERS.map((l, idx) => {
            // While the hint cycle is running (hintIdx !== null), the hinted
            // button overrides the real active highlight. After the cycle
            // ends (hintIdx === null), the user's selected layer wins.
            const isActive =
              hintIdx !== null ? hintIdx === idx : active === l.key
            const isHint = hintIdx === idx
            const cls = [
              'vc-map-layer',
              'ltog',
              isActive ? 'active' : '',
              isHint ? 'is-hint' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={l.key}
                type="button"
                className={cls}
                data-layer={l.key}
                onClick={() => handleLayerClick(l.key)}
              >
                <span className="ltog__num">{l.num}</span>
                <span className="vc-map-layer__name">{l.name}</span>
                <span className="vc-map-layer__desc">{l.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Tooltip data={tooltip} />

      {/* ── Mobile view ──────────────────────────────────────────────────
          Horizontally-scrolling 7-card strip + a cloned SVG below them.
          CSS hides this above 768px and hides .lc-wrap below 768px. The
          card copy is taken verbatim from prefall-prototype 1.html
          (lines 4702-4778) — these are short, design-locked summaries
          distinct from the longer node.shortBlurb shown on desktop. */}
      <div className="lc-mobile-view" ref={mobileWrapRef}>
        <div className="lc-mobile-scroll">
          <div className="vcc-flow lc-cards-mobile">
            {MOBILE_CARDS.map((card) => (
              <Link
                key={card.id}
                href={`${routes.valueChain}/${card.slug}`}
                className="vcc-card"
              >
                <div className="vcc-above">
                  <span className="vcc-num">{card.num}</span>
                </div>
                <div className="vcc-dot" />
                <div className="vcc-below">
                  <h2
                    className="vcc-name"
                    dangerouslySetInnerHTML={{__html: card.name}}
                  />
                  <p
                    className="vcc-themes"
                    dangerouslySetInnerHTML={{__html: card.themes}}
                  />
                  <p className="vcc-signal">{card.signal}</p>
                  <span className="vcc-go">Open node ↗</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Cloned SVG for mobile — same SvgBody. viewBox is `0 100 1440 460`
              (no negative-x offset) so the SVG's column grid starts at x=0,
              matching the cards container above. Result: card 1 centre lines
              up with the Raw Materials cluster, card 2 with Yarn & Fabric,
              etc. The cards container below also forces 1440px width with
              7 equal columns. */}
          <svg
            id="lc-svg-mobile"
            viewBox="0 100 1440 460"
            preserveAspectRatio="xMidYMid meet"
            style={{width: '1440px', minWidth: '1440px', display: 'block'}}
          >
            <SvgBody layer={active} animated={animated} onTip={setTooltip} />
          </svg>
        </div>
        {/* Mobile legend — LegendsTable already renders the .lc-legend-wrap
            container (with its own border-top), so we render it directly
            without an extra wrapper to avoid the double divider line. */}
        <LegendsTable layer={active} />
      </div>

      <div className="lc-wrap" ref={lcWrapRef}>
        <div className="lc-svg-wrap">
          <nav className="vc-nodes lc-nodes-desktop" aria-label="Value chain nodes">
            {sortedNodes.map((n) => (
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
                {n.shortBlurb ? (
                  <span className="vc-node__desc">{n.shortBlurb}</span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className={`lc-fade${fading ? ' out' : ''}`}>
            <svg
              id="lc-svg"
              viewBox="-28 0 1496 620"
              width="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{minWidth: '1440px'}}
            >
              <SvgBody layer={active} animated={animated} onTip={setTooltip} />
            </svg>
          </div>
        </div>

        <LegendsTable layer={active} />
      </div>

      <div className="vc-map-footer">
        <p className="vc-caption">
          {caption ?? "The economics of the industry rarely sit inside a single node."}
        </p>
      </div>
    </div>
  )
}
