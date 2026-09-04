import { useEffect, useState, useRef } from 'react'
import { Clock } from 'lucide-react'

export default function ExamTimer({ totalSec, onExpire, paused = false }) {
  const [remaining, setRemaining] = useState(totalSec)
  const intervalRef = useRef(null)

  useEffect(() => {
    setRemaining(totalSec)
  }, [totalSec])

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [paused, totalSec, onExpire])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const pct  = (remaining / totalSec) * 100

  const urgent  = remaining <= 60   // last minute — red
  const warning = remaining <= 180  // last 3 min — orange

  const color = urgent ? '#f3727f' : warning ? '#ffa42b' : '#1ed760'

  return (
    <div className="flex items-center gap-2">
      {/* Circular progress */}
      <div className="relative w-10 h-10 shrink-0">
        <svg width="40" height="40" className="-rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#252525" strokeWidth="3" />
          <circle
            cx="20" cy="20" r="16" fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <Clock
          size={14}
          className="absolute inset-0 m-auto"
          style={{ color }}
        />
      </div>

      {/* Time display */}
      <span
        id="exam-timer-display"
        className="font-bold text-base tabular-nums transition-colors"
        style={{ color }}
      >
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>

      {urgent && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f3727f]/10 text-[#f3727f] animate-pulse">
          Hurry!
        </span>
      )}
    </div>
  )
}
