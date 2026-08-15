import { ShieldAlert } from 'lucide-react'

export function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-base-300 bg-base-900/60 border border-base-700/50 rounded-md px-3 py-2">
        <ShieldAlert size={14} className="text-accent-light shrink-0" />
        <span>AI-assisted diagnostic recommendation — technician verification required. All data shown is simulated.</span>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-3 text-sm text-base-200 bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
      <ShieldAlert size={18} className="text-accent-light shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-base-100">AI-assisted diagnostic recommendation — technician verification required.</p>
        <p className="text-base-300 mt-0.5">
          This prototype uses simulated telemetry, thresholds and fault scenarios for demonstration only. It does not
          represent real KONE operational data or validated production diagnostics, and AI diagnosis never replaces a
          certified technician.
        </p>
      </div>
    </div>
  )
}

export default DisclaimerBanner
