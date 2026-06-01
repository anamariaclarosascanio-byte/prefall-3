'use client'

/**
 * Sidebar section — collapsible on mobile (≤768px), always open on desktop.
 * Ported from prefall-prototype 1.html lines 3196-3214.
 *
 * On desktop the trigger is non-interactive (cursor:default per the prototype
 * CSS), and the panel is always rendered. On mobile clicking the trigger
 * toggles the panel via .is-open class.
 */
import {useState} from 'react'

type Props = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function DetailSidebarSection({title, children, defaultOpen = true}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="detail-sidebar__section">
      <button
        type="button"
        className={`detail-sidebar__trigger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {title}
        <span className="detail-sidebar__icon">+</span>
      </button>
      <div className={`detail-sidebar__panel${open ? ' is-open' : ''}`}>
        {children}
      </div>
    </div>
  )
}
