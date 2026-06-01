'use client'

/**
 * Regulation cartography tracker — ported 1:1 from prefall-prototype 1.html
 * lines 6671-6929.
 *
 * Themes (not statuses) drive both filter pills and cell colours. The
 * prototype's tracker data is intentionally baked in: it's editorial
 * visualisation data tightly coupled to the chosen palette and to the
 * specific instruments/dates being illustrated. Regulation prose (summary,
 * body, sources, etc.) remains editable in Sanity on the detail pages — the
 * tracker is the curated overview.
 *
 * Cell modes:
 *   • active     — instrument exists that year, no specific event
 *   • event      — single dated milestone (e.g. stalled proposal)
 *   • enforcement— hard compliance deadline
 *   • omnibus    — 2026-only hatched overlay on CSRD / CSDDD
 */
import {useEffect, useMemo, useRef, useState} from 'react'

// Theme colours, copied verbatim from prototype line 6673.
const TC: Record<string, string> = {
  Transparency: '#8B5CF6',
  Greenwashing: '#0891B2',
  'Supply chain': '#D97706',
  'Product design': '#059669',
  Waste: '#DC2626',
}
const THEMES = Object.keys(TC)
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
const OMNIBUS_AFFECTED = ['CSRD', 'CSDDD']
const CURRENT_YEAR = 2026

type Instrument = {
  name: string
  theme: keyof typeof TC | string
  active: number[]
  enforceYear: number | null
  enforceLabel: string | null
  eventYear: number | null
  eventLabel: string | null
}

// Verbatim from prototype lines 6678-6693.
const INSTRUMENTS: Instrument[] = [
  {name: 'CSRD', theme: 'Transparency', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2028, enforceLabel: '2028: first mandatory reports due (FY2027)', eventYear: null, eventLabel: null},
  {name: 'ESRS', theme: 'Transparency', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: null, enforceLabel: null, eventYear: 2026, eventLabel: 'September 2026: Commission adopts simplified standards'},
  {name: 'DPP', theme: 'Transparency', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2028, enforceLabel: 'mid-2028: enforcement begins', eventYear: null, eventLabel: null},
  {name: 'Textile label', theme: 'Transparency', active: [2024, 2025, 2026, 2027, 2028, 2029], enforceYear: null, enforceLabel: null, eventYear: 2024, eventLabel: '2024: proposal stalled, indefinitely delayed'},
  {name: 'France score', theme: 'Transparency', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: null, enforceLabel: null, eventYear: 2026, eventLabel: 'October 2026: third-party publication right begins'},
  {name: 'ECGT', theme: 'Greenwashing', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2026, enforceLabel: '27 September 2026: green claims must be substantiated', eventYear: null, eventLabel: null},
  {name: 'Green Claims', theme: 'Greenwashing', active: [2024, 2025], enforceYear: null, enforceLabel: null, eventYear: 2025, eventLabel: 'June 2025: legislative process suspended'},
  {name: 'CSDDD', theme: 'Supply chain', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2029, enforceLabel: '26 July 2029: compliance begins', eventYear: null, eventLabel: null},
  {name: 'EUDR', theme: 'Supply chain', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2026, enforceLabel: '30 December 2026: large operators', eventYear: null, eventLabel: null},
  {name: 'ESPR', theme: 'Product design', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2026, enforceLabel: '19 July 2026: unsold goods ban (large companies)', eventYear: null, eventLabel: null},
  {name: 'Italy bill', theme: 'Product design', active: [2025, 2026, 2027, 2028], enforceYear: null, enforceLabel: null, eventYear: 2025, eventLabel: 'October 2025: introduced to Senate, under review'},
  {name: 'Textile EPR', theme: 'Waste', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2028, enforceLabel: '17 April 2028: national EPR schemes required', eventYear: null, eventLabel: null},
  {name: 'PPWR', theme: 'Waste', active: [2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2026, enforceLabel: '12 August 2026: packaging requirements apply', eventYear: null, eventLabel: null},
  {name: 'CA SB 707', theme: 'Waste', active: [2024, 2025, 2026, 2027, 2028, 2029, 2030], enforceYear: 2026, enforceLabel: 'July 2026: producer registration deadline', eventYear: null, eventLabel: null},
]

// Verbatim from prototype lines 6695-6699.
const COUNTDOWNS = [
  {name: 'ESPR', theme: 'Product design', desc: 'Unsold goods destruction ban', date: new Date('2026-07-19'), color: TC['Product design']},
  {name: 'DPP', theme: 'Transparency', desc: 'Delegated act 2027 · Enforcement mid-2028', date: new Date('2028-06-01'), color: TC['Transparency']},
  {name: 'CSRD', theme: 'Transparency', desc: 'First mandatory reports due', date: new Date('2028-01-01'), color: TC['Transparency']},
]

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

function getDiff(t: Date) {
  const ms = t.getTime() - Date.now()
  if (ms <= 0) return {d: 0, h: 0, m: 0}
  return {
    d: Math.floor(ms / 864e5),
    h: Math.floor((ms % 864e5) / 36e5),
    m: Math.floor((ms % 36e5) / 6e4),
  }
}

type Props = {
  title?: string | null
  subtitle?: string | null
  ctaLabel?: string | null
  ctaSubLabel?: string | null
  // (Legacy props retained so the page-level call site doesn't need to change;
  // the tracker no longer consumes Sanity data.)
  regulations?: unknown
  statuses?: unknown
}

export function RegulationTracker({title}: Props) {
  const [active, setActive] = useState<string>('all')

  const filteredInstruments = useMemo(
    () => (active === 'all' ? INSTRUMENTS : INSTRUMENTS.filter((i) => i.theme === active)),
    [active]
  )
  const visibleThemes = active === 'all' ? THEMES : [active]

  // Build rows once per filter change.
  const rows: {theme: string; inst: Instrument; isSpacerAfter: boolean}[] = []
  visibleThemes.forEach((theme, ti) => {
    filteredInstruments
      .filter((i) => i.theme === theme)
      .forEach((inst, idx, arr) => {
        const lastInTheme = idx === arr.length - 1
        rows.push({
          theme,
          inst,
          isSpacerAfter: lastInTheme && active === 'all' && ti < THEMES.length - 1,
        })
      })
  })

  return (
    <div className="ca">
      <div className="ca-head stagger-item" style={{transitionDelay: '0s'}}>
        <div className="ca-eye">
          {title ?? 'Regulatory Cartography'} · Updated{' '}
          {new Date().toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}
        </div>
      </div>

      {/* Filter pills */}
      <div className="ca-filter stagger-item" style={{transitionDelay: '0.10s'}}>
        <PillButton
          id="all"
          label="All themes"
          color="#282828"
          active={active === 'all'}
          onClick={() => setActive('all')}
        />
        {THEMES.map((t) => (
          <PillButton
            key={t}
            id={t}
            label={t}
            color={TC[t]}
            active={active === t}
            onClick={() => setActive(t)}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="ca-grid-wrap stagger-item" style={{transitionDelay: '0.20s'}}>
        <div className="ca-grid-label">Hover enforcement and event cells for details</div>
        <Grid rows={rows} active={active} />
      </div>

      {/* Legend */}
      <div className="ca-legend stagger-item" style={{transitionDelay: '0.30s'}}>
        <LegendItem
          label="Active period"
          style={{
            background: 'rgba(168,121,255,0.10)',
            border: '1px solid rgba(168,121,255,0.18)',
          }}
        />
        <LegendItem
          label="Key event"
          style={{
            background: 'rgba(168,121,255,0.38)',
            border: '1px solid rgba(168,121,255,0.50)',
          }}
        />
        <LegendItem
          label="Enforcement year"
          style={{
            background: 'rgba(168,121,255,0.75)',
            border: '1px solid rgba(168,121,255,0.90)',
          }}
        />
        <LegendItem
          label="Omnibus amendment"
          style={{
            background: 'rgba(168,121,255,0.10)',
            border: '1px solid rgba(168,121,255,0.18)',
            backgroundImage:
              'repeating-linear-gradient(45deg,rgba(255,255,255,0.08) 0px,rgba(255,255,255,0.08) 1px,transparent 1px,transparent 5px)',
          }}
        />
        <LegendItem
          label="Not tracked"
          style={{
            background: 'rgba(0,0,0,0.03)',
            border: '0.5px solid rgba(0,0,0,0.07)',
          }}
        />
      </div>

      {/* Countdowns */}
      <Countdowns />
    </div>
  )
}

function PillButton({
  id,
  label,
  color,
  active,
  onClick,
}: {
  id: string
  label: string
  color: string
  active: boolean
  onClick: () => void
}) {
  // Match prototype: left border always coloured; active state inverts to
  // filled background + white text.
  const style: React.CSSProperties = {
    borderLeftColor: color,
  }
  if (active) {
    style.background = id === 'all' ? '#282828' : color
    style.borderColor = id === 'all' ? '#282828' : color
    style.color = '#ffffff'
  }
  return (
    <button
      type="button"
      className={`ca-pill${active ? ' on' : ''}`}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function Grid({
  rows,
  active,
}: {
  rows: {theme: string; inst: Instrument; isSpacerAfter: boolean}[]
  active: string
}) {
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Year-by-year reveal animation, matches prototype caAnimate().
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cells = grid.querySelectorAll<HTMLElement>('.ca-cell:not(.inactive)')
    cells.forEach((cell) => {
      const c = cell.dataset.color
      if (!c) return
      cell.dataset.finalBg = cell.style.background
      cell.dataset.finalBorder = cell.style.border
      cell.style.background = hexToRgba(c, 0.06)
      cell.style.border = '1px solid ' + hexToRgba(c, 0.12)
    })
    const timeouts: number[] = []
    YEARS.forEach((y, yi) => {
      const id = window.setTimeout(() => {
        grid.querySelectorAll<HTMLElement>(`.ca-cell[data-year="${y}"]:not(.inactive)`).forEach((cell) => {
          cell.style.transition = 'background 0.5s ease, border-color 0.5s ease'
          cell.style.background = cell.dataset.finalBg || ''
          cell.style.border = cell.dataset.finalBorder || ''
        })
      }, 400 + yi * 220)
      timeouts.push(id)
    })
    return () => timeouts.forEach((id) => window.clearTimeout(id))
  }, [active])

  // Mobile: tap to toggle tooltip (delegated, matches prototype).
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth > 768) return
    const grid = gridRef.current
    if (!grid) return
    function onGridClick(e: MouseEvent) {
      e.stopPropagation()
      const target = e.target as HTMLElement
      const cell = target.closest('.ca-cell.hoverable') as HTMLElement | null
      const tip = cell?.querySelector('.ca-tooltip') as HTMLElement | null
      const was = tip?.classList.contains('visible') ?? false
      document.querySelectorAll('.ca-tooltip.visible').forEach((t) => t.classList.remove('visible'))
      if (!tip || was) return
      tip.style.left = '50%'
      tip.style.right = 'auto'
      tip.style.transform = 'translateX(-50%)'
      tip.classList.add('visible')
    }
    function onDocClick() {
      document.querySelectorAll('.ca-tooltip.visible').forEach((t) => t.classList.remove('visible'))
    }
    grid.addEventListener('click', onGridClick)
    document.addEventListener('click', onDocClick)
    return () => {
      grid.removeEventListener('click', onGridClick)
      document.removeEventListener('click', onDocClick)
    }
  }, [active])

  return (
    <div className="ca-grid" ref={gridRef}>
      {/* Spacer cell + year headers */}
      <div />
      {YEARS.map((y) => (
        <div key={y} className={`ca-yr${y === CURRENT_YEAR ? ' now' : ''}`}>
          {y}
        </div>
      ))}

      {/* Rows */}
      {rows.map(({theme, inst, isSpacerAfter}, ri) => {
        const color = TC[theme]
        return (
          <RowFragment
            key={`${theme}-${inst.name}-${ri}`}
            inst={inst}
            color={color}
            spacerAfter={isSpacerAfter}
          />
        )
      })}
    </div>
  )
}

function RowFragment({
  inst,
  color,
  spacerAfter,
}: {
  inst: Instrument
  color: string
  spacerAfter: boolean
}) {
  return (
    <>
      <div className="ca-row-label">{inst.name}</div>
      {YEARS.map((y) => (
        <Cell key={y} inst={inst} year={y} color={color} />
      ))}
      {spacerAfter ? <div style={{gridColumn: '1/-1', height: '4px'}} /> : null}
    </>
  )
}

function Cell({inst, year, color}: {inst: Instrument; year: number; color: string}) {
  const isActive = inst.active.includes(year)
  if (!isActive) return <div className="ca-cell inactive" data-year={year} />

  const isEnforce = inst.enforceYear === year
  const isEvent = inst.eventYear === year
  const isOmnibus =
    OMNIBUS_AFFECTED.includes(inst.name) && year === 2026 && !isEnforce && !isEvent

  if (isEnforce) {
    return (
      <div
        className="ca-cell hoverable"
        data-year={year}
        data-color={color}
        style={{
          background: hexToRgba(color, 0.75),
          border: `1px solid ${hexToRgba(color, 0.9)}`,
        }}
      >
        <div className="ca-tooltip">
          <div className="ca-tooltip-name" style={{color}}>
            {inst.name}
          </div>
          <div className="ca-tooltip-date">{inst.enforceLabel}</div>
        </div>
      </div>
    )
  }
  if (isEvent) {
    return (
      <div
        className="ca-cell hoverable"
        data-year={year}
        data-color={color}
        style={{
          background: hexToRgba(color, 0.38),
          border: `1px solid ${hexToRgba(color, 0.5)}`,
        }}
      >
        <div className="ca-tooltip">
          <div className="ca-tooltip-name" style={{color}}>
            {inst.name}
          </div>
          <div className="ca-tooltip-date">{inst.eventLabel}</div>
        </div>
      </div>
    )
  }
  if (isOmnibus) {
    return (
      <div
        className="ca-cell hoverable"
        data-year={year}
        data-color={color}
        style={{
          background: hexToRgba(color, 0.1),
          border: `1px solid ${hexToRgba(color, 0.18)}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            background:
              'repeating-linear-gradient(45deg,rgba(255,255,255,0.07) 0px,rgba(255,255,255,0.07) 1px,transparent 1px,transparent 5px)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="ca-tooltip"
          style={{whiteSpace: 'normal', maxWidth: '240px'}}
        >
          <div className="ca-tooltip-name" style={{color: '#9CA3AF'}}>
            EU Omnibus I
          </div>
          <div className="ca-tooltip-date">
            18 March 2026: scope of CSRD and CSDDD significantly reduced.
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      className="ca-cell"
      data-year={year}
      data-color={color}
      style={{
        background: hexToRgba(color, 0.1),
        border: `1px solid ${hexToRgba(color, 0.18)}`,
      }}
    />
  )
}

function LegendItem({label, style}: {label: string; style: React.CSSProperties}) {
  return (
    <div className="ca-leg">
      <div className="ca-leg-sq" style={style} />
      {label}
    </div>
  )
}

function Countdowns() {
  // Tick once a minute so the displayed days/hours/minutes stay current.
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="ca-countdowns">
      {COUNTDOWNS.map((item, i) => {
        const diff = getDiff(item.date)
        return (
          <div
            key={item.name}
            className="ca-cd stagger-item"
            style={{transitionDelay: `${i * 0.15}s`}}
          >
            <div className="ca-cd-bar" style={{width: '100%', background: item.color}} />
            <div className="ca-cd-name">{item.name}</div>
            <div className="ca-cd-theme">{item.theme}</div>
            <div className="ca-cd-desc">{item.desc}</div>
            <div className="ca-cd-timer">
              <div className="ca-cd-unit">
                <span className="ca-cd-val" style={{color: item.color}}>
                  {diff.d}
                </span>
                <span className="ca-cd-lbl">days</span>
              </div>
              <div className="ca-cd-sep">:</div>
              <div className="ca-cd-unit">
                <span className="ca-cd-val" style={{color: item.color}}>
                  {String(diff.h).padStart(2, '0')}
                </span>
                <span className="ca-cd-lbl">hrs</span>
              </div>
              <div className="ca-cd-sep">:</div>
              <div className="ca-cd-unit">
                <span className="ca-cd-val" style={{color: item.color}}>
                  {String(diff.m).padStart(2, '0')}
                </span>
                <span className="ca-cd-lbl">min</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
