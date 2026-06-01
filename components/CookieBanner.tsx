'use client'

/**
 * Cookie banner — ported from prefall-prototype 1.html lines 5372-5378.
 * Class names preserved exactly: cookie-banner, cookie-banner__text,
 * cookie-banner__btns, cookie-btn, cookie-btn--fill, cookie-btn--outline,
 * is-hidden.
 *
 * Dismiss state persisted in localStorage so the banner doesn't reappear on
 * subsequent visits. Per the privacy default in user prefs, the recommended
 * choice is "Essential only".
 */
import {useEffect, useState} from 'react'

const STORAGE_KEY = 'prefall:cookie-dismissed'

export function CookieBanner() {
  // Start hidden until we know from localStorage whether to show it. Avoids
  // flashing the banner for returning visitors.
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY)
      if (!dismissed) setVisible(true)
    } catch {
      // localStorage blocked (private mode, etc.) — show the banner anyway.
      setVisible(true)
    }
  }, [])

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!mounted) return null

  return (
    <div
      className={`cookie-banner${visible ? '' : ' is-hidden'}`}
      id="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-hidden={!visible}
    >
      <p className="cookie-banner__text">
        Prefall uses essential cookies to operate the site and optional analytics
        cookies to understand how the platform is used. We do not run advertising
        trackers.
      </p>
      <div className="cookie-banner__btns">
        <button
          type="button"
          className="cookie-btn cookie-btn--fill"
          onClick={dismiss}
        >
          Accept analytics
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn--outline"
          onClick={dismiss}
        >
          Essential only
        </button>
      </div>
    </div>
  )
}
