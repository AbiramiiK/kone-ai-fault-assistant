import { STATUS_META, SEVERITY_META } from '../data/statusMeta'

export function StatusDot({ status }) {
  const meta = STATUS_META[status] || STATUS_META.normal
  return <span className={`inline-block w-2 h-2 rounded-full ${meta.dot}`} />
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.normal
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
      <StatusDot status={status} />
      {meta.label}
    </span>
  )
}

export function SeverityBadge({ severity }) {
  const meta = SEVERITY_META[severity] || SEVERITY_META.NONE
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${meta.bg} ${meta.text} ${meta.border}`}>
      {meta.label}
    </span>
  )
}

export default StatusBadge
