import { useState, useEffect } from 'react'
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import { QUIZ_QUESTIONS } from '../../data/data'

export default function PinyinQuiz({ speak, rate }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState([])

  // Initialize or restart quiz
  function initQuiz() {
    // Shuffle questions
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setQuizFinished(false)
    setWrongAnswers([])
  }

  useEffect(() => {
    initQuiz()
  }, [])

  // Auto-play audio when question loads
  useEffect(() => {
    if (questions.length > 0 && !quizFinished && !isAnswered) {
      const currentQ = questions[currentIndex]
      if (currentQ) {
        speak(currentQ.audioText, rate)
      }
    }
  }, [currentIndex, questions, quizFinished])

  function handlePlayAudio() {
    const currentQ = questions[currentIndex]
    if (currentQ) {
      speak(currentQ.audioText, rate)
    }
  }

  function handleSelectOption(option) {
    if (isAnswered) return
    setSelectedAnswer(option)
    setIsAnswered(true)

    const currentQ = questions[currentIndex]
    const isCorrect = option === currentQ.pinyinAnswer

    if (isCorrect) {
      setScore((s) => s + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > maxStreak) setMaxStreak(newStreak)
    } else {
      setStreak(0)
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: currentQ,
          yourAnswer: option,
        },
      ])
    }
  }

  function handleNextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setQuizFinished(true)
    }
  }

  if (questions.length === 0) return null

  // Result screen
  if (quizFinished) {
    const percent = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-xl mx-auto bg-[#181818] border border-[#4d4d4d]/40 rounded-3xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#1ed760]/10 border-2 border-[#1ed760] flex items-center justify-center text-[#1ed760]">
          <Trophy size={40} />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Hoàn Thành Bài Luyện Nghe!</h3>
          <p className="text-sm text-[#b3b3b3]">
            Bạn đã rèn luyện phản xạ phân biệt các cặp âm Pinyin then chốt.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#121212] p-4 rounded-2xl border border-[#4d4d4d]/30">
            <span className="text-xs text-[#7c7c7c] block mb-1">Điểm số</span>
            <span className="text-2xl font-bold text-white font-mono">
              {score}/{questions.length}
            </span>
          </div>
          <div className="bg-[#121212] p-4 rounded-2xl border border-[#4d4d4d]/30">
            <span className="text-xs text-[#7c7c7c] block mb-1">Độ chính xác</span>
            <span className="text-2xl font-bold text-[#1ed760] font-mono">{percent}%</span>
          </div>
          <div className="bg-[#121212] p-4 rounded-2xl border border-[#4d4d4d]/30">
            <span className="text-xs text-[#7c7c7c] block mb-1">Chuỗi đúng cao nhất</span>
            <span className="text-2xl font-bold text-[#ffa42b] font-mono flex items-center justify-center gap-1">
              <Flame size={18} />
              {maxStreak}
            </span>
          </div>
        </div>

        {/* Review mistakes */}
        {wrongAnswers.length > 0 && (
          <div className="text-left bg-[#121212] p-4 rounded-2xl border border-[#4d4d4d]/30 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={15} className="text-[#f3727f]" />
              Các cặp âm cần lưu ý lại ({wrongAnswers.length}):
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {wrongAnswers.map((w, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#181818] border border-[#4d4d4d]/20 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{w.question.category}</span>
                    <button
                      onClick={() => speak(w.question.audioText, rate)}
                      className="text-[#1ed760] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Volume2 size={13} /> Nghe lại
                    </button>
                  </div>
                  <p className="text-[#b3b3b3] mb-1">
                    Đáp án đúng: <span className="text-[#1ed760] font-mono font-bold">{w.question.pinyinAnswer}</span> (Bạn chọn: <span className="text-[#f3727f] font-mono">{w.yourAnswer}</span>)
                  </p>
                  <p className="text-[11px] text-[#7c7c7c]">{w.question.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restart button */}
        <button
          onClick={initQuiz}
          className="w-full py-3.5 px-6 rounded-full bg-[#1ed760] text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1db954] transition-all shadow-lg shadow-[#1ed760]/20"
        >
          <RotateCcw size={18} />
          <span>Luyện tập lại vòng mới</span>
        </button>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const progressPercent = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Header: Progress & Streak */}
      <div className="bg-[#181818] border border-[#4d4d4d]/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between text-xs text-[#b3b3b3] mb-1.5 font-medium">
            <span>
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span>{currentQ.category}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#121212] overflow-hidden">
            <div
              className="h-full bg-[#1ed760] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-[#121212] px-3 py-1.5 rounded-full border border-[#4d4d4d]/30">
          <Flame size={16} className={streak > 0 ? 'text-[#ffa42b] animate-bounce' : 'text-[#7c7c7c]'} />
          <span className="text-xs font-mono font-bold text-white">{streak}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#181818] border border-[#4d4d4d]/30 rounded-3xl p-6 sm:p-8 text-center space-y-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#1ed760]/10 text-[#1ed760] border border-[#1ed760]/20">
            Luyện nghe phân biệt âm
          </span>
          <h3 className="text-lg font-bold text-white">
            Nghe và chọn âm Pinyin chính xác:
          </h3>
        </div>

        {/* Audio Player Button */}
        <div className="py-4">
          <button
            onClick={handlePlayAudio}
            className="w-24 h-24 mx-auto rounded-full bg-[#1ed760] text-black flex flex-col items-center justify-center gap-1 shadow-xl shadow-[#1ed760]/30 hover:scale-105 active:scale-95 transition-all group"
          >
            <Volume2 size={36} className="group-hover:animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Phát lại</span>
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {currentQ.options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQ.pinyinAnswer

            let btnStyle =
              'bg-[#121212] border-[#4d4d4d]/40 text-white hover:border-[#1ed760] hover:bg-[#1f1f1f]'

            if (isAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-[#1ed760]/20 border-[#1ed760] text-[#1ed760] font-bold shadow-lg shadow-[#1ed760]/20'
              } else if (isSelected) {
                btnStyle =
                  'bg-[#f3727f]/20 border-[#f3727f] text-[#f3727f] font-bold'
              } else {
                btnStyle = 'bg-[#121212]/50 border-[#4d4d4d]/20 text-[#7c7c7c] opacity-50'
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`py-4 px-3 rounded-2xl border text-base sm:text-lg font-mono font-bold transition-all duration-150 flex items-center justify-center gap-2 ${btnStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-[#1ed760]" />}
                {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-[#f3727f]" />}
              </button>
            )
          })}
        </div>

        {/* Feedback & Explanation Box */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl text-left border animate-fadeIn space-y-2 ${
              selectedAnswer === currentQ.pinyinAnswer
                ? 'bg-[#1ed760]/10 border-[#1ed760]/40'
                : 'bg-[#f3727f]/10 border-[#f3727f]/40'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedAnswer === currentQ.pinyinAnswer ? (
                <>
                  <CheckCircle2 size={18} className="text-[#1ed760]" />
                  <span className="text-[#1ed760]">Chính xác! Làm tốt lắm.</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-[#f3727f]" />
                  <span className="text-[#f3727f]">
                    Chưa chính xác! Đáp án là "{currentQ.pinyinAnswer}".
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-[#cbcbcb] leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next Question CTA */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 px-6 rounded-full bg-[#1ed760] text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1db954] transition-all shadow-lg shadow-[#1ed760]/20 animate-bounce"
          >
            <span>
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}
            </span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
