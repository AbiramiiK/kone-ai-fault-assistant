import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, Copy, FileText, Check } from 'lucide-react'
import Topbar from '../components/Topbar'
import DisclaimerBanner from '../components/DisclaimerBanner'
import { SeverityBadge } from '../components/StatusBadge'
import api from '../services/api'

export function Reports() {
  const [searchParams] = useSearchParams()
  const initialElevatorId = searchParams.get('elevatorId') || ''
  const initialScenarioId = searchParams.get('scenarioId') || ''
  const isDemo = searchParams.get('demo') === '1'

  const [elevators, setElevators] = useState([])
  const [scenarios, setScenarios] = useState([])
  const [elevatorId, setElevatorId] = useState(initialElevatorId)
  const [scenarioId, setScenarioId] = useState(initialScenarioId)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [reportText, setReportText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.getElevators().then((d) => setElevators(d.elevators))
    api.getScenarios().then((d) => setScenarios(d.scenarios))
  }, [])

  const generate = useCallback(() => {
    if (!elevatorId || !scenarioId) return
    setLoading(true)
    Promise.all([api.analyze(elevatorId, scenarioId), api.getReport(elevatorId, scenarioId)]).then(
      ([analyzeRes, reportRes]) => {
        setAnalysis(analyzeRes)
        setReportText(reportRes.reportText)
        setLoading(false)
      },
    )
  }, [elevatorId, scenarioId])

  useEffect(() => {
    if (isDemo && elevatorId && scenarioId) {
      generate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo])

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KONE_Fault_Report_${elevatorId}_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex-1 min-w-0">
      <Topbar title="Reports" subtitle="Generate a technician-ready maintenance report from a simulated diagnosis" />
      <div className="p-8 space-y-6">
        <DisclaimerBanner compact />

        <div className="panel p-6 flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-base-400 block mb-1">Elevator</label>
            <select
              value={elevatorId}
              onChange={(e) => setElevatorId(e.target.value)}
              className="bg-base-800 border border-base-700 rounded-md text-sm px-3 py-2 text-base-100 focus:outline-none focus:border-accent min-w-[200px]"
            >
              <option value="">Select elevator…</option>
              {elevators.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-base-400 block mb-1">Fault Scenario</label>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
              className="bg-base-800 border border-base-700 rounded-md text-sm px-3 py-2 text-base-100 focus:outline-none focus:border-accent min-w-[260px]"
            >
              <option value="">Select scenario…</option>
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generate}
            disabled={!elevatorId || !scenarioId || loading}
            className="px-5 py-2.5 rounded-md text-sm font-semibold bg-accent hover:bg-accent-dark disabled:bg-base-700 disabled:text-base-500 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            {loading ? 'Generating…' : 'GENERATE REPORT'}
          </button>
        </div>

        {analysis && (
          <div className="panel overflow-hidden">
            <div className="px-6 py-5 border-b border-base-700/50 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium">KONE AI Fault Analysis Report</p>
                <p className="text-lg font-semibold text-base-100 mt-1">{analysis.elevatorId} — {analysis.diagnostic.fault}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-md text-xs font-medium bg-base-800 hover:bg-base-700 border border-base-600 text-base-100 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={14} className="text-status-healthy" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Report'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3.5 py-2 rounded-md text-xs font-medium bg-accent hover:bg-accent-dark text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} />
                  Download Report
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-base-700/50">
              <ReportField label="Elevator ID" value={analysis.elevatorId} />
              <ReportField label="Fault" value={analysis.diagnostic.fault} />
              <ReportField label="Fault Location" value={analysis.diagnostic.location} />
              <ReportField label="Probable Root Cause" value={analysis.diagnostic.probableCause} />
              <ReportField label="Severity" value={<SeverityBadge severity={analysis.diagnostic.severity} />} />
              <ReportField label="Confidence (prototype score)" value={`${analysis.diagnostic.confidence}%`} />
              <ReportField label="Historical Pattern (simulated)" value={analysis.rca.historicalPattern.description} />
              <ReportField label="Timestamp" value={new Date(analysis.generatedAt).toLocaleString()} />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-base-700/50">
              <div>
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-2">Telemetry Evidence</p>
                <ul className="space-y-1.5 text-sm text-base-200 list-disc list-inside">
                  {analysis.rca.evidence.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-2">Alarm / Event Evidence</p>
                <ul className="space-y-1.5 text-sm text-base-200">
                  {analysis.events.map((e, i) => (
                    <li key={i} className="mono-num">
                      <span className="text-base-500">{e.time}</span> — {e.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 border-b border-base-700/50">
              <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-2">Recommended Action</p>
              <ol className="space-y-1.5 text-sm text-base-200 list-decimal list-inside">
                {analysis.recommendation.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>

            <div className="p-6">
              <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-2">Full Report Text</p>
              <pre className="text-xs text-base-300 bg-base-950 border border-base-700/50 rounded-md p-4 whitespace-pre-wrap font-mono leading-relaxed">
                {reportText}
              </pre>
            </div>
          </div>
        )}

        {!analysis && !loading && (
          <p className="text-sm text-base-500">Select an elevator and fault scenario, then generate a report.</p>
        )}
      </div>
    </div>
  )
}

function ReportField({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-base-400 font-medium mb-1">{label}</p>
      <div className="text-sm font-medium text-base-100">{value}</div>
    </div>
  )
}

export default Reports
