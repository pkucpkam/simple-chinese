import { BookOpen } from 'lucide-react'

export default function VocabEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#1f1f1f] flex items-center justify-center mb-6">
        <BookOpen size={36} className="text-[#4d4d4d]" />
      </div>

      {/* Text */}
      <h3 className="text-white text-xl font-bold mb-2">No words yet</h3>
      <p className="text-[#b3b3b3] text-sm max-w-xs leading-relaxed mb-8">
        Start building your personal vocabulary list. Add words as you encounter them while studying.
      </p>

      {/* Hint cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-sm text-left mb-8">
        {[
          { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello' },
          { hanzi: '学习', pinyin: 'xué xí', meaning: 'Study' },
          { hanzi: '朋友', pinyin: 'péng yǒu', meaning: 'Friend' },
        ].map((w) => (
          <div key={w.hanzi} className="bg-[#181818] border border-[#4d4d4d]/30 rounded-xl p-3 opacity-50">
            <p className="text-white text-2xl font-bold">{w.hanzi}</p>
            <p className="text-[#1ed760] text-xs">{w.pinyin}</p>
            <p className="text-[#b3b3b3] text-xs mt-0.5">{w.meaning}</p>
          </div>
        ))}
      </div>

      <button
        id="empty-state-add-btn"
        onClick={onAdd}
        className="bg-[#1ed760] text-black font-bold text-sm px-8 py-3 rounded-full hover:bg-[#1fdf64] active:scale-95 transition-all duration-150"
      >
        Add your first word
      </button>
    </div>
  )
}
