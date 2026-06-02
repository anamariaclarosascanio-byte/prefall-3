/**
 * Route-specific OG image for /jobs. Replaces the generic site-wide
 * Open Graph image with a "job board" creative so social shares land
 * with a contextual preview instead of the homepage hero.
 *
 * Also doubles as a re-usable announcement asset: when Ana posts on
 * LinkedIn / Substack about new jobs, she can download this PNG from
 * https://pre-fall.com/jobs/opengraph-image to attach as the post card.
 *
 * Style: matches the brand chrome — off-white surface (#FEFEFD), ink
 * dark text (#282828), purple accent (#8B5CF6), large editorial type.
 */
import {ImageResponse} from 'next/og'

export const runtime = 'edge'
export const alt = 'Prefall — open sustainability roles in fashion'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          background: '#FEFEFD',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#282828',
          position: 'relative',
        }}
      >
        {/* Top bar — wordmark + eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#6b6b6b',
          }}
        >
          <span style={{color: '#282828', letterSpacing: '0.4em'}}>PREFALL</span>
          <span>Job board · Updated weekly</span>
        </div>

        {/* Headline — vertically centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            gap: 28,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8B5CF6',
              fontWeight: 600,
            }}
          >
            ↗ Now hiring
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              fontWeight: 400,
            }}
          >
            Sustainability roles
            <br />
            in fashion.
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: 'rgba(0,0,0,0.62)',
              maxWidth: 820,
              fontWeight: 400,
            }}
          >
            Curated openings at the brands and houses shaping the
            <br />
            next season — ESG, regulation, circularity, supply chain.
          </div>
        </div>

        {/* Bottom — accent bar + URL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#6b6b6b',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div
              style={{
                width: 64,
                height: 2,
                background: '#8B5CF6',
              }}
            />
            <span>Editorial intelligence on sustainable fashion</span>
          </div>
          <span style={{fontWeight: 600, color: '#282828'}}>pre-fall.com/jobs</span>
        </div>
      </div>
    ),
    {...size}
  )
}
