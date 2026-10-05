export const HSK_SYLLABUS = {
  'hsk2.0': {
    id: 'hsk2.0',
    label: 'HSK 2.0',
    levels: [1, 2, 3, 4, 5, 6],
    wordlistVersion: '2026-01',
  },
  'hsk3.0': {
    id: 'hsk3.0',
    label: 'HSK 3.0 (2026)',
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    wordlistVersion: '2026-07',
  },
}

export const DEFAULT_LEARNING_SETTINGS = {
  syllabus: 'hsk2.0',
  pinyinDisplay: 'always',
  toneColors: true,
  darkMode: true,
  newCardsPerDay: 8,
  targetMinutes: 30,
}

export const SAMPLE_UNIT_ORDER = [
  { id: 'u01', titleVi: 'Chào hỏi', order: 1 },
  { id: 'u02', titleVi: 'Giới thiệu bản thân', order: 2 },
  { id: 'u03', titleVi: 'Số đếm & thời gian', order: 3 },
  { id: 'u04', titleVi: 'Gia đình & bạn bè', order: 4 },
  { id: 'u05', titleVi: 'Thời gian', order: 5 },
]
