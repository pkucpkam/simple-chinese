import { useState, useCallback } from 'react'
import { ChevronRight, Eye, EyeOff, Trophy, Pencil, Layers } from 'lucide-react'
import HanziWriterCanvas from './HanziWriterCanvas'

export default function WritingSession({ session, onFinish }) {
  const { words, mode } = session

  const [charIndex, setCharIndex]     = useState(0)
  const [sessionLog, setSessionLog]   = useState([])   // { word, mistakes }
  const [quizDone, setQuizDone]       = useState(false)
  const [mistakes, setMistakes]       = useState(null) // null = in-progress
  const [showInfo, setShowInfo]       = useState(false)
  const [animMode, setAnimMode]       = useState(mode) // can switch per char

  const current   = words[charIndex]
  const charToWrite = [...current.hanzi][0]  // first char of word
  const isLast    = charIndex + 1 >= words.length
  const progress  = ((charIndex) / words.length) * 100

  const handleQuizComplete = useCallback((summary) => {
    setMistakes(summary.totalMistakes ?? 0)
    setQuizDone(true)
    setSessionLog(prev => [
      ...prev,
      { word: current, mistakes: summary.totalMistakes ?? 0, char: charToWrite },
    ])
  }, [current, charToWrite])

  function handleAnimComplete() {
    // In animate mode, mark as "done" after watching
    setQuizDone(true)
    setSessionLog(prev => [...prev, { word: current, mistakes: 0, char: charToWrite }])
  }

  function handleNext() {
    if (isLast) {
      onFinish(sessionLog)
    } else {
      setCharIndex(i => i + 1)
      setQuizDone(false)
      setMistakes(null)
      setShowInfo(false)
    }
  }

  // For animate mode, allow proceeding anytime after a second
  const [animReady, setAnimReady] = useState(false)
  // Reset animReady on char change
  const handleCanvasKey = charIndex + '-' + animMode

  return (
    <div className="min-h-full flex flex-col">
      {/* ── Progress bar ── */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-md px-6 py-4 border-b border-[#4d4d4d]/20">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[#b3b3b3] text-xs font-medium">
              Character <span className="text-white font-bold">{charIndex + 1}</span> / {words.length}
            </span>
            <div className="flex items-center gap-1.5">
              {animMode === 'animate'
                ? <><Layers size={12} className="text-[#1ed760]" /><span className="text-[#b3b3b3] text-xs">Watch & Learn</span></>
                : <><Pencil size={12} className="text-[#539df5]" /><span className="text-[#b3b3b3] text-xs">Draw Quiz</span></>
              }
            </div>
          </div>
          <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1ed760] rounded-full transition-all duration-500"
              style={{ width: `${((charIndex + (quizDone ? 1 : 0)) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col items-center px-6 py-6 max-w-xl mx-auto w-full gap-5">

        {/* Word info bar */}
        <div className="w-full flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-3xl font-bold">{current.hanzi}</span>
              <span className="text-[#1ed760] text-base">{current.pinyin}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-1
                ${current.hsk === 1 ? 'bg-[#1ed760]/15 text-[#1ed760]'
                  : current.hsk === 2 ? 'bg-[#539df5]/15 text-[#539df5]'
                  : 'bg-[#ffa42b]/15 text-[#ffa42b]'}`
              }>HSK {current.hsk}</span>
            </div>
            <p className="text-[#b3b3b3] text-sm mt-0.5">{current.meaning}</p>
          </div>
          <button
            id="toggle-info-btn"
            onClick={() => setShowInfo(v => !v)}
            className="p-2 rounded-lg text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f] transition-colors"
          >
            {showInfo ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Example sentence */}
        {showInfo && current.example && (
          <div className="w-full bg-[#181818] border border-[#4d4d4d]/20 rounded-xl px-4 py-3 animate-in fade-in duration-200">
            <p className="text-[#b3b3b3] text-xs leading-relaxed">{current.example}</p>
          </div>
        )}

        {/* Mode switcher per character */}
        <div className="flex gap-1.5 bg-[#1f1f1f] p-1 rounded-full">
          {[
            { id: 'animate', icon: Layers,  label: 'Watch' },
            { id: 'quiz',    icon: Pencil,  label: 'Draw'  },
          ].map(m => (
            <button
              key={m.id}
              id={`switch-mode-${m.id}`}
              onClick={() => { setAnimMode(m.id); setQuizDone(false); setMistakes(null) }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                ${animMode === m.id
                  ? m.id === 'animate' ? 'bg-[#1ed760] text-black' : 'bg-[#539df5] text-black'
                  : 'text-[#b3b3b3] hover:text-white'
                }`}
            >
              <m.icon size={12} /> {m.label}
            </button>
          ))}
        </div>

        {/* ── Hanzi Writer Canvas ── */}
        <div className="w-full flex justify-center">
          <HanziWriterCanvas
            key={handleCanvasKey}
            character={charToWrite}
            mode={animMode}
            onComplete={animMode === 'quiz' ? handleQuizComplete : undefined}
          />
        </div>

        {/* Hint for draw mode */}
        {animMode === 'quiz' && !quizDone && (
          <p className="text-[#4d4d4d] text-xs text-center">
            Draw each stroke in the correct order. You'll get a hint after 3 mistakes.
          </p>
        )}

        {/* Animate mode: "Continue" available after viewing */}
        {animMode === 'animate' && (
          <div className="w-full space-y-2">
            <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-xl px-4 py-3 text-center">
              <p className="text-[#b3b3b3] text-xs">
                Watch the stroke animation, then switch to <span className="text-[#539df5] font-medium">Draw</span> to practice.
              </p>
            </div>
          </div>
        )}

        {/* Quiz done: result */}
        {animMode === 'quiz' && quizDone && mistakes !== null && (
          <div className={`w-full rounded-2xl border px-5 py-4 text-center
            ${mistakes === 0
              ? 'bg-[#1ed760]/10 border-[#1ed760]/30'
              : mistakes <= 3
                ? 'bg-[#ffa42b]/10 border-[#ffa42b]/30'
                : 'bg-[#f3727f]/10 border-[#f3727f]/30'
            }`}
          >
            <div className="text-2xl mb-1">
              {mistakes === 0 ? '🎉' : mistakes <= 3 ? '👍' : '💪'}
            </div>
            <p className={`font-bold text-sm ${
              mistakes === 0 ? 'text-[#1ed760]' : mistakes <= 3 ? 'text-[#ffa42b]' : 'text-[#f3727f]'
            }`}>
              {mistakes === 0 ? 'Perfect!' : mistakes <= 3 ? 'Good effort!' : 'Keep practicing!'}
            </p>
            <p className="text-[#b3b3b3] text-xs mt-1">
              {mistakes} mistake{mistakes !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Next / Finish button */}
        {(animMode === 'animate' || quizDone) && (
          <button
            id="next-char-btn"
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64]
              text-black font-bold text-sm py-3.5 rounded-full active:scale-95 transition-all duration-150"
          >
            {isLast ? 'See Results' : 'Next Character'}
            <ChevronRight size={18} />
          </button>
        )}

        {/* Session stats mini */}
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-white font-bold text-lg">{charIndex + (quizDone ? 1 : 0)}</p>
            <p className="text-[#b3b3b3] text-xs">Done</p>
          </div>
          <div className="w-px bg-[#4d4d4d]/40" />
          <div>
            <p className="text-white font-bold text-lg">{words.length - charIndex - (quizDone ? 1 : 0)}</p>
            <p className="text-[#b3b3b3] text-xs">Left</p>
          </div>
          <div className="w-px bg-[#4d4d4d]/40" />
          <div>
            <p className="text-white font-bold text-lg">
              {sessionLog.filter(r => r.mistakes === 0).length}
            </p>
            <p className="text-[#b3b3b3] text-xs">Perfect</p>
          </div>
        </div>
      </div>
    </div>
  )
}
