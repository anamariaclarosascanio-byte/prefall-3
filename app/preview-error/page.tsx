'use client'

/**
 * TEMPORARY preview route — visit /preview-error to see the global
 * error.tsx (500) page. We throw inside useEffect so the render
 * succeeds first (the server returns valid HTML), then on the client
 * the effect runs and triggers the boundary. This is the most
 * reliable way to invoke error.tsx visually in production.
 *
 * Remove once previewed.
 */
import {useEffect, useState} from 'react'

export default function PreviewErrorPage() {
  const [trigger, setTrigger] = useState(false)
  useEffect(() => {
    // Schedule the throw on the next microtask so React mounts the
    // component first, then re-renders with `trigger=true` which
    // synchronously throws inside the boundary.
    setTrigger(true)
  }, [])
  if (trigger) {
    throw new Error('Preview: intentional error to display the 500 page')
  }
  return (
    <p style={{padding: 80, fontFamily: 'system-ui'}}>Triggering 500…</p>
  )
}
