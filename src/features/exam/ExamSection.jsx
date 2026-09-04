import { useState } from 'react'
import { useSpeech } from '../listening/useSpeech'
import { Volume2 } from 'lucide-react'

// ─── Listening Question ───────────────────────────────────────────────────────
function ListeningQuestion({ q, answer, onAnswer }) {
  const { speak } = useSpeech()
  const done = answer !== undefined

  return (
    <div className="space-y-4">
      <div className="bg-[#121212] rounded-2xl p-5 text-center">
        <p className="text-white text-4xl font-bold mb-1">{q.prompt}</p>
        {q.pinyin && <p className="text-[#1ed760] text-sm">{q.pinyin}</p>}
        <button
          id={`listen-${q.id}`}
          onClick={() => speak(q.prompt, 0.9)}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#252525]
            text-[#b3b3b3] hover:text-[#1ed760] text-xs rounded-full border border-[#4d4d4d]/40 transition-all"
        >
          <Volume2 size={13} /> Play audio
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map(opt => {
          const sel = answer === opt
          const correct = opt === q.answer
          let cls = 'bg-[#1f1f1f] border-[#4d4d4d]/30 text-white hover:bg-[#252525]'
          if (done) {
            if (correct)       cls = 'bg-[#1ed760]/10 border-[#1ed760]/40 text-[#1ed760]'
            else if (sel)      cls = 'bg-[#f3727f]/10 border-[#f3727f]/40 text-[#f3727f]'
            else               cls = 'bg-[#1f1f1f] border-[#4d4d4d]/20 text-[#4d4d4d]'
          }
          return (
            <button key={opt} onClick={() => !done && onAnswer(opt)} disabled={done}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls} disabled:cursor-default`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Reading Question — Fill Blank / Match / True-False ──────────────────────
function ReadingQuestion({ q, answer, onAnswer }) {
  const done = answer !== undefined
  const isTF = q.type === 'true-false'

  return (
    <div className="space-y-4">
      <div className="bg-[#121212] rounded-2xl p-5">
        <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {q.prompt}
        </pre>
      </div>
      <div className={`grid gap-2 ${isTF ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {q.options.map(opt => {
          const sel = answer === opt
          const correct = opt === q.answer
          let cls = 'bg-[#1f1f1f] border-[#4d4d4d]/30 text-white hover:bg-[#252525]'
          if (done) {
            if (correct)   cls = 'bg-[#1ed760]/10 border-[#1ed760]/40 text-[#1ed760]'
            else if (sel)  cls = 'bg-[#f3727f]/10 border-[#f3727f]/40 text-[#f3727f]'
            else           cls = 'bg-[#1f1f1f] border-[#4d4d4d]/20 text-[#4d4d4d]'
          }
          return (
            <button key={opt} onClick={() => !done && onAnswer(opt)} disabled={done}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls} disabled:cursor-default`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Writing Question — Arrange words ────────────────────────────────────────
function WritingQuestion({ q, answer, onAnswer }) {
  const [selected, setSelected] = useState([])
  const [remaining, setRemaining] = useState([...q.words])
  const done = answer !== undefined
  const assembled = selected.join('')
  const isCorrect = done && assembled === q.answer

  function pick(w, i) {
    if (done) return
    setSelected(p => [...p, w])
    setRemaining(p => { const n=[...p]; n.splice(i,1); return n })
  }

  function undo() {
    if (done || selected.length === 0) return
    const last = selected[selected.length - 1]
    setSelected(p => p.slice(0, -1))
    setRemaining(p => [...p, last])
  }

  function submit() {
    if (!selected.length) return
    onAnswer(assembled)
  }

  return (
    <div className="space-y-3">
      <p className="text-[#b3b3b3] text-xs">{q.instruction}</p>
      {/* Assembly area */}
      <div className={`min-h-[48px] bg-[#121212] rounded-xl px-4 py-3 border flex flex-wrap items-center gap-1
        ${done ? (isCorrect ? 'border-[#1ed760]/40' : 'border-[#f3727f]/40') : 'border-[#4d4d4d]/30'}`}>
        {selected.length === 0
          ? <span className="text-[#4d4d4d] text-sm">Tap words to build your sentence…</span>
          : selected.map((w, i) => (
            <span key={i} className="text-white font-medium text-base">{w}</span>
          ))
        }
      </div>
      {/* Word tiles */}
      {!done && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((w, i) => (
            <button key={i} onClick={() => pick(w, i)}
              className="px-3 py-1.5 bg-[#252525] hover:bg-[#2e2e2e] border border-[#4d4d4d]/40
                text-white text-sm rounded-lg transition-all active:scale-95">
              {w}
            </button>
          ))}
        </div>
      )}
      {!done && (
        <div className="flex gap-2">
          <button onClick={undo} disabled={selected.length===0}
            className="px-3 py-2 text-xs text-[#b3b3b3] hover:text-white bg-[#1f1f1f] rounded-lg border border-[#4d4d4d]/40 disabled:opacity-40">
            ← Undo
          </button>
          <button onClick={submit} disabled={selected.length===0}
            className="flex-1 py-2 text-sm font-semibold bg-[#1f1f1f] hover:bg-[#252525] text-white rounded-lg border border-[#4d4d4d]/40 disabled:opacity-40">
            Confirm
          </button>
        </div>
      )}
      {done && (
        <div className={`text-sm px-3 py-2 rounded-lg ${isCorrect ? 'bg-[#1ed760]/10 text-[#1ed760]' : 'bg-[#f3727f]/10 text-[#f3727f]'}`}>
          {isCorrect ? '✓ Correct!' : <>✗ Answer: <span className="font-bold">{q.answer}</span></>}
        </div>
      )}
    </div>
  )
}

// ─── ExamSection — renders all questions for one section ──────────────────────
export default function ExamSection({ section, questions, answers, onAnswer, currentQ, onJumpTo }) {
  const q = questions[currentQ]
  const sectionColor = section.color

  return (
    <div className="flex-1 flex flex-col gap-5 px-6 py-5 max-w-2xl mx-auto w-full">

      {/* Question navigator dots */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {questions.map((_, i) => {
          const answered = answers[i] !== undefined
          const active   = i === currentQ
          return (
            <button
              key={i}
              id={`q-dot-${i}`}
              onClick={() => onJumpTo(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all
                ${active ? 'ring-2 ring-offset-1 ring-offset-[#121212]' : ''}
              `}
              style={{
                background: active ? sectionColor : answered ? `${sectionColor}30` : '#252525',
                color:      active ? '#000' : answered ? sectionColor : '#b3b3b3',
                ringColor:  sectionColor,
              }}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Question card */}
      <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5 space-y-4 flex-1">
        {/* Q header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${sectionColor}18`, color: sectionColor }}>
              Q{currentQ + 1} / {questions.length}
            </span>
            <span className="text-[#b3b3b3] text-xs capitalize">
              {q.type?.replace('-', ' ')}
            </span>
          </div>
          {answers[currentQ] !== undefined && (
            <span className={`text-xs font-semibold ${answers[currentQ] === q.answer ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
              {answers[currentQ] === q.answer ? '✓' : '✗'}
            </span>
          )}
        </div>

        {/* Question body */}
        {section.id === 'listening' && (
          <ListeningQuestion
            key={q.id}
            q={q}
            answer={answers[currentQ]}
            onAnswer={ans => onAnswer(currentQ, ans)}
          />
        )}
        {section.id === 'reading' && (
          <ReadingQuestion
            key={q.id}
            q={q}
            answer={answers[currentQ]}
            onAnswer={ans => onAnswer(currentQ, ans)}
          />
        )}
        {section.id === 'writing' && (
          <WritingQuestion
            key={q.id}
            q={q}
            answer={answers[currentQ]}
            onAnswer={ans => onAnswer(currentQ, ans)}
          />
        )}

        {/* Explanation (shown after answer) */}
        {answers[currentQ] !== undefined && q.explanation && (
          <div className="bg-[#121212] border-l-2 border-[#1ed760]/40 rounded-r-xl px-4 py-3 text-xs text-[#b3b3b3] leading-relaxed">
            💡 {q.explanation}
          </div>
        )}
      </div>
    </div>
  )
}
