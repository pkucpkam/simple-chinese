import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, ChevronRight, Headphones, NotebookText, Play, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { evaluateExercise } from '../../lib/exercise-engine'
import { courseRepository, findAuthoredLesson, lessonProgressRepository, selectGrammarForStep, selectListeningQuestionsForStep, selectWordsForStep } from '../../data/contentRepository'
import { examRepository, grammarRepository, vocabRepository } from '../../data/repositories'

const STORAGE_KEY = 'simple-chinese-lesson-player'

const LESSON = {
  id: 'u01-l1',
  title: 'Unit 1 · Chào hỏi',
  subtitle: 'Làm quen lời chào, cảm ơn, xin lỗi và tạm biệt.',
  exercises: [
    {
      id: 'e_u01_001',
      type: 'mcq_meaning',
      skill: 'vocab',
      prompt: '你好',
      options: ['xin chào', 'tạm biệt', 'cảm ơn', 'xin lỗi'],
      answer: 0,
      explanationVi: '你好 nghĩa là “xin chào”, dùng khi gặp mặt hoặc bắt đầu cuộc nói chuyện.',
    },
    {
      id: 'e_u01_002',
      type: 'mcq_hanzi',
      skill: 'vocab',
      promptVi: 'Tạm biệt',
      options: ['谢谢', '再见', '你好', '不客气'],
      answer: 1,
      explanationVi: '再见 có nghĩa là “tạm biệt”.',
    },
    {
      id: 'e_u01_003',
      type: 'type_pinyin',
      skill: 'pinyin',
      hanzi: '再见',
      answers: ['zai4 jian4'],
      explanationVi: 'Cách đọc chuẩn là zài jiàn, thanh 4 và thanh 4.',
    },
  ],
}

const defaultProgress = {
  currentIndex: 0,
  answered: {},
  completed: false,
}

function AuthoredLessonView({ lesson }) {
  const [progress, setProgress] = useState(() => lessonProgressRepository.get(lesson.id))
  const completedSteps = progress.completedSteps || {}
  const steps = Array.isArray(lesson.steps) ? lesson.steps : []
  const words = vocabRepository.list()
  const completedCount = steps.filter((_, index) => completedSteps[index]).length

  function toggleStep(index) {
    setProgress(current => {
      const next = {
        ...current,
        completedSteps: { ...current.completedSteps, [index]: !current.completedSteps?.[index] },
      }
      next.completed = steps.length > 0 && steps.every((_, stepIndex) => next.completedSteps[stepIndex])
      lessonProgressRepository.save(lesson.id, next)
      return next
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/learn" className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white text-sm">
          <ArrowLeft size={16} /> Quay lại lộ trình
        </Link>
        <span className="rounded-full border border-[#539df5]/30 bg-[#539df5]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#539df5]">
          Studio lesson
        </span>
      </div>

      <div className="rounded-3xl border border-[#4d4d4d]/25 bg-[#181818] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#1ed760] font-bold">{lesson.courseTitle || lesson.courseId}</p>
        <h1 className="mt-2 text-2xl font-bold text-white">{lesson.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#b3b3b3]">Hoàn thành từng bước để học bài này theo thứ tự đã cấu hình.</p>

        <div className="mt-6 flex items-center justify-between text-xs text-[#b3b3b3]">
          <span>Tiến độ bài học</span>
          <span>{completedCount}/{steps.length}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1f1f1f]">
          <div className="h-full rounded-full bg-[#1ed760] transition-all" style={{ width: `${steps.length ? (completedCount / steps.length) * 100 : 0}%` }} />
        </div>

        <div className="mt-6 space-y-2">
          {steps.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#4d4d4d]/40 p-4 text-sm text-[#b3b3b3]">Bài học này chưa có bước học.</p>
          ) : steps.map((step, index) => (
            <button
              key={`${lesson.id}-${index}`}
              type="button"
              onClick={() => toggleStep(index)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${completedSteps[index] ? 'border-[#1ed760]/30 bg-[#1ed760]/10' : 'border-[#4d4d4d]/20 bg-[#1f1f1f]/70 hover:border-[#7c7c7c]'}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${completedSteps[index] ? 'bg-[#1ed760] text-black' : 'bg-[#121212] text-[#b3b3b3]'}`}>
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">{step.title || step.kind}</span>
                <span className="mt-1 block text-xs text-[#7c7c7c]">Bước {step.kind}</span>
                {step.kind === 'words' && selectWordsForStep(words, step).length > 0 && (
                  <span className="mt-3 grid gap-1 sm:grid-cols-2">
                    {selectWordsForStep(words, step).map(word => (
                      <span key={word.id} className="rounded-lg bg-[#121212] px-2 py-1.5 text-xs text-[#d9d9d9]">
                        <strong className="text-white">{word.hanzi}</strong> · {word.pinyin || 'Chưa có pinyin'} · {word.meaning || 'Chưa có nghĩa'}
                      </span>
                    ))}
                  </span>
                )}
                {step.kind === 'grammar' && selectGrammarForStep(grammarRepository.list(), step) && (
                  <span className="mt-3 block rounded-lg bg-[#121212] px-3 py-2 text-xs text-[#d9d9d9]">
                    <strong className="text-white">{selectGrammarForStep(grammarRepository.list(), step).pattern}</strong>
                    <span className="mt-1 block text-[#b3b3b3]">{selectGrammarForStep(grammarRepository.list(), step).summary}</span>
                  </span>
                )}
                {step.kind === 'listen' && selectListeningQuestionsForStep(examRepository.listQuestions('listening'), step).length > 0 && (
                  <span className="mt-3 grid gap-2">
                    {selectListeningQuestionsForStep(examRepository.listQuestions('listening'), step).map(question => (
                      <span key={question.id} className="rounded-lg bg-[#121212] px-3 py-2 text-xs text-[#d9d9d9]">
                        <strong className="block text-white">{question.prompt}</strong>
                        <span className="mt-1 block text-[#7c7c7c]">{question.options.join(' · ')}</span>
                      </span>
                    ))}
                  </span>
                )}
              </span>
              {completedSteps[index] ? <CheckCircle2 size={17} className="text-[#1ed760]" /> : <ChevronRight size={17} className="text-[#7c7c7c]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function readProgress() {
  if (typeof window === 'undefined') return defaultProgress

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw)
    return { ...defaultProgress, ...parsed }
  } catch {
    return defaultProgress
  }
}

export default function LessonPlayer() {
  const { lessonId } = useParams()
  const authoredLesson = lessonId ? findAuthoredLesson(courseRepository.list(), lessonId) : null
  const [progress, setProgress] = useState(readProgress)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState(null)

  const currentExercise = LESSON.exercises[progress.currentIndex] || LESSON.exercises[0]

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const percentage = useMemo(() => {
    const answered = Object.keys(progress.answered).length
    return Math.round((answered / LESSON.exercises.length) * 100)
  }, [progress.answered])

  if (authoredLesson) return <AuthoredLessonView lesson={authoredLesson} />

  const handleSubmit = () => {
    const nextResult = evaluateExercise(currentExercise, selectedAnswer)
    setResult(nextResult)

    setProgress(prev => ({
      ...prev,
      answered: {
        ...prev.answered,
        [currentExercise.id]: {
          selected: selectedAnswer,
          correct: nextResult.correct,
        },
      },
    }))
  }

  const handleNext = () => {
    const nextIndex = progress.currentIndex + 1
    if (nextIndex >= LESSON.exercises.length) {
      setProgress(prev => ({ ...prev, completed: true }))
      return
    }

    setProgress(prev => ({ ...prev, currentIndex: nextIndex }))
    setSelectedAnswer('')
    setResult(null)
  }

  const renderOptions = () => {
    if (!currentExercise) return null

    if (currentExercise.type === 'type_pinyin') {
      return (
        <div className="space-y-3">
          <label className="block text-sm text-[#b3b3b3]">Nhập pinyin (ví dụ: zai4 jian4)</label>
          <input
            value={selectedAnswer}
            onChange={event => setSelectedAnswer(event.target.value)}
            placeholder="Nhập đáp án..."
            className="w-full rounded-xl border border-[#4d4d4d] bg-[#121212] px-4 py-3 text-white outline-none focus:border-[#1ed760]"
          />
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {currentExercise.options.map((option, index) => (
          <button
            key={option}
            onClick={() => setSelectedAnswer(index)}
            className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
              Number(selectedAnswer) === index
                ? 'border-[#1ed760] bg-[#1ed760]/10 text-white'
                : 'border-[#4d4d4d] bg-[#1f1f1f] text-[#d9d9d9] hover:border-[#7c7c7c]'
            }`}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/learn" className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white text-sm">
          <ArrowLeft size={16} /> Quay lại lộ trình
        </Link>
        <span className="rounded-full border border-[#1ed760]/30 bg-[#1ed760]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1ed760]">
          Lesson flow
        </span>
      </div>

      <div className="rounded-3xl border border-[#4d4d4d]/25 bg-[#181818] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#1ed760] font-bold">{LESSON.title}</p>
            <h1 className="mt-2 text-2xl font-bold text-white">{LESSON.subtitle}</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#121212] px-4 py-2 text-sm text-[#b3b3b3]">
            <NotebookText size={16} className="text-[#1ed760]" />
            Bài {progress.currentIndex + 1}/{LESSON.exercises.length}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-[#b3b3b3]">
            <span>Tiến độ</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#1f1f1f]">
            <div className="h-full rounded-full bg-[#1ed760] transition-all" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#4d4d4d]/20 bg-[#1f1f1f] p-5">
            <div className="mb-4 flex items-center gap-2 text-[#1ed760]">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">Câu hỏi</span>
            </div>

            <h2 className="text-3xl font-bold text-white">
              {currentExercise.type === 'type_pinyin' ? currentExercise.hanzi : currentExercise.prompt}
            </h2>
            {currentExercise.promptVi ? (
              <p className="mt-2 text-sm text-[#b3b3b3]">Nghĩa: {currentExercise.promptVi}</p>
            ) : null}

            <div className="mt-6">{renderOptions()}</div>

            {result ? (
              <div className={`mt-6 rounded-2xl border p-4 ${result.correct ? 'border-[#1ed760]/30 bg-[#1ed760]/10' : 'border-[#f3727f]/30 bg-[#f3727f]/10'}`}>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {result.correct ? <CheckCircle2 size={16} className="text-[#1ed760]" /> : <Headphones size={16} className="text-[#f3727f]" />}
                  <span className={result.correct ? 'text-[#1ed760]' : 'text-[#f3727f]'}>{result.correct ? 'Đúng' : 'Sai'}</span>
                </div>
                <p className="mt-2 text-sm text-[#d9d9d9]">{result.feedback}</p>
                <p className="mt-2 text-xs text-[#b3b3b3]">{result.explanationVi}</p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-[#1ed760] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#1ed760]/20 transition hover:brightness-110"
              >
                Kiểm tra
              </button>
              <button
                onClick={handleNext}
                disabled={!result}
                className="rounded-xl border border-[#4d4d4d] px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Tiếp theo <ChevronRight size={16} className="ml-1 inline" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#4d4d4d]/20 bg-[#121212] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#b3b3b3]">Mục tiêu</p>
              <p className="mt-3 text-sm leading-6 text-[#d9d9d9]">
                Học thuộc từ chào hỏi, dùng đúng trong câu và phát âm chuẩn cả âm lẫn thanh.
              </p>
            </div>

            <div className="rounded-2xl border border-[#4d4d4d]/20 bg-[#121212] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#b3b3b3]">Gợi ý ôn tập</p>
              <ul className="mt-3 space-y-2 text-sm text-[#d9d9d9]">
                <li>• Nghe lại 3 lần trước khi trả lời.</li>
                <li>• Lặp lại mẫu câu bằng giọng của mình.</li>
                <li>• Cố gắng nhớ nghĩa và âm thanh cùng lúc.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
