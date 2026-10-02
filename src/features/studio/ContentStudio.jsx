import { useMemo, useState } from 'react'
import { AlertTriangle, BookOpen, Layers3, NotebookPen, Sparkles } from 'lucide-react'
import { examRepository, grammarRepository, vocabRepository } from '../../data/repositories'
import {
  addLessonToCourse,
  addUnitToCourse,
  appendLessonStep,
  courseRepository,
  createCourseSummary,
  createStudioSummary,
  DEFAULT_COURSES,
  moveLessonStep,
  removeLessonStep,
  updateLesson,
  updateLessonStep,
} from '../../data/contentRepository'
import VocabForm from '../vocab/VocabForm'

const quickStats = [
  { label: 'Tổng từ', color: 'text-white', icon: BookOpen },
  { label: 'Sẵn sàng', color: 'text-[#1ed760]', icon: Layers3 },
  { label: 'Cảnh báo', color: 'text-[#f7c948]', icon: AlertTriangle },
  { label: 'Bài học', color: 'text-[#539df5]', icon: NotebookPen },
]

export default function ContentStudio() {
  const [words, setWords] = useState(() => vocabRepository.list())
  const [courses, setCourses] = useState(() => courseRepository.list())
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')
  const [courseLevel, setCourseLevel] = useState('HSK 1')
  const [unitDrafts, setUnitDrafts] = useState({})
  const [lessonDrafts, setLessonDrafts] = useState({})
  const [selectedCourseId, setSelectedCourseId] = useState(DEFAULT_COURSES[0]?.id || '')
  const [selectedLessonId, setSelectedLessonId] = useState(DEFAULT_COURSES[0]?.lessons?.[0]?.id || '')

  const summary = useMemo(() => createStudioSummary(words), [words])
  const courseSummary = useMemo(() => createCourseSummary(courses), [courses])

  function saveCourses(nextCourses) {
    const savedCourses = courseRepository.replace(nextCourses)
    setCourses(savedCourses)
  }

  function refreshWords() {
    setWords(vocabRepository.list())
  }

  function handleSaveWord(newWord) {
    vocabRepository.create({
      ...newWord,
      status: 'draft',
      tags: [],
      createdAt: new Date().toISOString(),
    })
    refreshWords()
    setShowQuickAdd(false)
  }

  function handleCreateCourse(e) {
    e.preventDefault()
    const title = courseTitle.trim()
    if (!title) return

    courseRepository.create({
      id: `course-${Date.now()}`,
      title,
      levelLabel: courseLevel,
      description: 'Khóa học do người dùng tạo trong Studio.',
      order: courses.length,
      units: [],
      lessons: [],
      createdAt: new Date().toISOString(),
    })

    setCourses(courseRepository.list())
    setCourseTitle('')
    setCourseLevel('HSK 1')
  }

  function handleAddUnit(courseId) {
    const title = (unitDrafts[courseId] || '').trim()
    if (!title) return

    const nextCourses = addUnitToCourse(courses, courseId, {
      id: `unit-${Date.now()}`,
      title,
      goals: [],
    })
    saveCourses(nextCourses)
    setUnitDrafts(current => ({ ...current, [courseId]: '' }))
  }

  function handleAddLesson(courseId) {
    const title = (lessonDrafts[courseId] || '').trim()
    if (!title) return

    const course = courses.find(item => item.id === courseId)
    const nextCourses = addLessonToCourse(courses, courseId, {
      id: `lesson-${Date.now()}`,
      title,
      unitId: course?.units?.[0]?.id || '',
      steps: [{ kind: 'words' }, { kind: 'practice' }, { kind: 'review_mistakes' }, { kind: 'summary' }],
      passPercent: 80,
    })
    saveCourses(nextCourses)
    setLessonDrafts(current => ({ ...current, [courseId]: '' }))
  }

  function handleAddLessonStep(courseId, lessonId) {
    const kind = 'practice'
    saveCourses(appendLessonStep(courses, courseId, lessonId, kind))
  }

  function handleMoveLessonStep(courseId, lessonId, fromIndex, direction) {
    const nextIndex = direction === 'up' ? Math.max(fromIndex - 1, 0) : Math.min(fromIndex + 1, Number.MAX_SAFE_INTEGER)
    const safeIndex = direction === 'up' ? nextIndex : Math.min(fromIndex + 1, 1000)
    saveCourses(moveLessonStep(courses, courseId, lessonId, fromIndex, safeIndex))
  }

  const stats = [
    { label: 'Tổng từ', value: summary.total, color: 'text-white' },
    { label: 'Sẵn sàng', value: summary.ready, color: 'text-[#1ed760]' },
    { label: 'Cảnh báo', value: summary.alerts.length, color: 'text-[#f7c948]' },
    { label: 'Bài học', value: courseSummary.totalLessons, color: 'text-[#539df5]' },
  ]

  const selectedLesson = useMemo(() => {
    if (!selectedCourseId || !selectedLessonId) return null

    const course = courses.find(item => item.id === selectedCourseId)
    if (!course) return null

    return (course.lessons || []).find(item => item.id === selectedLessonId) || null
  }, [courses, selectedCourseId, selectedLessonId])

  function handleLessonField(field, value) {
    if (!selectedCourseId || !selectedLessonId) return
    saveCourses(updateLesson(courses, selectedCourseId, selectedLessonId, { [field]: value }))
  }

  function handleLessonStepField(stepIndex, field, value) {
    if (!selectedCourseId || !selectedLessonId) return
    saveCourses(updateLessonStep(courses, selectedCourseId, selectedLessonId, stepIndex, { [field]: value }))
  }

  function handleRemoveLessonStep(stepIndex) {
    if (!selectedCourseId || !selectedLessonId) return
    saveCourses(removeLessonStep(courses, selectedCourseId, selectedLessonId, stepIndex))
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">
      <header className="rounded-3xl border border-[#4d4d4d]/30 bg-[#181818] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#1ed760]">
              <Sparkles size={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Content Studio</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-white">Quản lý nội dung học tập</h1>
            <p className="mt-2 text-sm text-[#b3b3b3]">
              Tạo, lưu và kiểm tra dữ liệu từ vựng, bài học và nội dung học theo hướng mở cho HSK 1–3.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQuickAdd(true)}
            className="inline-flex items-center justify-center rounded-full bg-[#1ed760] px-4 py-2 text-sm font-bold text-black hover:bg-[#1fdf64]"
          >
            + Tạo nhanh từ mới
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = quickStats[index].icon
          return (
            <div key={stat.label} className="rounded-2xl border border-[#4d4d4d]/30 bg-[#181818] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[#b3b3b3] text-xs uppercase tracking-wider">{stat.label}</p>
                <Icon size={16} className={stat.color} />
              </div>
              <p className={`mt-3 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          )
        })}
      </div>

      {showQuickAdd && (
        <VocabForm
          onSave={handleSaveWord}
          onCancel={() => setShowQuickAdd(false)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#4d4d4d]/30 bg-[#181818] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Tổng quan nội dung</h2>
            <span className="rounded-full bg-[#1f1f1f] px-2 py-1 text-xs text-[#b3b3b3]">
              {words.length} mục
            </span>
          </div>

          <div className="space-y-3">
            {words.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#4d4d4d]/40 p-5 text-sm text-[#b3b3b3]">
                Chưa có nội dung nào. Thêm từ đầu tiên để bắt đầu Studio.
              </div>
            ) : (
              words.slice(0, 8).map(word => (
                <div key={word.id} className="flex items-center justify-between rounded-xl border border-[#4d4d4d]/20 bg-[#121212] px-3 py-2.5">
                  <div>
                    <p className="text-base font-bold text-white">{word.hanzi}</p>
                    <p className="text-xs text-[#b3b3b3]">{word.pinyin || 'Thiếu pinyin'} · {word.meaning || 'Thiếu nghĩa'}</p>
                  </div>
                  <span className="rounded-full bg-[#1f1f1f] px-2 py-1 text-[10px] uppercase tracking-wider text-[#b3b3b3]">
                    HSK {word.hsk ?? 1}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-5 rounded-2xl border border-[#4d4d4d]/30 bg-[#181818] p-5">
          <div>
            <h2 className="text-lg font-bold text-white">Kiểm tra dữ liệu</h2>
            {summary.alerts.length === 0 ? (
              <div className="mt-4 rounded-xl border border-[#1ed760]/40 bg-[#0f1d13] px-3 py-4 text-sm text-[#b3b3b3]">
                Không có cảnh báo nào trong danh sách hiện tại.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {summary.alerts.map(alert => (
                  <li key={alert.kind} className="rounded-xl border border-[#f7c948]/30 bg-[#211a10] px-3 py-2 text-sm text-[#f7d77f]">
                    {alert.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-[#4d4d4d]/30 bg-[#121212] p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b3b3b3]">Khóa học</h3>
            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3">
              <input
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                placeholder="Tên khóa học"
                className="w-full rounded-xl border border-[#4d4d4d]/30 bg-[#1f1f1f] px-3 py-2 text-sm text-white placeholder-[#6b6b6b]"
              />
              <select
                value={courseLevel}
                onChange={e => setCourseLevel(e.target.value)}
                className="w-full rounded-xl border border-[#4d4d4d]/30 bg-[#1f1f1f] px-3 py-2 text-sm text-white"
              >
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="Tùy chỉnh">Tùy chỉnh</option>
              </select>
              <button type="submit" className="w-full rounded-full bg-[#1ed760] px-4 py-2 text-sm font-bold text-black">
                Tạo khóa học
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {courses.map(course => (
                <div key={course.id} className="rounded-xl border border-[#4d4d4d]/20 bg-[#181818] px-3 py-2.5">
                  <p className="text-sm font-semibold text-white">{course.title}</p>
                  <p className="text-[11px] text-[#b3b3b3]">
                    {course.levelLabel} · {course.units?.length ?? 0} unit · {course.lessons?.length ?? 0} bài học
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={unitDrafts[course.id] || ''}
                        onChange={event => setUnitDrafts(current => ({ ...current, [course.id]: event.target.value }))}
                        placeholder="Tên unit"
                        className="flex-1 rounded-lg border border-[#4d4d4d]/30 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white placeholder-[#6b6b6b]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddUnit(course.id)}
                        className="rounded-lg bg-[#1ed760] px-2 py-1.5 text-[10px] font-bold text-black"
                      >
                        + Unit
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        value={lessonDrafts[course.id] || ''}
                        onChange={event => setLessonDrafts(current => ({ ...current, [course.id]: event.target.value }))}
                        placeholder="Tên bài học"
                        className="flex-1 rounded-lg border border-[#4d4d4d]/30 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white placeholder-[#6b6b6b]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddLesson(course.id)}
                        className="rounded-lg bg-[#539df5] px-2 py-1.5 text-[10px] font-bold text-white"
                      >
                        + Bài
                      </button>
                    </div>

                    {(course.lessons || []).map(lesson => (
                      <div key={lesson.id} className="rounded-lg border border-[#4d4d4d]/20 bg-[#121212] p-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white">{lesson.title}</p>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCourseId(course.id)
                                setSelectedLessonId(lesson.id)
                              }}
                              className="rounded bg-[#1f1f1f] px-2 py-1 text-[10px] text-[#b3b3b3]"
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddLessonStep(course.id, lesson.id)}
                              className="rounded bg-[#1f1f1f] px-2 py-1 text-[10px] text-[#b3b3b3]"
                            >
                              + Step
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(lesson.steps || []).map((step, index) => (
                            <div key={`${lesson.id}-${index}`} className="flex items-center gap-1 rounded-full bg-[#1f1f1f] px-2 py-1 text-[10px] text-[#b3b3b3]">
                              <span>{step.kind}</span>
                              <button
                                type="button"
                                onClick={() => handleMoveLessonStep(course.id, lesson.id, index, 'up')}
                                className="text-[#1ed760]"
                                disabled={index === 0}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveLessonStep(course.id, lesson.id, index, 'down')}
                                className="text-[#539df5]"
                                disabled={index === (lesson.steps || []).length - 1}
                              >
                                ↓
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedLesson && (
              <div className="mt-5 rounded-2xl border border-[#4d4d4d]/30 bg-[#121212] p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b3b3b3]">Editor bài học</h3>

                <div className="mt-4 space-y-3">
                  <label className="block text-xs text-[#b3b3b3]">
                    Tên bài học
                    <input
                      value={selectedLesson.title || ''}
                      onChange={event => handleLessonField('title', event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#4d4d4d]/30 bg-[#1f1f1f] px-3 py-2 text-sm text-white"
                    />
                  </label>

                  <label className="block text-xs text-[#b3b3b3]">
                    Điểm đạt yêu cầu (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedLesson.passPercent ?? 80}
                      onChange={event => handleLessonField('passPercent', Number(event.target.value) || 0)}
                      className="mt-1 w-full rounded-xl border border-[#4d4d4d]/30 bg-[#1f1f1f] px-3 py-2 text-sm text-white"
                    />
                  </label>
                </div>

                <div className="mt-4 space-y-2">
                  {(selectedLesson.steps || []).map((step, index) => (
                    <div key={`${selectedLesson.id}-step-${index}`} className="rounded-xl border border-[#4d4d4d]/20 bg-[#181818] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#b3b3b3]">Bước {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLessonStep(index)}
                          className="text-[10px] text-[#ff6b6b]"
                        >
                          Xóa
                        </button>
                      </div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <label className="block text-[11px] text-[#b3b3b3]">
                          Loại
                          <select
                            value={step.kind || 'practice'}
                            onChange={event => handleLessonStepField(index, 'kind', event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#4d4d4d]/30 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white"
                          >
                            <option value="words">words</option>
                            <option value="dialogue">dialogue</option>
                            <option value="grammar">grammar</option>
                            <option value="practice">practice</option>
                            <option value="review_mistakes">review_mistakes</option>
                            <option value="summary">summary</option>
                          </select>
                        </label>

                        <label className="block text-[11px] text-[#b3b3b3]">
                          Tiêu đề
                          <input
                            value={step.title || ''}
                            onChange={event => handleLessonStepField(index, 'title', event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#4d4d4d]/30 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white"
                          />
                        </label>
                      </div>

                      {step.kind === 'words' && (
                        <fieldset className="mt-3 rounded-lg border border-[#4d4d4d]/20 bg-[#121212] p-2">
                          <legend className="px-1 text-[11px] text-[#b3b3b3]">Từ vựng trong bước</legend>
                          <div className="mt-1 grid gap-1 sm:grid-cols-2">
                            {words.slice(0, 12).map(word => {
                              const selectedWordIds = step.wordIds || []
                              const checked = selectedWordIds.includes(word.id)
                              return (
                                <label key={word.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[#d9d9d9] hover:bg-[#1f1f1f]">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const nextWordIds = checked
                                        ? selectedWordIds.filter(id => id !== word.id)
                                        : [...selectedWordIds, word.id]
                                      handleLessonStepField(index, 'wordIds', nextWordIds)
                                    }}
                                  />
                                  <span>{word.hanzi} <span className="text-[#7c7c7c]">{word.meaning || 'Chưa có nghĩa'}</span></span>
                                </label>
                              )
                            })}
                          </div>
                        </fieldset>
                      )}

                      {step.kind === 'grammar' && (
                        <label className="mt-3 block text-[11px] text-[#b3b3b3]">
                          Điểm ngữ pháp
                          <select
                            value={step.grammarId || ''}
                            onChange={event => handleLessonStepField(index, 'grammarId', event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#4d4d4d]/30 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white"
                          >
                            <option value="">Chọn điểm ngữ pháp</option>
                            {grammarRepository.list().map(point => (
                              <option key={point.id} value={point.id}>{point.pattern}</option>
                            ))}
                          </select>
                        </label>
                      )}

                      {step.kind === 'listen' && (
                        <fieldset className="mt-3 rounded-lg border border-[#4d4d4d]/20 bg-[#121212] p-2">
                          <legend className="px-1 text-[11px] text-[#b3b3b3]">Câu hỏi nghe</legend>
                          <div className="mt-1 space-y-1">
                            {examRepository.listQuestions('listening').slice(0, 8).map(question => {
                              const selectedQuestionIds = step.questionIds || []
                              const checked = selectedQuestionIds.includes(question.id)
                              return (
                                <label key={question.id} className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs text-[#d9d9d9] hover:bg-[#1f1f1f]">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const nextQuestionIds = checked
                                        ? selectedQuestionIds.filter(id => id !== question.id)
                                        : [...selectedQuestionIds, question.id]
                                      handleLessonStepField(index, 'questionIds', nextQuestionIds)
                                    }}
                                  />
                                  <span>{question.prompt}</span>
                                </label>
                              )
                            })}
                          </div>
                        </fieldset>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
