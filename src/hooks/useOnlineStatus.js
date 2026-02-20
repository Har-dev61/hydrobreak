import { useState, useEffect } from 'react'

/**
 * Hook: Liefert den aktuellen Online-Status (navigator.onLine) und
 * aktualisiert sich bei den Events 'online' / 'offline'.
 * @returns {boolean} true = online, false = offline
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return online
}
