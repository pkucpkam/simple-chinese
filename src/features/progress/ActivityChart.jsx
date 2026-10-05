import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { CHART_DATA } from '../../data/data'

const METRICS = [
  { key: 'cumulativeWords', label: 'Total Words',   color: '#1ed760' },
  { key: 'wordsAdded',      label: 'Words / Day',   color: '#1ed760' },
  { key: 'studyMinutes',    label: 'Study Minutes', color: '#539df5' },
]

// Custom Tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#252525] border border-[#4d4d4d]/50 rounded-xl px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      <p className="text-[#b3b3b3] text-xs mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-[#b3b3b3]">{p.name}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const AXIS_STYLE = {
  tick: { fill: '#4d4d4d', fontSize: 11 },
  axisLine: { stroke: '#252525' },
  tickLine: false,
}

export default function ActivityChart() {
  const [metric, setMetric] = useState('cumulativeWords')
  const [chartType, setChartType] = useState('area')

  const active = METRICS.find(m => m.key === metric)

  return (
    <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-white font-bold text-sm">Learning Activity</h3>
          <p className="text-[#b3b3b3] text-xs mt-0.5">Last 14 days</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-end">
          {/* Metric switcher */}
          <div className="flex gap-1 bg-[#1f1f1f] p-1 rounded-full">
            {METRICS.map(m => (
              <button
                key={m.key}
                id={`metric-${m.key}`}
                onClick={() => setMetric(m.key)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap
                  ${metric === m.key ? 'bg-[#252525] text-white' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {/* Chart type */}
          <div className="flex gap-1 bg-[#1f1f1f] p-1 rounded-full">
            {['area', 'bar'].map(t => (
              <button
                key={t}
                id={`chart-type-${t}`}
                onClick={() => setChartType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 capitalize
                  ${chartType === t ? 'bg-[#1ed760] text-black' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        {chartType === 'area' ? (
          <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={active.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={active.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
            <XAxis dataKey="label" {...AXIS_STYLE} interval={2} />
            <YAxis {...AXIS_STYLE} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey={metric}
              name={active.label}
              stroke={active.color}
              strokeWidth={2}
              fill="url(#gradGreen)"
              dot={false}
              activeDot={{ r: 5, fill: active.color, stroke: '#181818', strokeWidth: 2 }}
            />
          </AreaChart>
        ) : (
          <BarChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
            <XAxis dataKey="label" {...AXIS_STYLE} interval={2} />
            <YAxis {...AXIS_STYLE} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey={metric}
              name={active.label}
              fill={active.color}
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
