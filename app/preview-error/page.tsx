/**
 * TEMPORARY preview route — visit /preview-error to see how the global
 * error.tsx page looks. The `dynamic = 'force-dynamic'` export tells
 * Next.js to skip static prerendering at build time (otherwise the
 * intentional throw kills the build). The error then happens on first
 * runtime request, which is what we want — that triggers error.tsx.
 *
 * Remove this file once previewed.
 */
export const dynamic = 'force-dynamic'

export default function PreviewErrorPage() {
  throw new Error('Preview: intentional error to display the 500 page')
}
