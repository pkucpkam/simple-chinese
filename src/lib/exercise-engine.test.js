import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateExercise } from './exercise-engine.js'

test('evaluateExercise returns correct for multiple choice answer', () => {
  const result = evaluateExercise(
    {
      id: 'e_001',
      type: 'mcq_meaning',
      skill: 'vocab',
      prompt: '你好',
      options: ['xin chào', 'tạm biệt', 'cảm ơn', 'xin lỗi'],
      answer: 0,
    },
    0,
  )

  assert.equal(result.correct, true)
  assert.equal(result.feedback, 'Đúng rồi!')
})

test('evaluateExercise accepts normalized pinyin answers', () => {
  const result = evaluateExercise(
    {
      id: 'e_002',
      type: 'type_pinyin',
      skill: 'pinyin',
      hanzi: '再见',
      answers: ['zai4 jian4'],
    },
    'zài jiàn',
  )

  assert.equal(result.correct, true)
  assert.match(result.feedback, /đúng|correct/i)
})
