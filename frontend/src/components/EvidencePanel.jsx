import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, Sparkles, History } from 'lucide-react'
import { RootCauseChain } from './RootCauseChain'

export function EvidencePanel({ rca, aiExplanation, autoOpen = false }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (autoOpen) setOpen(true)
  }, [autoOpen])

  if (!rca) return null

  const { evidence = [], rootCauseChain = [], historicalPattern, confidence } = rca

  return (
    <div className="panel overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-base-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-light" />
          <span className="text-sm font-semibold text-base-100">WHY THIS DIAGNOSIS?</span>
        </div>
        <ChevronDown size={18} className={`text-base-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-base-700/50 pt-5 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-3">Evidence</p>
                <ul className="space-y-2">
                  {evidence.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2.5 text-sm text-base-200"
                    >
                      <CheckCircle2 size={16} className="text-status-healthy shrink-0 mt-0.5" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <p className="text-sm text-accent-light font-medium mt-4">Diagnostic confidence: {confidence}%</p>
              </div>

              {aiExplanation && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-2">Evidence Summary</p>
                  <p className="text-sm text-base-300 leading-relaxed">{aiExplanation}</p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-3">Root-Cause Chain</p>
                <div className="max-w-sm">
                  <RootCauseChain chain={rootCauseChain} />
                </div>
              </div>

              {historicalPattern && (
                <div className="flex items-start gap-3 bg-base-800/60 border border-base-700/50 rounded-md px-4 py-3">
                  <History size={16} className="text-accent-light shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-1">
                      Historical Pattern Match (simulated)
                    </p>
                    <p className="text-sm text-base-200">{historicalPattern.description}</p>
                    <p className="text-xs text-base-500 mt-1">
                      {historicalPattern.occurrences} prior simulated occurrence(s)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-semibold text-accent-light mono-num">{historicalPattern.similarity}%</p>
                    <p className="text-[11px] text-base-500">similarity</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EvidencePanel
