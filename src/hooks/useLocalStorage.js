import { useState, useEffect, useCallback } from 'react'

/**
 * Hook: Wert in LocalStorage persistieren und mit State synchron halten.
 * @param {string} key – LocalStorage-Schlüssel
 * @param {*} initialValue – Fallback, wenn kein Eintrag existiert
 * @returns {[*, Function]} – [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValueState] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item != null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (next) => {
      setValueState((prev) => {
        const nextValue = typeof next === 'function' ? next(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
        } catch (e) {
          console.warn('useLocalStorage setItem failed', e)
        }
        return nextValue
      })
    },
    [key]
  )

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key && e.newValue != null) {
        try {
          setValueState(JSON.parse(e.newValue))
        } catch {
          // ungültiges JSON von anderem Tab – ignorieren
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, setValue]
}
