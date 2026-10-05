import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart2,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Languages,
  PenLine,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { learningRepository } from '../../data/repositories'

const ICONS = {
  book: BookOpen,
  chart: BarChart2,
  clipboard: ClipboardList,
  graduation: GraduationCap,
  languages: Languages,
  pen: PenLine,
  refresh: RefreshCw,
  sparkles: Sparkles,
  volume: Volume2,
}

const LEARNING_LEVELS = learningRepository.listLevels()
const STUDY_RHYTHM = learningRepository.getDailyRhythm()
const DEFAULT_STAGE = LEARNING_LEVELS[0].stages[0]
const STORAGE_KEY = 'simple-chinese-learning-checks'

function readChecks() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export default function LearningPath() {
  const level = LEARNING_LEVELS[0]
  const [selectedStageId, setSelectedStageId] = useState(DEFAULT_STAGE.id)
  const [completed, setCompleted] = useState(readChecks)
  const selectedStage = level.stages.find(stage => stage.id === selectedStageId) || DEFAULT_STAGE
  const selectedActions = selectedStage.actions
  const completedCount = selectedActions.filter(action => completed[action.id]).length
  const overallDone = level.stages.reduce(
    (total, stage) => total + stage.actions.filter(action => completed[action.id]).length,
    0,
  )
  const overallTotal = level.stages.reduce((total, stage) => total + stage.actions.length, 0)
  const overallPercent = Math.round((overallDone / overallTotal) * 100)

  function toggleAction(actionId) {
    const next = { ...completed, [actionId]: !completed[actionId] }
    setCompleted(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[#1ed760] text-[11px] font-bold uppercase tracking-widest">Learning Path</p>
            <h1 className="text-white font-bold text-xl leading-tight mt-1">Lộ trình tiếng Trung</h1>
            <p className="text-[#b3b3b3] text-xs mt-0.5">{level.code} · {level.title}</p>
          </div>
          <Link
            to="/progress"
            className="hidden sm:flex items-center gap-2 text-[#b3b3b3] hover:text-white text-xs font-semibold transition-colors"
          >
            <BarChart2 size={16} /> Tiến độ của tôi
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <section className="bg-[#181818] border border-[#4d4d4d]/25 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-[#1ed760] mb-2">
                <PlayCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Bắt đầu từ hôm nay</span>
              </div>
              <h2 className="text-white text-2xl font-bold">Mỗi ngày 35 phút, tiến bộ đều</h2>
              <p className="text-[#b3b3b3] text-sm leading-relaxed mt-2">Ôn từ cũ, học một nội dung mới, rồi nghe và nhại lại. Hoàn thành từng phiên nhỏ để xây nền vững trước khi lên cấp độ tiếp theo.</p>
            </div>
            <div className="lg:min-w-[220px]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#b3b3b3]">Tiến độ lộ trình</span>
                <span className="text-[#1ed760] font-bold">{overallPercent}%</span>
              </div>
              <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                <div className="h-full bg-[#1ed760] rounded-full transition-all" style={{ width: `${overallPercent}%` }} />
              </div>
              <p className="text-[#7c7c7c] text-[11px] mt-2">{overallDone}/{overallTotal} hoạt động đã hoàn thành</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[#b3b3b3] text-xs uppercase tracking-wider font-semibold">Lộ trình 12 tuần</p>
              <h2 className="text-white font-bold text-lg mt-1">Bốn chặng học tập</h2>
            </div>
            <span className="text-[#7c7c7c] text-xs hidden sm:block">Chọn chặng để xem bài học</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {level.stages.map(stage => {
              const done = stage.actions.filter(action => completed[action.id]).length
              const isSelected = stage.id === selectedStage.id
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`text-left rounded-2xl border p-4 transition-all ${isSelected ? 'bg-[#1f1f1f] border-[#1ed760]/60' : 'bg-[#181818] border-[#4d4d4d]/25 hover:border-[#4d4d4d]'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold" style={{ color: stage.color }}>0{stage.phase}</span>
                    <span className="text-[#7c7c7c] text-[11px]">{stage.weeks}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm">{stage.title}</h3>
                  <p className="text-[#b3b3b3] text-xs leading-relaxed mt-2 min-h-[42px]">{stage.description}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-1.5 bg-[#121212] rounded-full flex-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(done / stage.actions.length) * 100}%`, backgroundColor: stage.color }} />
                    </div>
                    <span className="text-[#7c7c7c] text-[11px]">{done}/{stage.actions.length}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-5">
          <div className="bg-[#181818] border border-[#4d4d4d]/25 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: selectedStage.color }}>{selectedStage.weeks}</p>
                <h2 className="text-white font-bold text-lg mt-1">{selectedStage.title}</h2>
                <p className="text-[#b3b3b3] text-sm mt-1 leading-relaxed">{selectedStage.description}</p>
              </div>
              <span className="text-[#7c7c7c] text-xs whitespace-nowrap">{completedCount}/{selectedActions.length}</span>
            </div>

            <div className="space-y-2">
              {selectedActions.map(action => {
                const Icon = ICONS[action.icon] || BookOpen
                const isDone = Boolean(completed[action.id])
                const isLessonAction = action.id === 'pinyin-chart' || action.id === 'tone-rules'
                const targetTo = isLessonAction ? '/lesson' : action.to

                return (
                  <div key={action.id} className={`flex items-center gap-3 border rounded-xl p-3 transition-colors ${isDone ? 'bg-[#1ed760]/5 border-[#1ed760]/25' : 'bg-[#1f1f1f]/60 border-[#4d4d4d]/20'}`}>
                    <button
                      onClick={() => toggleAction(action.id)}
                      aria-label={isDone ? `Đánh dấu chưa hoàn thành: ${action.label}` : `Đánh dấu hoàn thành: ${action.label}`}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-[#1ed760] border-[#1ed760] text-black' : 'border-[#4d4d4d] text-transparent hover:border-[#1ed760]'}`}
                    >
                      <Check size={15} />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-[#121212] flex items-center justify-center shrink-0">
                      <Icon size={16} style={{ color: selectedStage.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${isDone ? 'text-[#b3b3b3] line-through' : 'text-white'}`}>{action.label}</p>
                      <p className="text-[#7c7c7c] text-xs mt-0.5">{action.detail} · {action.minutes} phút</p>
                    </div>
                    <Link to={targetTo} aria-label={`Mở ${action.label}`} className="text-[#7c7c7c] hover:text-white p-1 transition-colors">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#4d4d4d]/20 mt-5 pt-5">
              <p className="text-white text-sm font-semibold mb-3">Mục tiêu chặng này</p>
              <div className="grid sm:grid-cols-3 gap-2">
                {selectedStage.goals.map(goal => <p key={goal} className="text-[#b3b3b3] text-xs leading-relaxed bg-[#1f1f1f]/60 rounded-lg p-3">{goal}</p>)}
              </div>
            </div>
          </div>

          <aside className="bg-[#181818] border border-[#4d4d4d]/25 rounded-2xl p-5 sm:p-6 h-fit">
            <p className="text-[#1ed760] text-xs font-bold uppercase tracking-wider">Nhịp học mỗi ngày</p>
            <h2 className="text-white font-bold text-lg mt-1">Checklist hôm nay</h2>
            <p className="text-[#b3b3b3] text-xs leading-relaxed mt-2">Giữ thứ tự này để việc ôn tập không bị đứt quãng.</p>
            <div className="space-y-2 mt-5">
              {STUDY_RHYTHM.map(item => {
                const Icon = ICONS[item.icon] || BookOpen
                return (
                  <Link key={item.id} to={item.to} className="flex items-center gap-3 bg-[#1f1f1f]/70 rounded-xl p-3 hover:bg-[#252525] transition-colors group">
                    <Icon size={17} className="text-[#b3b3b3] group-hover:text-[#1ed760]" />
                    <div className="flex-1">
                      <p className="text-white text-xs font-semibold">{item.label}</p>
                      <p className="text-[#7c7c7c] text-[11px] mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-[#7c7c7c] text-[11px]">{item.minutes}m</span>
                  </Link>
                )
              })}
            </div>
            <Link to="/progress" className="flex items-center justify-between border-t border-[#4d4d4d]/20 mt-5 pt-4 text-xs text-[#b3b3b3] hover:text-white">
              Xem lịch sử học tập <ChevronRight size={15} />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  )
}
