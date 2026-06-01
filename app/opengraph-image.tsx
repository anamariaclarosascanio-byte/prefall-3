/**
 * Default Open Graph image — generated at build time by Next.js.
 * Renders a branded 1200x630 PNG that's used as the fallback OG image for
 * any page that doesn't supply its own (regulation pages, static pages,
 * and so on). Articles and companies override this with their own image.
 *
 * Why a generated image instead of a static one: keeps the visual in sync
 * with the brand without us managing a Photoshop file. Style mirrors the
 * site's hero — large editorial wordmark, restrained palette, single line
 * of copy.
 */
import {ImageResponse} from 'next/og'

export const runtime = 'edge'
export const alt = 'Prefall — editorial intelligence on the business of fashion'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          background: '#FAF8F4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#1a1a1a',
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#6b6b6b',
          }}
        >
          PREFALL
        </div>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            fontWeight: 400,
            maxWidth: 1000,
          }}
        >
          The business behind the next season of fashion.
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#6b6b6b',
          }}
        >
          <span>Editorial intelligence on sustainable fashion economics</span>
          <span>pre-fall.com</span>
        </div>
      </div>
    ),
    {...size}
  )
}
