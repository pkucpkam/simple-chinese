import { useState } from 'react'
import WritingSetup from './WritingSetup'
import WritingSession from './WritingSession'
import WritingResult from './WritingResult'

export default function WritingPractice() {
  const [screen, setScreen]   = useState('setup')
  const [session, setSession] = useState(null)
  const [results, setResults] = useState([])

  function handleStart(config) {
    setSession(config)
    setResults([])
    setScreen('session')
  }

  function handleFinish(log) {
    setResults(log)
    setScreen('result')
  }

  function handleRestart() {
    const reshuffled = {
      ...session,
      words: [...session.words].sort(() => Math.random() - 0.5),
    }
    setSession(reshuffled)
    setResults([])
    setScreen('session')
  }

  function handleHome() {
    setScreen('setup')
    setSession(null)
  }

  if (screen === 'session' && session) {
    return <WritingSession session={session} onFinish={handleFinish} />
  }

  if (screen === 'result') {
    return (
      <WritingResult
        results={results}
        session={session}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    )
  }

  return <WritingSetup onStart={handleStart} />
}
