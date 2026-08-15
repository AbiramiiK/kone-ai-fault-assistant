import { useNavigate } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import { healthScoreColor } from '../data/statusMeta'

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function ElevatorTable({ elevators }) {
  const navigate = useNavigate()

  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-base-400 border-b border-base-700/50">
            <th className="px-5 py-3 font-medium">Elevator ID</th>
            <th className="px-5 py-3 font-medium">Location</th>
            <th className="px-5 py-3 font-medium">Health Score</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Current Fault</th>
            <th className="px-5 py-3 font-medium">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {elevators.map((e) => (
            <tr
              key={e.id}
              onClick={() => navigate(`/diagnostics/${e.id}`)}
              className="border-b border-base-800 last:border-0 hover:bg-base-800/60 cursor-pointer transition-colors"
            >
              <td className="px-5 py-3.5 font-medium text-base-100">{e.id}</td>
              <td className="px-5 py-3.5 text-base-300">{e.location}</td>
              <td className={`px-5 py-3.5 font-semibold mono-num ${healthScoreColor(e.healthScore)}`}>
                {e.healthScore}%
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={e.status} />
              </td>
              <td className="px-5 py-3.5 text-base-300">{e.currentFault}</td>
              <td className="px-5 py-3.5 text-base-400 mono-num">{formatTime(e.lastUpdated)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ElevatorTable
