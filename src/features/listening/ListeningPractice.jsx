import { useState } from 'react'
import SessionSetup from './SessionSetup'
import ListeningSession from './ListeningSession'
import ResultScreen from './ResultScreen'

// 3 screens: setup → session → result
export default function ListeningPractice() {
  const [screen, setScreen] = useState('setup')
  const [session, setSession] = useState(null)   // { mode, words }
  const [results, setResults] = useState([])

  function handleStart(sessionConfig) {
    setSession(sessionConfig)
    setResults([])
    setScreen('session')
  }

  function handleFinish(finalResults) {
    setResults(finalResults)
    setScreen('result')
  }

  function handleRestart() {
    // Re-shuffle same config
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
    return (
      <ListeningSession
        session={session}
        onFinish={handleFinish}
      />
    )
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        results={results}
        session={session}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    )
  }

  return <SessionSetup onStart={handleStart} />
}
