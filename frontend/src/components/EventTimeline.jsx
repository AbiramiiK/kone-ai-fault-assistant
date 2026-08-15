import { AlertTriangle, AlertOctagon, Info } from 'lucide-react'

export function EventTimeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-base-500">No simulated alarm events recorded.</p>
  }

  return (
    <div className="space-y-0">
      {events.map((e, i) => {
        const isCritical = e.severity === 'critical'
        const isInfo = e.severity === 'info'
        const Icon = isCritical ? AlertOctagon : isInfo ? Info : AlertTriangle
        return (
          <div key={i} className="flex gap-3 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCritical
                    ? 'bg-status-critical/15 text-status-critical'
                    : isInfo
                      ? 'bg-status-healthy/15 text-status-healthy'
                      : 'bg-status-warning/15 text-status-warning'
                }`}
              >
                <Icon size={14} />
              </div>
              {i < events.length - 1 && <div className="w-px flex-1 bg-base-700/70 my-1" />}
            </div>
            <div className="pb-5">
              <p className="text-xs text-base-400 mono-num">{e.time}</p>
              <p className="text-sm text-base-100 mt-0.5">{e.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EventTimeline
