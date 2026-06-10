'use client'

/**
 * Renders a Sanity htmlEmbed block inside a SANDBOXED iframe.
 *
 * Why iframe and not dangerouslySetInnerHTML directly:
 * editors paste full HTML documents that include `<style>` blocks with
 * GLOBAL selectors like `*, body, :root { ... }` and that CSS escapes
 * the embed wrapper and styles the entire site (resetting margins,
 * changing the page font to 'Outfit', centring layouts, etc.). An
 * iframe is its own document — global CSS in the pasted HTML stays
 * scoped to that document and can never reach the host page.
 *
 * Auto-height: the iframe initially renders at min height, then we read
 * its scrollHeight on load and resize it to fit. A ResizeObserver inside
 * the iframe re-syncs whenever the embed's content size changes (e.g.
 * after the user resizes the window). Falls back to a fixed default if
 * postMessage isn't available.
 */
import {useEffect, useRef, useState} from 'react'
import {usePathname} from 'next/navigation'

type Props = {
  code: string
  caption?: string | null
}

// Inject a tiny script into the iframe that posts the document height up
// to the parent on load and on every resize. Parent listens and matches.
const HEIGHT_REPORTER_SCRIPT = `
<script>
  (function(){
    function report() {
      var h = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.body ? document.body.scrollHeight : 0,
        document.body ? document.body.offsetHeight : 0
      );
      parent.postMessage({type: 'prefall-embed-height', height: h}, '*');
    }
    if (document.readyState === 'complete') report();
    else window.addEventListener('load', report);
    window.addEventListener('resize', report);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(report);
      ro.observe(document.documentElement);
      if (document.body) ro.observe(document.body);
    }
    // Retry a couple of times — some embeds finish painting after load
    // (font loading, chart libraries, etc.).
    setTimeout(report, 100);
    setTimeout(report, 500);
    setTimeout(report, 1500);
  })();
</script>
`

export function HtmlEmbed({code, caption}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [height, setHeight] = useState<number>(400)
  const pathname = usePathname()

  // Re-key on pathname so navigation to a new article rebuilds the iframe
  // from scratch (fresh document, fresh scripts).
  const [keyTick, setKeyTick] = useState(0)
  useEffect(() => {
    setKeyTick((t) => t + 1)
  }, [pathname])

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data
      if (data && data.type === 'prefall-embed-height' && typeof data.height === 'number') {
        // Only react to messages from our own iframe (best-effort source check)
        if (iframeRef.current && e.source === iframeRef.current.contentWindow) {
          // Cap at a sane maximum so a runaway embed can't blow up the page.
          const clamped = Math.min(Math.max(data.height, 80), 8000)
          setHeight(clamped)
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Compose the srcdoc: editor's HTML + height-reporter script appended
  // just before </body> (or at the end if there's no body tag).
  const srcdoc = buildSrcDoc(code)

  return (
    <figure className="article-page__figure" style={{margin: '20px 0'}}>
      <iframe
        ref={iframeRef}
        key={keyTick}
        srcDoc={srcdoc}
        // `allow-scripts` lets chart libraries run; we deliberately omit
        // `allow-same-origin` so the iframe can't access this site's DOM,
        // cookies or localStorage. The embed runs in a fully isolated null
        // origin sandbox.
        sandbox="allow-scripts"
        loading="lazy"
        style={{
          width: '100%',
          height: `${height}px`,
          border: 0,
          display: 'block',
          background: 'transparent',
        }}
        title={caption ?? 'Embedded content'}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function buildSrcDoc(code: string): string {
  // If the editor pasted a full document, append the reporter script before
  // </body>. If they pasted a partial fragment, wrap it in a minimal shell.
  const hasHtmlTag = /<html[\s>]/i.test(code)
  if (hasHtmlTag) {
    if (/<\/body>/i.test(code)) {
      return code.replace(/<\/body>/i, `${HEIGHT_REPORTER_SCRIPT}</body>`)
    }
    if (/<\/html>/i.test(code)) {
      return code.replace(/<\/html>/i, `${HEIGHT_REPORTER_SCRIPT}</html>`)
    }
    return code + HEIGHT_REPORTER_SCRIPT
  }
  // Fragment — wrap it.
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html, body { margin: 0; padding: 0; }
    body { font-family: var(--font), 'Figtree', sans-serif; color: #282828; }
  </style></head><body>${code}${HEIGHT_REPORTER_SCRIPT}</body></html>`
}
