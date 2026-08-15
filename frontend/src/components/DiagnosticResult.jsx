import { motion } from 'framer-motion'
import { AlertOctagon, MapPin, Search, Gauge } from 'lucide-react'
import { SeverityBadge } from './StatusBadge'

export function DiagnosticResult({ diagnostic, explanation }) {
  if (!diagnostic) return null

  const fields = [
    { label: 'Fault', value: diagnostic.fault, icon: AlertOctagon },
    { label: 'Location', value: diagnostic.location, icon: MapPin },
    { label: 'Probable Root Cause', value: diagnostic.probableCause, icon: Search },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="panel p-6 border-l-2 border-status-critical/50"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs uppercase tracking-wide text-base-400 font-medium">Diagnostic Result</p>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={diagnostic.severity} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label}>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-base-400 font-medium mb-1.5">
              <Icon size={13} />
              {label}
            </div>
            <p className="text-base font-semibold text-base-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-base-700/50">
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-accent-light" />
          <span className="text-xs text-base-400">Confidence (prototype score)</span>
        </div>
        <div className="flex-1 h-2 bg-base-800 rounded-full overflow-hidden max-w-xs">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${diagnostic.confidence}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-accent"
          />
        </div>
        <span className="text-lg font-semibold mono-num text-accent-light">{diagnostic.confidence}%</span>
      </div>
      <p className="text-[11px] text-base-500 mt-2">
        This is a prototype confidence score for demonstration, not a validated model accuracy metric.
      </p>

      {explanation && (
        <p className="text-sm text-base-300 mt-5 leading-relaxed border-t border-base-700/50 pt-4">{explanation}</p>
      )}
    </motion.div>
  )
}

export default DiagnosticResult
