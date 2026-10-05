import { useState } from 'react'
import { PenLine, BookOpen, Hash, ArrowRight, Layers } from 'lucide-react'
import { vocabRepository } from '../../data/repositories'

const HSK_FILTERS = [
  { value: 'all', label: 'All Levels' },
  { value: '1',   label: 'HSK 1' },
  { value: '2',   label: 'HSK 2' },
  { value: '3',   label: 'HSK 3' },
]

const COUNT_OPTIONS = [5, 10, 15, 20]

const MODES = [
  {
    id: 'animate',
    title: 'Watch & Learn',
    desc: 'See animated stroke order, then try yourself',
    icon: Layers,
    color: 'text-[#1ed760]',
    bg: 'bg-[#1ed760]/10',
    border: 'border-[#1ed760]/20',
  },
  {
    id: 'quiz',
    title: 'Draw Quiz',
    desc: 'Draw each stroke in the correct order — graded live',
    icon: PenLine,
    color: 'text-[#539df5]',
    bg: 'bg-[#539df5]/10',
    border: 'border-[#539df5]/20',
  },
]

export default function WritingSetup({ onStart }) {
  const [mode, setMode] = useState('animate')
  const [hsk, setHsk]   = useState('all')
  const [count, setCount] = useState(10)

  // Only use single-character words — hanzi-writer works best with 1 char
  const pool = vocabRepository.list().filter(w =>
    (hsk === 'all' ? true : w.hsk === Number(hsk)) && [...w.hanzi].length === 1
  )
  // For multi-char words, practice the first character
  const fullPool = vocabRepository.list().filter(w =>
    hsk === 'all' ? true : w.hsk === Number(hsk)
  )
  const available = fullPool.length
  const actualCount = Math.min(count, available)

  function handleStart() {
    const shuffled = [...fullPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, actualCount)
    onStart({ mode, words: shuffled })
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white font-bold text-xl">Writing Practice</h1>
          <p className="text-[#b3b3b3] text-xs mt-0.5">Master stroke order with hanzi-writer</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

        {/* Tip banner */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-[#1ed760]/10 flex items-center justify-center shrink-0">
            <span className="text-[#1ed760] text-2xl font-bold">永</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Stroke order matters</p>
            <p className="text-[#b3b3b3] text-xs mt-1 leading-relaxed">
              Writing characters correctly by hand strengthens memory and helps you read handwritten text.
              In quiz mode, draw each stroke on the canvas.
            </p>
          </div>
        </div>

        {/* Mode */}
        <section>
          <SectionLabel icon={PenLine}>Mode</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {MODES.map(m => (
              <button
                key={m.id}
                id={`mode-${m.id}`}
                onClick={() => setMode(m.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200
                  ${mode === m.id
                    ? `${m.bg} ${m.border}`
                    : 'bg-[#181818] border-[#4d4d4d]/20 hover:border-[#4d4d4d]/60'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                  <m.icon size={20} className={m.color} />
                </div>
                <p className={`font-bold text-sm ${mode === m.id ? m.color : 'text-white'}`}>{m.title}</p>
                <p className="text-[#b3b3b3] text-xs mt-1 leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* HSK Filter */}
        <section>
          <SectionLabel icon={BookOpen}>Word Pool</SectionLabel>
          <div className="flex gap-2 mt-3 flex-wrap">
            {HSK_FILTERS.map(f => (
              <button
                key={f.value}
                id={`hsk-${f.value}`}
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

        {/* Count */}
        <section>
          <SectionLabel icon={Hash}>Characters to Practice</SectionLabel>
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
                    ${count === n && !disabled ? 'bg-[#1ed760] text-black'
                      : disabled ? 'bg-[#1f1f1f] text-[#4d4d4d] cursor-not-allowed'
                      : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
                    }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
        </section>

        {/* Start */}
        <div className="bg-[#181818] border border-[#4d4d4d]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Ready</p>
            <p className="text-[#b3b3b3] text-xs mt-1">
              {actualCount} characters · {MODES.find(m => m.id === mode)?.title}
            </p>
          </div>
          <button
            id="start-writing-btn"
            onClick={handleStart}
            disabled={available === 0}
            className="flex items-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold
              text-sm px-6 py-3 rounded-full active:scale-95 transition-all duration-150 disabled:opacity-40"
          >
            Start <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-[#b3b3b3]" />
      <span className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">{children}</span>
    </div>
  )
}
