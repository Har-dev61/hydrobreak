import { useState, useRef, useCallback, useEffect } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

/** Phrasen pro Aktion (klein geschrieben, Teilstring-Match). DE + EN */
const PHRASES = {
  drink: [
    'glas getrunken',
    'wasser',
    'trinken',
    'getrunken',
    'glass',
    'water',
    'drink',
    'drank',
  ],
  stand: [
    'pause',
    'aufstehen',
    'bewegung',
    'bewegungspause',
    'break',
    'stand',
    'stand up',
    'movement',
  ],
  eye: [
    'augen',
    'augenpause',
    '20-20-20',
    'eyes',
    'eye break',
  ],
}

function matchPhrase(transcript, action) {
  if (!transcript || typeof transcript !== 'string') return false
  const t = transcript.trim().toLowerCase()
  return PHRASES[action].some((phrase) => t.includes(phrase))
}

/**
 * Sprachbefehle per Web Speech API.
 * @param {{ onDrink: () => void, onStand: () => void, onEye: () => void }} callbacks
 * @param {{ lang?: string }} options – z. B. { lang: 'de-DE' }
 * @returns {{ isListening: boolean, start: () => void, stop: () => void, isSupported: boolean, error: string | null }}
 */
export function useVoiceCommands(callbacks, options = {}) {
  const lang = options.lang || 'de-DE'
  const [isListening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const callbacksRef = useRef(callbacks)
  const lastActionRef = useRef({ drink: 0, stand: 0, eye: 0 })
  callbacksRef.current = callbacks

  const COOLDOWN_MS = 2200

  const stop = useCallback(() => {
    const rec = recognitionRef.current
    if (rec) {
      try {
        rec.stop()
      } catch (_) {}
      recognitionRef.current = null
    }
    setListening(false)
  }, [])

  const start = useCallback(() => {
    if (!SpeechRecognition) {
      setError('unsupported')
      return
    }
    setError(null)
    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = lang
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1]
      if (!last.isFinal) return
      const transcript = last[0]?.transcript || ''
      const now = Date.now()
      const lastAction = lastActionRef.current
      const { onDrink, onStand, onEye } = callbacksRef.current
      if (matchPhrase(transcript, 'drink') && onDrink && now - lastAction.drink > COOLDOWN_MS) {
        lastAction.drink = now
        onDrink()
      } else if (matchPhrase(transcript, 'stand') && onStand && now - lastAction.stand > COOLDOWN_MS) {
        lastAction.stand = now
        onStand()
      } else if (matchPhrase(transcript, 'eye') && onEye && now - lastAction.eye > COOLDOWN_MS) {
        lastAction.eye = now
        onEye()
      }
    }

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('denied')
        stop()
      } else if (e.error === 'no-speech') {
        // ignorieren, weiter hören
      } else {
        setError('error')
      }
    }

    rec.onend = () => {
      if (recognitionRef.current === rec) setListening(false)
      recognitionRef.current = null
    }

    try {
      rec.start()
      recognitionRef.current = rec
      setListening(true)
    } catch (err) {
      setError('error')
      setListening(false)
    }
  }, [lang, stop])

  useEffect(() => {
    return () => {
      const rec = recognitionRef.current
      if (rec) {
        try {
          rec.abort()
        } catch (_) {}
      }
    }
  }, [])

  return {
    isListening,
    start,
    stop,
    isSupported: !!SpeechRecognition,
    error,
  }
}
