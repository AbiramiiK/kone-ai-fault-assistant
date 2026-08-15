import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Zap, Thermometer, Activity, Plug, Gauge, DoorOpen, Sparkles, FileText } from 'lucide-react'
import Topbar from '../components/Topbar'
import TelemetryCard from '../components/TelemetryCard'
import TelemetryChart from '../components/TelemetryChart'
import EventTimeline from '../components/EventTimeline'
import DiagnosticPipeline from '../components/DiagnosticPipeline'
import DiagnosticResult from '../components/DiagnosticResult'
import EvidencePanel from '../components/EvidencePanel'
import RecommendationPanel from '../components/RecommendationPanel'
import DisclaimerBanner from '../components/DisclaimerBanner'
import { StatusBadge } from '../components/StatusBadge'
import { healthScoreColor } from '../data/statusMeta'
import api from '../services/api'

const TELEMETRY_ICONS = {
  motorCurrent: Zap,
  temperature: Thermometer,
  vibration: Activity,
  voltage: Plug,
  speed: Gauge,
  doorStatus: DoorOpen,
}

const TELEMETRY_LABELS = {
  motorCurrent: 'Motor Current',
  temperature: 'Temperature',
  vibration: 'Vibration',
  voltage: 'Voltage',
  speed: 'Speed',
  doorStatus: 'Door Status',
}

const TELEMETRY_ORDER = ['motorCurrent', 'temperature', 'vibration', 'voltage', 'speed', 'doorStatus']

const CHART_META = {
  motorCurrent: { title: 'Motor Current', unit: 'A', color: '#d1453b' },
  temperature: { title: 'Temperature', unit: '°C', color: '#d99a2b' },
  vibration: { title: 'Vibration', unit: 'mm/s', color: '#3b82c4' },
  speed: { title: 'Speed', unit: 'm/s', color: '#2fa86a' },
  doorCurrent: { title: 'Door Current', unit: 'A', color: '#3b82c4' },
  doorCycleTime: { title: 'Door Cycle Time', unit: 's', color: '#d99a2b' },
  coolingFanRpm: { title: 'Cooling Fan RPM', unit: 'rpm', color: '#5aa0dd' },
}

function scoreToStatus(score) {
  if (score >= 85) return 'healthy'
  if (score >= 60) return 'warning'
  return 'critical'
}

export function Diagnostics() {
  const { elevatorId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isDemo = searchParams.get('demo') === '1'

  const [elevator, setElevator] = useState(null)
  const [scenarios, setScenarios] = useState([])
  const [selectedScenarioId, setSelectedScenarioId] = useState(undefined)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [autoOpenEvidence, setAutoOpenEvidence] = useState(false)

  useEffect(() => {
    setElevator(null)
    setResult(null)
    setSelectedScenarioId(undefined)
    setAutoOpenEvidence(false)
    api.getElevator(elevatorId).then((data) => {
      setElevator(data)
      setSelectedScenarioId(data.scenarioId || '')
    })
    api.getScenarios(true).then((d) => setScenarios(d.scenarios))
  }, [elevatorId])

  const preview = useMemo(() => {
    if (!elevator) return null
    if (!selectedScenarioId) {
      return {
        telemetrySnapshot: elevator.telemetrySnapshot,
        series: elevator.series,
        events: elevator.events,
      }
    }
    const s = scenarios.find((sc) => sc.id === selectedScenarioId)
    if (!s) return { telemetrySnapshot: elevator.telemetrySnapshot, series: elevator.series, events: elevator.events }
    return { telemetrySnapshot: s.telemetrySnapshot, series: s.series, events: s.events }
  }, [elevator, selectedScenarioId, scenarios])

  const runAnalysis = useCallback(() => {
    if (!selectedScenarioId) return
    setResult(null)
    setAutoOpenEvidence(false)
    setAnalyzing(true)
  }, [selectedScenarioId])

  const handlePipelineComplete = useCallback(() => {
    api.analyze(elevatorId, selectedScenarioId).then((res) => {
      setAnalyzing(false)
      setResult(res)
      if (isDemo) setAutoOpenEvidence(true)
    })
  }, [elevatorId, selectedScenarioId, isDemo])

  useEffect(() => {
    if (!isDemo || !elevator || selectedScenarioId === undefined || !selectedScenarioId) return
    const t = setTimeout(() => runAnalysis(), 1200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, elevator, selectedScenarioId])

  useEffect(() => {
    if (!isDemo || !result) return
    const t = setTimeout(() => {
      navigate(`/reports?elevatorId=${elevatorId}&scenarioId=${selectedScenarioId}&demo=1`)
    }, 7000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, result])

  if (!elevator) {
    return (
      <div className="flex-1 min-w-0">
        <Topbar title={elevatorId} subtitle="Loading diagnostic workspace…" />
        <div className="p-8 text-sm text-base-400">Loading simulated telemetry…</div>
      </div>
    )
  }

  const displayedScenario = scenarios.find((sc) => sc.id === selectedScenarioId)
  const healthScore = displayedScenario ? displayedScenario.healthScore : elevator.healthScore
  const status = scoreToStatus(healthScore)
  const snapshot = preview?.telemetrySnapshot || {}
  const series = preview?.series || {}
  const events = preview?.events || []

  return (
    <div className="flex-1 min-w-0">
      <Topbar title={elevatorId} subtitle={elevator.location} />
      <div className="p-8 space-y-6">
        <DisclaimerBanner compact />

        <div className="panel p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-base-400 font-medium">Health Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-4xl font-bold mono-num ${healthScoreColor(healthScore)}`}>{healthScore}%</span>
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="text-xs text-base-400 block mb-1">Fault Scenario (simulated)</label>
              <select
                value={selectedScenarioId || ''}
                onChange={(e) => {
                  setSelectedScenarioId(e.target.value)
                  setResult(null)
                }}
                className="bg-base-800 border border-base-700 rounded-md text-sm px-3 py-2 text-base-100 focus:outline-none focus:border-accent min-w-[260px]"
              >
                <option value="">None — Nominal telemetry</option>
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={runAnalysis}
              disabled={!selectedScenarioId || analyzing}
              className="self-end px-5 py-2.5 rounded-md text-sm font-semibold bg-accent hover:bg-accent-dark disabled:bg-base-700 disabled:text-base-500 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2"
            >
              <Sparkles size={16} />
              ANALYZE FAULT
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-base-200 mb-3">Live Telemetry (simulated)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TELEMETRY_ORDER.map((key) => {
              const entry = snapshot[key]
              if (!entry) return null
              return (
                <TelemetryCard
                  key={key}
                  label={TELEMETRY_LABELS[key]}
                  value={entry.value}
                  unit={entry.unit}
                  status={entry.status}
                  icon={TELEMETRY_ICONS[key]}
                />
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-base-200 mb-3">Telemetry Trend</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(series).map(([key, data]) => {
              const meta = CHART_META[key] || { title: key, unit: '', color: '#3b82c4' }
              return <TelemetryChart key={key} title={meta.title} unit={meta.unit} color={meta.color} data={data} />
            })}
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-sm font-semibold text-base-200 mb-4">Alarm / Event Timeline (simulated)</h2>
          <EventTimeline events={events} />
        </div>

        {analyzing && <DiagnosticPipeline running={analyzing} onComplete={handlePipelineComplete} />}

        {result && (
          <>
            <DiagnosticResult diagnostic={result.diagnostic} explanation={result.ai?.explanation} />
            <EvidencePanel rca={result.rca} aiExplanation={result.ai?.evidenceSummary} autoOpen={autoOpenEvidence} />
            <RecommendationPanel recommendation={result.recommendation} />

            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/reports?elevatorId=${elevatorId}&scenarioId=${selectedScenarioId}`)}
                className="px-5 py-2.5 rounded-md text-sm font-semibold bg-base-800 hover:bg-base-700 border border-base-600 text-base-100 transition-colors flex items-center gap-2"
              >
                <FileText size={16} />
                GENERATE REPORT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Diagnostics
