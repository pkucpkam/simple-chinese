import { RotateCcw, Home, Volume2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useSpeech } from '../listening/useSpeech'

export default function WritingResult({ results, session, onRestart, onHome }) {
  const { speak } = useSpeech()
  const total   = results.length
  const perfect = results.filter(r => r.mistakes === 0).length
  const score   = total > 0 ? Math.round((perfect / total) * 100) : 0

  const grade =
    score >= 90 ? { emoji: '🏆', label: 'Excellent!',   color: 'text-[#1ed760]' } :
    score >= 70 ? { emoji: '👍', label: 'Great work!',  color: 'text-[#539df5]' } :
    score >= 50 ? { emoji: '💪', label: 'Keep at it!',  color: 'text-[#ffa42b]' } :
                  { emoji: '📚', label: 'Practice more', color: 'text-[#f3727f]' }

  const needsWork = results.filter(r => r.mistakes > 0)

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-white font-bold text-xl">Session Complete</h1>
          <p className="text-[#b3b3b3] text-xs mt-0.5">{total} characters practiced</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8 space-y-6">

        {/* Score */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-3xl p-8 text-center">
          <div className="text-5xl mb-3">{grade.emoji}</div>
          <div className={`text-6xl font-bold mb-1 ${grade.color}`}>{score}%</div>
          <p className={`font-bold text-lg ${grade.color}`}>{grade.label}</p>
          <p className="text-[#b3b3b3] text-sm mt-1">{perfect} / {total} perfect</p>

          <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden max-w-xs mx-auto mt-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                background: score >= 70 ? '#1ed760' : score >= 50 ? '#ffa42b' : '#f3727f',
              }}
            />
          </div>

          {/* Summary pills */}
          <div className="flex gap-3 justify-center mt-4">
            <div className="flex items-center gap-1.5 bg-[#1ed760]/10 text-[#1ed760] px-3 py-1.5 rounded-full text-sm font-semibold">
              <CheckCircle2 size={14} /> {perfect} perfect
            </div>
            {needsWork.length > 0 && (
              <div className="flex items-center gap-1.5 bg-[#ffa42b]/10 text-[#ffa42b] px-3 py-1.5 rounded-full text-sm font-semibold">
                <AlertCircle size={14} /> {needsWork.length} with mistakes
              </div>
            )}
          </div>
        </div>

        {/* Breakdown table */}
        {results.length > 0 && (
          <section>
            <p className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider mb-3">
              All Characters
            </p>
            <div className="space-y-2">
              {results.map(({ word, char, mistakes }, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 bg-[#181818] rounded-2xl px-5 py-3.5 border
                    ${mistakes === 0 ? 'border-[#1ed760]/10' : mistakes <= 3 ? 'border-[#ffa42b]/10' : 'border-[#f3727f]/10'}`}
                >
                  <span className="text-white font-bold text-2xl w-12 text-center shrink-0">{char}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1ed760] text-xs">{word.pinyin}</p>
                    <p className="text-[#b3b3b3] text-xs truncate">{word.meaning}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${mistakes === 0
                        ? 'bg-[#1ed760]/15 text-[#1ed760]'
                        : mistakes <= 3
                          ? 'bg-[#ffa42b]/15 text-[#ffa42b]'
                          : 'bg-[#f3727f]/15 text-[#f3727f]'
                      }`}>
                      {mistakes === 0 ? '✓ Perfect' : `${mistakes} miss`}
                    </span>
                    <button
                      id={`replay-${i}`}
                      onClick={() => speak(char, 0.8)}
                      className="w-8 h-8 rounded-full bg-[#1f1f1f] hover:bg-[#252525] flex items-center justify-center
                        text-[#b3b3b3] hover:text-[#1ed760] transition-all"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="writing-home-btn"
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-[#1f1f1f] hover:bg-[#252525]
              text-[#b3b3b3] hover:text-white font-semibold text-sm py-3.5 rounded-full
              border border-[#4d4d4d]/40 transition-all"
          >
            <Home size={16} /> Setup
          </button>
          <button
            id="writing-restart-btn"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64]
              text-black font-bold text-sm py-3.5 rounded-full active:scale-95 transition-all duration-150"
          >
            <RotateCcw size={16} /> Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}
