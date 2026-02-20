import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react'
import ReminderCard from './components/ReminderCard'
import ProgressTracker from './components/ProgressTracker'
import GamificationPanel from './components/GamificationPanel'
import WeekSummaryCard from './components/WeekSummaryCard'
import RewardToast from './components/RewardToast'
import ErrorBoundary from './components/ErrorBoundary'
import ComebackBanner from './components/ComebackBanner'
import OfflineBanner from './components/OfflineBanner'
import LoadingScreen from './components/LoadingScreen'
import { useOnlineStatus } from './hooks/useOnlineStatus'

const SettingsPanel = lazy(() => import('./components/SettingsPanel'))
const EyeBreakModal = lazy(() => import('./components/EyeBreakModal'))
const LevelUpModal = lazy(() => import('./components/LevelUpModal'))
const Onboarding = lazy(() => import('./components/Onboarding'))
const AuthModal = lazy(() => import('./components/AuthModal'))
const AuthGate = lazy(() => import('./components/AuthGate'))
import {
  getStoredSettings,
  setStoredSettings,
  getStoredProgress,
  setStoredProgress,
  getStoredStats,
  setStoredStats,
  getStoredTheme,
  setStoredTheme,
  getStoredGamification,
  setStoredGamification,
  getStoredOnboardingDone,
  setStoredOnboardingDone,
  setStorageErrorCallback,
  clearAllAppData,
  getStoredLastSeenVersion,
  setStoredLastSeenVersion,
} from './utils/storage'
import { requestNotificationPermission, showNotification } from './utils/notifications'
import { playReminderSound } from './utils/sound'
import { triggerHaptic } from './utils/haptic'
import { applyAction, ensureGamificationState } from './utils/gamificationUpdate'
import {
  getWeeklySummaries,
  getHeatmapData,
  getTotals,
  getNewMilestones,
  checkComeback,
} from './utils/statsHelpers'
import {
  WATER_INTERVAL_DEFAULT,
  WATER_GOAL_ML,
  WATER_GLASS_ML,
  STAND_UP_INTERVAL_DEFAULT,
  EYE_BREAK_INTERVAL_DEFAULT,
  FOCUS_SESSION_DURATION_DEFAULT,
  SNOOZE_MINUTES,
  COMEBACK_BONUS_XP,
  MILESTONES,
  APP_VERSION,
} from './constants'
import { t, tArray, tObject, getDailyQuote, getMotivationalMessages, setLocale } from './i18n'
import QuickActions from './components/QuickActions'
import FocusSessionCard from './components/FocusSessionCard'
import StatsModal from './components/StatsModal'
import LegalModal from './components/LegalModal'
import WhatsNewModal from './components/WhatsNewModal'
import AppFooter from './components/AppFooter'
import { useAuth } from './context/AuthContext'
import { user as userApi } from './api/client'

const defaultSettings = {
  waterIntervalMinutes: WATER_INTERVAL_DEFAULT,
  standUpIntervalMinutes: STAND_UP_INTERVAL_DEFAULT,
  eyeBreakIntervalMinutes: EYE_BREAK_INTERVAL_DEFAULT,
  notificationsEnabled: false,
  waterGoalMl: WATER_GOAL_ML,
  focusModeEnabled: false,
  focusStart: '12:00',
  focusEnd: '13:00',
  reminderWindowEnabled: false,
  reminderWindowStart: '08:00',
  reminderWindowEnd: '18:00',
  focusSessionDurationMinutes: FOCUS_SESSION_DURATION_DEFAULT,
  reminderSoundEnabled: false,
  hapticEnabled: true,
  locale: 'de',
}

/** Prüft, ob die aktuelle Uhrzeit in der Fokuszeit liegt (keine Erinnerungen). */
function isInFocusTime(enabled, start, end) {
  if (!enabled || !start || !end) return false
  const now = new Date()
  const min = now.getHours() * 60 + now.getMinutes()
  const [sH, sM] = start.split(':').map(Number)
  const [eH, eM] = end.split(':').map(Number)
  const startMin = sH * 60 + sM
  const endMin = eH * 60 + eM
  if (startMin <= endMin) return min >= startMin && min < endMin
  return min >= startMin || min < endMin
}

/** Prüft, ob die aktuelle Uhrzeit außerhalb des Reminder-Zeitfensters liegt (Arbeitszeiten). */
function isOutsideReminderWindow(enabled, start, end) {
  if (!enabled || !start || !end) return false
  return !isInFocusTime(true, start, end)
}

function getTodayKey() {
  return new Date().toDateString()
}

function getDefaultProgress() {
  return { date: getTodayKey(), todayMl: 0 }
}

function getDefaultStats() {
  return { daily: [], weeklyTotal: 0 }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatCountdown(seconds) {
  if (seconds <= 0) return t('app.now')
  if (seconds < 60) return `${seconds} ${t('app.seconds')}`
  const min = Math.floor(seconds / 60)
  return `${min} ${t('app.minutes')}`
}

function StorageErrorBanner({ message, onDismiss }) {
  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-200"
      role="alert"
    >
      <p className="text-sm flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 px-2 py-1.5 text-sm font-medium rounded-button hover:bg-amber-500/20 transition-colors"
        aria-label={t('storage.errorBannerDismiss')}
      >
        {t('app.close')}
      </button>
    </div>
  )
}

export default function App() {
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...getStoredSettings(null),
  }))
  const [progress, setProgress] = useState(() => {
    const stored = getStoredProgress(getDefaultProgress())
    const today = getTodayKey()
    if (stored.date !== today) {
      const next = { date: today, todayMl: 0 }
      setStoredProgress(next)
      return next
    }
    return stored
  })
  const [stats, setStats] = useState(() => getStoredStats(getDefaultStats()))
  const [theme, setThemeState] = useState(getStoredTheme)
  const [waterRemaining, setWaterRemaining] = useState(settings.waterIntervalMinutes * 60)
  const [standRemaining, setStandRemaining] = useState(settings.standUpIntervalMinutes * 60)
  const [eyeRemaining, setEyeRemaining] = useState(settings.eyeBreakIntervalMinutes * 60)
  const [waterMessage, setWaterMessage] = useState('')
  const [standMessage, setStandMessage] = useState('')
  const [eyeMessage, setEyeMessage] = useState('')
  const [eyeModalOpen, setEyeModalOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [statsModalOpen, setStatsModalOpen] = useState(false)
  const [gamification, setGamificationState] = useState(() => {
    const today = getTodayKey()
    const stored = getStoredGamification(null)
    return ensureGamificationState(stored, today)
  })
  const [toast, setToast] = useState({ open: false, type: 'xp', value: 0, badgeName: '' })
  const [quickActionFeedback, setQuickActionFeedback] = useState(null)
  const [levelUp, setLevelUp] = useState({ open: false, newLevel: 1 })
  const [onboardingDone, setOnboardingDone] = useState(getStoredOnboardingDone)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [storageErrorMessage, setStorageErrorMessage] = useState(null)
  const [showComebackBanner, setShowComebackBanner] = useState(false)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [legalType, setLegalType] = useState('privacy')
  const [whatsNewOpen, setWhatsNewOpen] = useState(false)
  const tickRef = useRef(null)
  const hasCheckedComebackRef = useRef(false)
  const hasCheckedWhatsNewRef = useRef(false)
  const lastDateRef = useRef(getTodayKey())
  const hasLoadedFromApiRef = useRef(false)
  const { user, token, loading: authLoading, login, register, verifyEmail, logout } = useAuth()
  const [authModalMode, setAuthModalMode] = useState('login')
  const online = useOnlineStatus()

  const {
    waterIntervalMinutes,
    standUpIntervalMinutes,
    eyeBreakIntervalMinutes,
    notificationsEnabled,
    waterGoalMl = WATER_GOAL_ML,
    focusModeEnabled,
    focusStart,
    focusEnd,
    reminderWindowEnabled,
    reminderWindowStart,
    reminderWindowEnd,
    focusSessionDurationMinutes = 25,
    reminderSoundEnabled = false,
    hapticEnabled = true,
    locale = 'de',
  } = settings

  const persistSettings = useCallback(
    (next) => {
      setSettings(next)
      setStoredSettings(next)
      if (token) userApi.putSettings(next).catch(() => {})
    },
    [token]
  )

  // Für API-Sync bei eingeloggtem Nutzer (künftig in Handlern nutzen)
  // eslint-disable-next-line no-unused-vars -- API-Sync bei Refactor der Handler
  const persistProgress = useCallback(
    (next) => {
      setProgress(next)
      setStoredProgress(next)
      if (token) userApi.putProgress(next).catch(() => {})
    },
    [token]
  )
  // eslint-disable-next-line no-unused-vars -- API-Sync bei Refactor der Handler
  const persistStats = useCallback(
    (next) => {
      setStats(next)
      setStoredStats(next)
      if (token) userApi.putStats(next).catch(() => {})
    },
    [token]
  )

  const setTheme = useCallback((value) => {
    setThemeState(value)
    setStoredTheme(value)
  }, [])

  const persistGamification = useCallback(
    (next) => {
      setGamificationState(next)
      setStoredGamification(next)
      if (token) userApi.putGamification(next).catch(() => {})
    },
    [token]
  )

  // Sync vom Backend bei eingeloggtem Nutzer (einmalig nach Login / Seitenload)
  useEffect(() => {
    if (!token || authLoading || hasLoadedFromApiRef.current) return
    hasLoadedFromApiRef.current = true
    Promise.all([
      userApi.getSettings().catch(() => null),
      userApi.getProgress().catch(() => null),
      userApi.getStats().catch(() => null),
      userApi.getGamification().catch(() => null),
    ]).then(([apiSettings, apiProgress, apiStats, apiGamification]) => {
      if (apiSettings && Object.keys(apiSettings).length > 0) {
        setSettings((prev) => ({ ...defaultSettings, ...prev, ...apiSettings }))
        setStoredSettings({ ...defaultSettings, ...apiSettings })
      }
      if (apiProgress && apiProgress.date) {
        const today = getTodayKey()
        if (apiProgress.date === today) {
          setProgress(apiProgress)
          setStoredProgress(apiProgress)
        }
      }
      if (apiStats && (apiStats.daily?.length > 0 || apiStats.weeklyTotal != null)) {
        setStats((prev) => ({ ...getDefaultStats(), ...prev, ...apiStats }))
        setStoredStats({ ...getDefaultStats(), ...apiStats })
      }
      if (apiGamification && Object.keys(apiGamification).length > 0) {
        const today = getTodayKey()
        setGamificationState((prev) =>
          ensureGamificationState({ ...prev, ...apiGamification }, today)
        )
        setStoredGamification(ensureGamificationState({ ...apiGamification }, today))
      }
    })
  }, [token, authLoading])

  useEffect(() => {
    if (!token) hasLoadedFromApiRef.current = false
  }, [token])

  useEffect(() => {
    setStorageErrorCallback(setStorageErrorMessage)
    return () => setStorageErrorCallback(null)
  }, [])

  useEffect(() => {
    setLocale(locale)
  }, [locale])

  // „Was ist neu?“ einmalig anzeigen, wenn Nutzer auf neuere Version trifft
  useEffect(() => {
    if (!onboardingDone || !user || hasCheckedWhatsNewRef.current) return
    const lastSeen = getStoredLastSeenVersion()
    if (lastSeen && lastSeen >= APP_VERSION) return
    hasCheckedWhatsNewRef.current = true
    setWhatsNewOpen(true)
  }, [onboardingDone, user])

  const handleWhatsNewClose = useCallback(() => {
    setWhatsNewOpen(false)
    setStoredLastSeenVersion(APP_VERSION)
  }, [])

  const handleOpenLegal = useCallback((type) => {
    setLegalType(type)
    setLegalModalOpen(true)
  }, [])

  // Comeback: nach längerer Inaktivität einmalig Bonus-XP + Badge
  useEffect(() => {
    if (!onboardingDone || !gamification || hasCheckedComebackRef.current) return
    const todayKeyNow = getTodayKey()
    const { show } = checkComeback(gamification, todayKeyNow)
    if (!show) return
    hasCheckedComebackRef.current = true
    const next = {
      ...gamification,
      totalXp: (gamification.totalXp ?? 0) + COMEBACK_BONUS_XP,
      badgesEarned: [...(gamification.badgesEarned ?? []), 'comeback'],
      lastComebackDate: todayKeyNow,
    }
    setGamificationState(next)
    setStoredGamification(next)
    if (token) userApi.putGamification(next).catch(() => {})
    setToast({ open: true, type: 'xp', value: COMEBACK_BONUS_XP, badgeName: '' })
    setTimeout(() => {
      setToast({
        open: true,
        type: 'badge',
        value: 0,
        badgeName: tObject('badges.comeback')?.name ?? 'Willkommen zurück',
      })
    }, 600)
    setShowComebackBanner(true)
  }, [onboardingDone, gamification, token])

  // Neue Meilensteine erkennen und speichern
  useEffect(() => {
    if (!gamification || !stats || !progress) return
    const todayKeyNow = getTodayKey()
    const totals = getTotals(stats, gamification, progress, todayKeyNow)
    const newOnes = getNewMilestones(totals, gamification.milestonesReached ?? [])
    if (newOnes.length === 0) return
    const next = {
      ...gamification,
      milestonesReached: [...(gamification.milestonesReached ?? []), ...newOnes.map((m) => m.id)],
    }
    setGamificationState(next)
    setStoredGamification(next)
    if (token) userApi.putGamification(next).catch(() => {})
    const first = newOnes[0]
    const label =
      first.type === 'water'
        ? t('milestones.water', { liters: first.target / 1000 })
        : first.type === 'eyeBreaks'
          ? t('milestones.eyeBreaks', { count: first.target })
          : t('milestones.standBreaks', { count: first.target })
    setToast({ open: true, type: 'badge', value: 0, badgeName: label })
  }, [stats, progress, gamification, token])

  const handleAuthSuccess = useCallback(
    async (mode, ...args) => {
      if (mode === 'login') await login(args[0], args[1])
      else if (mode === 'register') await register(args[0], args[1])
      hasLoadedFromApiRef.current = false
    },
    [login, register]
  )

  const handleResetApp = useCallback(() => {
    clearAllAppData()
    logout()
    window.location.reload()
  }, [logout])

  const handleVerifySuccess = useCallback(
    (email, code) => {
      return verifyEmail(email, code).then(() => {
        hasLoadedFromApiRef.current = false
      })
    },
    [verifyEmail]
  )

  // Bei geänderten Intervallen Countdowns zurücksetzen
  useEffect(() => {
    setWaterRemaining(waterIntervalMinutes * 60)
    setStandRemaining(standUpIntervalMinutes * 60)
    setEyeRemaining(eyeBreakIntervalMinutes * 60)
  }, [waterIntervalMinutes, standUpIntervalMinutes, eyeBreakIntervalMinutes])

  useEffect(() => {
    const dark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }, [theme])

  useEffect(() => {
    const today = getTodayKey()
    if (lastDateRef.current !== today) {
      const prevMl = progress.todayMl
      setStats((s) => {
        const daily = [...(s.daily || []), { date: lastDateRef.current, ml: prevMl }]
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - 7)
        const weeklyTotal = daily
          .filter((d) => new Date(d.date) >= weekStart)
          .reduce((sum, d) => sum + d.ml, 0)
        const next = { daily: daily.slice(-30), weeklyTotal }
        setStoredStats(next)
        return next
      })
      lastDateRef.current = today
      setProgress({ date: today, todayMl: 0 })
      setStoredProgress({ date: today, todayMl: 0 })
      setGamificationState((prev) => {
        const next = ensureGamificationState(prev, today)
        setStoredGamification(next)
        return next
      })
    }
  }, [progress.todayMl, progress.date])

  useEffect(() => {
    tickRef.current = setInterval(() => {
      const inFocus = isInFocusTime(focusModeEnabled, focusStart, focusEnd)
      const outsideWindow = isOutsideReminderWindow(
        reminderWindowEnabled,
        reminderWindowStart,
        reminderWindowEnd
      )
      if (inFocus || outsideWindow) return

      setWaterRemaining((s) => {
        if (s <= 1) {
          setWaterMessage(pickRandom(getMotivationalMessages('water', { dailyStreak: gamification?.dailyStreak ?? 0 })))
          if (reminderSoundEnabled) playReminderSound()
          if (notificationsEnabled) {
            showNotification(t('notifications.waterTitle'), {
              body: t('notifications.waterBody'),
            })
          }
          return waterIntervalMinutes * 60
        }
        return s - 1
      })
      setStandRemaining((s) => {
        if (s <= 1) {
          setStandMessage(pickRandom(getMotivationalMessages('stand', { dailyStreak: gamification?.dailyStreak ?? 0 })))
          if (reminderSoundEnabled) playReminderSound()
          if (notificationsEnabled) {
            showNotification(t('notifications.standTitle'), {
              body: t('notifications.standBody'),
            })
          }
          return standUpIntervalMinutes * 60
        }
        return s - 1
      })
      setEyeRemaining((s) => {
        if (s <= 1) {
          setEyeMessage(pickRandom(getMotivationalMessages('eye', { dailyStreak: gamification?.dailyStreak ?? 0 })))
          if (reminderSoundEnabled) playReminderSound()
          if (notificationsEnabled) {
            showNotification(t('notifications.eyeTitle'), {
              body: t('notifications.eyeBody'),
            })
          }
          setEyeModalOpen(true)
          return eyeBreakIntervalMinutes * 60
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(tickRef.current)
  }, [
    waterIntervalMinutes,
    standUpIntervalMinutes,
    eyeBreakIntervalMinutes,
    notificationsEnabled,
    reminderSoundEnabled,
    focusModeEnabled,
    focusStart,
    focusEnd,
    reminderWindowEnabled,
    reminderWindowStart,
    reminderWindowEnd,
    gamification?.dailyStreak,
  ])

  const handleDrinkNow = useCallback(() => {
    if (hapticEnabled) triggerHaptic(50)
    const today = getTodayKey()
    const progressAfter = {
      ...progress,
      todayMl: Math.min(waterGoalMl, progress.todayMl + WATER_GLASS_ML),
    }
    setProgress(progressAfter)
    setStoredProgress(progressAfter)
    setWaterRemaining(waterIntervalMinutes * 60)
    setWaterMessage('')

    const result = applyAction(gamification, progress, today, 'water', progressAfter, {
      waterGoalMl,
    })
    persistGamification(result.gamification)
    setQuickActionFeedback({ type: 'drink', xp: result.xpGained })
    setTimeout(() => setQuickActionFeedback(null), 1600)
    setToast({ open: true, type: 'xp', value: result.xpGained, badgeName: '' })
    if (result.newBadges.length > 0) {
      setTimeout(() => {
        const badgeId = result.newBadges[0]
        const badgeName = tObject('badges.' + badgeId)?.name ?? badgeId
        setToast({ open: true, type: 'badge', value: 0, badgeName })
      }, 600)
    }
    if (result.levelUp) setLevelUp({ open: true, newLevel: result.newLevel })
  }, [waterIntervalMinutes, progress, gamification, persistGamification, waterGoalMl, hapticEnabled])

  const handleStartBreak = useCallback(() => {
    if (hapticEnabled) triggerHaptic(50)
    const today = getTodayKey()
    setStandRemaining(standUpIntervalMinutes * 60)
    setStandMessage('')

    const result = applyAction(gamification, progress, today, 'stand', null, { waterGoalMl })
    persistGamification(result.gamification)
    setQuickActionFeedback({ type: 'stand', xp: result.xpGained })
    setTimeout(() => setQuickActionFeedback(null), 1600)
    setToast({ open: true, type: 'xp', value: result.xpGained, badgeName: '' })
    if (result.newBadges.length > 0) {
      setTimeout(() => {
        const badgeId = result.newBadges[0]
        const badgeName = tObject('badges.' + badgeId)?.name ?? badgeId
        setToast({ open: true, type: 'badge', value: 0, badgeName })
      }, 600)
    }
    if (result.levelUp) setLevelUp({ open: true, newLevel: result.newLevel })
  }, [standUpIntervalMinutes, progress, gamification, persistGamification, waterGoalMl, hapticEnabled])

  const handleStartEyeBreak = useCallback(() => {
    setEyeModalOpen(true)
    setEyeRemaining(eyeBreakIntervalMinutes * 60)
    setEyeMessage('')
    setQuickActionFeedback({ type: 'eye', xp: 0 })
    setTimeout(() => setQuickActionFeedback(null), 1600)
  }, [eyeBreakIntervalMinutes])

  const handleEyeBreakComplete = useCallback(() => {
    if (hapticEnabled) triggerHaptic(50)
    const today = getTodayKey()
    setEyeRemaining(eyeBreakIntervalMinutes * 60)

    const result = applyAction(gamification, progress, today, 'eye', null, { waterGoalMl })
    persistGamification(result.gamification)
    setQuickActionFeedback({ type: 'eye', xp: result.xpGained })
    setTimeout(() => setQuickActionFeedback(null), 1600)
    setToast({ open: true, type: 'xp', value: result.xpGained, badgeName: '' })
    if (result.newBadges.length > 0) {
      setTimeout(() => {
        const badgeId = result.newBadges[0]
        const badgeName = tObject('badges.' + badgeId)?.name ?? badgeId
        setToast({ open: true, type: 'badge', value: 0, badgeName })
      }, 600)
    }
    if (result.levelUp) setLevelUp({ open: true, newLevel: result.newLevel })
  }, [eyeBreakIntervalMinutes, progress, gamification, persistGamification, waterGoalMl, hapticEnabled])

  const handleSnoozeWater = useCallback(() => {
    setWaterRemaining(SNOOZE_MINUTES * 60)
    setWaterMessage('')
  }, [])
  const handleSnoozeStand = useCallback(() => {
    setStandRemaining(SNOOZE_MINUTES * 60)
    setStandMessage('')
  }, [])
  const handleSnoozeEye = useCallback(() => {
    setEyeRemaining(SNOOZE_MINUTES * 60)
    setEyeMessage('')
  }, [])

  const handleToggleStats = useCallback(() => setShowStats((s) => !s), [])

  const handleClaimChallenge = useCallback(() => {
    if (hapticEnabled) triggerHaptic([30, 50, 30])
    const today = getTodayKey()
    const result = applyAction(gamification, progress, today, 'challenge', null, { waterGoalMl })
    persistGamification(result.gamification)
    setToast({ open: true, type: 'xp', value: result.xpGained, badgeName: '' })
    if (result.levelUp) setLevelUp({ open: true, newLevel: result.newLevel })
  }, [progress, gamification, persistGamification, waterGoalMl, hapticEnabled])

  const handleRequestNotificationPermission = useCallback(async () => {
    const ok = await requestNotificationPermission()
    if (ok) persistSettings((s) => ({ ...s, notificationsEnabled: true }))
  }, [persistSettings])

  const handleOnboardingComplete = useCallback(
    ({ waterGoalMl: goalMl, notificationsAllowed }) => {
      setStoredOnboardingDone(true)
      setOnboardingDone(true)
      persistSettings((s) => ({
        ...s,
        waterGoalMl: goalMl,
        notificationsEnabled: notificationsAllowed,
      }))
    },
    [persistSettings]
  )

  const todayKey = getTodayKey()

  const { dailyHistory, weeklyTotal } = useMemo(() => {
    const daily = stats.daily || []
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    const weekly = daily.filter((d) => new Date(d.date) >= weekStart).reduce((sum, d) => sum + d.ml, 0)
    return { dailyHistory: daily, weeklyTotal: weekly }
  }, [stats.daily])

  const todayActivity = useMemo(
    () => ({
      waterGlasses: progress.date === todayKey ? Math.floor(progress.todayMl / 250) : 0,
      standBreaks: gamification.todayCounts?.[todayKey]?.standBreaks ?? 0,
      eyeBreaks: gamification.todayCounts?.[todayKey]?.eyeBreaks ?? 0,
    }),
    [progress.date, progress.todayMl, todayKey, gamification.todayCounts]
  )

  const weeklySummaries = useMemo(
    () => getWeeklySummaries(stats, gamification, progress, todayKey),
    [stats, gamification, progress, todayKey]
  )

  const heatmapData = useMemo(
    () => getHeatmapData(stats, gamification, progress, todayKey, 12),
    [stats, gamification, progress, todayKey]
  )

  const milestonesForDisplay = useMemo(() => {
    const reached = gamification.milestonesReached ?? []
    return MILESTONES.filter((m) => reached.includes(m.id))
  }, [gamification.milestonesReached])

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 font-sans transition-colors">
        {storageErrorMessage && (
          <StorageErrorBanner
            message={storageErrorMessage}
            onDismiss={() => setStorageErrorMessage(null)}
          />
        )}
        {!online && <OfflineBanner />}
        <Suspense fallback={<LoadingScreen />}>
          <AuthGate
            onRegister={() => {
              setAuthModalMode('register')
              setAuthModalOpen(true)
            }}
            onLogin={() => {
              setAuthModalMode('login')
              setAuthModalOpen(true)
            }}
          />
          <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
            onVerify={handleVerifySuccess}
            initialMode={authModalMode}
          />
        </Suspense>
      </div>
    )
  }

  if (!onboardingDone) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 font-sans transition-colors">
        {storageErrorMessage && (
          <StorageErrorBanner
            message={storageErrorMessage}
            onDismiss={() => setStorageErrorMessage(null)}
          />
        )}
        {!online && <OfflineBanner />}
        <Suspense fallback={<LoadingScreen />}>
          <Onboarding onComplete={handleOnboardingComplete} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg transition-colors">
      {storageErrorMessage && (
        <StorageErrorBanner
          message={storageErrorMessage}
          onDismiss={() => setStorageErrorMessage(null)}
        />
      )}
      {!online && <OfflineBanner />}
      <div className="max-w-xl mx-auto px-5 py-10 pb-20 sm:px-6">
        {showComebackBanner && (
          <ComebackBanner
            show={showComebackBanner}
            bonusXp={COMEBACK_BONUS_XP}
            onDismiss={() => setShowComebackBanner(false)}
          />
        )}
        <header className="mb-8 text-center animate-fade-in" role="banner">
          {isInFocusTime(focusModeEnabled, focusStart, focusEnd) && (
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-button bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-2 text-amber-800 dark:text-amber-200 text-sm font-medium"
              role="status"
              aria-live="polite"
              aria-label={t('app.focusTimeBanner')}
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden />
              {t('app.focusTimeBanner')}
            </div>
          )}
          {reminderWindowEnabled &&
            isOutsideReminderWindow(reminderWindowEnabled, reminderWindowStart, reminderWindowEnd) && (
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-button bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 px-3 py-2 text-blue-800 dark:text-blue-200 text-sm font-medium"
                role="status"
                aria-live="polite"
                aria-label={t('app.reminderWindowBanner')}
              >
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden />
                {t('app.reminderWindowBanner')}
              </div>
            )}
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--app-primary)]" id="app-title">
            {t('app.title')}
          </h1>
          <p className="mt-1 text-sm text-app-muted-foreground">{t('app.subtitle')}</p>
          {(user?.name || user?.email) && (
            <p className="mt-2 text-sm text-app-muted-foreground" aria-live="polite">
              {user?.name
                ? t('app.greeting', { name: user.name })
                : t('app.greeting', { name: user.email?.split('@')[0] || 'Du' })}
            </p>
          )}
          {!(user?.name || user?.email) && getDailyQuote() && (
            <p className="mt-2 text-sm text-app-muted-foreground italic" aria-live="polite">
              {getDailyQuote()}
            </p>
          )}
        </header>

        <main id="main-content" className="space-y-5" role="main" tabIndex={-1}>
          {/* Fokus-Reihenfolge: Quick Actions → Karten → Einstellungen */}
          <ErrorBoundary retryable>
            <QuickActions
              onDrink={handleDrinkNow}
              onStand={handleStartBreak}
              onEye={handleStartEyeBreak}
              feedback={quickActionFeedback}
            />
          </ErrorBoundary>
          <ErrorBoundary retryable>
            <FocusSessionCard
              durationMinutes={focusSessionDurationMinutes}
              onStartEyeBreak={handleStartEyeBreak}
              onStartStandBreak={handleStartBreak}
            />
          </ErrorBoundary>
          <ErrorBoundary retryable>
            <WeekSummaryCard
              thisWeek={weeklySummaries.thisWeek}
              prevWeek={weeklySummaries.prevWeek}
              dailyStreak={gamification.dailyStreak ?? 0}
            />
          </ErrorBoundary>
          <ErrorBoundary retryable>
            <GamificationPanel
              gamification={gamification}
              progress={progress}
              waterGoalMl={waterGoalMl}
              todayActivity={todayActivity}
              onClaimChallenge={handleClaimChallenge}
              heatmapData={heatmapData}
              milestonesForDisplay={milestonesForDisplay}
            />
          </ErrorBoundary>

          <ErrorBoundary retryable>
            <ProgressTracker
              todayMl={progress.todayMl}
              waterGoalMl={waterGoalMl}
              showStats={showStats}
              dailyHistory={dailyHistory}
              weeklyTotal={weeklyTotal}
              onToggleStats={handleToggleStats}
              onOpenStatsModal={() => setStatsModalOpen(true)}
            />

            <ReminderCard
              type="water"
              title={t('reminder.waterTitle')}
              subtitle={t('reminder.waterSubtitle', { minutes: waterIntervalMinutes })}
              nextIn={formatCountdown(waterRemaining)}
              nextInSeconds={waterRemaining}
              totalSeconds={waterIntervalMinutes * 60}
              message={waterMessage}
              primaryLabel={t('reminder.drinkNow')}
              onPrimary={handleDrinkNow}
              onSnooze={handleSnoozeWater}
              snoozeLabel={t('reminder.snoozeIn', { minutes: SNOOZE_MINUTES })}
            />

            <ReminderCard
              type="stand"
              title={t('reminder.standTitle')}
              subtitle={t('reminder.standSubtitle', { minutes: standUpIntervalMinutes })}
              nextIn={formatCountdown(standRemaining)}
              nextInSeconds={standRemaining}
              totalSeconds={standUpIntervalMinutes * 60}
              message={standMessage}
              primaryLabel={t('reminder.startBreak')}
              onPrimary={handleStartBreak}
              onSnooze={handleSnoozeStand}
              snoozeLabel={t('reminder.snoozeIn', { minutes: SNOOZE_MINUTES })}
            />

            <ReminderCard
              type="eye"
              title={t('reminder.eyeTitle')}
              subtitle={t('reminder.eyeSubtitle')}
              nextIn={formatCountdown(eyeRemaining)}
              nextInSeconds={eyeRemaining}
              totalSeconds={eyeBreakIntervalMinutes * 60}
              message={eyeMessage}
              primaryLabel={t('reminder.startBreak')}
              onPrimary={handleStartEyeBreak}
              onSnooze={handleSnoozeEye}
              snoozeLabel={t('reminder.snoozeIn', { minutes: SNOOZE_MINUTES })}
            />
          </ErrorBoundary>

          <ErrorBoundary retryable>
            <Suspense
              fallback={
                <div
                  className="h-48 rounded-2xl bg-gray-100 dark:bg-zinc-800 animate-pulse motion-reduce:animate-none"
                  aria-hidden
                />
              }
            >
              <SettingsPanel
              waterIntervalMinutes={waterIntervalMinutes}
              standUpIntervalMinutes={standUpIntervalMinutes}
              eyeBreakIntervalMinutes={eyeBreakIntervalMinutes}
              notificationsEnabled={notificationsEnabled}
              focusModeEnabled={focusModeEnabled}
              focusStart={focusStart}
              focusEnd={focusEnd}
              onWaterIntervalChange={(v) =>
                persistSettings((s) => ({ ...s, waterIntervalMinutes: v }))
              }
              onStandUpIntervalChange={(v) =>
                persistSettings((s) => ({ ...s, standUpIntervalMinutes: v }))
              }
              onEyeBreakIntervalChange={(v) =>
                persistSettings((s) => ({ ...s, eyeBreakIntervalMinutes: v }))
              }
              onNotificationsChange={(v) =>
                persistSettings((s) => ({ ...s, notificationsEnabled: v }))
              }
              onFocusModeChange={(v) => persistSettings((s) => ({ ...s, focusModeEnabled: v }))}
              onFocusStartChange={(v) => persistSettings((s) => ({ ...s, focusStart: v }))}
              onFocusEndChange={(v) => persistSettings((s) => ({ ...s, focusEnd: v }))}
              reminderWindowEnabled={reminderWindowEnabled}
              reminderWindowStart={reminderWindowStart}
              reminderWindowEnd={reminderWindowEnd}
              onReminderWindowChange={(v) =>
                persistSettings((s) => ({ ...s, reminderWindowEnabled: v }))
              }
              onReminderWindowStartChange={(v) =>
                persistSettings((s) => ({ ...s, reminderWindowStart: v }))
              }
              onReminderWindowEndChange={(v) =>
                persistSettings((s) => ({ ...s, reminderWindowEnd: v }))
              }
              focusSessionDurationMinutes={focusSessionDurationMinutes}
              onFocusSessionDurationChange={(v) =>
                persistSettings((s) => ({ ...s, focusSessionDurationMinutes: v }))
              }
              onRequestNotificationPermission={handleRequestNotificationPermission}
              reminderSoundEnabled={reminderSoundEnabled}
              onReminderSoundChange={(v) =>
                persistSettings((s) => ({ ...s, reminderSoundEnabled: v }))
              }
              hapticEnabled={hapticEnabled}
              onHapticChange={(v) =>
                persistSettings((s) => ({ ...s, hapticEnabled: v }))
              }
              darkMode={theme}
              onDarkModeChange={setTheme}
              locale={locale}
              onLocaleChange={(v) => persistSettings((s) => ({ ...s, locale: v }))}
              onOpenLegal={handleOpenLegal}
              user={user}
              onLoginClick={() => setAuthModalOpen(true)}
              onLogout={logout}
              onResetApp={handleResetApp}
            />
            </Suspense>
          </ErrorBoundary>

          <AppFooter onOpenLegal={handleOpenLegal} version={APP_VERSION} />
        </main>
      </div>

      <LegalModal
        open={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        type={legalType}
      />

      <WhatsNewModal open={whatsNewOpen} onClose={handleWhatsNewClose} />

      <Suspense fallback={null}>
        <EyeBreakModal
          open={eyeModalOpen}
          onClose={() => setEyeModalOpen(false)}
          onComplete={handleEyeBreakComplete}
        />

        <LevelUpModal
          open={levelUp.open}
          onClose={() => setLevelUp((l) => ({ ...l, open: false }))}
          newLevel={levelUp.newLevel}
        />

        <StatsModal
          open={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          dailyHistory={dailyHistory}
          todayKey={todayKey}
          todayMl={progress.todayMl}
          waterGoalMl={waterGoalMl}
          thisWeek={weeklySummaries?.thisWeek}
          prevWeek={weeklySummaries?.prevWeek}
          stats={stats}
          gamification={gamification}
          progress={progress}
        />

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          onVerify={handleVerifySuccess}
          initialMode={authModalMode}
        />
      </Suspense>

      <RewardToast
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        type={toast.type}
        value={toast.value}
        badgeName={toast.badgeName}
      />

    </div>
  )
}
