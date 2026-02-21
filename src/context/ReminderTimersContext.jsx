import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const ReminderTimersContext = createContext(null)

/**
 * Konfiguration für die Erinnerungs-Timer (Fokus, Fenster, Intervalle).
 */
function isInFocusTime(focusModeEnabled, focusStart, focusEnd) {
  if (!focusModeEnabled || !focusStart || !focusEnd) return false
  const now = new Date()
  const min = now.getHours() * 60 + now.getMinutes()
  const [sH, sM] = focusStart.split(':').map(Number)
  const [eH, eM] = focusEnd.split(':').map(Number)
  const startMin = sH * 60 + sM
  const endMin = eH * 60 + eM
  if (startMin <= endMin) return min >= startMin && min < endMin
  return min >= startMin || min < endMin
}

function isOutsideReminderWindow(reminderWindowEnabled, reminderWindowStart, reminderWindowEnd) {
  if (!reminderWindowEnabled || !reminderWindowStart || !reminderWindowEnd) return false
  return !isInFocusTime(true, reminderWindowStart, reminderWindowEnd)
}

/**
 * Provider: Hält die drei Countdown-State (water, stand, eye) und den 1-Sekunden-Interval.
 * Nur dieser Teilbaum rendert jede Sekunde neu – nicht die ganze App.
 */
export function ReminderTimersProvider({
  children,
  config,
  onWaterFire,
  onStandFire,
  onEyeFire,
  timerApiRef,
}) {
  const {
    waterIntervalMinutes,
    standUpIntervalMinutes,
    eyeBreakIntervalMinutes,
    focusModeEnabled,
    focusStart,
    focusEnd,
    reminderWindowEnabled,
    reminderWindowStart,
    reminderWindowEnd,
    reminderWeekdaysOnly,
  } = config

  const [waterRemaining, setWaterRemaining] = useState(waterIntervalMinutes * 60)
  const [standRemaining, setStandRemaining] = useState(standUpIntervalMinutes * 60)
  const [eyeRemaining, setEyeRemaining] = useState(eyeBreakIntervalMinutes * 60)

  const onWaterFireRef = useRef(onWaterFire)
  const onStandFireRef = useRef(onStandFire)
  const onEyeFireRef = useRef(onEyeFire)
  onWaterFireRef.current = onWaterFire
  onStandFireRef.current = onStandFire
  onEyeFireRef.current = onEyeFire

  const resetWater = useCallback(() => {
    setWaterRemaining(waterIntervalMinutes * 60)
  }, [waterIntervalMinutes])
  const resetStand = useCallback(() => {
    setStandRemaining(standUpIntervalMinutes * 60)
  }, [standUpIntervalMinutes])
  const resetEye = useCallback(() => {
    setEyeRemaining(eyeBreakIntervalMinutes * 60)
  }, [eyeBreakIntervalMinutes])

  useEffect(() => {
    setWaterRemaining(waterIntervalMinutes * 60)
    setStandRemaining(standUpIntervalMinutes * 60)
    setEyeRemaining(eyeBreakIntervalMinutes * 60)
  }, [waterIntervalMinutes, standUpIntervalMinutes, eyeBreakIntervalMinutes])

  useEffect(() => {
    const id = setInterval(() => {
      const inFocus = isInFocusTime(focusModeEnabled, focusStart, focusEnd)
      const outsideWindow = isOutsideReminderWindow(
        reminderWindowEnabled,
        reminderWindowStart,
        reminderWindowEnd
      )
      const day = new Date().getDay()
      const isWeekend = day === 0 || day === 6
      if (inFocus || outsideWindow || (reminderWeekdaysOnly && isWeekend)) return

      setWaterRemaining((s) => {
        if (s <= 1) {
          onWaterFireRef.current?.()
          return waterIntervalMinutes * 60
        }
        return s - 1
      })
      setStandRemaining((s) => {
        if (s <= 1) {
          onStandFireRef.current?.()
          return standUpIntervalMinutes * 60
        }
        return s - 1
      })
      setEyeRemaining((s) => {
        if (s <= 1) {
          onEyeFireRef.current?.()
          return eyeBreakIntervalMinutes * 60
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [
    focusModeEnabled,
    focusStart,
    focusEnd,
    reminderWindowEnabled,
    reminderWindowStart,
    reminderWindowEnd,
    reminderWeekdaysOnly,
    waterIntervalMinutes,
    standUpIntervalMinutes,
    eyeBreakIntervalMinutes,
  ])

  const value = {
    waterRemaining,
    standRemaining,
    eyeRemaining,
    resetWater,
    resetStand,
    resetEye,
    setWaterRemaining,
    setStandRemaining,
    setEyeRemaining,
  }

  if (timerApiRef) {
    timerApiRef.current = { resetWater, resetStand, resetEye, setWaterRemaining, setStandRemaining, setEyeRemaining }
  }

  return (
    <ReminderTimersContext.Provider value={value}>
      {children}
    </ReminderTimersContext.Provider>
  )
}

export function useReminderTimers() {
  const ctx = useContext(ReminderTimersContext)
  if (!ctx) throw new Error('useReminderTimers must be used inside ReminderTimersProvider')
  return ctx
}
