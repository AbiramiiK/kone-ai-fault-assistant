import { STATUS_META } from '../data/statusMeta'

export function TelemetryCard({ label, value, unit, status, icon: Icon }) {
  const meta = STATUS_META[status] || STATUS_META.normal

  return (
    <div className={`panel p-4 border-l-2 ${meta.border}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-base-400 font-medium">{label}</p>
        {Icon && <Icon size={15} className={meta.text} />}
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-2xl font-semibold mono-num text-base-100">{value}</span>
        {unit && <span className="text-sm text-base-400">{unit}</span>}
      </div>
      <p className={`text-xs mt-1.5 font-medium ${meta.text}`}>{meta.label}</p>
    </div>
  )
}

export default TelemetryCard
