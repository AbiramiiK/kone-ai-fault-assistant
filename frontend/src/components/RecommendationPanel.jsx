import { ClipboardCheck } from 'lucide-react'
import { SeverityBadge } from './StatusBadge'

export function RecommendationPanel({ recommendation }) {
  if (!recommendation) return null
  const { priority, actions = [], disclaimer } = recommendation

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} className="text-accent-light" />
          <p className="text-sm font-semibold text-base-100">RECOMMENDED ACTION</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-base-400">Priority</span>
          <SeverityBadge severity={priority} />
        </div>
      </div>

      <ol className="space-y-2.5">
        {actions.map((action, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-base-200">
            <span className="w-5 h-5 rounded-full bg-accent/15 text-accent-light text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            {action}
          </li>
        ))}
      </ol>

      {disclaimer && <p className="text-[11px] text-base-500 mt-5 pt-4 border-t border-base-700/50 leading-relaxed">{disclaimer}</p>}
    </div>
  )
}

export default RecommendationPanel
