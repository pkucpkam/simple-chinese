import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { WEEKLY_SKILL, STATS } from './mockProgressData'
import { BookOpen, Volume2, PenLine, GraduationCap } from 'lucide-react'

const SKILL_ICONS = {
  Vocabulary: BookOpen,
  Listening:  Volume2,
  Writing:    PenLine,
  Grammar:    GraduationCap,
}

function SkillTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#252525] border border-[#4d4d4d]/50 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-white font-bold text-sm">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-[#b3b3b3] text-xs mt-1">
          {p.name}: <span className="text-white font-semibold">{p.value}</span>
          {p.name === 'Minutes' ? 'm' : ''}
        </p>
      ))}
    </div>
  )
}

export default function SkillBreakdown() {
  const total = WEEKLY_SKILL.reduce((s, sk) => s + sk.minutes, 0)

  return (
    <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5">
      <div className="mb-5">
        <h3 className="text-white font-bold text-sm">Skill Breakdown</h3>
        <p className="text-[#b3b3b3] text-xs mt-0.5">This month — {Math.round(total / 60)}h total</p>
      </div>

      {/* Skill metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {WEEKLY_SKILL.map(sk => {
          const Icon = SKILL_ICONS[sk.skill]
          const pct  = Math.round((sk.minutes / total) * 100)
          return (
            <div
              key={sk.skill}
              className="bg-[#121212] rounded-xl p-3 text-center"
            >
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
                style={{ background: `${sk.color}18` }}>
                <Icon size={15} style={{ color: sk.color }} />
              </div>
              <p className="text-white font-bold text-sm">{sk.minutes}m</p>
              <p className="text-[#b3b3b3] text-xs">{sk.skill}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: sk.color }}>{pct}%</p>
            </div>
          )
        })}
      </div>

      {/* Stacked horizontal bar */}
      <div className="mb-5">
        <div className="h-3 rounded-full overflow-hidden flex">
          {WEEKLY_SKILL.map(sk => (
            <div
              key={sk.skill}
              style={{
                width: `${(sk.minutes / total) * 100}%`,
                background: sk.color,
                opacity: 0.85,
              }}
              title={`${sk.skill}: ${Math.round((sk.minutes / total) * 100)}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {WEEKLY_SKILL.map(sk => (
            <span key={sk.skill} className="flex items-center gap-1.5 text-xs text-[#b3b3b3]">
              <span className="w-2 h-2 rounded-full" style={{ background: sk.color }} />
              {sk.skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bar chart — sessions */}
      <div>
        <p className="text-[#b3b3b3] text-xs font-semibold mb-3">Sessions / Exercises Count</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={WEEKLY_SKILL}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#252525" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#4d4d4d', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="skill"
              tick={{ fill: '#b3b3b3', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip content={<SkillTooltip />} />
            <Bar dataKey="sessions" name="Sessions" radius={[0, 4, 4, 0]}>
              {WEEKLY_SKILL.map(sk => (
                <Cell key={sk.skill} fill={sk.color} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
