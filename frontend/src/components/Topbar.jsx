export function Topbar({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-base-700/50 bg-base-950/80 backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-base-100">{title}</h1>
        {subtitle && <p className="text-sm text-base-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 text-xs text-base-400 border border-base-700/60 rounded-full px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-status-healthy animate-pulse" />
        Simulated data feed active
      </div>
    </div>
  )
}

export default Topbar
