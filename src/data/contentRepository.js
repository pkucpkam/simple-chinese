const STORAGE_PREFIX = 'simple-chinese:studio:'

export const DEFAULT_COURSES = [
  {
    id: 'course-hsk-1',
    title: 'HSK 1',
    levelLabel: 'HSK 1',
    description: 'Khóa học nền tảng cho giao tiếp cơ bản.',
    units: [
      { id: 'unit-greetings', title: 'Lời chào', courseId: 'course-hsk-1' },
    ],
    lessons: [
      { id: 'lesson-greetings', title: 'Chào hỏi cơ bản', courseId: 'course-hsk-1', unitId: 'unit-greetings', steps: [{ kind: 'words' }] },
    ],
  },
]

export function createStudioSummary(items = []) {
  const records = Array.isArray(items) ? items : []
  const total = records.length
  const missingPinyin = records.filter(item => !String(item?.pinyin ?? '').trim()).length
  const missingMeaning = records.filter(item => !String(item?.meaning ?? item?.meaningVi ?? '').trim()).length
  const missingExample = records.filter(item => !String(item?.example ?? item?.exampleSentence ?? '').trim()).length
  const ready = records.filter(item => {
    const hasPinyin = !!String(item?.pinyin ?? '').trim()
    const hasMeaning = !!String(item?.meaning ?? item?.meaningVi ?? '').trim()
    const hasExample = !!String(item?.example ?? item?.exampleSentence ?? '').trim()
    return hasPinyin && hasMeaning && hasExample
  }).length

  const alerts = [
    ...(missingPinyin > 0 ? [{ kind: 'pinyin', message: `Thiếu pinyin cho ${missingPinyin} mục` }] : []),
    ...(missingMeaning > 0 ? [{ kind: 'meaning', message: `Thiếu nghĩa cho ${missingMeaning} mục` }] : []),
    ...(missingExample > 0 ? [{ kind: 'example', message: `Thiếu ví dụ cho ${missingExample} mục` }] : []),
  ]

  return {
    total,
    ready,
    missingPinyin,
    missingMeaning,
    missingExample,
    alerts,
  }
}

export function createCollectionRepository(namespace, seed = []) {
  const storageKey = `${STORAGE_PREFIX}${namespace}`
  const initialRecords = Array.isArray(seed) ? seed : []
  let records = [...initialRecords]

  if (typeof localStorage !== 'undefined') {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
      if (Array.isArray(saved) && saved.length) {
        records = saved
      }
    } catch {
      records = [...initialRecords]
    }
  }

  function persist() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(records))
    }
  }

  return {
    list() {
      return records.filter(item => !item?.deletedAt)
    },
    replace(nextRecords) {
      records = Array.isArray(nextRecords) ? [...nextRecords] : []
      persist()
      return records.filter(item => !item?.deletedAt)
    },
    getById(id) {
      return records.find(item => item?.id === id) ?? null
    },
    getTrash() {
      return records.filter(item => item?.deletedAt)
    },
    create(value) {
      const next = { ...value, createdAt: value.createdAt || new Date().toISOString() }
      records = [next, ...records]
      persist()
      return next
    },
    update(id, value) {
      const current = records.find(item => item?.id === id)
      if (!current) return null
      const next = {
        ...current,
        ...value,
        id,
        updatedAt: new Date().toISOString(),
      }
      records = records.map(item => item?.id === id ? next : item)
      persist()
      return next
    },
    softDelete(id) {
      const current = records.find(item => item?.id === id)
      if (!current) return null
      const next = {
        ...current,
        deletedAt: 'soft-deleted',
        updatedAt: new Date().toISOString(),
      }
      records = records.map(item => item?.id === id ? next : item)
      persist()
      return next
    },
    restore(id) {
      const current = records.find(item => item?.id === id)
      if (!current) return null
      const next = {
        ...current,
        deletedAt: undefined,
        updatedAt: new Date().toISOString(),
      }
      records = records.map(item => item?.id === id ? next : item)
      persist()
      return next
    },
    remove(id) {
      const removed = records.filter(item => item?.id !== id)
      records = removed
      persist()
      return removed
    },
  }
}

export function createCourseSummary(courses = []) {
  const courseList = Array.isArray(courses) ? courses : []
  const totalCourses = courseList.length
  const totalUnits = courseList.reduce((sum, course) => sum + (Array.isArray(course?.units) ? course.units.length : 0), 0)
  const totalLessons = courseList.reduce((sum, course) => sum + (Array.isArray(course?.lessons) ? course.lessons.length : 0), 0)
  const emptyLessons = courseList.reduce((sum, course) => {
    if (!Array.isArray(course?.lessons)) return sum
    return sum + course.lessons.filter(lesson => !Array.isArray(lesson?.steps) || lesson.steps.length === 0).length
  }, 0)

  const alerts = []
  if (emptyLessons > 0) {
    alerts.push({ kind: 'empty-lesson', message: `Có ${emptyLessons} bài học rỗng cần bổ sung bước học` })
  }

  return {
    totalCourses,
    totalUnits,
    totalLessons,
    emptyLessons,
    alerts,
  }
}

export function createDefaultLessonSteps() {
  return [{ kind: 'words' }, { kind: 'practice' }, { kind: 'review_mistakes' }, { kind: 'summary' }]
}

export function addUnitToCourse(courses = [], courseId, unit) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const nextUnit = {
      id: unit?.id || `unit-${Date.now()}`,
      title: unit?.title || 'Unit mới',
      courseId,
      order: Array.isArray(course.units) ? course.units.length : 0,
      goals: Array.isArray(unit?.goals) ? unit.goals : [],
      ...unit,
    }

    return {
      ...course,
      units: [...(Array.isArray(course.units) ? course.units : []), nextUnit],
    }
  })
}

export function addLessonToCourse(courses = [], courseId, lesson) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const nextLesson = {
      id: lesson?.id || `lesson-${Date.now()}`,
      title: lesson?.title || 'Bài học mới',
      courseId,
      unitId: lesson?.unitId || (Array.isArray(course.units) && course.units[0]?.id) || '',
      order: Array.isArray(course.lessons) ? course.lessons.length : 0,
      steps: Array.isArray(lesson?.steps) && lesson.steps.length > 0 ? lesson.steps : createDefaultLessonSteps(),
      passPercent: lesson?.passPercent ?? 80,
      ...lesson,
    }

    return {
      ...course,
      lessons: [...(Array.isArray(course.lessons) ? course.lessons : []), nextLesson],
    }
  })
}

export function moveLessonStep(courses = [], courseId, lessonId, fromIndex, toIndex) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) => {
      if (lesson?.id !== lessonId) return lesson

      const steps = Array.isArray(lesson.steps) ? [...lesson.steps] : []
      if (fromIndex < 0 || fromIndex >= steps.length || toIndex < 0 || toIndex >= steps.length) return lesson

      const nextSteps = [...steps]
      const [movedStep] = nextSteps.splice(fromIndex, 1)
      nextSteps.splice(toIndex, 0, movedStep)

      return {
        ...lesson,
        steps: nextSteps,
      }
    }) : []

    return {
      ...course,
      lessons,
    }
  })
}

export function appendLessonStep(courses = [], courseId, lessonId, kind) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) => {
      if (lesson?.id !== lessonId) return lesson

      const nextSteps = Array.isArray(lesson.steps) ? [...lesson.steps] : []
      nextSteps.push({ kind })

      return {
        ...lesson,
        steps: nextSteps,
      }
    }) : []

    return {
      ...course,
      lessons,
    }
  })
}

export function updateLesson(courses = [], courseId, lessonId, updates = {}) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) => {
      if (lesson?.id !== lessonId) return lesson
      return {
        ...lesson,
        ...updates,
      }
    }) : []

    return {
      ...course,
      lessons,
    }
  })
}

export function updateLessonStep(courses = [], courseId, lessonId, stepIndex, updates = {}) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) => {
      if (lesson?.id !== lessonId) return lesson

      const steps = Array.isArray(lesson.steps) ? [...lesson.steps] : []
      if (stepIndex < 0 || stepIndex >= steps.length) return lesson

      steps[stepIndex] = {
        ...steps[stepIndex],
        ...updates,
      }

      return {
        ...lesson,
        steps,
      }
    }) : []

    return {
      ...course,
      lessons,
    }
  })
}

export function removeLessonStep(courses = [], courseId, lessonId, stepIndex) {
  if (!Array.isArray(courses)) return []

  return courses.map((course) => {
    if (course?.id !== courseId) return course

    const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) => {
      if (lesson?.id !== lessonId) return lesson

      const steps = Array.isArray(lesson.steps) ? [...lesson.steps] : []
      if (stepIndex < 0 || stepIndex >= steps.length) return lesson

      steps.splice(stepIndex, 1)

      return {
        ...lesson,
        steps,
      }
    }) : []

    return {
      ...course,
      lessons,
    }
  })
}

export function createCourseRepository(seed = []) {
  return createCollectionRepository('courses', seed)
}

export function createUnitRepository(seed = []) {
  return createCollectionRepository('units', seed)
}

export function createLessonRepository(seed = []) {
  return createCollectionRepository('lessons', seed)
}

export const courseRepository = createCourseRepository(DEFAULT_COURSES)
export const studioRepository = createCollectionRepository('studio')

export function listAuthoredLessons(courses = []) {
  if (!Array.isArray(courses)) return []

  return courses.flatMap(course => (Array.isArray(course?.lessons) ? course.lessons.map(lesson => ({
    ...lesson,
    courseId: lesson.courseId || course.id,
    courseTitle: course.title,
    levelLabel: course.levelLabel,
  })) : []))
}

export function findAuthoredLesson(courses = [], lessonId) {
  return listAuthoredLessons(courses).find(lesson => lesson.id === lessonId) ?? null
}

export function selectWordsForStep(words = [], step = {}) {
  if (!Array.isArray(words) || !Array.isArray(step?.wordIds)) return []
  const selectedIds = new Set(step.wordIds)
  return words.filter(word => selectedIds.has(word?.id))
}

export function selectGrammarForStep(grammarPoints = [], step = {}) {
  if (!Array.isArray(grammarPoints) || !step?.grammarId) return null
  return grammarPoints.find(point => point?.id === step.grammarId) ?? null
}

export function selectListeningQuestionsForStep(questions = [], step = {}) {
  if (!Array.isArray(questions) || !Array.isArray(step?.questionIds)) return []
  const selectedIds = new Set(step.questionIds)
  return questions.filter(question => selectedIds.has(question?.id))
}

const LESSON_PROGRESS_KEY = `${STORAGE_PREFIX}lesson-progress`

function readLessonProgress() {
  if (typeof localStorage === 'undefined') return {}
  try {
    const saved = JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY) || '{}')
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

export const lessonProgressRepository = {
  get(lessonId) {
    return readLessonProgress()[lessonId] || { completedSteps: {}, completed: false }
  },
  save(lessonId, progress) {
    const all = readLessonProgress()
    all[lessonId] = progress
    if (typeof localStorage !== 'undefined') localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(all))
    return progress
  },
  list() {
    return readLessonProgress()
  },
}
