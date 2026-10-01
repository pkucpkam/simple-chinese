import { useState } from 'react'
import { Volume2, BookOpen, Gauge, Hash, ArrowRight, Headphones } from 'lucide-react'
import { vocabRepository } from '../../data/repositories'

const MODES = [
  {
    id: 'multiple-choice',
    icon: BookOpen,
    title: 'Multiple Choice',
    desc: 'Listen, then pick the correct meaning from 4 options',
    color: 'text-[#1ed760]',
    bg: 'bg-[#1ed760]/10',
    border: 'border-[#1ed760]/20',
  },
  {
    id: 'type-pinyin',
    icon: Gauge,
    title: 'Type Pinyin',
    desc: 'Listen, then type the pinyin you heard',
    color: 'text-[#539df5]',
    bg: 'bg-[#539df5]/10',
    border: 'border-[#539df5]/20',
  },
]

const COUNT_OPTIONS = [5, 10, 15, 20]
const HSK_FILTERS = [
  { value: 'all', label: 'All Levels' },
  { value: '1', label: 'HSK 1' },
  { value: '2', label: 'HSK 2' },
  { value: '3', label: 'HSK 3' },
]

export default function SessionSetup({ onStart }) {
  const [mode, setMode] = useState('multiple-choice')
  const [hsk, setHsk] = useState('all')
  const [count, setCount] = useState(10)

  const pool = vocabRepository.list().filter(w =>
    hsk === 'all' ? true : w.hsk === Number(hsk)
  )
  const available = pool.length
  const actualCount = Math.min(count, available)

  function handleStart() {
    // Shuffle and slice
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, actualCount)
    onStart({ mode, words: shuffled })
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white font-bold text-xl">Listening Practice</h1>
          <p className="text-[#b3b3b3] text-xs mt-0.5">Train your ear for Chinese tones</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

        {/* Hero */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#1ed760]/10 flex items-center justify-center shrink-0">
            <Headphones size={32} className="text-[#1ed760]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Audio powered by your browser</h2>
            <p className="text-[#b3b3b3] text-sm mt-1 leading-relaxed">
              Uses built-in Chinese text-to-speech. Make sure your volume is on.
            </p>
          </div>
        </div>

        {/* Mode */}
        <section>
          <Label icon={Volume2}>Practice Mode</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {MODES.map(m => (
              <button
                key={m.id}
                id={`mode-${m.id}`}
                onClick={() => setMode(m.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200
                  ${mode === m.id
                    ? `${m.bg} ${m.border} ring-1 ring-inset ${m.border}`
                    : 'bg-[#181818] border-[#4d4d4d]/20 hover:border-[#4d4d4d]/60'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                  <m.icon size={20} className={m.color} />
                </div>
                <p className={`font-bold text-sm ${mode === m.id ? m.color : 'text-white'}`}>
                  {m.title}
                </p>
                <p className="text-[#b3b3b3] text-xs mt-1 leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* HSK Filter */}
        <section>
          <Label icon={BookOpen}>Word Pool</Label>
          <div className="flex gap-2 mt-3 flex-wrap">
            {HSK_FILTERS.map(f => (
              <button
                key={f.value}
                id={`hsk-filter-${f.value}`}
                onClick={() => setHsk(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                  ${hsk === f.value
                    ? 'bg-[#1ed760] text-black'
                    : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white border border-[#4d4d4d]/40'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-[#b3b3b3] text-xs mt-2">
            <span className="text-white font-semibold">{available}</span> words available
          </p>
        </section>

        {/* Question count */}
        <section>
          <Label icon={Hash}>Number of Questions</Label>
          <div className="flex gap-2 mt-3">
            {COUNT_OPTIONS.map(n => {
              const disabled = n > available
              return (
                <button
                  key={n}
                  id={`count-${n}`}
                  onClick={() => !disabled && setCount(n)}
                  disabled={disabled}
                  className={`w-16 h-12 rounded-xl text-sm font-bold transition-all duration-150
                    ${count === n && !disabled
                      ? 'bg-[#1ed760] text-black'
                      : disabled
                        ? 'bg-[#1f1f1f] text-[#4d4d4d] cursor-not-allowed'
                        : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
                    }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
        </section>

        {/* Summary + Start */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Ready to start</p>
            <p className="text-[#b3b3b3] text-xs mt-1">
              {actualCount} questions · {MODES.find(m2 => m2.id === mode)?.title} ·{' '}
              {hsk === 'all' ? 'All HSK levels' : `HSK ${hsk}`}
            </p>
          </div>
          <button
            id="start-session-btn"
            onClick={handleStart}
            disabled={available === 0}
            className="flex items-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold
              text-sm px-6 py-3 rounded-full active:scale-95 transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-[#b3b3b3]" />
      <span className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">{children}</span>
    </div>
  )
}
