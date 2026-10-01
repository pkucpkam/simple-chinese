import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, ChevronRight, RotateCcw, Turtle, Zap } from 'lucide-react'
import { useSpeech } from './useSpeech'
import { vocabRepository } from '../../data/repositories'

// Build 4 MC options: 1 correct + 3 random distractors from the full pool
function buildChoices(correctWord, allWords) {
  const distractors = allWords
    .filter(w => w.id !== correctWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  return [...distractors, correctWord].sort(() => Math.random() - 0.5)
}

// Normalize pinyin for comparison — strip tones, lowercase
function normalizePinyin(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[ü]/g, 'u')
    .replace(/\s+/g, ' ')
    .trim()
}

const SPEED_OPTIONS = [
  { label: 'Slow', rate: 0.55, icon: Turtle },
  { label: 'Normal', rate: 1, icon: Zap },
]

export default function ListeningSession({ session, onFinish }) {
  const { words, mode } = session
  const { speak, speaking } = useSpeech()

  const [qIndex, setQIndex] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)   // MC: chosen meaning string
  const [typedPinyin, setTypedPinyin] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [results, setResults] = useState([])       // { word, correct }
  const [choices, setChoices] = useState([])
  const [revealed, setRevealed] = useState(false)  // show hanzi after answer

  const current = words[qIndex]
  const progress = (qIndex / words.length) * 100

  // Build choices when question changes
  useEffect(() => {
    if (mode === 'multiple-choice') {
      setChoices(buildChoices(current, vocabRepository.list()))
    }
    setAnswered(false)
    setSelected(null)
    setTypedPinyin('')
    setIsCorrect(null)
    setRevealed(false)
  }, [qIndex, current, mode])

  // Auto-play on question change
  useEffect(() => {
    const timer = setTimeout(() => speak(current.hanzi, speed), 400)
    return () => clearTimeout(timer)
  }, [qIndex]) // eslint-disable-line

  const handlePlay = useCallback(() => {
    speak(current.hanzi, speed)
  }, [current, speak, speed])

  function submitMC(choice) {
    if (answered) return
    const correct = choice.id === current.id
    setSelected(choice.id)
    setIsCorrect(correct)
    setAnswered(true)
    setResults(prev => [...prev, { word: current, correct }])
  }

  function submitPinyin() {
    if (answered || !typedPinyin.trim()) return
    const correct = normalizePinyin(typedPinyin) === normalizePinyin(current.pinyin)
    setIsCorrect(correct)
    setAnswered(true)
    setResults(prev => [...prev, { word: current, correct }])
  }

  function handleNext() {
    if (qIndex + 1 >= words.length) {
      onFinish(results)
    } else {
      setQIndex(i => i + 1)
    }
  }

  const isLast = qIndex + 1 >= words.length

  return (
    <div className="min-h-full flex flex-col">
      {/* ── Progress Bar ── */}
      <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-md px-6 py-4 border-b border-[#4d4d4d]/20">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[#b3b3b3] text-xs font-medium">
              Question <span className="text-white font-bold">{qIndex + 1}</span> / {words.length}
            </span>
            <span className="text-[#b3b3b3] text-xs">
              {mode === 'multiple-choice' ? 'Multiple Choice' : 'Type Pinyin'}
            </span>
          </div>
          <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1ed760] rounded-full transition-all duration-500"
              style={{ width: `${((qIndex + (answered ? 1 : 0)) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 max-w-xl mx-auto w-full">

        {/* Audio Player Card */}
        <div className="w-full bg-[#181818] border border-[#4d4d4d]/20 rounded-3xl p-8 mb-6 text-center">
          {/* Hanzi — hidden until answered */}
          <div className="mb-6 min-h-[80px] flex flex-col items-center justify-center">
            {revealed ? (
              <div className="animate-in fade-in duration-300">
                <p className="text-white text-6xl font-bold">{current.hanzi}</p>
                <p className="text-[#1ed760] text-lg mt-2 font-medium">{current.pinyin}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1f1f1f] flex items-center justify-center">
                  <span className="text-[#4d4d4d] text-3xl">?</span>
                </div>
                <p className="text-[#4d4d4d] text-xs">Listen carefully</p>
              </div>
            )}
          </div>

          {/* Play button */}
          <button
            id="play-audio-btn"
            onClick={handlePlay}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-200
              ${speaking
                ? 'bg-[#1ed760] scale-95 shadow-[0_0_30px_rgba(30,215,96,0.4)]'
                : 'bg-[#1f1f1f] hover:bg-[#252525] hover:scale-105 active:scale-95'
              }`}
          >
            {speaking
              ? <Pause size={32} className="text-black" />
              : <Play size={32} className="text-white ml-1" />
            }
          </button>

          {/* Speed toggle */}
          <div className="flex gap-2 justify-center">
            {SPEED_OPTIONS.map(opt => (
              <button
                key={opt.label}
                id={`speed-${opt.label.toLowerCase()}`}
                onClick={() => setSpeed(opt.rate)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150
                  ${speed === opt.rate
                    ? 'bg-[#1ed760] text-black'
                    : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white border border-[#4d4d4d]/40'
                  }`}
              >
                <opt.icon size={13} /> {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Multiple Choice ── */}
        {mode === 'multiple-choice' && (
          <div className="w-full space-y-3">
            <p className="text-[#b3b3b3] text-xs text-center mb-4">Choose the correct meaning</p>
            {choices.map((choice) => {
              const isSelected = selected === choice.id
              const isAnswer = choice.id === current.id
              let style = 'bg-[#181818] border-[#4d4d4d]/30 text-white hover:border-[#4d4d4d] hover:bg-[#1f1f1f]'
              if (answered) {
                if (isAnswer) style = 'bg-[#1ed760]/10 border-[#1ed760]/50 text-[#1ed760]'
                else if (isSelected && !isAnswer) style = 'bg-[#f3727f]/10 border-[#f3727f]/50 text-[#f3727f]'
                else style = 'bg-[#181818] border-[#4d4d4d]/20 text-[#4d4d4d]'
              }
              return (
                <button
                  key={choice.id}
                  id={`choice-${choice.id}`}
                  onClick={() => submitMC(choice)}
                  disabled={answered}
                  className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium
                    transition-all duration-200 ${style} disabled:cursor-default`}
                >
                  <span className="leading-snug">{choice.meaning}</span>
                  {answered && isAnswer && (
                    <span className="ml-2 text-xs opacity-70">✓ Correct</span>
                  )}
                  {answered && isSelected && !isAnswer && (
                    <span className="ml-2 text-xs opacity-70">✗ Wrong</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Type Pinyin ── */}
        {mode === 'type-pinyin' && (
          <div className="w-full space-y-4">
            <p className="text-[#b3b3b3] text-xs text-center">Type the pinyin you heard</p>
            <div className="relative">
              <input
                id="pinyin-input"
                type="text"
                value={typedPinyin}
                onChange={e => setTypedPinyin(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !answered && submitPinyin()}
                disabled={answered}
                placeholder="e.g. nǐ hǎo or ni hao"
                className={`w-full bg-[#181818] text-white text-center text-lg font-medium rounded-2xl px-5 py-4
                  border placeholder-[#4d4d4d] transition-colors
                  ${answered
                    ? isCorrect
                      ? 'border-[#1ed760]/60 text-[#1ed760]'
                      : 'border-[#f3727f]/60 text-[#f3727f]'
                    : 'border-[#4d4d4d]/40 focus:border-[#1ed760]/50'
                  }`}
                autoFocus
              />
            </div>

            {answered && (
              <div className={`rounded-xl px-4 py-3 text-sm text-center ${
                isCorrect ? 'bg-[#1ed760]/10 text-[#1ed760]' : 'bg-[#f3727f]/10 text-[#f3727f]'
              }`}>
                {isCorrect
                  ? '✓ Correct!'
                  : <>✗ The correct pinyin is: <span className="font-bold">{current.pinyin}</span></>
                }
              </div>
            )}

            {!answered && (
              <button
                id="submit-pinyin-btn"
                onClick={submitPinyin}
                disabled={!typedPinyin.trim()}
                className="w-full bg-[#1f1f1f] hover:bg-[#252525] text-white font-bold text-sm py-3.5 rounded-full
                  border border-[#4d4d4d]/40 hover:border-[#1ed760]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Check Answer
              </button>
            )}
          </div>
        )}

        {/* ── After Answer: Result Banner + Next ── */}
        {answered && (
          <div className="w-full mt-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            {/* Result feedback */}
            <div className={`rounded-2xl px-5 py-4 border ${
              isCorrect
                ? 'bg-[#1ed760]/10 border-[#1ed760]/30'
                : 'bg-[#f3727f]/10 border-[#f3727f]/30'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${isCorrect ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite'}
                  </p>
                  <p className="text-white text-base font-bold mt-1">{current.hanzi}</p>
                  <p className="text-[#1ed760] text-sm">{current.pinyin}</p>
                  <p className="text-[#b3b3b3] text-sm mt-0.5">{current.meaning}</p>
                  {current.example && (
                    <p className="text-[#4d4d4d] text-xs mt-1.5 leading-relaxed">{current.example}</p>
                  )}
                </div>
              </div>
              {!revealed && (
                <button
                  onClick={() => setRevealed(true)}
                  className="mt-3 text-[#b3b3b3] hover:text-white text-xs underline-offset-2 hover:underline transition-colors"
                >
                  Show character
                </button>
              )}
            </div>

            {/* Next button */}
            <button
              id="next-question-btn"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64]
                text-black font-bold text-sm py-3.5 rounded-full active:scale-95 transition-all duration-150"
            >
              {isLast ? 'See Results' : 'Next Question'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
