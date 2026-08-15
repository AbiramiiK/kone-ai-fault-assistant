export function SummaryCard({ label, value, icon: Icon, tone = 'default' }) {
  const toneClasses = {
    default: 'text-base-100',
    healthy: 'text-status-healthy',
    warning: 'text-status-warning',
    critical: 'text-status-critical',
  }[tone]

  const iconTone = {
    default: 'text-accent-light bg-accent/10',
    healthy: 'text-status-healthy bg-status-healthy/10',
    warning: 'text-status-warning bg-status-warning/10',
    critical: 'text-status-critical bg-status-critical/10',
  }[tone]

  return (
    <div className="panel p-5 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-base-400 font-medium">{label}</p>
        <p className={`text-3xl font-semibold mt-2 mono-num ${toneClasses}`}>{value}</p>
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconTone}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}

export default SummaryCard
