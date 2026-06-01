'use client'

/**
 * TEMPORARY preview route — visit /preview-error to see how the global
 * error.tsx page looks. As a Client Component, the throw happens on the
 * client during render, which the nearest error.tsx boundary
 * (app/error.tsx) is guaranteed to catch and replace with the 500 UI.
 *
 * Remove this file once previewed.
 */
export default function PreviewErrorPage() {
  throw new Error('Preview: intentional error to display the 500 page')
}
