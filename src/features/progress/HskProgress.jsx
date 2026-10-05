import {
  RadialBarChart, RadialBar, Tooltip, ResponsiveContainer,
} from 'recharts'
import { HSK_PROGRESS } from '../../data/data'

function HskBar({ item }) {
  const pct = Math.round((item.mastered / item.target) * 100)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
          <span className="text-white font-semibold">{item.label}</span>
        </div>
        <div className="text-right">
          <span className="text-white font-bold">{item.mastered}</span>
          <span className="text-[#4d4d4d] text-xs"> / {item.target}</span>
          <span
            className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: `${item.color}18`, color: item.color }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: item.color }}
        />
      </div>
    </div>
  )
}

export default function HskProgress() {
  const totalMastered = HSK_PROGRESS.reduce((s, h) => s + h.mastered, 0)
  const totalTarget   = HSK_PROGRESS.reduce((s, h) => s + h.target, 0)
  const overallPct    = Math.round((totalMastered / totalTarget) * 100)

  // Radial chart data
  const radialData = HSK_PROGRESS.map(h => ({
    name: h.label,
    value: Math.round((h.mastered / h.target) * 100),
    fill: h.color,
  }))

  return (
    <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-sm">HSK Progress</h3>
          <p className="text-[#b3b3b3] text-xs mt-0.5">Words mastered / target</p>
        </div>
        <div className="text-right">
          <p className="text-[#1ed760] font-bold text-xl">{overallPct}%</p>
          <p className="text-[#b3b3b3] text-xs">{totalMastered} / {totalTarget}</p>
        </div>
      </div>

      {/* Radial chart */}
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <ResponsiveContainer width={120} height={120}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius={28} outerRadius={54}
              barSize={10}
              data={radialData}
              startAngle={90} endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={5}
                background={{ fill: '#1f1f1f' }}
              />
              <Tooltip
                formatter={(v) => [`${v}%`]}
                contentStyle={{
                  background: '#252525',
                  border: '1px solid #4d4d4d',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#b3b3b3' }}
                itemStyle={{ color: '#fff' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Linear bars */}
        <div className="flex-1 space-y-3">
          {HSK_PROGRESS.map(h => <HskBar key={h.level} item={h} />)}
        </div>
      </div>
    </div>
  )
}
