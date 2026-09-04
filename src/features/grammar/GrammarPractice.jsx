import { useState } from 'react'
import GrammarList from './GrammarList'
import GrammarDetail from './GrammarDetail'

export default function GrammarPractice() {
  const [selected, setSelected]       = useState(null)
  const [completedIds, setCompletedIds] = useState(new Set())

  function handleSelect(point) {
    setSelected(point)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    // Mark as completed when returning from detail
    if (selected) {
      setCompletedIds(prev => new Set([...prev, selected.id]))
    }
    setSelected(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selected) {
    return <GrammarDetail point={selected} onBack={handleBack} />
  }

  return <GrammarList onSelect={handleSelect} completedIds={completedIds} />
}
