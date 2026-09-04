import { useState } from 'react'
import { Check, X, Lightbulb } from 'lucide-react'

/** Multiple Choice Exercise */
export function ExerciseMC({ exercise, onAnswer, answered, userAnswer }) {
  return (
    <div className="space-y-3">
      <p className="text-white text-sm font-medium leading-relaxed">{exercise.question}</p>
      <div className="grid grid-cols-1 gap-2">
        {exercise.options.map((opt) => {
          const isSelected = userAnswer === opt
          const isCorrect  = opt === exercise.answer
          let cls = 'bg-[#1f1f1f] border-[#4d4d4d]/30 text-white hover:bg-[#252525] hover:border-[#4d4d4d]'
          if (answered) {
            if (isCorrect)              cls = 'bg-[#1ed760]/10 border-[#1ed760]/50 text-[#1ed760]'
            else if (isSelected)        cls = 'bg-[#f3727f]/10 border-[#f3727f]/50 text-[#f3727f]'
            else                        cls = 'bg-[#1f1f1f] border-[#4d4d4d]/20 text-[#4d4d4d]'
          }
          return (
            <button
              key={opt}
              onClick={() => !answered && onAnswer(opt)}
              disabled={answered}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${cls} disabled:cursor-default`}
            >
              <span className="leading-snug">{opt}</span>
              {answered && isCorrect  && <span className="ml-2 opacity-70 text-xs">✓</span>}
              {answered && isSelected && !isCorrect && <span className="ml-2 opacity-70 text-xs">✗</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Fill in the Blank Exercise */
export function ExerciseFillBlank({ exercise, onAnswer, answered, userAnswer }) {
  const [value, setValue] = useState(userAnswer || '')
  const isCorrect = answered && value.trim() === exercise.answer

  function handleSubmit() {
    if (!value.trim()) return
    onAnswer(value.trim())
  }

  return (
    <div className="space-y-3">
      <p className="text-white text-sm font-medium leading-relaxed">{exercise.question}</p>
      {exercise.hint && !answered && (
        <p className="text-[#b3b3b3] text-xs flex items-center gap-1.5">
          <Lightbulb size={12} className="text-[#ffa42b]" /> {exercise.hint}
        </p>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !answered && handleSubmit()}
          disabled={answered}
          placeholder="Type your answer…"
          className={`flex-1 bg-[#1f1f1f] text-white text-sm rounded-xl px-4 py-2.5
            border placeholder-[#4d4d4d] transition-colors
            ${answered
              ? isCorrect ? 'border-[#1ed760]/60' : 'border-[#f3727f]/60'
              : 'border-[#4d4d4d]/40 focus:border-[#1ed760]/50'
            }`}
          autoFocus={!answered}
        />
        {!answered && (
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="px-4 py-2.5 bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white text-sm font-medium
              rounded-xl border border-[#4d4d4d]/40 disabled:opacity-40 transition-all"
          >
            Check
          </button>
        )}
      </div>
      {answered && (
        <div className={`text-sm px-3 py-2 rounded-lg ${isCorrect ? 'text-[#1ed760] bg-[#1ed760]/10' : 'text-[#f3727f] bg-[#f3727f]/10'}`}>
          {isCorrect ? '✓ Correct!' : <>✗ Answer: <span className="font-bold">{exercise.answer}</span></>}
        </div>
      )}
    </div>
  )
}

/** Word Arrangement Exercise */
export function ExerciseArrange({ exercise, onAnswer, answered, userAnswer }) {
  const [selected, setSelected] = useState([])
  const [remaining, setRemaining] = useState([...exercise.words])

  const assembled = selected.join('')
  const isCorrect  = answered && assembled === exercise.answer

  function pickWord(word, idx) {
    if (answered) return
    setSelected(prev => [...prev, word])
    setRemaining(prev => {
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }

  function unpickLast() {
    if (answered || selected.length === 0) return
    const last = selected[selected.length - 1]
    setSelected(prev => prev.slice(0, -1))
    setRemaining(prev => [...prev, last])
  }

  function handleSubmit() {
    if (selected.length === 0) return
    onAnswer(assembled)
  }

  return (
    <div className="space-y-3">
      <p className="text-white text-sm font-medium">{exercise.question}</p>

      {/* Assembly area */}
      <div className={`min-h-[44px] bg-[#1f1f1f] rounded-xl px-4 py-2.5 border flex items-center flex-wrap gap-1.5
        ${answered
          ? isCorrect ? 'border-[#1ed760]/50' : 'border-[#f3727f]/50'
          : 'border-[#4d4d4d]/40'
        }`}
      >
        {selected.length === 0
          ? <span className="text-[#4d4d4d] text-sm">Tap words below to build the sentence…</span>
          : selected.map((w, i) => (
            <span key={i} className="text-white text-sm font-medium">{w}</span>
          ))
        }
      </div>

      {/* Available words */}
      {!answered && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((w, i) => (
            <button
              key={i}
              onClick={() => pickWord(w, i)}
              className="px-3 py-1.5 bg-[#252525] hover:bg-[#2e2e2e] border border-[#4d4d4d]/40 hover:border-[#4d4d4d]
                text-white text-sm rounded-lg transition-all active:scale-95"
            >
              {w}
            </button>
          ))}
        </div>
      )}

      {!answered && (
        <div className="flex gap-2">
          <button
            onClick={unpickLast}
            disabled={selected.length === 0}
            className="px-3 py-2 text-xs text-[#b3b3b3] hover:text-white bg-[#1f1f1f] rounded-lg border border-[#4d4d4d]/40 disabled:opacity-40 transition-all"
          >
            ← Undo
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="flex-1 py-2 text-sm font-semibold bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white
              rounded-lg border border-[#4d4d4d]/40 disabled:opacity-40 transition-all"
          >
            Submit
          </button>
        </div>
      )}

      {answered && (
        <div className={`text-sm px-3 py-2 rounded-lg ${isCorrect ? 'text-[#1ed760] bg-[#1ed760]/10' : 'text-[#f3727f] bg-[#f3727f]/10'}`}>
          {isCorrect ? '✓ Correct!' : <>✗ Answer: <span className="font-bold">{exercise.answer}</span></>}
        </div>
      )}
    </div>
  )
}
