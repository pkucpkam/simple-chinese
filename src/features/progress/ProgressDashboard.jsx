import { BarChart2 } from 'lucide-react'
import StatsCards from './StatsCards'
import ActivityChart from './ActivityChart'
import HskProgress from './HskProgress'
import SkillBreakdown from './SkillBreakdown'
import ActivityCalendar from './ActivityCalendar'

export default function ProgressDashboard() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Progress</h1>
            <p className="text-[#b3b3b3] text-xs mt-0.5">Your learning journey</p>
          </div>
          <div className="flex items-center gap-1.5 text-[#b3b3b3]">
            <BarChart2 size={16} />
            <span className="text-xs font-medium">Last 30 days</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">

        {/* Stats row */}
        <StatsCards />

        {/* Activity chart */}
        <ActivityChart />

        {/* Two columns on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <HskProgress />
          <SkillBreakdown />
        </div>

        {/* Heatmap */}
        <ActivityCalendar />

        {/* Motivational footer */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl px-6 py-5 text-center">
          <p className="text-white font-bold text-base">坚持就是胜利</p>
          <p className="text-[#1ed760] text-xs mt-1">Jiānchí jiùshì shènglì</p>
          <p className="text-[#b3b3b3] text-sm mt-2">
            "Persistence is victory" — Keep going, every word counts.
          </p>
        </div>
      </div>
    </div>
  )
}
