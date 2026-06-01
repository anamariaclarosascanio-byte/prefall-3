/**
 * Status badge — reused across regulation index, detail header, home module,
 * and tracker tooltips. Maps the status slug to the prototype CSS modifier.
 */
type Props = {
  status?: {
    title: string
    slug?: string | null
  } | null
  className?: string
}

const SLUG_TO_MODIFIER: Record<string, string> = {
  'in-force': 'badge--in-force',
  enforced: 'badge--enforced',
  transpos: 'badge--transpos',
  preparation: 'badge--preparation',
  withdrawn: 'badge--withdrawn',
  amended: 'badge--amended',
}

export function StatusBadge({status, className}: Props) {
  if (!status) return null
  const modifier = SLUG_TO_MODIFIER[status.slug ?? ''] ?? 'badge--amended'
  return <span className={`badge ${modifier} ${className ?? ''}`}>{status.title}</span>
}
