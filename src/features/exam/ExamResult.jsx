import { useState } from 'react'
import { RotateCcw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle, Trophy } from 'lucide-react'

const PASS_THRESHOLD = 0.6 // 60%

function SectionResult({ result, expanded, onToggle }) {
  const { section, questions, answers, correct, total } = result
  const pct   = Math.round((correct / total) * 100)
  const pass  = pct >= PASS_THRESHOLD * 100
  const wrong = questions.filter((q, i) => answers[i] !== q.answer)

  return (
    <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl overflow-hidden">
      {/* Section header */}
      <button
        id={`section-result-${section.id}`}
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <span className="text-2xl">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{section.labelEn}</span>
            <span className="text-[#b3b3b3] text-sm">{section.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: pass ? '#1ed76018' : '#f3727f18',
                color:      pass ? '#1ed760'   : '#f3727f',
              }}
            >
              {pass ? '✓ Pass' : '✗ Fail'}
            </span>
            <span className="text-[#b3b3b3] text-xs">{correct}/{total} correct</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl" style={{ color: section.color }}>{pct}%</p>
          {expanded ? <ChevronUp size={16} className="text-[#4d4d4d] ml-auto mt-1" /> : <ChevronDown size={16} className="text-[#4d4d4d] ml-auto mt-1" />}
        </div>
      </button>

      {/* Progress bar */}
      <div className="mx-5 mb-4 h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: section.color }}
        />
      </div>

      {/* Wrong answers detail */}
      {expanded && wrong.length > 0 && (
        <div className="px-5 pb-5 border-t border-[#4d4d4d]/20 pt-4 space-y-3">
          <p className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">
            Review mistakes ({wrong.length})
          </p>
          {wrong.map((q, i) => {
            const qIdx  = questions.indexOf(q)
            const given = answers[qIdx]
            return (
              <div key={q.id} className="bg-[#121212] rounded-xl px-4 py-3 space-y-1.5">
                <p className="text-[#b3b3b3] text-xs font-medium">
                  Q{qIdx + 1} {q.prompt?.length > 60 ? q.prompt.slice(0, 60) + '…' : q.prompt}
                </p>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[#f3727f]">✗ Your answer: <span className="font-semibold">{given ?? '(skipped)'}</span></span>
                  <span className="text-[#1ed760]">✓ Correct: <span className="font-semibold">{q.answer}</span></span>
                </div>
                {q.explanation && (
                  <p className="text-[#4d4d4d] text-xs leading-relaxed border-t border-[#252525] pt-1.5">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
      {expanded && wrong.length === 0 && (
        <div className="px-5 pb-5 text-center text-sm text-[#1ed760]">🎉 Perfect section!</div>
      )}
    </div>
  )
}

export default function ExamResult({ results, onRetry, onHome }) {
  const [expandedSection, setExpandedSection] = useState(null)

  const totalCorrect = results.reduce((s, r) => s + r.correct, 0)
  const totalQ       = results.reduce((s, r) => s + r.total, 0)
  const overallPct   = Math.round((totalCorrect / totalQ) * 100)
  const allPass      = results.every(r => Math.round((r.correct / r.total) * 100) >= 60)

  const grade =
    overallPct >= 90 ? { emoji: '🏆', label: 'Outstanding!',  color: 'text-[#1ed760]' } :
    overallPct >= 75 ? { emoji: '🥇', label: 'Excellent!',    color: 'text-[#1ed760]' } :
    overallPct >= 60 ? { emoji: '👍', label: 'Pass!',         color: 'text-[#539df5]' } :
    overallPct >= 45 ? { emoji: '💪', label: 'Almost there!', color: 'text-[#ffa42b]' } :
                       { emoji: '📚', label: 'Keep studying!', color: 'text-[#f3727f]' }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white font-bold text-xl">Exam Results</h1>
          <p className="text-[#b3b3b3] text-xs mt-0.5">HSK 3 Mock Test · {totalQ} questions</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">

        {/* Score hero */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">{grade.emoji}</div>
          <div className={`text-7xl font-bold mb-1 ${grade.color}`}>{overallPct}%</div>
          <p className={`font-bold text-xl ${grade.color}`}>{grade.label}</p>
          <p className="text-[#b3b3b3] text-sm mt-2">{totalCorrect} / {totalQ} correct</p>

          {/* Score bar */}
          <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden max-w-xs mx-auto mt-4 mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${overallPct}%`,
                background: overallPct >= 60 ? '#1ed760' : overallPct >= 45 ? '#ffa42b' : '#f3727f',
              }}
            />
          </div>

          {/* Pass/fail + threshold */}
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold
              ${allPass ? 'bg-[#1ed760]/10 text-[#1ed760]' : 'bg-[#f3727f]/10 text-[#f3727f]'}`}>
              {allPass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {allPass ? 'All sections passed' : 'Some sections failed'}
            </span>
            <span className="text-[#4d4d4d] text-xs">Pass threshold: 60%</span>
          </div>
        </div>

        {/* Per-section breakdown */}
        <div>
          <p className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider mb-3">Section Breakdown</p>
          <div className="space-y-3">
            {results.map(r => (
              <SectionResult
                key={r.section.id}
                result={r}
                expanded={expandedSection === r.section.id}
                onToggle={() => setExpandedSection(
                  expandedSection === r.section.id ? null : r.section.id
                )}
              />
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl px-6 py-5 text-center">
          {allPass ? (
            <>
              <p className="text-[#1ed760] font-bold">🎊 Congratulations!</p>
              <p className="text-[#b3b3b3] text-sm mt-1">
                You passed all sections. Keep practicing to build confidence!
              </p>
            </>
          ) : (
            <>
              <p className="text-white font-bold">熟能生巧</p>
              <p className="text-[#1ed760] text-xs mt-0.5">Shú néng shēng qiǎo</p>
              <p className="text-[#b3b3b3] text-sm mt-2">
                "Practice makes perfect" — Review your mistakes and try again.
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="exam-home-btn"
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#252525]
              text-[#b3b3b3] hover:text-white font-semibold text-sm py-3.5 rounded-full
              border border-[#4d4d4d]/40 transition-all"
          >
            <Home size={16} /> Home
          </button>
          <button
            id="exam-retry-btn"
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64]
              text-black font-bold text-sm py-3.5 rounded-full active:scale-95 transition-all duration-150
              shadow-[0_2px_12px_rgba(30,215,96,0.25)]"
          >
            <RotateCcw size={16} /> Retry Exam
          </button>
        </div>
      </div>
    </div>
  )
}
