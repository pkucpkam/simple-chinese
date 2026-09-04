/**
 * HanziWriterCanvas — React wrapper for the hanzi-writer library.
 *
 * Props:
 *   character  — the Chinese character to render (string, 1 char)
 *   mode       — 'animate' | 'quiz'
 *   onComplete — called when quiz is complete: ({ totalMistakes }) => void
 *   key        — caller should change key to force remount on character change
 */
import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'

const SIZE = 280

export default function HanziWriterCanvas({ character, mode, onComplete }) {
  const containerRef = useRef(null)
  const writerRef    = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | done

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous
    containerRef.current.innerHTML = ''
    setStatus('loading')

    const char = [...character][0] // always first char

    try {
      const writer = HanziWriter.create(containerRef.current, char, {
        width: SIZE,
        height: SIZE,
        padding: 16,
        showOutline: true,
        strokeColor: '#ffffff',
        outlineColor: '#2a2a2a',
        drawingColor: '#1ed760',
        drawingWidth: 4,
        showCharacter: mode === 'animate',
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 100,
        // radicalColor for multi-component chars
        radicalColor: '#1ed760',
        // Quiz options
        showHintAfterMisses: 3,
        highlightOnComplete: true,
        highlightColor: '#1ed760',
        renderer: 'svg',
      })

      writerRef.current = writer

      if (mode === 'animate') {
        writer.animateCharacter({
          onComplete: () => setStatus('done'),
        })
        setStatus('ready')
      } else {
        // Quiz mode
        setStatus('ready')
        writer.quiz({
          onMistake: () => {},
          onCorrectStroke: () => {},
          onComplete: (summary) => {
            setStatus('done')
            onComplete?.(summary)
          },
        })
      }
    } catch (err) {
      // Character not in hanzi-writer dataset (rare)
      console.warn('HanziWriter: character not found', char, err)
      setStatus('error')
    }

    return () => {
      writerRef.current = null
    }
  }, [character, mode]) // eslint-disable-line

  function handleAnimate() {
    writerRef.current?.animateCharacter()
    setStatus('ready')
  }

  function handleShowCharacter() {
    writerRef.current?.showCharacter()
  }

  function handleHideCharacter() {
    writerRef.current?.hideCharacter()
  }

  function handleResetQuiz() {
    writerRef.current?.quiz({
      onComplete: (summary) => {
        setStatus('done')
        onComplete?.(summary)
      },
    })
    setStatus('ready')
  }

  return (
    <div className="flex flex-col items-center">
      {/* Canvas area */}
      <div className="relative">
        {/* Grid background — simulates writing paper */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            width: SIZE,
            height: SIZE,
            background: '#141414',
            boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${SIZE / 4}px ${SIZE / 4}px`,
          }}
        >
          {/* Diagonal guide lines */}
          <svg
            width={SIZE}
            height={SIZE}
            className="absolute inset-0 pointer-events-none"
          >
            <line x1="0" y1="0" x2={SIZE} y2={SIZE} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <line x1={SIZE} y1="0" x2="0" y2={SIZE} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </svg>

          {/* Loading state */}
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#1ed760]/30 border-t-[#1ed760] rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-white text-5xl font-bold">{[...character][0]}</span>
              <p className="text-[#b3b3b3] text-xs">Stroke data unavailable</p>
            </div>
          )}

          {/* hanzi-writer mounts here */}
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Done badge */}
        {status === 'done' && mode === 'quiz' && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#1ed760] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-sm">✓</span>
          </div>
        )}
      </div>

      {/* Controls below canvas */}
      {mode === 'animate' && status !== 'error' && (
        <div className="flex gap-2 mt-4">
          <button
            id="animate-again-btn"
            onClick={handleAnimate}
            className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white
              text-xs font-medium rounded-full border border-[#4d4d4d]/40 transition-all"
          >
            ▶ Replay
          </button>
          <button
            id="show-char-btn"
            onClick={handleShowCharacter}
            className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white
              text-xs font-medium rounded-full border border-[#4d4d4d]/40 transition-all"
          >
            Show
          </button>
          <button
            id="hide-char-btn"
            onClick={handleHideCharacter}
            className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white
              text-xs font-medium rounded-full border border-[#4d4d4d]/40 transition-all"
          >
            Hide
          </button>
        </div>
      )}

      {mode === 'quiz' && status !== 'error' && (
        <div className="flex gap-2 mt-4">
          <button
            id="quiz-reset-btn"
            onClick={handleResetQuiz}
            className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white
              text-xs font-medium rounded-full border border-[#4d4d4d]/40 transition-all"
          >
            ↺ Retry
          </button>
        </div>
      )}
    </div>
  )
}
