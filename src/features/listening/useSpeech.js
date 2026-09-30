/**
 * useSpeech — Web Speech API hook for Chinese TTS with Online Fallback
 * Speaks Chinese text with SpeechSynthesis or falls back to native online TTS audio.
 */
import { useState, useCallback, useRef } from 'react'

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)
  const audioRef = useRef(null)

  const playOnlineFallback = useCallback((text, rate = 1) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      const encoded = encodeURIComponent(text)
      const primaryUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&le=zh`
      const audio = new Audio(primaryUrl)
      audioRef.current = audio
      audio.playbackRate = rate

      audio.onplay = () => setSpeaking(true)
      audio.onended = () => {
        setSpeaking(false)
        audioRef.current = null
      }
      audio.onerror = () => {
        // Backup: Google Translate TTS
        const backupUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encoded}`
        const backupAudio = new Audio(backupUrl)
        audioRef.current = backupAudio
        backupAudio.playbackRate = rate
        backupAudio.onplay = () => setSpeaking(true)
        backupAudio.onended = () => {
          setSpeaking(false)
          audioRef.current = null
        }
        backupAudio.onerror = () => {
          setSpeaking(false)
          audioRef.current = null
        }
        backupAudio.play().catch(() => setSpeaking(false))
      }

      audio.play().catch(() => {
        setSpeaking(false)
      })
    } catch {
      setSpeaking(false)
    }
  }, [])

  const speak = useCallback((text, rate = 1) => {
    if (!text) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      playOnlineFallback(text, rate)
      return
    }

    // Chrome unpause workaround
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const voices = window.speechSynthesis.getVoices()
    const zhVoice = voices.find(v => v.lang && (v.lang.startsWith('zh') || v.lang.includes('Chinese')))

    // If voices list is loaded and has no Chinese voice on user's OS, use online fallback immediately
    if (voices.length > 0 && !zhVoice) {
      playOnlineFallback(text, rate)
      return
    }

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'zh-CN'
    utter.rate = rate
    utter.pitch = 1
    utter.volume = 1

    if (zhVoice) {
      utter.voice = zhVoice
    }

    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = (e) => {
      console.warn('SpeechSynthesis failed, falling back to online audio:', e)
      setSpeaking(false)
      playOnlineFallback(text, rate)
    }

    utteranceRef.current = utter

    // Delay by 10ms to avoid Chrome immediate cancel race condition
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utter)
      } catch {
        playOnlineFallback(text, rate)
      }
    }, 10)
  }, [playOnlineFallback])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  const supported = typeof window !== 'undefined'

  return { speak, stop, speaking, supported }
}
