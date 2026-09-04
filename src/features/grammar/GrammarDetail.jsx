import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, XCircle, BookOpen } from 'lucide-react'
import { ExerciseMC, ExerciseFillBlank, ExerciseArrange } from './ExerciseComponents'

const HSK_COLORS = {
  1: { badge: 'bg-[#1ed760]/15 text-[#1ed760]', border: 'border-[#1ed760]/20', glow: '#1ed760' },
  2: { badge: 'bg-[#539df5]/15 text-[#539df5]', border: 'border-[#539df5]/20', glow: '#539df5' },
  3: { badge: 'bg-[#ffa42b]/15 text-[#ffa42b]', border: 'border-[#ffa42b]/20', glow: '#ffa42b' },
}

export default function GrammarDetail({ point, onBack }) {
  const [expandedEx, setExpandedEx]   = useState(false)
  const [answered, setAnswered]       = useState({})   // { exerciseId: userAnswer }
  const [showExplain, setShowExplain] = useState({})   // { exerciseId: true }

  const colors = HSK_COLORS[point.hsk]

  const totalEx    = point.exercises.length
  const doneCount  = Object.keys(answered).length
  const correctCount = point.exercises.filter(e => {
    const ua = answered[e.id]
    return ua !== undefined && ua === e.answer
  }).length

  function handleAnswer(exId, answer) {
    setAnswered(prev => ({ ...prev, [exId]: answer }))
    setShowExplain(prev => ({ ...prev, [exId]: true }))
  }

  function isCorrect(ex) {
    return answered[ex.id] !== undefined && answered[ex.id] === ex.answer
  }

  const allDone = doneCount === totalEx

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            id="grammar-back-btn"
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-lg truncate">{point.pattern}</h1>
              <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                HSK {point.hsk}
              </span>
            </div>
            <p className="text-[#b3b3b3] text-xs mt-0.5 truncate">{point.title}</p>
          </div>
          {allDone && (
            <div className="shrink-0 text-right">
              <p className={`text-sm font-bold ${correctCount === totalEx ? 'text-[#1ed760]' : 'text-[#ffa42b]'}`}>
                {correctCount}/{totalEx}
              </p>
              <p className="text-[#b3b3b3] text-xs">score</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">

        {/* Summary card */}
        <div className={`bg-[#181818] border ${colors.border} rounded-2xl p-5`}>
          <p className="text-[#b3b3b3] text-sm leading-relaxed">{point.summary}</p>
        </div>

        {/* Explanation (collapsible) */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl overflow-hidden">
          <button
            id="toggle-explanation-btn"
            onClick={() => setExpandedEx(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#1ed760]" />
              <span className="text-white font-semibold text-sm">Explanation & Pattern</span>
            </div>
            {expandedEx ? <ChevronUp size={16} className="text-[#b3b3b3]" /> : <ChevronDown size={16} className="text-[#b3b3b3]" />}
          </button>
          {expandedEx && (
            <div className="px-5 pb-5 border-t border-[#4d4d4d]/20 pt-4 space-y-4">
              <pre className="text-[#b3b3b3] text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {point.explanation}
              </pre>
              {/* Examples */}
              <div className="space-y-3">
                <p className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">Examples</p>
                {point.examples.map((ex, i) => (
                  <div key={i} className="bg-[#121212] rounded-xl px-4 py-3">
                    <p className="text-white font-bold text-base">{ex.zh}</p>
                    <p className="text-[#1ed760] text-xs mt-0.5">{ex.pinyin}</p>
                    <p className="text-[#b3b3b3] text-xs mt-0.5">{ex.en}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">
              Exercises
            </p>
            <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
              <span className="text-white font-semibold">{doneCount}</span> / {totalEx} done
            </div>
          </div>

          <div className="space-y-4">
            {point.exercises.map((ex, idx) => {
              const done  = answered[ex.id] !== undefined
              const ok    = isCorrect(ex)
              const showExpl = showExplain[ex.id]

              return (
                <div
                  key={ex.id}
                  className={`bg-[#181818] rounded-2xl border p-5 space-y-4 transition-all duration-200
                    ${done
                      ? ok ? 'border-[#1ed760]/20' : 'border-[#f3727f]/20'
                      : 'border-[#4d4d4d]/20'
                    }`}
                >
                  {/* Exercise header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#4d4d4d] text-xs font-medium">#{idx + 1}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${ex.type === 'multiple-choice' ? 'bg-[#539df5]/10 text-[#539df5]'
                          : ex.type === 'fill-blank' ? 'bg-[#ffa42b]/10 text-[#ffa42b]'
                          : 'bg-[#1ed760]/10 text-[#1ed760]'
                        }`}>
                        {ex.type === 'multiple-choice' ? 'Multiple Choice'
                          : ex.type === 'fill-blank' ? 'Fill in the Blank'
                          : 'Arrange Words'}
                      </span>
                    </div>
                    {done && (
                      ok
                        ? <CheckCircle2 size={16} className="text-[#1ed760]" />
                        : <XCircle size={16} className="text-[#f3727f]" />
                    )}
                  </div>

                  {/* Exercise content */}
                  {ex.type === 'multiple-choice' && (
                    <ExerciseMC
                      exercise={ex}
                      answered={done}
                      userAnswer={answered[ex.id]}
                      onAnswer={(ans) => handleAnswer(ex.id, ans)}
                    />
                  )}
                  {ex.type === 'fill-blank' && (
                    <ExerciseFillBlank
                      exercise={ex}
                      answered={done}
                      userAnswer={answered[ex.id]}
                      onAnswer={(ans) => handleAnswer(ex.id, ans)}
                    />
                  )}
                  {ex.type === 'arrange' && (
                    <ExerciseArrange
                      key={ex.id}
                      exercise={ex}
                      answered={done}
                      userAnswer={answered[ex.id]}
                      onAnswer={(ans) => handleAnswer(ex.id, ans)}
                    />
                  )}

                  {/* Explanation after answer */}
                  {done && showExpl && ex.explanation && (
                    <div className="bg-[#121212] rounded-xl px-4 py-3 text-xs text-[#b3b3b3] leading-relaxed border-l-2 border-[#1ed760]/40">
                      💡 {ex.explanation}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Final score */}
        {allDone && (
          <div className={`rounded-2xl border p-6 text-center
            ${correctCount === totalEx
              ? 'bg-[#1ed760]/10 border-[#1ed760]/30'
              : correctCount >= totalEx / 2
                ? 'bg-[#ffa42b]/10 border-[#ffa42b]/30'
                : 'bg-[#f3727f]/10 border-[#f3727f]/30'
            }`}
          >
            <div className="text-4xl mb-2">
              {correctCount === totalEx ? '🎉' : correctCount >= totalEx / 2 ? '👍' : '📚'}
            </div>
            <p className={`text-2xl font-bold ${
              correctCount === totalEx ? 'text-[#1ed760]'
                : correctCount >= totalEx / 2 ? 'text-[#ffa42b]'
                : 'text-[#f3727f]'
            }`}>
              {correctCount} / {totalEx}
            </p>
            <p className="text-[#b3b3b3] text-sm mt-1">
              {correctCount === totalEx ? 'Perfect! You\'ve mastered this pattern.' : 'Review the explanations above and try again.'}
            </p>
            <button
              id="back-to-list-btn"
              onClick={onBack}
              className="mt-4 px-6 py-2.5 bg-[#1f1f1f] hover:bg-[#252525] text-white text-sm font-medium
                rounded-full border border-[#4d4d4d]/40 transition-all"
            >
              ← Back to Grammar List
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
