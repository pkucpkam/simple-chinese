/**
 * Mock progress data — simulates 30 days of study activity
 */

// Generate last N days of dates (ISO strings)
function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}

const DAYS = lastNDays(30)

// Daily activity — words added, listening sessions, writing sessions, grammar exercises
// Simulate realistic learning patterns (more active some days, gaps on weekends)
const RAW_ACTIVITY = [
  // week 1 — just started, small numbers
  { w: 3, l: 1, wr: 0, g: 2 },
  { w: 5, l: 2, wr: 1, g: 3 },
  { w: 0, l: 0, wr: 0, g: 0 }, // gap
  { w: 4, l: 1, wr: 2, g: 1 },
  { w: 6, l: 3, wr: 1, g: 4 },
  { w: 2, l: 1, wr: 0, g: 2 },
  { w: 0, l: 0, wr: 0, g: 0 }, // weekend gap
  // week 2 — picking up
  { w: 5, l: 2, wr: 2, g: 3 },
  { w: 7, l: 3, wr: 1, g: 5 },
  { w: 4, l: 2, wr: 2, g: 2 },
  { w: 6, l: 3, wr: 3, g: 4 },
  { w: 8, l: 4, wr: 2, g: 6 },
  { w: 3, l: 1, wr: 1, g: 2 },
  { w: 5, l: 2, wr: 2, g: 3 },
  // week 3 — consistent
  { w: 6, l: 3, wr: 2, g: 4 },
  { w: 9, l: 4, wr: 3, g: 5 },
  { w: 4, l: 2, wr: 2, g: 3 },
  { w: 7, l: 3, wr: 3, g: 4 },
  { w: 10, l: 5, wr: 4, g: 6 },
  { w: 5, l: 2, wr: 2, g: 3 },
  { w: 8, l: 4, wr: 3, g: 5 },
  // week 4 — strong finish
  { w: 11, l: 5, wr: 4, g: 7 },
  { w: 7, l: 3, wr: 3, g: 4 },
  { w: 9, l: 4, wr: 4, g: 5 },
  { w: 12, l: 6, wr: 5, g: 8 },
  { w: 8, l: 4, wr: 3, g: 5 },
  { w: 10, l: 5, wr: 4, g: 6 },
  { w: 6, l: 3, wr: 2, g: 4 },
  { w: 11, l: 5, wr: 5, g: 7 },
  { w: 9, l: 4, wr: 4, g: 5 },
]

// Build daily data with cumulative word count
let cumWords = 0
export const DAILY_DATA = DAYS.map((date, i) => {
  const a = RAW_ACTIVITY[i] || { w: 0, l: 0, wr: 0, g: 0 }
  cumWords += a.w
  const label = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return {
    date,
    label,
    wordsAdded: a.w,
    cumulativeWords: cumWords,
    listeningMinutes: a.l * 12,
    writingMinutes: a.wr * 8,
    grammarExercises: a.g,
    studyMinutes: a.l * 12 + a.wr * 8 + a.g * 3,
    active: a.w > 0 || a.l > 0 || a.wr > 0 || a.g > 0,
  }
})

// Current streak (consecutive active days from today backwards)
function calcStreak() {
  let streak = 0
  for (let i = DAILY_DATA.length - 1; i >= 0; i--) {
    if (DAILY_DATA[i].active) streak++
    else break
  }
  return streak
}

// Summary stats
export const STATS = {
  totalWords: cumWords,
  streak: calcStreak(),
  longestStreak: 12,
  totalStudyMinutes: DAILY_DATA.reduce((s, d) => s + d.studyMinutes, 0),
  listeningMinutes: DAILY_DATA.reduce((s, d) => s + d.listeningMinutes, 0),
  writingMinutes: DAILY_DATA.reduce((s, d) => s + d.writingMinutes, 0),
  grammarExercises: DAILY_DATA.reduce((s, d) => s + d.grammarExercises, 0),
  vocabAdded: DAILY_DATA.reduce((s, d) => s + d.wordsAdded, 0),
  activeDays: DAILY_DATA.filter(d => d.active).length,
}

// HSK progress (words mastered out of target)
export const HSK_PROGRESS = [
  { level: 1, mastered: 48,  target: 150, label: 'HSK 1', color: '#1ed760' },
  { level: 2, mastered: 61,  target: 150, label: 'HSK 2', color: '#539df5' },
  { level: 3, mastered: 29,  target: 300, label: 'HSK 3', color: '#ffa42b' },
]

// Skill breakdown for the week
export const WEEKLY_SKILL = [
  { skill: 'Vocabulary', minutes: 145, color: '#1ed760', sessions: 28 },
  { skill: 'Listening',  minutes: 96,  color: '#539df5', sessions: 8  },
  { skill: 'Writing',    minutes: 72,  color: '#ffa42b', sessions: 10 },
  { skill: 'Grammar',    minutes: 54,  color: '#f3727f', sessions: 36 },
]

// Recent chart data (last 14 days) for area chart
export const CHART_DATA = DAILY_DATA.slice(-14)
