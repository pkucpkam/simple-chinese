import { RotateCcw, Home, Trophy, CheckCircle2, XCircle, Volume2 } from 'lucide-react'
import { useSpeech } from './useSpeech'

export default function ResultScreen({ results, session, onRestart, onHome }) {
  const { speak } = useSpeech()
  const correct = results.filter(r => r.correct).length
  const total = results.length
  const score = Math.round((correct / total) * 100)
  const wrong = results.filter(r => !r.correct)

  const grade =
    score >= 90 ? { label: 'Excellent!',   emoji: '🏆', color: 'text-[#1ed760]' } :
    score >= 70 ? { label: 'Good job!',    emoji: '👍', color: 'text-[#539df5]' } :
    score >= 50 ? { label: 'Keep going!',  emoji: '💪', color: 'text-[#ffa42b]' } :
                  { label: 'Practice more', emoji: '📚', color: 'text-[#f3727f]' }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-white font-bold text-xl">Session Complete</h1>
          <p className="text-[#b3b3b3] text-xs mt-0.5">
            {session.mode === 'multiple-choice' ? 'Multiple Choice' : 'Type Pinyin'} ·{' '}
            {total} questions
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8 space-y-6">

        {/* Score Hero */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">{grade.emoji}</div>
          <div className={`text-6xl font-bold mb-1 ${grade.color}`}>{score}%</div>
          <p className={`font-bold text-lg ${grade.color}`}>{grade.label}</p>
          <p className="text-[#b3b3b3] text-sm mt-2">
            {correct} / {total} correct
          </p>

          {/* Mini bar */}
          <div className="mt-5 h-2 bg-[#1f1f1f] rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                background: score >= 70 ? '#1ed760' : score >= 50 ? '#ffa42b' : '#f3727f',
              }}
            />
          </div>

          {/* Stat pills */}
          <div className="flex gap-3 justify-center mt-4">
            <div className="flex items-center gap-1.5 bg-[#1ed760]/10 text-[#1ed760] px-3 py-1.5 rounded-full text-sm font-semibold">
              <CheckCircle2 size={14} /> {correct} correct
            </div>
            <div className="flex items-center gap-1.5 bg-[#f3727f]/10 text-[#f3727f] px-3 py-1.5 rounded-full text-sm font-semibold">
              <XCircle size={14} /> {total - correct} wrong
            </div>
          </div>
        </div>

        {/* Wrong answers review */}
        {wrong.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={15} className="text-[#f3727f]" />
              <span className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">
                Review mistakes ({wrong.length})
              </span>
            </div>
            <div className="space-y-2">
              {wrong.map(({ word }) => (
                <div
                  key={word.id}
                  className="bg-[#181818] border border-[#f3727f]/10 rounded-2xl px-5 py-4 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-bold text-2xl">{word.hanzi}</span>
                      <span className="text-[#1ed760] text-sm">{word.pinyin}</span>
                    </div>
                    <p className="text-[#b3b3b3] text-sm mt-0.5">{word.meaning}</p>
                  </div>
                  <button
                    id={`replay-${word.id}`}
                    onClick={() => speak(word.hanzi, 0.7)}
                    className="w-10 h-10 rounded-full bg-[#1f1f1f] hover:bg-[#252525] flex items-center justify-center
                      text-[#b3b3b3] hover:text-[#1ed760] transition-all shrink-0"
                    title="Replay audio"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All correct! */}
        {wrong.length === 0 && (
          <div className="bg-[#1ed760]/10 border border-[#1ed760]/20 rounded-2xl px-5 py-4 text-center">
            <p className="text-[#1ed760] font-bold">Perfect score! 🎊</p>
            <p className="text-[#b3b3b3] text-sm mt-1">You got every question right.</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="result-home-btn"
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#252525]
              text-[#b3b3b3] hover:text-white font-semibold text-sm py-3.5 rounded-full
              border border-[#4d4d4d]/40 transition-all"
          >
            <Home size={16} /> Setup
          </button>
          <button
            id="result-restart-btn"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64]
              text-black font-bold text-sm py-3.5 rounded-full active:scale-95 transition-all duration-150"
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
