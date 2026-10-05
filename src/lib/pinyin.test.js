import test from 'node:test'
import assert from 'node:assert/strict'
import { syllableToMarked, normalizePinyin } from './pinyin.js'

test('syllableToMarked converts numeric tones to marked style', () => {
  assert.equal(syllableToMarked('hao3'), 'hǎo')
  assert.equal(syllableToMarked('liu2'), 'liú')
  assert.equal(syllableToMarked('gui4'), 'guì')
  assert.equal(syllableToMarked('zou3'), 'zǒu')
  assert.equal(syllableToMarked('lv4'), 'lǜ')
  assert.equal(syllableToMarked('xie4'), 'xiè')
  assert.equal(syllableToMarked('ma'), 'ma')
})

test('normalizePinyin handles whitespace, punctuation and v/u:', () => {
  assert.equal(normalizePinyin('zai4jian4'), 'zai4jian4')
  assert.equal(normalizePinyin('zài jiàn'), 'zai4jian4')
  assert.equal(normalizePinyin('zai4 jian4'), 'zai4jian4')
  assert.equal(normalizePinyin('lü4'), 'lü4')
  assert.equal(normalizePinyin('lv4'), 'lü4')
  assert.equal(normalizePinyin("nǐ hǎo"), 'ni3hao3')
})
