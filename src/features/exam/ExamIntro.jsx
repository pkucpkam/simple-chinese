import { ClipboardList, Clock, Target, ChevronRight, BookOpen, Volume2, PenLine } from 'lucide-react'
import { EXAM_SECTIONS } from '../../data/data'

const SECTION_ICONS = { listening: Volume2, reading: BookOpen, writing: PenLine }

export default function ExamIntro({ onStart }) {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1ed760]/10 flex items-center justify-center">
            <ClipboardList size={18} className="text-[#1ed760]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">HSK 3 Mock Exam</h1>
            <p className="text-[#b3b3b3] text-xs mt-0.5">汉语水平考试 · Practice Test</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Hero banner */}
        <div className="bg-gradient-to-br from-[#1ed760]/10 to-[#181818] border border-[#1ed760]/20 rounded-3xl p-6">
          <div className="flex items-start gap-5">
            <div className="text-5xl shrink-0">📝</div>
            <div>
              <h2 className="text-white font-bold text-lg mb-1">Simulate the real exam</h2>
              <p className="text-[#b3b3b3] text-sm leading-relaxed">
                This mock test follows the HSK 3 format with a countdown timer.
                Each section advances automatically when time runs out.
                Your answers are graded instantly at the end.
              </p>
            </div>
          </div>
        </div>

        {/* Exam structure */}
        <div>
          <p className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider mb-3">
            Exam Structure
          </p>
          <div className="space-y-3">
            {EXAM_SECTIONS.map((sec, i) => {
              const Icon = SECTION_ICONS[sec.id]
              const mins = Math.floor(sec.timeLimitSec / 60)
              return (
                <div
                  key={sec.id}
                  className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl px-5 py-4 flex items-center gap-4"
                >
                  {/* Number */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: `${sec.color}18`, color: sec.color }}
                  >
                    {i + 1}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-base">{sec.label}</span>
                      <span className="text-[#b3b3b3] text-sm">{sec.labelEn}</span>
                    </div>
                    <p className="text-[#b3b3b3] text-xs mt-0.5">{sec.description}</p>
                  </div>
                  {/* Stats */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                      <span className="flex items-center gap-1">
                        <Icon size={12} style={{ color: sec.color }} />
                        {sec.questionCount} Qs
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} style={{ color: sec.color }} />
                        {mins}min
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Total summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Questions',  value: EXAM_SECTIONS.reduce((s, e) => s + e.questionCount, 0), icon: Target },
            { label: 'Total Time', value: `${EXAM_SECTIONS.reduce((s, e) => s + Math.floor(e.timeLimitSec / 60), 0)} min`, icon: Clock },
            { label: 'Sections',   value: EXAM_SECTIONS.length, icon: ClipboardList },
          ].map(stat => (
            <div key={stat.label} className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-4 text-center">
              <stat.icon size={16} className="text-[#1ed760] mx-auto mb-2" />
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-[#b3b3b3] text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5">
          <p className="text-white font-semibold text-sm mb-3">Before you start</p>
          <ul className="space-y-2">
            {[
              'The timer starts immediately when you click Start.',
              'Each section has its own timer — it auto-advances when time is up.',
              'You can skip questions and come back within the section.',
              'Answers are graded and explained at the end.',
              'Passing score: 60% per section (180/300 on real HSK3).',
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#b3b3b3]">
                <span className="text-[#1ed760] mt-0.5 shrink-0">•</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Start button */}
        <button
          id="start-exam-btn"
          onClick={onStart}
          className="w-full flex items-center justify-center gap-3 bg-[#1ed760] hover:bg-[#1fdf64]
            text-black font-bold text-base py-4 rounded-full active:scale-98 transition-all duration-150
            shadow-[0_4px_24px_rgba(30,215,96,0.3)]"
        >
          <ClipboardList size={20} />
          Start Exam
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
