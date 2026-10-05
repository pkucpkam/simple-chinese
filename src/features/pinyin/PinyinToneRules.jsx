import { useState } from 'react'
import { Volume2, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { TONE_RULES } from '../../data/data'

export default function PinyinToneRules({ speak, rate }) {
  const [playingId, setPlayingId] = useState(null)

  function playExample(audioText, id) {
    setPlayingId(id)
    speak(audioText, rate)
    setTimeout(() => {
      setPlayingId(null)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-[#181818] via-[#1f1f1f] to-[#181818] border border-[#1ed760]/30 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1ed760]/10 border border-[#1ed760]/30 flex items-center justify-center shrink-0 text-[#1ed760]">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              Bí Kíp Biến Điệu & Quy Tắc Chính Tả Pinyin (Tone Sandhi)
            </h3>
            <p className="text-xs sm:text-sm text-[#b3b3b3] leading-relaxed">
              Trong tiếng Trung khẩu ngữ thực tế, thanh điệu của một số chữ sẽ tự động biến đổi để luồng hơi phát ra mềm mại và mượt mà hơn. Nắm chắc 5 quy tắc dưới đây sẽ giúp bạn nói tự nhiên chuẩn người bản xứ!
            </p>
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {TONE_RULES.map((rule, idx) => (
          <div
            key={rule.id}
            className="bg-[#181818] border border-[#4d4d4d]/30 rounded-2xl p-5 hover:border-[#1ed760]/40 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{rule.title}</span>
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1ed760]/10 text-[#1ed760] border border-[#1ed760]/20">
                {rule.tag}
              </span>
            </div>

            {/* Explanation text */}
            <p className="text-xs sm:text-sm text-[#b3b3b3] mb-4 leading-relaxed">
              {rule.ruleText}
            </p>

            {/* Visual Formula Pill */}
            <div className="bg-[#121212] border border-[#4d4d4d]/40 rounded-xl p-3 mb-4 flex items-center justify-center">
              <span className="text-sm sm:text-base font-mono font-bold text-[#1ed760] tracking-wide text-center">
                {rule.visualFormula}
              </span>
            </div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {rule.examples.map((ex, exIdx) => {
                const id = `${rule.id}-${exIdx}`
                const isPlaying = playingId === id
                return (
                  <div
                    key={exIdx}
                    className="bg-[#121212] border border-[#4d4d4d]/30 rounded-xl p-3 flex flex-col justify-between hover:border-[#1ed760]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#7c7c7c]">Viết:</span>
                        <span className="text-xs font-mono font-semibold text-white">
                          {ex.written}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#1ed760] font-medium">Đọc:</span>
                        <span className="text-xs font-mono font-bold text-[#1ed760]">
                          {ex.spoken}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#b3b3b3] italic mb-3">"{ex.meaning}"</p>
                    </div>

                    <button
                      onClick={() => playExample(ex.audioText, id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isPlaying
                          ? 'bg-[#1ed760] text-black'
                          : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
                      }`}
                    >
                      <Volume2 size={14} className={isPlaying ? 'animate-pulse' : 'text-[#1ed760]'} />
                      <span>{isPlaying ? 'Đang phát...' : 'Nghe phát âm'}</span>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Note / Tip */}
            <div className="flex items-start gap-2 text-xs text-[#cbcbcb] bg-[#1f1f1f]/50 p-3 rounded-xl border border-[#4d4d4d]/20">
              <AlertCircle size={15} className="text-[#ffa42b] shrink-0 mt-0.5" />
              <p className="leading-relaxed">{rule.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
