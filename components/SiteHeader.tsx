'use client'

/**
 * Site header — ported from prefall-prototype 1.html lines 2626-2655.
 * Class names preserved exactly: site-header, site-header__inner, site-logo,
 * site-nav, site-nav__link, site-header__menu-btn, hamburger__line, mobile-nav,
 * mobile-nav__link.
 * Hamburger toggle managed via local state. Mobile nav appears below header at
 * <=768px (CSS handles the @media query).
 */
import Link from 'next/link'
import {useState, useEffect} from 'react'
import {primaryNav, routes} from '@/lib/routes'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  // Close drawer on route change is implicit (Link triggers re-render)
  // Also close on resize-to-desktop or Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header__inner">
          <Link
            href={routes.home}
            className="site-logo"
            aria-label="Prefall home"
            onClick={() => setOpen(false)}
          >
            PREFALL
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className="site-header__menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            type="button"
          >
            <span className="hamburger__line" />
            <span className="hamburger__line" />
            <span className="hamburger__line" />
          </button>
        </div>
      </header>

      <nav
        className={`mobile-nav${open ? ' is-open' : ''}`}
        id="mobile-nav"
        aria-label="Mobile navigation"
      >
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mobile-nav__link"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
