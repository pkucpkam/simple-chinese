import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import ExamTimer from './ExamTimer'
import ExamSection from './ExamSection'
import { EXAM_SECTIONS, ALL_QUESTIONS } from '../../data/data'

export default function ExamSession({ onFinish }) {
  const [sectionIdx, setSectionIdx] = useState(0)
  const [currentQ, setCurrentQ]     = useState(0)
  // answers[sectionId][qIdx] = userAnswer
  const [answers, setAnswers] = useState({ listening: {}, reading: {}, writing: {} })
  const [timerKey, setTimerKey]     = useState(0) // force re-mount timer on section change
  const [transitioning, setTransitioning] = useState(false)

  const section   = EXAM_SECTIONS[sectionIdx]
  const questions = ALL_QUESTIONS[section.id]
  const sectionAnswers = answers[section.id]

  const answeredCount = Object.keys(sectionAnswers).length
  const totalQ        = questions.length

  const handleAnswer = useCallback((qIdx, ans) => {
    setAnswers(prev => ({
      ...prev,
      [section.id]: { ...prev[section.id], [qIdx]: ans },
    }))
    // Auto-advance to next unanswered
    const nextUnanswered = questions.findIndex((_, i) => i > qIdx && prev[section.id]?.[i] === undefined)
    if (nextUnanswered !== -1) {
      setTimeout(() => setCurrentQ(nextUnanswered), 350)
    }
  }, [section.id, questions])

  function advanceSection() {
    if (sectionIdx + 1 >= EXAM_SECTIONS.length) {
      // Build final results
      const results = EXAM_SECTIONS.map(sec => {
        const qs  = ALL_QUESTIONS[sec.id]
        const ans = answers[sec.id]
        const correct = qs.filter((q, i) => ans[i] === q.answer).length
        return { section: sec, questions: qs, answers: ans, correct, total: qs.length }
      })
      onFinish(results)
    } else {
      setTransitioning(true)
      setTimeout(() => {
        setSectionIdx(i => i + 1)
        setCurrentQ(0)
        setTimerKey(k => k + 1)
        setTransitioning(false)
      }, 400)
    }
  }

  const handleTimerExpire = useCallback(() => {
    advanceSection()
  }, [sectionIdx, answers])

  const isLastSection = sectionIdx + 1 >= EXAM_SECTIONS.length
  const answeredAll   = answeredCount >= totalQ

  return (
    <div className={`min-h-full flex flex-col transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-3">
        <div className="max-w-2xl mx-auto">
          {/* Section tabs */}
          <div className="flex items-center gap-3 mb-3">
            {EXAM_SECTIONS.map((sec, i) => (
              <div
                key={sec.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${i === sectionIdx
                    ? 'text-black'
                    : i < sectionIdx
                      ? 'text-[#1ed760] bg-[#1ed760]/10'
                      : 'text-[#4d4d4d] bg-[#1f1f1f]'
                  }`}
                style={i === sectionIdx ? { background: sec.color } : {}}
              >
                <span>{sec.icon}</span>
                <span className="hidden sm:inline">{sec.labelEn}</span>
                {i < sectionIdx && <span>✓</span>}
              </div>
            ))}
            <div className="flex-1" />
            {/* Timer */}
            <ExamTimer
              key={timerKey + '-' + section.id}
              totalSec={section.timeLimitSec}
              onExpire={handleTimerExpire}
            />
          </div>

          {/* Progress bar for current section */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(answeredCount / totalQ) * 100}%`,
                  background: section.color,
                }}
              />
            </div>
            <span className="text-[#b3b3b3] text-xs shrink-0">
              {answeredCount}/{totalQ}
            </span>
          </div>
        </div>
      </div>

      {/* ── Question area ── */}
      <ExamSection
        section={section}
        questions={questions}
        answers={sectionAnswers}
        onAnswer={handleAnswer}
        currentQ={currentQ}
        onJumpTo={setCurrentQ}
      />

      {/* ── Bottom nav ── */}
      <div className="sticky bottom-0 bg-[#121212]/95 backdrop-blur-md border-t border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            id="prev-q-btn"
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="w-10 h-10 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] flex items-center justify-center
              text-[#b3b3b3] hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            id="next-q-btn"
            onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))}
            disabled={currentQ === totalQ - 1}
            className="w-10 h-10 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] flex items-center justify-center
              text-[#b3b3b3] hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex-1" />

          <button
            id="next-section-btn"
            onClick={advanceSection}
            className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-150 active:scale-95
              ${answeredAll
                ? 'bg-[#1ed760] hover:bg-[#1fdf64] text-black shadow-[0_2px_12px_rgba(30,215,96,0.3)]'
                : 'bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white border border-[#4d4d4d]/40'
              }`}
          >
            <SkipForward size={15} />
            {isLastSection
              ? answeredAll ? 'Submit Exam' : 'Finish Section'
              : answeredAll ? `Next: ${EXAM_SECTIONS[sectionIdx + 1]?.labelEn}` : 'Skip Section'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
