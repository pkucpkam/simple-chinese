import { Flame, BookOpen, Clock, Calendar } from 'lucide-react'
import { STATS } from '../../data/data'

function StatCard({ icon: Icon, label, value, sub, color, id }) {
  return (
    <div
      id={id}
      className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5 flex flex-col gap-2"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center`}
        style={{ background: `${color}18` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-white text-2xl font-bold leading-none">{value}</p>
        <p className="text-[#b3b3b3] text-xs mt-1">{label}</p>
        {sub && <p className="text-[#4d4d4d] text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function formatMinutes(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        id="stat-words"
        icon={BookOpen}
        label="Words Learned"
        value={STATS.totalWords}
        sub={`${STATS.vocabAdded} this month`}
        color="#1ed760"
      />
      <StatCard
        id="stat-streak"
        icon={Flame}
        label="Day Streak"
        value={`${STATS.streak} 🔥`}
        sub={`Best: ${STATS.longestStreak} days`}
        color="#ffa42b"
      />
      <StatCard
        id="stat-time"
        icon={Clock}
        label="Study Time"
        value={formatMinutes(STATS.totalStudyMinutes)}
        sub="this month"
        color="#539df5"
      />
      <StatCard
        id="stat-days"
        icon={Calendar}
        label="Active Days"
        value={`${STATS.activeDays}/30`}
        sub={`${Math.round((STATS.activeDays / 30) * 100)}% consistency`}
        color="#f3727f"
      />
    </div>
  )
}
