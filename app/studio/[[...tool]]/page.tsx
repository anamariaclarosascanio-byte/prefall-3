'use client'

/**
 * Sanity Studio mounted at /studio.
 * Renders Sanity v3 Studio inside the Next.js app.
 * Must be a Client Component — Studio uses React context internally.
 */
import {NextStudio} from 'next-sanity/studio'
import config from '../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
