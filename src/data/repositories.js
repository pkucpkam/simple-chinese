import {
  VOCAB_DATA,
  GRAMMAR_POINTS,
  EXAM_SECTIONS,
  ALL_QUESTIONS,
  INITIALS,
  FINALS,
  TONES,
  TONE_RULES,
  QUIZ_QUESTIONS,
  DAILY_DATA,
  STATS,
  HSK_PROGRESS,
  WEEKLY_SKILL,
  CHART_DATA,
} from './data'
import { LEARNING_LEVELS, STUDY_RHYTHM } from './learningData'

function createMemoryRepository(seed) {
  let records = [...seed]

  return {
    list() {
      return [...records]
    },
    getById(id) {
      return records.find(record => record.id === id) ?? null
    },
    create(record) {
      records = [record, ...records]
      return record
    },
    update(id, changes) {
      const current = records.find(record => record.id === id)
      if (!current) return null
      const updated = { ...current, ...changes, id }
      records = records.map(record => record.id === id ? updated : record)
      return updated
    },
    remove(id) {
      records = records.filter(record => record.id !== id)
    },
  }
}

export const vocabRepository = createMemoryRepository(VOCAB_DATA)

export const grammarRepository = {
  list: () => [...GRAMMAR_POINTS],
  getById: id => GRAMMAR_POINTS.find(point => point.id === id) ?? null,
}

export const examRepository = {
  listSections: () => [...EXAM_SECTIONS],
  listQuestions: section => [...(ALL_QUESTIONS[section] ?? [])],
}

export const pinyinRepository = {
  listInitials: () => [...INITIALS],
  listFinals: () => [...FINALS],
  listTones: () => [...TONES],
  listToneRules: () => [...TONE_RULES],
  listQuizQuestions: () => [...QUIZ_QUESTIONS],
}

export const progressRepository = {
  getDailyData: () => [...DAILY_DATA],
  getStats: () => ({ ...STATS }),
  getHskProgress: () => [...HSK_PROGRESS],
  getWeeklySkill: () => [...WEEKLY_SKILL],
  getChartData: () => [...CHART_DATA],
}

export const learningRepository = {
  listLevels: () => [...LEARNING_LEVELS],
  getDailyRhythm: () => [...STUDY_RHYTHM],
}
