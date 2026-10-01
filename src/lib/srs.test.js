import test from 'node:test'
import assert from 'node:assert/strict'
import { createCardFromWord, scheduleReview, isMastered, isLeech } from './srs.js'

test('createCardFromWord initializes a valid SRS card', () => {
  const card = createCardFromWord({ id: 'w_1', hanzi: '你好' }, 'recognition')

  assert.equal(card.wordId, 'w_1')
  assert.equal(card.kind, 'recognition')
  assert.equal(card.state, 'new')
  assert.equal(card.intervalDays, 0)
})

test('scheduleReview increases interval for correct reviews', () => {
  const card = {
    id: 'card_1',
    wordId: 'w_1',
    kind: 'recognition',
    state: 'new',
    due: Date.now(),
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
  }

  const next = scheduleReview(card, 3)

  assert.ok(next.intervalDays >= 1)
  assert.equal(next.reps, 1)
  assert.ok(next.ease >= 2.5)
})

test('isMastered and isLeech behave correctly', () => {
  const mastered = {
    intervalDays: 21,
    lapses: 0,
  }

  const leech = {
    intervalDays: 7,
    lapses: 8,
  }

  assert.equal(isMastered(mastered), true)
  assert.equal(isLeech(leech), true)
})
