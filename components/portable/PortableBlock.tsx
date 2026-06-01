import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'
import {HtmlEmbed} from './HtmlEmbed'

/**
 * Renderer for block content (article body, company sections, regulation
 * bodies, prose pages, About sections). Maps Sanity block styles to the
 * prototype's prose classes.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="detail-body__prose">{children}</p>,
    h2: ({children}) => <h2 className="article-page__h2">{children}</h2>,
    h3: ({children}) => <h3 className="detail-body__h2">{children}</h3>,
    lead: ({children}) => <p className="article-page__lead">{children}</p>,
    blockquote: ({children}) => (
      <blockquote className="article-page__pullquote">{children}</blockquote>
    ),
  },
  marks: {
    link: ({value, children}) => {
      const href = value?.href ?? '#'
      const blank = value?.blank
      return (
        <a
          href={href}
          className="link-u"
          {...(blank ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    figure: ({value}) => (
      <figure className="article-page__figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlFor(value).width(1200).url()}
          alt={value?.alt ?? ''}
        />
        {value?.caption ? <figcaption>{value.caption}</figcaption> : null}
      </figure>
    ),
    htmlEmbed: ({value}) => {
      // Editor-pasted HTML (charts, iframes, custom visualisations). The
      // <HtmlEmbed> wrapper re-executes any <script> tags inside on mount
      // and on each client-side navigation, so chart libraries render on
      // first nav (not only after a hard reload).
      if (!value?.code) return null
      return <HtmlEmbed code={value.code} caption={value.caption} />
    },
  },
  list: {
    bullet: ({children}) => <ul className="modal__list">{children}</ul>,
    number: ({children}) => <ol>{children}</ol>,
  },
}

export function PortableBlock({value}: {value: any}) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return <PortableText value={value} components={components} />
}
