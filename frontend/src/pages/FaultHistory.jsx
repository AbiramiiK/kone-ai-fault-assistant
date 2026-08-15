import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, TrendingUp } from 'lucide-react'
import Topbar from '../components/Topbar'
import { StatusBadge } from '../components/StatusBadge'
import DisclaimerBanner from '../components/DisclaimerBanner'
import api from '../services/api'

export function FaultHistory() {
  const [history, setHistory] = useState(null)
  const [elevators, setElevators] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.getHistory().then((d) => setHistory(d.historicalPatterns))
    api.getElevators().then((d) => setElevators(d.elevators))
  }, [])

  const activeFaults = (elevators || []).filter((e) => e.status !== 'healthy')

  return (
    <div className="flex-1 min-w-0">
      <Topbar title="Fault History" subtitle="Simulated historical fault patterns and recent fleet events" />
      <div className="p-8 space-y-6">
        <DisclaimerBanner compact />

        <div>
          <h2 className="text-sm font-semibold text-base-200 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-light" />
            Active Fault Events
          </h2>
          <div className="panel divide-y divide-base-800">
            {activeFaults.length === 0 && <p className="p-5 text-sm text-base-400">No active faults in the simulated fleet.</p>}
            {activeFaults.map((e) => (
              <div
                key={e.id}
                onClick={() => navigate(`/diagnostics/${e.id}`)}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-base-800/50 cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-base-100">{e.id}</p>
                  <p className="text-xs text-base-400">{e.currentFault}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-base-200 mb-3 flex items-center gap-2">
            <History size={16} className="text-accent-light" />
            Simulated Historical Pattern Library
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(history || []).map((p, i) => (
              <div key={i} className="panel p-5">
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-2">Pattern</p>
                <p className="text-sm text-base-200 mb-3">{p.pattern}</p>
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-1">Observed Outcome</p>
                <p className="text-sm font-medium text-base-100 mb-3">{p.outcome}</p>
                <p className="text-xs text-base-500">{p.occurrences} simulated occurrence(s) on record</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaultHistory
