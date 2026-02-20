import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Timer-Hook: Countdown in Sekunden mit Pause/Resume/Reset.
 * Nützlich für die 20-20-20 Augenpause (20 Sekunden).
 *
 * @param {number} initialSeconds – Startwert in Sekunden
 * @param {boolean} running – ob der Timer läuft
 * @param {() => void} onComplete – Callback wenn 0 erreicht
 * @returns {{ seconds: number, start: () => void, pause: () => void, reset: () => void }}
 */
export function useTimer(initialSeconds, running, onComplete) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const clearIntervalSafe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!running || seconds <= 0) {
      clearIntervalSafe()
      if (running && seconds <= 0) {
        onCompleteRef.current?.()
      }
      return
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearIntervalSafe()
          onCompleteRef.current?.()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return clearIntervalSafe
  }, [running, seconds, clearIntervalSafe])

  const start = useCallback(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  const pause = useCallback(() => {
    clearIntervalSafe()
  }, [clearIntervalSafe])

  const reset = useCallback(() => {
    clearIntervalSafe()
    setSeconds(initialSeconds)
  }, [initialSeconds, clearIntervalSafe])

  return { seconds, start, pause, reset }
}
