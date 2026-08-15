const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  getElevators: () => request('/api/elevators'),
  getElevator: (id) => request(`/api/elevators/${encodeURIComponent(id)}`),
  getScenarios: (full = false) => request(`/api/scenarios${full ? '?full=true' : ''}`),
  getHistory: () => request('/api/history'),
  analyze: (elevatorId, scenarioId) =>
    request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ elevatorId, scenarioId }),
    }),
  getReport: (elevatorId, scenarioId) =>
    request('/api/report', {
      method: 'POST',
      body: JSON.stringify({ elevatorId, scenarioId }),
    }),
}

export default api
