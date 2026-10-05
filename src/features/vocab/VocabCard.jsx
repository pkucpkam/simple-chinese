import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { isLeech, isMastered } from '../../lib/srs'
import { srsRepository } from '../../data/repositories'

const HSK_STYLES = {
  1: { badge: 'bg-[#1ed760]/15 text-[#1ed760]', border: 'border-[#1ed760]/10' },
  2: { badge: 'bg-[#539df5]/15 text-[#539df5]', border: 'border-[#539df5]/10' },
  3: { badge: 'bg-[#ffa42b]/15 text-[#ffa42b]', border: 'border-[#ffa42b]/10' },
}

export default function VocabCard({ word, onEdit, onDelete, onReview }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [card, setCard] = useState(() => srsRepository.getCard(word))
  const style = HSK_STYLES[word.hsk] || HSK_STYLES[1]

  const reviewState = isMastered(card)
    ? 'Đã thuộc'
    : isLeech(card)
      ? 'Leech'
      : card.intervalDays > 0
        ? 'Đang ôn'
        : 'Mới'

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete(word.id)
  }

  function handleReview(rating) {
    const next = onReview ? onReview(word, rating) : srsRepository.review(word, rating)
    if (next) setCard(next)
  }

  return (
    <div
      id={`vocab-card-${word.id}`}
      className={`group bg-[#181818] border ${style.border} border-opacity-40 rounded-2xl p-5 flex flex-col gap-3
        hover:bg-[#1f1f1f] hover:border-opacity-80 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]`}
    >
      {/* Top row: hanzi + badge + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="text-white text-3xl font-bold leading-none">{word.hanzi}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge} shrink-0`}>
              HSK {word.hsk}
            </span>
          </div>
          <p className="text-[#1ed760] text-sm mt-1.5 font-medium">{word.pinyin}</p>
        </div>

        {/* Action buttons — visible on hover on desktop */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:flex transition-opacity duration-150 shrink-0">
          <button
            id={`edit-btn-${word.id}`}
            onClick={() => onEdit(word)}
            className="p-2 rounded-lg text-[#b3b3b3] hover:text-white hover:bg-[#252525] transition-all"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            id={`delete-btn-${word.id}`}
            onClick={handleDelete}
            onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
            className={`p-2 rounded-lg transition-all ${
              confirmDelete
                ? 'text-[#f3727f] bg-[#f3727f]/10'
                : 'text-[#b3b3b3] hover:text-[#f3727f] hover:bg-[#f3727f]/10'
            }`}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Meaning */}
      <p className="text-[#cbcbcb] text-sm leading-relaxed">{word.meaning}</p>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#121212] px-3 py-2 text-[11px] text-[#b3b3b3] border border-[#4d4d4d]/20">
        <span className="font-semibold text-[#1ed760]">SRS</span>
        <span>{reviewState}</span>
        <span>{card.intervalDays}d</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 3, 4].map(rating => (
          <button
            key={rating}
            onClick={() => handleReview(rating)}
            className="rounded-lg border border-[#4d4d4d] bg-[#1f1f1f] px-2 py-1.5 text-[11px] font-semibold text-[#d9d9d9] transition hover:border-[#1ed760] hover:text-white"
          >
            {rating === 1 ? 'Again' : rating === 3 ? 'Good' : 'Easy'}
          </button>
        ))}
      </div>

      {/* Example — collapsible */}
      {word.example && (
        <div>
          <button
            id={`expand-btn-${word.id}`}
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-[#b3b3b3] hover:text-white text-xs transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            <span>{expanded ? 'Hide example' : 'Show example'}</span>
          </button>
          {expanded && (
            <p className="mt-2 text-[#b3b3b3] text-xs leading-relaxed bg-[#121212] rounded-lg px-3 py-2.5 border border-[#4d4d4d]/30">
              {word.example}
            </p>
          )}
        </div>
      )}

      {/* Mobile actions (always visible on small screens) */}
      <div className="flex gap-2 sm:hidden pt-1 border-t border-[#4d4d4d]/30">
        <button
          onClick={() => onEdit(word)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[#b3b3b3] hover:text-white text-xs transition-colors"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={handleDelete}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs transition-colors ${
            confirmDelete ? 'text-[#f3727f]' : 'text-[#b3b3b3] hover:text-[#f3727f]'
          }`}
        >
          <Trash2 size={12} />
          {confirmDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
