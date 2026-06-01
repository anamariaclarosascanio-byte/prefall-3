/**
 * TEMPORARY preview route — visit /preview-error to see how the global
 * error.tsx page looks. Throws an error on render to trigger the
 * error boundary intentionally. Remove this file once previewed.
 */
export default function PreviewErrorPage() {
  throw new Error('Preview: intentional error to display the 500 page')
}
