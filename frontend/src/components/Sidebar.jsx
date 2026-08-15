import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2, Stethoscope, History, FileText, PlayCircle, ArrowUpDown } from 'lucide-react'
import { useDemoMode } from './DemoModeContext'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/elevators', label: 'Elevators', icon: Building2 },
  { to: '/diagnostics/KONE-E204', label: 'Diagnostics', icon: Stethoscope },
  { to: '/fault-history', label: 'Fault History', icon: History },
  { to: '/reports', label: 'Reports', icon: FileText },
]

export function Sidebar() {
  const { startDemo } = useDemoMode()

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-base-900 border-r border-base-700/50">
      <div className="px-5 py-5 border-b border-base-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center font-bold text-white text-sm">
            <ArrowUpDown size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-base-100 leading-tight">KONE AI</p>
            <p className="text-[11px] text-base-400 leading-tight">Fault Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent-light font-medium'
                  : 'text-base-300 hover:bg-base-800 hover:text-base-100'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={startDemo}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium bg-accent hover:bg-accent-dark text-white transition-colors"
        >
          <PlayCircle size={17} />
          Demo Mode
        </button>
        <p className="text-[11px] text-base-500 mt-3 leading-snug px-1">
          All telemetry and diagnostics are simulated for demonstration.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
