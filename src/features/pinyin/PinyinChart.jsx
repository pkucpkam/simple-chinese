import { useState } from 'react'
import {
  Volume2,
  Sparkles,
  Info,
  X,
  Gauge,
  Flame,
  Wind,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { INITIALS, FINALS, TONES } from '../../data/data'

export default function PinyinChart({ speak, speaking, rate, setRate }) {
  const [activeSubTab, setActiveSubTab] = useState('initials') // 'initials' | 'finals' | 'tones'
  const [initialFilter, setInitialFilter] = useState('all') // 'all' | 'aspirated' | 'retroflex' | 'labial' | 'palatal' | 'dental'
  const [finalFilter, setFinalFilter] = useState('all') // 'all' | 'simple' | 'compound' | 'nasal'
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPlayingSound, setCurrentPlayingSound] = useState(null)

  function handlePlaySound(text, id) {
    setCurrentPlayingSound(id)
    speak(text, rate)
    setTimeout(() => {
      setCurrentPlayingSound(null)
    }, 900)
  }

  // Filter initials
  const filteredInitials = INITIALS.filter((item) => {
    if (initialFilter === 'aspirated') return item.isAspirated
    if (initialFilter === 'retroflex') return item.isRetroflex
    if (initialFilter === 'labial') return item.category === 'labial' || item.category === 'labiodental'
    if (initialFilter === 'palatal') return item.category === 'palatal'
    if (initialFilter === 'dental') return item.category === 'dental'
    return true
  })

  // Filter finals
  const filteredFinals = FINALS.filter((item) => {
    if (finalFilter === 'simple') return item.group === 'simple'
    if (finalFilter === 'compound') return item.group === 'compound'
    if (finalFilter === 'nasal') return item.group === 'nasal'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Sub tabs & playback controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181818] border border-[#4d4d4d]/30 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setActiveSubTab('initials')
              setSelectedItem(null)
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeSubTab === 'initials'
                ? 'bg-[#1ed760] text-black shadow-lg shadow-[#1ed760]/20'
                : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
            }`}
          >
            Thanh Mẫu ({INITIALS.length} Âm)
          </button>
          <button
            onClick={() => {
              setActiveSubTab('finals')
              setSelectedItem(null)
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeSubTab === 'finals'
                ? 'bg-[#1ed760] text-black shadow-lg shadow-[#1ed760]/20'
                : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
            }`}
          >
            Vận Mẫu ({FINALS.length} Âm)
          </button>
          <button
            onClick={() => {
              setActiveSubTab('tones')
              setSelectedItem(null)
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              activeSubTab === 'tones'
                ? 'bg-[#1ed760] text-black shadow-lg shadow-[#1ed760]/20'
                : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
            }`}
          >
            Thanh Điệu (4 Thanh + Khinh)
          </button>
        </div>

        {/* Speed setting */}
        <div className="flex items-center gap-2 px-2 self-end sm:self-auto text-xs text-[#b3b3b3]">
          <Gauge size={15} className="text-[#1ed760]" />
          <span>Tốc độ đọc:</span>
          <button
            onClick={() => setRate(0.7)}
            className={`px-2.5 py-1 rounded-full border transition-all text-xs ${
              rate === 0.7
                ? 'border-[#1ed760] bg-[#1ed760]/10 text-[#1ed760] font-semibold'
                : 'border-[#4d4d4d]/40 text-[#b3b3b3] hover:text-white'
            }`}
          >
            0.7x (Chậm)
          </button>
          <button
            onClick={() => setRate(1)}
            className={`px-2.5 py-1 rounded-full border transition-all text-xs ${
              rate === 1
                ? 'border-[#1ed760] bg-[#1ed760]/10 text-[#1ed760] font-semibold'
                : 'border-[#4d4d4d]/40 text-[#b3b3b3] hover:text-white'
            }`}
          >
            1.0x (Chuẩn)
          </button>
        </div>
      </div>

      {/* FILTER CHIPS */}
      {activeSubTab === 'initials' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#7c7c7c] shrink-0 font-medium">Bộ lọc:</span>
          {[
            { id: 'all', label: 'Tất cả (23)' },
            { id: 'aspirated', label: '💨 Bật hơi (p, t, k, q, ch, c)', icon: Wind },
            { id: 'retroflex', label: '🌀 Uốn lưỡi (zh, ch, sh, r)' },
            { id: 'palatal', label: '👅 Mặt lưỡi (j, q, x)' },
            { id: 'dental', label: '🦷 Đầu lưỡi (z, c, s)' },
            { id: 'labial', label: '👄 Âm môi (b, p, m, f)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setInitialFilter(f.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 border ${
                initialFilter === f.id
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#181818] border-[#4d4d4d]/40 text-[#b3b3b3] hover:border-[#7c7c7c] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {activeSubTab === 'finals' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#7c7c7c] shrink-0 font-medium">Bộ lọc:</span>
          {[
            { id: 'all', label: 'Tất cả (24)' },
            { id: 'simple', label: 'Vận mẫu đơn (a, o, e, i, u, ü)' },
            { id: 'compound', label: 'Vận mẫu kép (ai, ei, ao...)' },
            { id: 'nasal', label: 'Vận mẫu mũi (an, en, ang...)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFinalFilter(f.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 border ${
                finalFilter === f.id
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#181818] border-[#4d4d4d]/40 text-[#b3b3b3] hover:border-[#7c7c7c] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* ──────────────── TAB 1: THANH MẪU (INITIALS) ──────────────── */}
      {activeSubTab === 'initials' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredInitials.map((item) => {
            const isPlaying = currentPlayingSound === item.pinyin
            const isSelected = selectedItem?.pinyin === item.pinyin
            return (
              <div
                key={item.pinyin}
                className={`relative group flex flex-col justify-between p-4 rounded-xl border bg-[#181818] transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#1ed760] shadow-lg shadow-[#1ed760]/10 bg-[#1f1f1f]'
                    : isPlaying
                    ? 'border-[#1ed760] bg-[#1f1f1f] scale-[1.02]'
                    : 'border-[#4d4d4d]/30 hover:border-[#1ed760]/60 hover:bg-[#1f1f1f]'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] text-[#7c7c7c] uppercase tracking-wider font-mono">
                    {item.categoryName}
                  </span>
                  {item.isAspirated && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#ffa42b]/20 text-[#ffa42b] border border-[#ffa42b]/30">
                      <Wind size={10} /> Bật hơi
                    </span>
                  )}
                  {item.isRetroflex && !item.isAspirated && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#539df5]/20 text-[#539df5] border border-[#539df5]/30">
                      Uốn lưỡi
                    </span>
                  )}
                </div>

                {/* Big Pinyin Character */}
                <div className="flex items-baseline justify-between my-2">
                  <div className="text-3xl font-bold tracking-tight text-white group-hover:text-[#1ed760] transition-colors font-mono">
                    {item.pinyin}
                  </div>
                  <div className="text-xs text-[#7c7c7c] font-mono">{item.ipa}</div>
                </div>

                {/* Vietnamese description summary */}
                <p className="text-[11px] text-[#b3b3b3] line-clamp-2 mb-3 leading-relaxed">
                  {item.vietnameseDesc}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#4d4d4d]/20 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaySound(item.speechText, item.pinyin)
                    }}
                    className={`p-2 rounded-full transition-all duration-150 flex items-center justify-center ${
                      isPlaying
                        ? 'bg-[#1ed760] text-black scale-110 shadow-md shadow-[#1ed760]/40'
                        : 'bg-[#121212] text-[#1ed760] hover:bg-[#1ed760] hover:text-black'
                    }`}
                    title="Nghe phát âm"
                  >
                    <Volume2 size={16} />
                  </button>
                  <span className="text-[11px] text-[#7c7c7c] group-hover:text-[#1ed760] transition-colors flex items-center gap-1 font-medium">
                    Chi tiết &rarr;
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ──────────────── TAB 2: VẬN MẪU (FINALS) ──────────────── */}
      {activeSubTab === 'finals' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredFinals.map((item) => {
            const isPlaying = currentPlayingSound === item.pinyin
            const isSelected = selectedItem?.pinyin === item.pinyin
            return (
              <div
                key={item.pinyin}
                className={`relative group flex flex-col justify-between p-4 rounded-xl border bg-[#181818] transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#1ed760] shadow-lg shadow-[#1ed760]/10 bg-[#1f1f1f]'
                    : isPlaying
                    ? 'border-[#1ed760] bg-[#1f1f1f] scale-[1.02]'
                    : 'border-[#4d4d4d]/30 hover:border-[#1ed760]/60 hover:bg-[#1f1f1f]'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#7c7c7c] uppercase tracking-wider font-mono">
                    {item.groupName}
                  </span>
                  <span className="text-[10px] text-[#1ed760] font-mono">{item.sample.split(' ')[0]}</span>
                </div>

                {/* Big Pinyin Final */}
                <div className="flex items-baseline justify-between my-2">
                  <div className="text-3xl font-bold tracking-tight text-white group-hover:text-[#1ed760] transition-colors font-mono">
                    {item.pinyin}
                  </div>
                  <div className="text-xs text-[#7c7c7c] font-mono">
                    {item.tones.slice(0, 2).join(' ')}...
                  </div>
                </div>

                {/* Vietnamese description */}
                <p className="text-[11px] text-[#b3b3b3] line-clamp-2 mb-3 leading-relaxed">
                  {item.vietnameseDesc}
                </p>

                {/* Play button */}
                <div className="flex items-center justify-between pt-2 border-t border-[#4d4d4d]/20 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaySound(item.speechText, item.pinyin)
                    }}
                    className={`p-2 rounded-full transition-all duration-150 flex items-center justify-center ${
                      isPlaying
                        ? 'bg-[#1ed760] text-black scale-110 shadow-md shadow-[#1ed760]/40'
                        : 'bg-[#121212] text-[#1ed760] hover:bg-[#1ed760] hover:text-black'
                    }`}
                    title="Nghe phát âm"
                  >
                    <Volume2 size={16} />
                  </button>
                  <span className="text-[11px] text-[#7c7c7c] group-hover:text-[#1ed760] transition-colors flex items-center gap-1 font-medium">
                    4 Thanh điệu &rarr;
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ──────────────── TAB 3: THANH ĐIỆU (TONES) ──────────────── */}
      {activeSubTab === 'tones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TONES.map((t) => {
              const isPlaying = currentPlayingSound === `tone-${t.id}`
              return (
                <div
                  key={t.id}
                  className="bg-[#181818] border border-[#4d4d4d]/30 rounded-2xl p-5 flex flex-col justify-between hover:border-[#1ed760]/50 transition-all duration-200"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold font-mono"
                        style={{ backgroundColor: `${t.color}20`, color: t.color, borderColor: `${t.color}40`, borderWidth: '1px' }}
                      >
                        Cao độ: {t.contour} ({t.pitchName})
                      </span>
                      <span className="text-2xl font-bold font-mono text-white">{t.symbol}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                    <p className="text-sm text-[#b3b3b3] mb-3 leading-relaxed">{t.desc}</p>

                    {/* Analogy Box */}
                    <div className="bg-[#121212] border border-[#4d4d4d]/30 rounded-xl p-3 mb-4">
                      <p className="text-xs text-[#cbcbcb] leading-relaxed">
                        <strong className="text-white">💡 Mẹo hình dung:</strong> {t.analogy}
                      </p>
                    </div>
                  </div>

                  {/* Sample & Audio */}
                  <div className="pt-3 border-t border-[#4d4d4d]/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#7c7c7c] block">Ví dụ HSK 1:</span>
                      <span className="text-sm font-semibold text-white">
                        {t.example.hanzi} - <span className="text-[#b3b3b3] font-normal">{t.example.meaning}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlaySound(t.speechText, `tone-${t.id}`)}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all duration-150 ${
                        isPlaying
                          ? 'bg-[#1ed760] text-black scale-105 shadow-md shadow-[#1ed760]/30'
                          : 'bg-[#1f1f1f] text-white hover:bg-[#1ed760] hover:text-black'
                      }`}
                    >
                      <Volume2 size={16} />
                      <span>Nghe mẫu</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tone Contour Visual Map */}
          <div className="bg-[#181818] border border-[#4d4d4d]/30 rounded-2xl p-6 mt-6">
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-[#1ed760]" />
              Bản đồ cao độ 5 mức (Pitch Contour Guide)
            </h4>
            <p className="text-xs text-[#b3b3b3] mb-4">
              Hệ thống Pinyin sử dụng thang cao độ 5 bậc (từ 1 - cực trầm đến 5 - cực cao):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#121212] p-3 rounded-xl border border-[#1ed760]/30">
                <span className="font-bold text-[#1ed760] block mb-1">Thanh 1: [5-5] Cao Bằng</span>
                <p className="text-[#b3b3b3]">Âm giữ ở mức 5 suốt từ đầu đến cuối. Đều và phẳng.</p>
              </div>
              <div className="bg-[#121212] p-3 rounded-xl border border-[#539df5]/30">
                <span className="font-bold text-[#539df5] block mb-1">Thanh 2: [3-5] Lên Dốc</span>
                <p className="text-[#b3b3b3]">Bắt đầu ở mức 3 rồi vút nhanh lên mức 5 như hỏi bất ngờ.</p>
              </div>
              <div className="bg-[#121212] p-3 rounded-xl border border-[#ffa42b]/30">
                <span className="font-bold text-[#ffa42b] block mb-1">Thanh 3: [2-1-4] Xuống Lên</span>
                <p className="text-[#b3b3b3]">Hạ xuống mức 1 (rất trầm) trước khi móc nhẹ lên mức 4.</p>
              </div>
              <div className="bg-[#121212] p-3 rounded-xl border border-[#f3727f]/30">
                <span className="font-bold text-[#f3727f] block mb-1">Thanh 4: [5-1] Rơi Thẳng</span>
                <p className="text-[#b3b3b3]">Từ mức 5 rơi tụt dứt khoát xuống mức 1. Ngắn và dứt khoát.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── DETAIL MODAL / DRAWER ──────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#181818] border border-[#4d4d4d]/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-[#b3b3b3] hover:text-white rounded-full bg-[#121212] border border-[#4d4d4d]/40 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#1ed760] text-black font-mono font-bold text-4xl flex items-center justify-center shadow-lg shadow-[#1ed760]/30 shrink-0">
                {selectedItem.pinyin}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white font-mono">{selectedItem.pinyin}</h3>
                  {selectedItem.ipa && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#121212] text-[#1ed760] font-mono border border-[#1ed760]/30">
                      {selectedItem.ipa}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#b3b3b3]">
                  {selectedItem.categoryName || selectedItem.groupName}
                </p>
              </div>
            </div>

            {/* Play Sound Button */}
            <div className="mb-5">
              <button
                onClick={() => handlePlaySound(selectedItem.speechText, 'modal-sound')}
                className="w-full py-3 px-4 rounded-xl bg-[#1ed760] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1ed760]/20 hover:bg-[#1db954] active:scale-[0.98] transition-all"
              >
                <Volume2 size={18} />
                <span>Phát âm âm chuẩn (Tốc độ {rate}x)</span>
              </button>
            </div>

            {/* Vietnamese Phonetics Guide */}
            <div className="space-y-3 mb-5">
              <div className="bg-[#121212] p-3.5 rounded-xl border border-[#4d4d4d]/30">
                <span className="text-xs font-semibold text-white block mb-1">
                  🗣️ Phát âm tương đương tiếng Việt:
                </span>
                <p className="text-xs text-[#cbcbcb] leading-relaxed">
                  {selectedItem.vietnameseDesc}
                </p>
              </div>

              <div className="bg-[#121212] p-3.5 rounded-xl border border-[#4d4d4d]/30">
                <span className="text-xs font-semibold text-[#1ed760] block mb-1">
                  💡 Mẹo khẩu hình & đặt lưỡi:
                </span>
                <p className="text-xs text-[#cbcbcb] leading-relaxed">{selectedItem.tips}</p>
              </div>
            </div>

            {/* IF IT'S A FINAL: Show 4 Tones */}
            {selectedItem.tones && (
              <div className="mb-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#1ed760]" />
                  4 Thanh điệu của "{selectedItem.pinyin}"
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {selectedItem.tones.map((tonePinyin, idx) => (
                    <button
                      key={tonePinyin}
                      onClick={() => handlePlaySound(tonePinyin, `tone-btn-${idx}`)}
                      className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-[#121212] border border-[#4d4d4d]/30 hover:border-[#1ed760] hover:bg-[#1f1f1f] transition-all group"
                    >
                      <span className="text-lg font-bold text-white group-hover:text-[#1ed760] font-mono">
                        {tonePinyin}
                      </span>
                      <span className="text-[10px] text-[#7c7c7c]">Thanh {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* IF IT'S AN INITIAL: Show sample words */}
            {selectedItem.examples && selectedItem.examples.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#1ed760]" />
                  Từ vựng HSK 1 tiêu biểu
                </h4>
                <div className="space-y-2">
                  {selectedItem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#121212] border border-[#4d4d4d]/30 hover:border-[#1ed760]/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">{ex.hanzi}</span>
                          <span className="text-xs font-mono text-[#1ed760]">{ex.pinyin}</span>
                        </div>
                        <span className="text-xs text-[#b3b3b3]">{ex.meaning}</span>
                      </div>
                      <button
                        onClick={() => handlePlaySound(ex.hanzi, `sample-ex-${idx}`)}
                        className="p-2 rounded-full bg-[#1f1f1f] text-[#1ed760] hover:bg-[#1ed760] hover:text-black transition-all"
                        title="Nghe từ này"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
