import { useState } from 'react'
import {
  Volume2,
  Sparkles,
  Headphones,
  BookOpen,
  HelpCircle,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { useSpeech } from '../listening/useSpeech'
import PinyinChart from './PinyinChart'
import PinyinQuiz from './PinyinQuiz'
import PinyinToneRules from './PinyinToneRules'

export default function PinyinPractice() {
  const [activeTab, setActiveTab] = useState('chart') // 'chart' | 'quiz' | 'rules'
  const [rate, setRate] = useState(1) // speech rate 0.7 or 1.0
  const { speak, stop, speaking, supported } = useSpeech()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Top Hero Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4d4d4d]/30 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1ed760]/10 text-[#1ed760] border border-[#1ed760]/30 flex items-center gap-1.5">
              <Sparkles size={13} />
              Nền Tảng Hán Ngữ Nhập Môn
            </span>
            {supported ? (
              <span className="text-[11px] text-[#7c7c7c] flex items-center gap-1">
                <CheckCircle2 size={12} className="text-[#1ed760]" /> Giọng đọc chuẩn bản ngữ sẵn sàng
              </span>
            ) : null}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Học Hán Ngữ Bính Âm <span className="text-[#1ed760] font-normal">(Pinyin 拼音)</span>
          </h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl">
            Làm chủ 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu chuẩn cao độ và các quy tắc biến điệu thực tế với hệ thống phát âm tương tác trực quan.
          </p>
        </div>

        {/* Quick Highlights Stats */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#181818] p-2.5 rounded-2xl border border-[#4d4d4d]/30">
          <div className="text-center px-3 py-1 border-r border-[#4d4d4d]/30">
            <span className="text-lg font-bold text-white font-mono block">23</span>
            <span className="text-[10px] text-[#7c7c7c] uppercase">Thanh Mẫu</span>
          </div>
          <div className="text-center px-3 py-1 border-r border-[#4d4d4d]/30">
            <span className="text-lg font-bold text-white font-mono block">24</span>
            <span className="text-[10px] text-[#7c7c7c] uppercase">Vận Mẫu</span>
          </div>
          <div className="text-center px-3 py-1">
            <span className="text-lg font-bold text-[#1ed760] font-mono block">4+1</span>
            <span className="text-[10px] text-[#7c7c7c] uppercase">Thanh Điệu</span>
          </div>
        </div>
      </div>

      {/* ── Main Feature Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#4d4d4d]/30 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('chart')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
            activeTab === 'chart'
              ? 'bg-[#1ed760] text-black shadow-lg shadow-[#1ed760]/20'
              : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Layers size={17} />
          <span>Bảng Tra Cứu Tương Tác</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
            activeTab === 'quiz'
              ? 'bg-[#1ed760] text-black shadow-lg shadow-[#1ed760]/20'
              : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Headphones size={17} />
          <span>Luyện Phản Xạ Nghe</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
            activeTab === 'rules'
              ? 'bg-[#1ed760] text-black shadow-lg shadow-[#1ed760]/20'
              : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
          }`}
        >
          <BookOpen size={17} />
          <span>Bí Kíp Biến Điệu & Quy Tắc</span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div>
        {activeTab === 'chart' && (
          <PinyinChart
            speak={speak}
            speaking={speaking}
            rate={rate}
            setRate={setRate}
          />
        )}

        {activeTab === 'quiz' && (
          <PinyinQuiz
            speak={speak}
            rate={rate}
          />
        )}

        {activeTab === 'rules' && (
          <PinyinToneRules
            speak={speak}
            rate={rate}
          />
        )}
      </div>
    </div>
  )
}
