import { useMemo } from 'react'
import VocabCard from './VocabCard'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A → Z' },
  { value: 'hsk', label: 'HSK Level' },
]

export default function VocabList({ words, onEdit, onDelete, search, hskFilter, sort, onSortChange }) {
  const filtered = useMemo(() => {
    let result = [...words]

    // Filter by search
    const q = search.toLowerCase().trim()
    if (q) {
      result = result.filter(w =>
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      )
    }

    // Filter by HSK
    if (hskFilter !== 'all') {
      result = result.filter(w => w.hsk === Number(hskFilter))
    }

    // Sort
    if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sort === 'az') {
      result.sort((a, b) => a.hanzi.localeCompare(b.hanzi, 'zh'))
    } else if (sort === 'hsk') {
      result.sort((a, b) => a.hsk - b.hsk || new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [words, search, hskFilter, sort])

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[#b3b3b3] text-sm">
          <span className="text-white font-semibold">{filtered.length}</span> word{filtered.length !== 1 ? 's' : ''}
          {search && <span> for "<span className="text-[#1ed760]">{search}</span>"</span>}
        </p>
        <div className="flex gap-1 bg-[#1f1f1f] p-1 rounded-full">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              id={`sort-${opt.value}`}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150
                ${sort === opt.value
                  ? 'bg-[#252525] text-white shadow-sm'
                  : 'text-[#b3b3b3] hover:text-white'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-[#b3b3b3] text-sm">No words match your search.</p>
          <p className="text-[#4d4d4d] text-xs mt-1">Try a different term or clear the filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(word => (
            <VocabCard
              key={word.id}
              word={word}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
