import test from 'node:test'
import assert from 'node:assert/strict'
import {
  syllableToMarked,
  phraseToMarked,
  markedToNumeric,
  normalizePinyin,
} from './pinyin.js'

test('syllableToMarked converts numeric tones to marked style', () => {
  assert.equal(syllableToMarked('hao3'), 'hǎo')
  assert.equal(syllableToMarked('liu2'), 'liú')
  assert.equal(syllableToMarked('gui4'), 'guì')
  assert.equal(syllableToMarked('zou3'), 'zǒu')
  assert.equal(syllableToMarked('lv4'), 'lǜ')
  assert.equal(syllableToMarked('xie4'), 'xiè')
  assert.equal(syllableToMarked('ma'), 'ma')
})

test('phraseToMarked converts phrases with spaces and tone numbers', () => {
  assert.equal(phraseToMarked('ni3 hao3'), 'nǐ hǎo')
  assert.equal(phraseToMarked('liu2 xue2'), 'liú xué')
  assert.equal(phraseToMarked('lv4'), 'lǜ')
})

test('markedToNumeric reverses marked syllables and phrases', () => {
  assert.equal(markedToNumeric('nǐ hǎo'), 'ni3 hao3')
  assert.equal(markedToNumeric('liú xué'), 'liu2 xue2')
  assert.equal(markedToNumeric('lǜ'), 'lü4')
})

test('normalizePinyin handles whitespace, punctuation and v/u:', () => {
  assert.equal(normalizePinyin('zai4jian4'), 'zai4jian4')
  assert.equal(normalizePinyin('zài jiàn'), 'zai4jian4')
  assert.equal(normalizePinyin('zai4 jian4'), 'zai4jian4')
  assert.equal(normalizePinyin('lü4'), 'lü4')
  assert.equal(normalizePinyin('lv4'), 'lü4')
  assert.equal(normalizePinyin("nǐ hǎo"), 'ni3hao3')
})
