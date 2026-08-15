import { useEffect, useState } from 'react'
import { Building2, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react'
import Topbar from '../components/Topbar'
import SummaryCard from '../components/SummaryCard'
import ElevatorTable from '../components/ElevatorTable'
import DisclaimerBanner from '../components/DisclaimerBanner'
import api from '../services/api'

export function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getElevators().then(setData).catch((e) => setError(e.message))
  }, [])

  return (
    <div className="flex-1 min-w-0">
      <Topbar title="KONE AI FAULT ASSISTANT" subtitle="Autonomous Fault Isolation & Root Cause Analysis" />
      <div className="p-8 space-y-6">
        <DisclaimerBanner />

        {error && <p className="text-sm text-status-critical">Failed to load elevator data: {error}</p>}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard label="Active Elevators" value={data.summary.active} icon={Building2} />
              <SummaryCard label="Healthy" value={data.summary.healthy} icon={CheckCircle2} tone="healthy" />
              <SummaryCard label="Warning" value={data.summary.warning} icon={AlertTriangle} tone="warning" />
              <SummaryCard label="Critical" value={data.summary.critical} icon={AlertOctagon} tone="critical" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-base-200 mb-3">Fleet Status</h2>
              <ElevatorTable elevators={data.elevators} />
            </div>
          </>
        )}

        {!data && !error && <p className="text-sm text-base-400">Loading simulated fleet data…</p>}
      </div>
    </div>
  )
}

export default Overview
