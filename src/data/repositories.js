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
import { createCardFromWord, scheduleReview } from '../lib/srs'

function createMemoryRepository(seed, storageKey = '') {
  let records = [...seed]

  if (storageKey && typeof localStorage !== 'undefined') {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
      if (Array.isArray(saved)) records = saved
    } catch {
      records = [...seed]
    }
  }

  function persist() {
    if (storageKey && typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(records))
    }
  }

  return {
    list() {
      return [...records]
    },
    getById(id) {
      return records.find(record => record.id === id) ?? null
    },
    create(record) {
      records = [record, ...records]
      persist()
      return record
    },
    update(id, changes) {
      const current = records.find(record => record.id === id)
      if (!current) return null
      const updated = { ...current, ...changes, id }
      records = records.map(record => record.id === id ? updated : record)
      persist()
      return updated
    },
    remove(id) {
      records = records.filter(record => record.id !== id)
      persist()
    },
  }
}

export const vocabRepository = createMemoryRepository(VOCAB_DATA, 'simple-chinese:vocab')

const SRS_STORAGE_KEY = 'simple-chinese:srs'

function readSrsData() {
  if (typeof localStorage === 'undefined') return { cards: {}, logs: [] }

  try {
    const saved = JSON.parse(localStorage.getItem(SRS_STORAGE_KEY) || '{}')
    return {
      cards: saved.cards && typeof saved.cards === 'object' ? saved.cards : {},
      logs: Array.isArray(saved.logs) ? saved.logs : [],
    }
  } catch {
    return { cards: {}, logs: [] }
  }
}

function writeSrsData(data) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(data))
  }
}

export const srsRepository = {
  getCard(word, kind = 'recognition') {
    const data = readSrsData()
    return data.cards[`${word.id}:${kind}`] || createCardFromWord(word, kind)
  },
  review(word, rating, kind = 'recognition') {
    const data = readSrsData()
    const key = `${word.id}:${kind}`
    const current = data.cards[key] || createCardFromWord(word, kind)
    const next = scheduleReview(current, rating)

    data.cards[key] = next
    data.logs.unshift({
      cardId: next.id,
      wordId: word.id,
      kind,
      rating,
      at: new Date().toISOString(),
      prevInterval: current.intervalDays,
      newInterval: next.intervalDays,
    })
    writeSrsData(data)
    return next
  },
  removeByWordId(wordId) {
    const data = readSrsData()
    Object.keys(data.cards).forEach(key => {
      if (key.startsWith(`${wordId}:`)) delete data.cards[key]
    })
    data.logs = data.logs.filter(log => log.wordId !== wordId)
    writeSrsData(data)
  },
  listLogs() {
    return readSrsData().logs
  },
  listCards() {
    return Object.values(readSrsData().cards)
  },
}

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
