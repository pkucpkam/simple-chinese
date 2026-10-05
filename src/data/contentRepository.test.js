import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createStudioSummary,
  createCollectionRepository,
  createCourseSummary,
  addUnitToCourse,
  addLessonToCourse,
  findAuthoredLesson,
  listAuthoredLessons,
  moveLessonStep,
  selectWordsForStep,
  selectGrammarForStep,
  selectListeningQuestionsForStep,
  updateLesson,
  updateLessonStep,
} from './contentRepository.js'

test('createStudioSummary reports alerts for incomplete content', () => {
  const summary = createStudioSummary([
    { id: '1', hanzi: '你好', pinyin: '', meaning: '', example: '', hsk: 1 },
    { id: '2', hanzi: '学习', pinyin: 'xué xí', meaning: 'study', example: '我学习汉语。', hsk: 1 },
    { id: '3', hanzi: '朋友', pinyin: 'péng you', meaning: 'friend', example: '', hsk: 2 },
  ])

  assert.equal(summary.total, 3)
  assert.equal(summary.ready, 1)
  assert.equal(summary.missingPinyin, 1)
  assert.equal(summary.missingMeaning, 1)
  assert.equal(summary.missingExample, 2)
  assert.equal(summary.alerts.length, 3)
})

test('createCollectionRepository supports local storage style CRUD and soft deletes', () => {
  const repo = createCollectionRepository('studio-test', [
    { id: 'a', title: 'Alpha' },
  ])

  assert.equal(repo.list().length, 1)
  repo.create({ id: 'b', title: 'Beta' })
  repo.softDelete('a')

  assert.equal(repo.list().length, 1)
  assert.equal(repo.getTrash().length, 1)
  assert.equal(repo.getById('a')?.deletedAt, 'soft-deleted')
  assert.equal(repo.getById('b')?.title, 'Beta')
})

test('createCollectionRepository replaces a collection and returns active records', () => {
  const repo = createCollectionRepository('studio-replace-test', [{ id: 'a', title: 'Alpha' }])

  const active = repo.replace([
    { id: 'b', title: 'Beta' },
    { id: 'trash', title: 'Old', deletedAt: 'soft-deleted' },
  ])

  assert.deepEqual(active, [{ id: 'b', title: 'Beta' }])
  assert.equal(repo.getById('trash')?.deletedAt, 'soft-deleted')
})

test('createCourseSummary tracks course, unit and lesson health', () => {
  const summary = createCourseSummary([
    {
      id: 'course-1',
      title: 'HSK 1',
      levelLabel: 'HSK 1',
      units: [
        { id: 'unit-1', title: 'Greetings', courseId: 'course-1' },
      ],
      lessons: [
        { id: 'lesson-1', title: 'Greeting Basics', unitId: 'unit-1', courseId: 'course-1', steps: [{ kind: 'words' }] },
        { id: 'lesson-2', title: 'Empty Lesson', unitId: 'unit-1', courseId: 'course-1', steps: [] },
      ],
    },
  ])

  assert.equal(summary.totalCourses, 1)
  assert.equal(summary.totalUnits, 1)
  assert.equal(summary.totalLessons, 2)
  assert.equal(summary.emptyLessons, 1)
  assert.equal(summary.alerts.length, 1)
})

test('authored lesson helpers flatten course context for learner routes', () => {
  const lessons = listAuthoredLessons([{
    id: 'course-1',
    title: 'HSK 1',
    levelLabel: 'HSK 1',
    lessons: [{ id: 'lesson-1', title: 'Greetings', steps: [{ kind: 'words' }] }],
  }])

  assert.equal(lessons.length, 1)
  assert.equal(lessons[0].courseTitle, 'HSK 1')
  assert.equal(findAuthoredLesson([{ id: 'course-1', lessons }], 'lesson-1')?.title, 'Greetings')
})

test('selectWordsForStep returns only vocabulary assigned to a words step', () => {
  const selected = selectWordsForStep([
    { id: 'word-1', hanzi: '你好' },
    { id: 'word-2', hanzi: '谢谢' },
  ], { wordIds: ['word-2'] })

  assert.deepEqual(selected.map(word => word.hanzi), ['谢谢'])
})

test('selectGrammarForStep resolves the grammar point assigned to a step', () => {
  const selected = selectGrammarForStep([
    { id: 'grammar-1', pattern: '是', summary: 'To be' },
  ], { grammarId: 'grammar-1' })

  assert.equal(selected?.pattern, '是')
  assert.equal(selectGrammarForStep([], { grammarId: 'missing' }), null)
})

test('selectListeningQuestionsForStep returns assigned listening questions in source order', () => {
  const selected = selectListeningQuestionsForStep([
    { id: 'q-1', prompt: '你好' },
    { id: 'q-2', prompt: '谢谢' },
  ], { questionIds: ['q-2', 'q-1'] })

  assert.deepEqual(selected.map(question => question.id), ['q-1', 'q-2'])
})

test('addUnitToCourse and addLessonToCourse attach items to the correct course', () => {
  const courses = [
    { id: 'course-1', title: 'HSK 1', units: [], lessons: [] },
    { id: 'course-2', title: 'HSK 2', units: [], lessons: [] },
  ]

  const withUnit = addUnitToCourse(courses, 'course-1', { id: 'unit-1', title: 'Greetings' })
  const withLesson = addLessonToCourse(withUnit, 'course-1', {
    id: 'lesson-1',
    title: 'Greeting Basics',
    unitId: 'unit-1',
    steps: [{ kind: 'words' }],
  })

  assert.equal(withLesson[0].units.length, 1)
  assert.equal(withLesson[0].lessons.length, 1)
  assert.equal(withLesson[1].units.length, 0)
  assert.equal(withLesson[0].lessons[0].title, 'Greeting Basics')
})

test('moveLessonStep reorders steps within a lesson and keeps other courses untouched', () => {
  const courses = [{
    id: 'course-1',
    title: 'HSK 1',
    units: [],
    lessons: [{
      id: 'lesson-1',
      title: 'Greeting Basics',
      unitId: 'unit-1',
      steps: [{ kind: 'words' }, { kind: 'practice' }, { kind: 'summary' }],
    }],
  }, {
    id: 'course-2',
    title: 'HSK 2',
    units: [],
    lessons: [{
      id: 'lesson-2',
      title: 'Other',
      unitId: 'unit-2',
      steps: [{ kind: 'listen' }],
    }],
  }]

  const next = moveLessonStep(courses, 'course-1', 'lesson-1', 0, 2)

  assert.deepEqual(next[0].lessons[0].steps.map(step => step.kind), ['practice', 'summary', 'words'])
  assert.deepEqual(next[1].lessons[0].steps.map(step => step.kind), ['listen'])
})

test('updateLesson and updateLessonStep patch lesson metadata and step details', () => {
  const courses = [{
    id: 'course-1',
    title: 'HSK 1',
    units: [],
    lessons: [{
      id: 'lesson-1',
      title: 'Greeting Basics',
      unitId: 'unit-1',
      passPercent: 80,
      steps: [{ kind: 'words', title: 'Vocabulary' }, { kind: 'practice', title: 'Practice' }],
    }],
  }]

  const updatedLesson = updateLesson(courses, 'course-1', 'lesson-1', {
    title: 'Greeting and numbers',
    passPercent: 90,
  })

  const updatedStep = updateLessonStep(updatedLesson, 'course-1', 'lesson-1', 1, {
    kind: 'dialogue',
    title: 'Listening drill',
  })

  assert.equal(updatedStep[0].lessons[0].title, 'Greeting and numbers')
  assert.equal(updatedStep[0].lessons[0].passPercent, 90)
  assert.equal(updatedStep[0].lessons[0].steps[1].kind, 'dialogue')
  assert.equal(updatedStep[0].lessons[0].steps[1].title, 'Listening drill')
})
