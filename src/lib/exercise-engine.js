import { normalizePinyin } from './pinyin.js'

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(item => normalizePinyin(String(item)))
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return normalizePinyin(String(value ?? ''))
}

export function evaluateExercise(exercise, answer) {
  if (!exercise) {
    return {
      correct: false,
      feedback: 'Bài tập không hợp lệ.',
      explanationVi: 'Không có dữ liệu bài tập để kiểm tra.',
    }
  }

  const normalizedAnswer = normalizeValue(answer)

  if (exercise.type === 'mcq_meaning' || exercise.type === 'mcq_hanzi' || exercise.type === 'listen_choose' || exercise.type === 'fill_blank' || exercise.type === 'translate_pick') {
    const isCorrect = Number(normalizedAnswer) === Number(exercise.answer)
    return {
      correct: isCorrect,
      feedback: isCorrect ? 'Đúng rồi!' : 'Sai rồi. Hãy xem lại câu hỏi.',
      explanationVi: exercise.explanationVi || 'Đây là một dạng trắc nghiệm cơ bản.',
    }
  }

  if (exercise.type === 'type_pinyin') {
    const expectedList = Array.isArray(exercise.answers) ? exercise.answers : [exercise.answers]
    const matches = expectedList.some(expected => normalizeValue(expected) === normalizedAnswer)

    if (matches) {
      return {
        correct: true,
        feedback: 'Đúng! Cách đọc pinyin chính xác.',
        explanationVi: exercise.explanationVi || 'Phân biệt đúng âm và thanh là yếu tố quan trọng trong Pinyin.',
      }
    }

    return {
      correct: false,
      feedback: 'Sai âm/thanh rồi. Hãy kiểm tra lại cách đọc.',
      explanationVi: exercise.explanationVi || 'Gợi ý: thử viết theo cách đọc số và kiểm tra thanh điệu.',
    }
  }

  if (exercise.type === 'match_pairs' || exercise.type === 'order_words') {
    return {
      correct: false,
      feedback: 'Dạng bài này cần logic render riêng tùy UI.',
      explanationVi: 'Hệ thống sẽ triển khai render chuyên biệt cho dạng ghép cặp hoặc sắp xếp từ sau.',
    }
  }

  return {
    correct: false,
    feedback: 'Dạng bài chưa được hỗ trợ ở phiên bản này.',
    explanationVi: 'Nâng cấp engine sẽ mở rộng thêm các loại bài phức tạp hơn.',
  }
}
