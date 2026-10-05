import { useState } from 'react'
import { GraduationCap, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react'
import { GRAMMAR_POINTS } from '../../data/data'

const HSK_FILTERS = [
  { value: 'all', label: 'All' },
  { value: '1',   label: 'HSK 1' },
  { value: '2',   label: 'HSK 2' },
  { value: '3',   label: 'HSK 3' },
]

const HSK_COLORS = {
  1: { badge: 'bg-[#1ed760]/15 text-[#1ed760]', dot: 'bg-[#1ed760]', border: 'border-[#1ed760]/15' },
  2: { badge: 'bg-[#539df5]/15 text-[#539df5]', dot: 'bg-[#539df5]', border: 'border-[#539df5]/15' },
  3: { badge: 'bg-[#ffa42b]/15 text-[#ffa42b]', dot: 'bg-[#ffa42b]', border: 'border-[#ffa42b]/15' },
}

// Group by HSK level
function groupByHsk(points) {
  return points.reduce((acc, p) => {
    if (!acc[p.hsk]) acc[p.hsk] = []
    acc[p.hsk].push(p)
    return acc
  }, {})
}

export default function GrammarList({ onSelect, completedIds = new Set() }) {
  const [hskFilter, setHskFilter] = useState('all')

  const filtered = hskFilter === 'all'
    ? GRAMMAR_POINTS
    : GRAMMAR_POINTS.filter(g => g.hsk === Number(hskFilter))

  const grouped = groupByHsk(filtered)
  const levels  = Object.keys(grouped).map(Number).sort()

  const totalPoints    = GRAMMAR_POINTS.length
  const completedCount = completedIds.size

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Grammar</h1>
            <p className="text-[#b3b3b3] text-xs mt-0.5">
              {completedCount} / {totalPoints} patterns studied
            </p>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-[#1f1f1f] p-1 rounded-full">
            {HSK_FILTERS.map(f => (
              <button
                key={f.value}
                id={`grammar-filter-${f.value}`}
                onClick={() => setHskFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                  ${hskFilter === f.value
                    ? 'bg-[#1ed760] text-black'
                    : 'text-[#b3b3b3] hover:text-white'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-8">

        {/* Progress overview */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-[#1ed760]" />
              <span className="text-white font-semibold text-sm">Overall Progress</span>
            </div>
            <span className="text-[#1ed760] font-bold text-sm">
              {totalPoints > 0 ? Math.round((completedCount / totalPoints) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1ed760] rounded-full transition-all duration-500"
              style={{ width: `${totalPoints > 0 ? (completedCount / totalPoints) * 100 : 0}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3">
            {[1, 2, 3].map(lvl => {
              const pts   = GRAMMAR_POINTS.filter(g => g.hsk === lvl)
              const done  = pts.filter(g => completedIds.has(g.id)).length
              const col   = HSK_COLORS[lvl]
              return (
                <div key={lvl} className="flex-1 text-center">
                  <p className={`font-bold text-sm ${col.badge.split(' ')[1]}`}>{done}/{pts.length}</p>
                  <p className="text-[#b3b3b3] text-xs">HSK {lvl}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Grammar cards by level */}
        {levels.map(lvl => {
          const col = HSK_COLORS[lvl]
          return (
            <section key={lvl}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h2 className={`font-bold text-sm ${col.badge.split(' ')[1]}`}>
                  HSK {lvl} — {grouped[lvl].length} patterns
                </h2>
              </div>
              <div className="space-y-2">
                {grouped[lvl].map(point => {
                  const isDone = completedIds.has(point.id)
                  return (
                    <button
                      key={point.id}
                      id={`grammar-card-${point.id}`}
                      onClick={() => onSelect(point)}
                      className={`w-full text-left bg-[#181818] border ${col.border} rounded-2xl px-5 py-4
                        hover:bg-[#1f1f1f] hover:border-opacity-60 transition-all duration-200 group`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Pattern label */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold text-base">{point.pattern}</span>
                            {isDone && <CheckCircle2 size={14} className="text-[#1ed760] shrink-0" />}
                          </div>
                          <p className="text-[#b3b3b3] text-xs leading-relaxed">{point.summary}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[#4d4d4d] text-xs flex items-center gap-1">
                              <BookOpen size={11} /> {point.exercises.length} exercises
                            </span>
                          </div>
                        </div>
                        {/* Arrow */}
                        <ChevronRight
                          size={18}
                          className="text-[#4d4d4d] group-hover:text-[#b3b3b3] group-hover:translate-x-1 transition-all shrink-0"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
