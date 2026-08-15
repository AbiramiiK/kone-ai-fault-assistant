import { useEffect, useMemo, useState } from 'react'
import Topbar from '../components/Topbar'
import ElevatorTable from '../components/ElevatorTable'
import api from '../services/api'

const FILTERS = ['all', 'critical', 'warning', 'healthy']

export function Elevators() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getElevators().then(setData)
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    if (filter === 'all') return data.elevators
    return data.elevators.filter((e) => e.status === filter)
  }, [data, filter])

  return (
    <div className="flex-1 min-w-0">
      <Topbar title="Elevators" subtitle="Simulated fleet — click any elevator to open its diagnostic view" />
      <div className="p-8 space-y-5">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${
                filter === f
                  ? 'bg-accent/15 border-accent/40 text-accent-light'
                  : 'border-base-700/60 text-base-400 hover:text-base-200 hover:border-base-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {data ? <ElevatorTable elevators={filtered} /> : <p className="text-sm text-base-400">Loading…</p>}
      </div>
    </div>
  )
}

export default Elevators
