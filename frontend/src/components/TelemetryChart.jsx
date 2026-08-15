import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export function TelemetryChart({ title, data, unit, color = '#3b82c4', threshold, height = 180 }) {
  if (!data || data.length === 0) {
    return (
      <div className="panel p-4">
        <p className="text-sm font-medium text-base-200 mb-2">{title}</p>
        <p className="text-xs text-base-500">No simulated data available.</p>
      </div>
    )
  }

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-base-200">{title}</p>
        {unit && <span className="text-xs text-base-500">{unit}</span>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232b37" vertical={false} />
          <XAxis dataKey="t" tick={{ fill: '#6b7688', fontSize: 11 }} axisLine={{ stroke: '#232b37' }} tickLine={false} />
          <YAxis tick={{ fill: '#6b7688', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: '#12171e', border: '1px solid #232b37', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#94a0b3' }}
            itemStyle={{ color: '#e6e9ef' }}
          />
          {threshold && (
            <ReferenceLine y={threshold} stroke="#d1453b" strokeDasharray="4 4" strokeOpacity={0.6} />
          )}
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TelemetryChart
