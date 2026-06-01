import {urlFor} from '@/sanity/lib/image'

/**
 * Full-width image strip — ported from prefall-prototype 1.html lines 2766-2769.
 */
type Props = {
  image?: any
}

export function HomeFullWidthImage({image}: Props) {
  if (!image) {
    // Render a neutral placeholder strip so the layout breaks are preserved.
    return (
      <div className="home-fullwidth-img" aria-hidden="true">
        <div
          style={{
            width: '100%',
            height: 'clamp(320px, 45vw, 640px)',
            background: '#E8E8E8',
          }}
        />
      </div>
    )
  }
  return (
    <div className="home-fullwidth-img">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urlFor(image).width(2400).url()}
        alt={image.alt ?? ''}
      />
    </div>
  )
}
