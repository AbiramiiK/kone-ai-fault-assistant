export const STATUS_META = {
  healthy: { label: 'Healthy', dot: 'bg-status-healthy', text: 'text-status-healthy', bg: 'bg-status-healthy/10', border: 'border-status-healthy/30' },
  warning: { label: 'Warning', dot: 'bg-status-warning', text: 'text-status-warning', bg: 'bg-status-warning/10', border: 'border-status-warning/30' },
  critical: { label: 'Critical', dot: 'bg-status-critical', text: 'text-status-critical', bg: 'bg-status-critical/10', border: 'border-status-critical/30' },
  normal: { label: 'Normal', dot: 'bg-status-healthy', text: 'text-status-healthy', bg: 'bg-status-healthy/10', border: 'border-status-healthy/30' },
}

export const SEVERITY_META = {
  HIGH: { label: 'HIGH', text: 'text-status-critical', bg: 'bg-status-critical/10', border: 'border-status-critical/30' },
  CRITICAL: { label: 'CRITICAL', text: 'text-status-critical', bg: 'bg-status-critical/10', border: 'border-status-critical/30' },
  MEDIUM: { label: 'MEDIUM', text: 'text-status-warning', bg: 'bg-status-warning/10', border: 'border-status-warning/30' },
  LOW: { label: 'LOW', text: 'text-status-healthy', bg: 'bg-status-healthy/10', border: 'border-status-healthy/30' },
  NONE: { label: 'NONE', text: 'text-base-300', bg: 'bg-base-700/30', border: 'border-base-600/30' },
}

export function healthScoreColor(score) {
  if (score >= 85) return 'text-status-healthy'
  if (score >= 60) return 'text-status-warning'
  return 'text-status-critical'
}
