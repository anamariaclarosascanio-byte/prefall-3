'use client'

/**
 * Lifecycle map — 1:1 port of the prototype's JS-driven SVG visualisation
 * (prefall-prototype 1.html lines 6119-6500). Renders all 4 toggleable layers
 * (Physical Flow · Value Capture · Regulatory Exposure · Carbon Scope) with:
 *
 *   • The exact packing algorithm for circle clusters per zone (pack/centerPack)
 *   • Inner concentric white + coloured + halo treatment per circle
 *   • Inside labels for r ≥ 18 (white text), outside labels with directional
 *     positioning for smaller circles
 *   • Dashed chain arrow + closed-loop curved arrow + post-zone connectors
 *   • Regulation pills with hover tooltip on the regulatory layer
 *   • Layer-specific legend with proper labels
 *   • Fade transition on layer change + lcNodeIn entrance animation
 *
 * Constants, data and colours are copied verbatim from the prototype.
 */
export type Layer = 'physical' | 'value' | 'regulatory' | 'scope'

// ── Constants (verbatim from prototype line 6122-6133) ─────────────────────
const SVG_W = 1440
const SVG_H = 620
const SEG_W = SVG_W / 7
const CHAIN_Y = 290
const HEADER_H = 0 // desktop: 0; mobile sync replaces header with cards
const SEG_TINT = [
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.009)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.009)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.009)',
]
const SEG_CX = (i: number) => SEG_W * i + SEG_W / 2

const THEME = {
  transparency: '#8B5CF6',
  greenwashing: '#0891B2',
  supply: '#D97706',
  product: '#059669',
  waste: '#DC2626',
} as const

type ZoneId = 'rawmat' | 'spinmill' | 'manufacturing' | 'brands' | 'retail' | 'consumer'
type PostId = 'resale' | 'repair' | 'recycling' | 'disposal'

const PHYSICAL_FILL_BY_ZONE: Record<ZoneId, string> = {
  rawmat: '#D97706',
  spinmill: '#FBBF24',
  manufacturing: '#A855F7',
  brands: '#8B5CF6',
  retail: '#22D3EE',
  consumer: '#34D399',
}
const PHYSICAL_FILL_POST_BY_ZONE: Record<PostId, string> = {
  resale: '#D8B4FE',
  repair: '#34D399',
  recycling: '#FBBF24',
  disposal: '#F87171',
}
const PHYSICAL_FILL = '#A855F7'

const VALUE_FILL: Record<ZoneId, string> = {
  rawmat: '#DDD6FE',
  spinmill: '#C4B5FD',
  manufacturing: '#A855F7',
  brands: '#5B21B6',
  retail: '#8B5CF6',
  consumer: '#BBBBBB',
}
const VALUE_FILL_POST: Record<PostId, string> = {
  resale: '#5B21B6',
  repair: '#8B5CF6',
  recycling: '#A855F7',
  disposal: '#DDD6FE',
}

const REG_FILL: Record<ZoneId, string> = {
  rawmat: '#BBBBBB',
  spinmill: THEME.transparency,
  manufacturing: THEME.transparency,
  brands: THEME.transparency,
  retail: THEME.greenwashing,
  consumer: '#BBBBBB',
}
const REG_FILL_POST: Record<PostId, string> = {
  resale: THEME.transparency,
  repair: THEME.product,
  recycling: THEME.waste,
  disposal: THEME.waste,
}

const SCOPE_FILL: Record<ZoneId, string> = {
  rawmat: '#DC2626',
  spinmill: '#DC2626',
  manufacturing: '#DC2626',
  brands: '#8B5CF6',
  retail: '#D97706',
  consumer: '#D97706',
}
const SCOPE_FILL_POST: Record<PostId, string> = {
  resale: '#059669',
  repair: '#059669',
  recycling: '#D97706',
  disposal: '#DC2626',
}

function getFill(id: string, layer: Layer, isPost: boolean): string {
  if (layer === 'physical') {
    if (isPost) return PHYSICAL_FILL_POST_BY_ZONE[id as PostId] || PHYSICAL_FILL
    return PHYSICAL_FILL_BY_ZONE[id as ZoneId] || PHYSICAL_FILL
  }
  if (layer === 'value') {
    if (isPost) return VALUE_FILL_POST[id as PostId] || '#E6E6E6'
    return VALUE_FILL[id as ZoneId] || '#E6E6E6'
  }
  if (layer === 'regulatory') {
    if (isPost) return REG_FILL_POST[id as PostId] || '#E6E6E6'
    return REG_FILL[id as ZoneId] || '#E6E6E6'
  }
  if (isPost) return SCOPE_FILL_POST[id as PostId] || '#E6E6E6'
  return SCOPE_FILL[id as ZoneId] || '#E6E6E6'
}

// ── Zone definitions (verbatim from prototype lines 6136-6155) ────────────
type CircleSpec = {
  r: number
  label: string
  labelDir?: 'above' | 'above-right' | 'below' | 'left' | 'right' | 'auto'
  labelOutside?: boolean
  labelGap?: number
  labelVOffset?: number
}
type RegRef = {name: string; theme: keyof typeof THEME | null}
type Zone = {id: ZoneId; seg: number; zone: string; circles: CircleSpec[]; regs: RegRef[]}

const ZONES: Zone[] = [
  {
    id: 'rawmat',
    seg: 0,
    zone: 'RAW MATERIALS',
    circles: [
      {r: 42, label: 'Petrochem\nsynthetics'},
      {r: 28, label: 'Cotton\nfarmers'},
      {r: 16, label: 'Linen\n& bast'},
      {r: 11, label: 'Wool', labelDir: 'left'},
      {r: 8, label: 'Specialty\nfibres', labelDir: 'above'},
    ],
    regs: [
      {name: 'No direct EU obligation', theme: null},
      {name: 'Affected by EUDR — brand traceability req.', theme: 'supply'},
      {name: 'Affected by CSDDD — brand due diligence', theme: 'supply'},
    ],
  },
  {
    id: 'spinmill',
    seg: 1,
    zone: 'YARN & FABRIC',
    circles: [
      {r: 38, label: 'Fabric\nmills'},
      {r: 26, label: 'Yarn\nspinners', labelDir: 'left'},
      {r: 16, label: 'Finishing\nhouses', labelDir: 'left'},
      {r: 10, label: 'Trim\nsuppliers', labelDir: 'above'},
    ],
    regs: [
      {name: 'Affected by DPP — traceability data req.', theme: 'transparency'},
      {name: 'Affected by CSDDD — brand due diligence', theme: 'supply'},
    ],
  },
  {
    id: 'manufacturing',
    seg: 2,
    zone: 'MANUFACTURING',
    circles: [
      {r: 36, label: 'Subcontractors\nTier 2–4'},
      {r: 42, label: 'Tier 1\nmanufacturers'},
    ],
    regs: [
      {name: 'Affected by DPP — primary data source', theme: 'transparency'},
      {name: 'Affected by CSDDD — brand due diligence', theme: 'supply'},
      {name: 'Affected by ESPR — repairability design', theme: 'product'},
    ],
  },
  {
    id: 'brands',
    seg: 3,
    zone: 'BRANDS',
    circles: [
      {r: 44, label: 'Mass\nmarket'},
      {r: 28, label: 'Premium\nbrands', labelDir: 'left'},
      {r: 18, label: 'Luxury\nhouses', labelOutside: true, labelDir: 'above'},
      {r: 14, label: 'DTC\nstartups', labelDir: 'left', labelVOffset: 20},
      {r: 9, label: 'Independent\ndesigners', labelDir: 'below', labelGap: 14},
    ],
    regs: [
      {name: 'CSRD — >1,000 emp. AND >€450M', theme: 'transparency'},
      {name: 'EUDR — operator (leather & rubber)', theme: 'supply'},
      {name: 'CSDDD — supply chain due diligence', theme: 'supply'},
      {name: 'ECGT — no vague claims', theme: 'greenwashing'},
      {name: 'DPP — first-in-market obligation', theme: 'transparency'},
      {name: 'ESPR — unsold goods destruction ban', theme: 'product'},
      {name: 'PPWR — e-commerce packaging', theme: 'waste'},
    ],
  },
  {
    id: 'retail',
    seg: 4,
    zone: 'LOGISTICS AND RETAIL',
    circles: [
      {r: 36, label: 'Marketplaces'},
      {r: 28, label: 'Department\nstores', labelOutside: true, labelDir: 'right'},
      {r: 22, label: 'Specialty\nretail', labelOutside: true, labelDir: 'left'},
      {r: 17, label: 'Wholesale\nagents', labelDir: 'right'},
      {r: 11, label: 'DTC\nchannels', labelDir: 'above'},
    ],
    regs: [
      {name: 'ECGT — co-liability for claims', theme: 'greenwashing'},
      {name: 'DPP — display at point of sale', theme: 'transparency'},
      {name: 'PPWR — packaging & parcels', theme: 'waste'},
      {name: 'EU Textile EPR — collection points', theme: 'waste'},
      {name: 'ESPR — display repair info', theme: 'product'},
    ],
  },
  {
    id: 'consumer',
    seg: 5,
    zone: 'CONSUMER',
    circles: [
      {r: 36, label: 'Value\nshopper'},
      {r: 28, label: 'Aspirational\nshopper', labelOutside: true, labelDir: 'below', labelGap: 14},
      {r: 18, label: 'Affluent\nconsumer', labelOutside: true, labelDir: 'above-right'},
      {r: 12, label: 'Conscious\nbuyer', labelDir: 'left', labelVOffset: -10},
      {r: 7, label: ''},
      {r: 5, label: ''},
    ],
    regs: [{name: 'No direct regulatory obligation', theme: null}],
  },
]

type PostZone = {id: PostId; label: string; y: number; size: number; regs: RegRef[]}
const POST_ZONES: PostZone[] = [
  {id: 'resale', label: 'Resale', y: 163, size: 36, regs: [{name: 'DPP follows garment', theme: 'transparency'}]},
  {id: 'repair', label: 'Repair &\nRental', y: 278, size: 26, regs: [{name: 'ESPR right to repair', theme: 'product'}]},
  {id: 'recycling', label: 'Recycling', y: 383, size: 20, regs: [
    {name: 'EU Textile EPR', theme: 'waste'},
    {name: 'CSRD Scope 3 Cat.12', theme: 'transparency'},
  ]},
  {id: 'disposal', label: 'Disposal', y: 478, size: 15, regs: [{name: 'EPR avoidance incentive', theme: 'waste'}]},
]

// ── Packing algorithm (verbatim from prototype lines 6163-6194) ───────────
type Packed = CircleSpec & {cx: number; cy: number}

function pack(circles: CircleSpec[]): Packed[] {
  const PAD = 11
  const H_LIM = SEG_W / 2 - 8
  const placed: Packed[] = []
  circles.forEach((c, i) => {
    if (i === 0) {
      placed.push({...c, cx: 0, cy: 0})
      return
    }
    let best: {cx: number; cy: number} | null = null
    let bestScore = Infinity
    for (let ai = 0; ai < 240; ai++) {
      const angle = (ai / 240) * 2 * Math.PI
      for (let di = 0; di < 7; di++) {
        const baseD = placed[0].r + c.r + PAD
        const d = baseD * (0.55 + di * 0.22)
        const cx = d * Math.cos(angle)
        const cy = d * Math.sin(angle)
        if (Math.abs(cx) + c.r > H_LIM) continue
        const ok = placed.every(
          (p) => Math.sqrt((cx - p.cx) ** 2 + (cy - p.cy) ** 2) >= p.r + c.r + PAD
        )
        if (!ok) continue
        let ap = 0
        placed.forEach((p) => {
          if (Math.abs(cx - p.cx) < 4) ap += 60
          if (Math.abs(cy - p.cy) < 4) ap += 30
        })
        const centX = placed.reduce((s, p) => s + p.cx, 0) / placed.length
        const centY = placed.reduce((s, p) => s + p.cy, 0) / placed.length
        const score =
          Math.sqrt((cx - centX) ** 2 + (cy - centY) ** 2) * 0.5 + ap + Math.abs(cy) * 0.15
        if (score < bestScore) {
          bestScore = score
          best = {cx, cy}
        }
      }
    }
    if (!best) {
      const topY = Math.min(...placed.map((p) => p.cy - p.r))
      best = {cx: (i % 3 - 1) * (c.r + 4), cy: topY - c.r - PAD}
    }
    placed.push({...c, cx: best.cx, cy: best.cy})
  })
  return placed
}

function centerPack(circles: CircleSpec[]): Packed[] {
  const placed = pack(circles)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  placed.forEach((c) => {
    minX = Math.min(minX, c.cx - c.r)
    maxX = Math.max(maxX, c.cx + c.r)
    minY = Math.min(minY, c.cy - c.r)
    maxY = Math.max(maxY, c.cy + c.r)
  })
  const offX = (minX + maxX) / 2
  const offY = (minY + maxY) / 2
  return placed.map((c) => ({...c, cx: c.cx - offX, cy: c.cy - offY}))
}

// Memoise layouts (deterministic, expensive)
const LAYOUTS: Record<ZoneId, Packed[]> = Object.fromEntries(
  ZONES.map((z) => [z.id, centerPack(z.circles)])
) as Record<ZoneId, Packed[]>

// ── Legend per layer (verbatim from prototype lines 6373-6390) ─────────────
type LegendItem = {color: string; label: string}
const LEGENDS: Record<Layer, LegendItem[]> = {
  physical: [{color: '#000000', label: 'Larger circle = greater volume of actors at that stage'}],
  value: [
    {color: '#EDE9FE', label: 'Low margin capture'},
    {color: '#8B5CF6', label: 'Moderate'},
    {color: '#5B21B6', label: 'Highest value capture'},
  ],
  regulatory: [
    {color: THEME.transparency, label: 'Transparency (CSRD · DPP · ESRS)'},
    {color: THEME.greenwashing, label: 'Greenwashing (ECGT)'},
    {color: THEME.supply, label: 'Supply chain (CSDDD · EUDR)'},
    {color: THEME.product, label: 'Product design (ESPR)'},
    {color: THEME.waste, label: 'Waste (EU Textile EPR · PPWR)'},
  ],
  scope: [
    {color: '#DC2626', label: 'Scope 3 Cat.1 upstream · Cat.12 disposal, the highest-impact stages'},
    {color: '#8B5CF6', label: 'Scope 1+2 + full Scope 3 reporting obligation (brands)'},
    {color: '#D97706', label: 'Scope 1+2 direct · Cat.11 use-phase · Cat.12 recycling'},
    {color: '#059669', label: 'Lower-impact end-of-life: reduces Cat.12 by extending garment life'},
  ],
}

// ── Layer descriptor for the toggle buttons ───────────────────────────────
export const LAYERS: {key: Layer; num: string; name: string; desc: string}[] = [
  {key: 'physical', num: 'Layer 01', name: 'Physical Flow', desc: 'Circle size shows relative actor volume at each stage of the chain'},
  {key: 'value', num: 'Layer 02', name: 'Value Capture', desc: 'Where margin is extracted and which actors absorb the cost of transition'},
  {key: 'regulatory', num: 'Layer 03', name: 'Regulatory Exposure', desc: 'Which EU instruments apply to each actor, and the obligations they carry'},
  {key: 'scope', num: 'Layer 04', name: 'Carbon Scope', desc: 'GHG responsibility by actor, Scope 1, 2, and 3 assignment across the chain'},
]

// ── Exposed types + helpers consumed by <ValueChainView /> ────────────────
export type NodeData = {_id: string; title: string; order: number; slug: string; shortBlurb?: string | null}
export type TooltipData = {x: number; y: number; text: string; color: string} | null

export function LegendsTable({layer}: {layer: Layer}) {
  return (
    <div className="lc-legend-wrap">
      {LEGENDS[layer].map((l, i) => (
        <div key={i} className="lc-legend-item">
          <span className="lc-legend-dot" style={{background: l.color}} />
          {l.label.toUpperCase()}
        </div>
      ))}
    </div>
  )
}

export function Tooltip({data}: {data: TooltipData}) {
  return (
    <div
      className={`pill-tooltip${data ? ' visible' : ''}`}
      style={
        data
          ? {
              left: data.x + 16,
              top: data.y - 14,
              borderLeft: `3px solid ${data.color}`,
              paddingLeft: '10px',
            }
          : undefined
      }
    >
      {data?.text ?? ''}
    </div>
  )
}

// Reusable inline style for any SVG element that should fade in alongside
// the staggered circle entrance. Uses `both` fill mode so the element stays
// invisible during the delay (backwards) and remains at opacity 1 once the
// animation ends (forwards). Default duration is 1.8s — slightly longer
// than the 2.6s circles so the dashed connectors feel like a subtle reveal
// rather than a competing event.
export function fadeStyle(
  animated: boolean,
  delayMs: number,
  durationS = 1.8
): React.CSSProperties {
  return {
    opacity: 0,
    animation: animated ? `lcNodeIn ${durationS}s ease ${delayMs}ms both` : undefined,
  }
}

export const DEFAULT_NODES: NodeData[] = [
  {_id: 'd-1', order: 1, slug: 'raw-materials', title: 'Raw Materials', shortBlurb: "Cotton, wool, and synthetic fibres. The chain's biggest environmental cost, the smallest direct regulatory footprint."},
  {_id: 'd-2', order: 2, slug: 'yarn-fabric', title: 'Yarn & Fabric', shortBlurb: 'Spinning, weaving, dyeing. Where raw fibre becomes usable material — and where water pollution concentrates.'},
  {_id: 'd-3', order: 3, slug: 'manufacturing', title: 'Manufacturing', shortBlurb: 'The cut-make-trim supply chain. Multi-tier, mostly subcontracted, most visibility gaps, most compliance risk.'},
  {_id: 'd-4', order: 4, slug: 'brands', title: 'Brands', shortBlurb: 'Where the product brief is set and the regulatory obligation lands. The highest-margin, highest-obligation node.'},
  {_id: 'd-5', order: 5, slug: 'retail', title: 'Logistics & Retail', shortBlurb: 'Physical and digital channels to the first buyer. DPP display requirements and EPR collection duties land here.'},
  {_id: 'd-6', order: 6, slug: 'consumer', title: 'Consumer', shortBlurb: 'The end-user: the only actor whose behaviour determines whether the sustainability logic of the chain closes.'},
  {_id: 'd-7', order: 7, slug: 'secondary-market', title: 'Secondary Market', shortBlurb: 'Resale, rental, repair. The fastest-growing segment by transaction volume, and the hardest to make profitable.'},
]

// ──────────────────────────────────────────────────────────────────────────
// SVG subtree — pure renderer, takes layer + animated flag + tooltip setter
// ──────────────────────────────────────────────────────────────────────────
export function SvgBody({
  layer,
  animated,
  onTip,
}: {
  layer: Layer
  animated: boolean
  onTip: (t: {x: number; y: number; text: string; color: string} | null) => void
}) {
  const POST_CX = SEG_CX(6)
  const p0 = POST_ZONES[0]
  const pL = POST_ZONES[POST_ZONES.length - 1]
  const showLoop = layer !== 'regulatory'

  return (
    <>
      <defs>
        <marker id="lc-arr-chain" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M2 2L10 6L2 10" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="lc-arr-loop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Segment tints */}
      {ZONES.map((z, i) => (
        <rect
          key={`tint-${z.id}`}
          x={z.seg * SEG_W}
          y={HEADER_H}
          width={SEG_W}
          height={SVG_H - HEADER_H}
          fill={SEG_TINT[i]}
        />
      ))}
      <rect x={6 * SEG_W} y={HEADER_H} width={SEG_W} height={SVG_H - HEADER_H} fill="rgba(0,0,0,0)" />
      {/* Vertical dividers between segments */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={`div-${i}`}
          x1={i * SEG_W}
          y1={0}
          x2={i * SEG_W}
          y2={SVG_H}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.5"
        />
      ))}

      {/* Chain line — fades in alongside zone 0 with a softer 1.8s duration
          so it reads as a guide rather than competing with the circles. */}
      <line
        x1={20}
        y1={CHAIN_Y}
        x2={SEG_W * 6 - 10}
        y2={CHAIN_Y}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.5"
        strokeDasharray="5 10"
        style={fadeStyle(animated, 0)}
      />

      {/* Connectors from consumer to each post zone — each one fades in with
          its matching post-zone, so the dashed lines arrive together with
          the circles they connect to. */}
      {POST_ZONES.map((n, pi) => (
        <line
          key={`pc-${n.id}`}
          x1={SEG_CX(5)}
          y1={CHAIN_Y}
          x2={POST_CX - n.size - 8}
          y2={n.y}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1.1"
          strokeDasharray="3 4"
          style={fadeStyle(animated, (ZONES.length + pi) * 520)}
        />
      ))}

      {/* Vertical guide between post zones — appears when the first post-zone
          (resale) starts animating in. */}
      <line
        x1={POST_CX}
        y1={p0.y - p0.size - 14}
        x2={POST_CX}
        y2={pL.y + pL.size + 14}
        stroke="rgba(0,0,0,0.10)"
        strokeWidth="0.7"
        strokeDasharray="2 5"
        style={fadeStyle(animated, ZONES.length * 520)}
      />

      {/* Closed-loop arrow (recycling back to raw materials) — appears last,
          after every post-zone has come in. Hidden on regulatory layer. */}
      {showLoop ? (
        <g style={fadeStyle(animated, (ZONES.length + POST_ZONES.length) * 520)}>
          <ClosedLoop />
        </g>
      ) : null}

      {/* Main zone circles */}
      {ZONES.map((z, zi) => (
        <ZoneGroup
          key={`zone-${z.id}`}
          zone={z}
          layer={layer}
          animated={animated}
          delayIdx={zi}
          onTip={onTip}
        />
      ))}

      {/* Post-consumer zones */}
      {POST_ZONES.map((p, pi) => (
        <PostZoneGroup
          key={`post-${p.id}`}
          post={p}
          layer={layer}
          animated={animated}
          delayIdx={ZONES.length + pi}
          onTip={onTip}
        />
      ))}
    </>
  )
}

function ClosedLoop() {
  // Reverted to the prototype's exact cubic-Bezier loop (prefall-prototype 1
  // line 6264). Two attempts to make this "more circular" both failed
  // visually, so we keep the original geometry verbatim.
  const POST_CX = SEG_CX(6)
  const pL = POST_ZONES[POST_ZONES.length - 1]
  const rc = POST_ZONES.find((n) => n.id === 'recycling')!
  const loopCtrlY = pL.y + pL.size + 60
  const lx = (POST_CX + SEG_CX(1)) / 2
  const ly = pL.y + pL.size + 50
  return (
    <>
      <path
        d={`M ${POST_CX} ${rc.y + rc.size + 4} C ${POST_CX - 80} ${loopCtrlY}, ${SEG_CX(1) + 80} ${loopCtrlY}, ${SEG_CX(1)} ${CHAIN_Y + 16}`}
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.2"
        strokeDasharray="6 5"
        markerEnd="url(#lc-arr-loop)"
      />
      <rect x={lx - 92} y={ly - 10} width={184} height={16} fill="rgba(240,240,238,0.88)" rx="2" />
      <text
        x={lx}
        y={ly}
        textAnchor="middle"
        fontFamily="'Figtree', sans-serif"
        fontSize="8"
        fill="rgba(0,0,0,0.60)"
        letterSpacing="0.06em"
      >
        CLOSED-LOOP TARGET · &lt;1% CURRENTLY
      </text>
    </>
  )
}

// ── ZoneGroup ─────────────────────────────────────────────────────────────
function ZoneGroup({
  zone,
  layer,
  animated,
  delayIdx,
  onTip,
}: {
  zone: Zone
  layer: Layer
  animated: boolean
  delayIdx: number
  onTip: (t: {x: number; y: number; text: string; color: string} | null) => void
}) {
  const fill = getFill(zone.id, layer, false)
  const circles = LAYOUTS[zone.id]
  const cx = SEG_CX(zone.seg)

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  circles.forEach((c) => {
    minX = Math.min(minX, c.cx - c.r)
    maxX = Math.max(maxX, c.cx + c.r)
    minY = Math.min(minY, c.cy - c.r)
    maxY = Math.max(maxY, c.cy + c.r)
  })

  // Match the prototype: every zone starts at opacity 0 and stays hidden
  // through both the 800ms idle phase and its own stagger delay. The animation
  // uses `both` fill mode so:
  //   • during the per-zone delay, the `from { opacity: 0 }` keyframe applies
  //     (backwards fill) → no premature flash
  //   • after the animation ends, the `to { opacity: 1 }` keyframe persists
  //     (forwards fill) → zone stays visible
  // Keeping `opacity: 0` inline is harmless because the running/finished
  // animation always overrides it via the cascade.
  const style: React.CSSProperties = {
    cursor: 'pointer',
    opacity: 0,
    animation: animated ? `lcNodeIn 2.6s ease ${delayIdx * 520}ms both` : undefined,
  }

  return (
    <g transform={`translate(${cx},${CHAIN_Y})`} style={style}>
      {circles.map((c, i) => (
        <CircleWithLabel key={i} c={LAYOUTS[zone.id][i]} fill={fill} />
      ))}

      {layer === 'regulatory'
        ? renderRegPills(zone, minX, maxX, minY, maxY, onTip)
        : null}
    </g>
  )
}

function CircleWithLabel({c, fill}: {c: Packed; fill: string}) {
  const lls = c.label ? c.label.split('\n') : []
  const hasInsideLabel = !c.labelOutside && c.r >= 18 && lls.length > 0 && !!lls[0]
  return (
    <>
      <circle cx={c.cx} cy={c.cy} r={c.r + 10} fill={fill} fillOpacity="0.12" />
      <circle cx={c.cx} cy={c.cy} r={c.r} fill="#ffffff" fillOpacity="1" />
      <circle
        cx={c.cx}
        cy={c.cy}
        r={c.r}
        fill={fill}
        fillOpacity="0.70"
        stroke={fill}
        strokeOpacity="0.92"
        strokeWidth="1.8"
      />
      {hasInsideLabel ? <InsideLabel c={c} /> : null}
      {!hasInsideLabel && lls.length > 0 && !!lls[0] ? <OutsideLabel c={c} /> : null}
    </>
  )
}

function InsideLabel({c}: {c: Packed}) {
  const lls = c.label.split('\n')
  const LLH = 12
  const blockH = lls.length * LLH
  return (
    <text
      x={c.cx}
      y={c.cy}
      textAnchor="middle"
      fontFamily="'Figtree', sans-serif"
      fontSize="11"
      fontWeight="600"
      fill="#ffffff"
      style={{pointerEvents: 'none'}}
    >
      {lls.map((ln, li) => (
        <tspan key={li} x={c.cx} dy={li === 0 ? `${-(blockH / 2 - LLH * 0.72)}px` : `${LLH}px`}>
          {ln}
        </tspan>
      ))}
    </text>
  )
}

function OutsideLabel({c}: {c: Packed}) {
  const lls = c.label.split('\n')
  const LLH = 10
  const blockH = lls.length * LLH
  const GAP = c.labelGap !== undefined ? c.labelGap : 7
  const segHalf = SEG_W / 2
  const dir = c.labelDir || 'auto'
  let lx = c.cx
  let ly: number = c.cy
  let anchor: 'start' | 'middle' | 'end' = 'middle'
  if (dir === 'above') {
    ly = c.cy - c.r - GAP - blockH + LLH * 0.8
  } else if (dir === 'above-right') {
    lx = c.cx + c.r * 0.7 + GAP
    ly = c.cy - c.r * 0.7 - GAP - blockH + LLH * 0.8
    anchor = 'start'
  } else if (dir === 'below') {
    ly = c.cy + c.r + GAP + LLH * 0.5
  } else if (dir === 'left') {
    lx = c.cx - c.r - GAP
    ly = c.cy
    anchor = 'end'
  } else if (dir === 'right') {
    lx = c.cx + c.r + GAP
    ly = c.cy
    anchor = 'start'
  } else {
    const lW = Math.max(...lls.map((l) => l.length)) * 5.2
    const goLeft = c.cx + c.r + GAP + lW > segHalf + 4
    lx = goLeft ? c.cx - c.r - GAP : c.cx + c.r + GAP
    ly = c.cy
    anchor = goLeft ? 'end' : 'start'
  }
  if (c.labelVOffset) ly += c.labelVOffset

  return (
    <text
      x={lx}
      y={ly}
      textAnchor={anchor}
      fontFamily="'Figtree', sans-serif"
      fontSize="10"
      fontWeight="400"
      fill="#6B6B6B"
      letterSpacing="0.01em"
      style={{pointerEvents: 'none'}}
    >
      {lls.map((ln, li) => (
        <tspan key={li} x={lx} dy={li === 0 ? `${-(blockH / 2 - LLH * 0.72)}px` : `${LLH}px`}>
          {ln}
        </tspan>
      ))}
    </text>
  )
}

// ── Regulation pills ──────────────────────────────────────────────────────
const PILL_W = 158
const PILL_H = 20
const PILL_GAP = 24

function renderRegPills(
  zone: Zone,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  onTip: (t: {x: number; y: number; text: string; color: string} | null) => void
) {
  const pillCX = (minX + maxX) / 2
  if (zone.id === 'brands') {
    const aboveCount = 3
    return zone.regs.map((reg, ri) => {
      const py =
        ri < aboveCount
          ? minY - 28 - PILL_GAP - (aboveCount - 1 - ri) * PILL_GAP
          : maxY + 28 + (ri - aboveCount) * PILL_GAP
      return <RegPill key={ri} reg={reg} cx={pillCX} cy={py} idx={ri} parentId={zone.id} onTip={onTip} />
    })
  }
  const extraGap = zone.id === 'consumer' ? 55 : 0
  return zone.regs.map((reg, ri) => {
    const py = maxY + 28 + extraGap + ri * PILL_GAP
    return <RegPill key={ri} reg={reg} cx={pillCX} cy={py} idx={ri} parentId={zone.id} onTip={onTip} />
  })
}

function RegPill({
  reg,
  cx,
  cy,
  idx,
  parentId,
  onTip,
}: {
  reg: RegRef
  cx: number
  cy: number
  idx: number
  parentId: string
  onTip: (t: {x: number; y: number; text: string; color: string} | null) => void
}) {
  const col = reg.theme ? THEME[reg.theme] : 'rgba(0,0,0,0.30)'
  const rawFs = Math.min(8.5, (PILL_W - 24) / (reg.name.length * 1.95))
  const fontSz = Math.max(6.5, rawFs).toFixed(1)
  const clipId = `pc-${parentId}-${idx}`

  function show(e: React.MouseEvent) {
    onTip({x: e.clientX, y: e.clientY, text: reg.name, color: col})
  }
  function move(e: React.MouseEvent) {
    onTip({x: e.clientX, y: e.clientY, text: reg.name, color: col})
  }
  function hide() {
    onTip(null)
  }

  return (
    <g transform={`translate(${cx},${cy})`} style={{cursor: 'pointer'}}>
      <defs>
        <clipPath id={clipId}>
          <rect x={-(PILL_W / 2) + 6} y={-(PILL_H / 2)} width={PILL_W - 12} height={PILL_H} />
        </clipPath>
      </defs>
      <rect
        x={-(PILL_W / 2)}
        y={-(PILL_H / 2)}
        width={PILL_W}
        height={PILL_H}
        rx="3"
        fill={col}
        fillOpacity="0.18"
        stroke={col}
        strokeOpacity="0.60"
        strokeWidth="0.7"
        onMouseEnter={show}
        onMouseMove={move}
        onMouseLeave={hide}
      />
      <text
        x="0"
        y="4.5"
        textAnchor="middle"
        fontFamily="'Figtree', sans-serif"
        fontSize={fontSz}
        fontWeight="400"
        fill={col}
        letterSpacing="0.01em"
        clipPath={`url(#${clipId})`}
        style={{pointerEvents: 'none'}}
      >
        {reg.name.toUpperCase()}
      </text>
    </g>
  )
}

// ── PostZoneGroup ─────────────────────────────────────────────────────────
function PostZoneGroup({
  post,
  layer,
  animated,
  delayIdx,
  onTip,
}: {
  post: PostZone
  layer: Layer
  animated: boolean
  delayIdx: number
  onTip: (t: {x: number; y: number; text: string; color: string} | null) => void
}) {
  const POST_CX = SEG_CX(6)
  const nr = post.size
  const fill = getFill(post.id, layer, true)
  // Match the prototype: every zone starts at opacity 0 and stays hidden
  // through both the 800ms idle phase and its own stagger delay. The animation
  // uses `both` fill mode so:
  //   • during the per-zone delay, the `from { opacity: 0 }` keyframe applies
  //     (backwards fill) → no premature flash
  //   • after the animation ends, the `to { opacity: 1 }` keyframe persists
  //     (forwards fill) → zone stays visible
  // Keeping `opacity: 0` inline is harmless because the running/finished
  // animation always overrides it via the cascade.
  const style: React.CSSProperties = {
    cursor: 'pointer',
    opacity: 0,
    animation: animated ? `lcNodeIn 2.6s ease ${delayIdx * 520}ms both` : undefined,
  }

  return (
    <g style={style}>
      <circle cx={POST_CX} cy={post.y} r={nr + 10} fill={fill} fillOpacity="0.12" />
      <circle cx={POST_CX} cy={post.y} r={nr} fill="#ffffff" fillOpacity="1" />
      <circle
        cx={POST_CX}
        cy={post.y}
        r={nr}
        fill={fill}
        fillOpacity={layer === 'physical' ? '0.55' : '0.70'}
        stroke={fill}
        strokeOpacity="0.92"
        strokeWidth="1.8"
      />
      <text
        x={POST_CX + nr + 11}
        y={post.y + 4}
        fontFamily="'Figtree', sans-serif"
        fontSize="10"
        fontWeight="400"
        fill="#6B6B6B"
        letterSpacing="0.01em"
      >
        {post.label.split('\n').map((ln, li) => (
          <tspan key={li} x={POST_CX + nr + 11} dy={li === 0 ? '0' : '12px'}>
            {ln}
          </tspan>
        ))}
      </text>

      {layer === 'regulatory'
        ? post.regs.map((reg, ri) => {
            const py = post.y + nr + 22 + ri * 22
            return (
              <RegPill
                key={ri}
                reg={reg}
                cx={POST_CX}
                cy={py}
                idx={ri}
                parentId={`post-${post.id}`}
                onTip={onTip}
              />
            )
          })
        : null}
    </g>
  )
}
