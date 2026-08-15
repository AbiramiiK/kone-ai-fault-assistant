import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

const STEPS = [
  'Collecting telemetry',
  'Analyzing anomalies',
  'Correlating event logs',
  'Checking historical patterns',
  'Isolating affected subsystem',
  'Performing root-cause analysis',
  'Generating recommendation',
]

const STEP_DURATION_MS = 380

export function DiagnosticPipeline({ running, onComplete }) {
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    if (!running) {
      setActiveStep(-1)
      return
    }

    let cancelled = false
    setActiveStep(0)

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        if (cancelled) return
        setActiveStep(i)
        if (i === STEPS.length - 1) {
          setTimeout(() => {
            if (!cancelled) onComplete?.()
          }, STEP_DURATION_MS)
        }
      }, i * STEP_DURATION_MS)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  if (!running) return null

  return (
    <div className="panel p-6">
      <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-5">Diagnostic pipeline running</p>
      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const isDone = i < activeStep
          const isActive = i === activeStep
          const isPending = i > activeStep

          return (
            <div key={step} className="flex items-center gap-3 py-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  isDone
                    ? 'bg-status-healthy/15 border-status-healthy/40 text-status-healthy'
                    : isActive
                      ? 'bg-accent/15 border-accent/40 text-accent-light'
                      : 'bg-base-800 border-base-700 text-base-500'
                }`}
              >
                {isDone ? <Check size={13} /> : isActive ? <Loader2 size={13} className="animate-spin" /> : <span className="text-[10px]">{i + 1}</span>}
              </div>
              <span
                className={`text-sm transition-colors ${
                  isDone ? 'text-base-300' : isActive ? 'text-base-100 font-medium' : 'text-base-500'
                }`}
              >
                {step}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-accent-light ml-auto"
                  >
                    processing…
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DiagnosticPipeline
