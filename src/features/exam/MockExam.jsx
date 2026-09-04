import { useState } from 'react'
import ExamIntro from './ExamIntro'
import ExamSession from './ExamSession'
import ExamResult from './ExamResult'

export default function MockExam() {
  const [screen, setScreen] = useState('intro') // intro | session | result
  const [results, setResults] = useState(null)

  function handleStart() {
    setResults(null)
    setScreen('session')
  }

  function handleFinish(finalResults) {
    setResults(finalResults)
    setScreen('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRetry() {
    setResults(null)
    setScreen('session')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleHome() {
    setScreen('intro')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (screen === 'session') return <ExamSession onFinish={handleFinish} />
  if (screen === 'result')  return <ExamResult results={results} onRetry={handleRetry} onHome={handleHome} />
  return <ExamIntro onStart={handleStart} />
}
