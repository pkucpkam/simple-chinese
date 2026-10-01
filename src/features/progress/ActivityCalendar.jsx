import { DAILY_DATA } from '../../data/data'

/**
 * Heatmap-style activity calendar — last 30 days
 * Each cell is a day, colored by study minutes
 */
export default function ActivityCalendar() {
  const weeks = []
  let week = []

  // Pad to start on Monday
  const firstDOW = new Date(DAILY_DATA[0].date).getDay() // 0=Sun
  const pad = firstDOW === 0 ? 6 : firstDOW - 1
  for (let i = 0; i < pad; i++) week.push(null)

  DAILY_DATA.forEach(d => {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  })
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  function cellColor(d) {
    if (!d || !d.active) return '#1f1f1f'
    const mins = d.studyMinutes
    if (mins >= 40) return '#1ed760'
    if (mins >= 25) return '#1aab4e'
    if (mins >= 10) return '#138038'
    return '#0d5528'
  }

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm">Activity Heatmap</h3>
          <p className="text-[#b3b3b3] text-xs mt-0.5">Last 30 days</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#4d4d4d] text-xs">Less</span>
          {['#1f1f1f', '#0d5528', '#138038', '#1aab4e', '#1ed760'].map(c => (
            <span key={c} className="w-3.5 h-3.5 rounded-sm" style={{ background: c }} />
          ))}
          <span className="text-[#4d4d4d] text-xs">More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[300px]">
          {/* Day labels */}
          <div className="flex mb-1.5 pl-0" style={{ gap: 4 }}>
            {DAY_LABELS.map((l, i) => (
              <div key={i} className="text-[#4d4d4d] text-[10px] text-center" style={{ width: 22 }}>
                {l}
              </div>
            ))}
          </div>
          {/* Weeks */}
          <div className="flex flex-col gap-1">
            {weeks.map((wk, wi) => (
              <div key={wi} className="flex gap-1">
                {wk.map((day, di) => (
                  <div
                    key={di}
                    title={day ? `${day.date}: ${day.studyMinutes}m studied, ${day.wordsAdded} words` : ''}
                    className="rounded-sm transition-opacity hover:opacity-80"
                    style={{
                      width: 22,
                      height: 22,
                      background: cellColor(day),
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Month labels below */}
          <div className="flex mt-2 gap-1">
            {DAILY_DATA.filter((_, i) => i === 0 || new Date(DAILY_DATA[i].date).getDate() === 1).map(d => (
              <span key={d.date} className="text-[#4d4d4d] text-[10px] whitespace-nowrap" style={{ width: 22 }}>
                {new Date(d.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
