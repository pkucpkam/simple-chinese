/**
 * useSpeech — Web Speech API hook for Chinese TTS
 * Uses SpeechSynthesis to speak Chinese text at normal or slow rate.
 */
import { useState, useCallback, useRef } from 'react'

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  const speak = useCallback((text, rate = 1) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'zh-CN'
    utter.rate = rate   // 0.6 = slow, 1 = normal
    utter.pitch = 1
    utter.volume = 1

    // Prefer a zh-CN voice if available
    const voices = window.speechSynthesis.getVoices()
    const zhVoice = voices.find(v => v.lang.startsWith('zh'))
    if (zhVoice) utter.voice = zhVoice

    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)

    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  return { speak, stop, speaking, supported }
}
