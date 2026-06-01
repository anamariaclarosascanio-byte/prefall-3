/**
 * Studio uses its own root layout to bypass the site fonts and styles.
 * This prevents globals.css from clashing with Sanity's UI styles.
 */
export {metadata, viewport} from 'next-sanity/studio'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
