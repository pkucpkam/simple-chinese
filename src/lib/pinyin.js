export const MARKS = {
  a: ['ā', 'á', 'ǎ', 'à', 'a'],
  e: ['ē', 'é', 'ě', 'è', 'e'],
  i: ['ī', 'í', 'ǐ', 'ì', 'i'],
  o: ['ō', 'ó', 'ǒ', 'ò', 'o'],
  u: ['ū', 'ú', 'ǔ', 'ù', 'u'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
}

const TONE_MARK_TO_NUMERIC = new Map([
  ['ā', 'a1'], ['á', 'a2'], ['ǎ', 'a3'], ['à', 'a4'],
  ['ē', 'e1'], ['é', 'e2'], ['ě', 'e3'], ['è', 'e4'],
  ['ī', 'i1'], ['í', 'i2'], ['ǐ', 'i3'], ['ì', 'i4'],
  ['ō', 'o1'], ['ó', 'o2'], ['ǒ', 'o3'], ['ò', 'o4'],
  ['ū', 'u1'], ['ú', 'u2'], ['ǔ', 'u3'], ['ù', 'u4'],
  ['ǖ', 'ü1'], ['ǘ', 'ü2'], ['ǚ', 'ü3'], ['ǜ', 'ü4'],
])

const TONE_NUMBER_BY_BASE = {
  a: ['a1', 'a2', 'a3', 'a4', 'a5'],
  e: ['e1', 'e2', 'e3', 'e4', 'e5'],
  i: ['i1', 'i2', 'i3', 'i4', 'i5'],
  o: ['o1', 'o2', 'o3', 'o4', 'o5'],
  u: ['u1', 'u2', 'u3', 'u4', 'u5'],
  ü: ['ü1', 'ü2', 'ü3', 'ü4', 'ü5'],
}

function stripToneMarks(value = '') {
  return Array.from(value).map((char) => {
    if (TONE_MARK_TO_NUMERIC.has(char)) {
      const normalized = TONE_MARK_TO_NUMERIC.get(char)
      return normalized.slice(0, -1)
    }
    return char
  }).join('')
}

function convertSingleMarkedSyllable(value = '') {
  const cleaned = String(value)
    .toLowerCase()
    .replace(/u:/g, 'ü')
    .replace(/v/g, 'ü')
    .replace(/['’]/g, '')

  if (!cleaned) return ''

  let base = ''
  let toneNumber = null

  for (const char of cleaned) {
    const toneValue = TONE_MARK_TO_NUMERIC.get(char)
    if (toneValue) {
      const baseChar = toneValue.slice(0, -1)
      base += baseChar
      toneNumber = Number(toneValue.slice(-1))
      continue
    }
    base += char
  }

  if (toneNumber === null) {
    return cleaned
  }

  return `${base}${toneNumber}`
}

export function pickVowelIndex(s) {
  let i = s.search(/[ae]/)
  if (i >= 0) return i

  i = s.indexOf('ou')
  if (i >= 0) return i

  for (let k = s.length - 1; k >= 0; k -= 1) {
    if ('iouü'.includes(s[k])) return k
  }

  return -1
}

export function syllableToMarked(raw) {
  const m = String(raw).toLowerCase().match(/^([a-zü:]+?)([1-5])?$/)
  if (!m) return raw

  const base = m[1].replace(/u:|v/g, 'ü')
  const tone = m[2] ? Number(m[2]) : 5
  const idx = pickVowelIndex(base)

  if (idx < 0) return base

  const char = base[idx]
  const marks = MARKS[char] || MARKS[char === 'ü' ? 'ü' : char]

  if (!marks) return base

  return base.slice(0, idx) + marks[tone - 1] + base.slice(idx + 1)
}

export function phraseToMarked(raw) {
  return String(raw || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((syllable) => syllableToMarked(syllable))
    .join(' ')
}

function convertMarkedSyllableToNumeric(value = '') {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .replace(/u:/g, 'ü')
    .replace(/v/g, 'ü')
    .replace(/['’]/g, '')

  if (!cleaned) return ''

  let base = ''
  let toneNumber = 5

  for (const char of cleaned) {
    const toneEntry = TONE_MARK_TO_NUMERIC.get(char)
    if (toneEntry) {
      const baseChar = toneEntry.slice(0, -1)
      base += baseChar
      toneNumber = Number(toneEntry.slice(-1))
      continue
    }

    if (/[a-zü]/.test(char)) {
      base += char
    }
  }

  return `${base}${toneNumber}`
}

export function markedToNumeric(raw) {
  return String(raw || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((syllable) => convertMarkedSyllableToNumeric(syllable))
    .join(' ')
}

export function normalizePinyin(input) {
  if (typeof input !== 'string') return ''

  const parts = input
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, '')
    .replace(/['’]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return ''

  const normalized = parts
    .map((part) => {
      const cleaned = part
        .replace(/u:/g, 'ü')
        .replace(/v/g, 'ü')
        .replace(/[^a-z\u00C0-\u024Fü0-9]/gi, '')

      if (!cleaned) return ''

      if (/\d/.test(cleaned)) {
        return cleaned.replace(/ü/g, 'ü')
      }

      const hasToneMarks = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(cleaned)
      if (hasToneMarks) {
        return convertSingleMarkedSyllable(cleaned)
      }

      return cleaned
    })
    .join('')

  return normalized
}

export function pinyinMatches(input, expected) {
  return normalizePinyin(input) === normalizePinyin(expected)
}

export function splitSyllables(raw) {
  return String(raw)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((syllable) => normalizePinyin(syllable))
}

export { stripToneMarks }
