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
  getStoredDailyContext,
  setStoredDailyContext,
  getStoredOnboardingDone,
  setStoredOnboardingDone,
  setStorageErrorCallback,
  clearAllAppData,
  getStoredLastSeenVersion,
  setStoredLastSeenVersion,
} from './utils/storage'
import { fetchWeatherWithGeolocation } from './utils/weather'
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
import CompactView from './components/CompactView'
import VoiceCommandButton from './components/VoiceCommandButton'
import IntroAnimation from './components/IntroAnimation'
import TodayTab from './components/TodayTab'
import FocusSessionCard from './components/FocusSessionCard'
import { ReminderTimersProvider } from './context/ReminderTimersContext'
import { useVoiceCommands } from './hooks/useVoiceCommands'
import StatsModal from './components/StatsModal'
import StatsPage from './components/StatsPage'
import LeaderboardCard from './components/LeaderboardCard'
import BottomNav from './components/BottomNav'
import PullToRefresh from './components/PullToRefresh'
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
  reminderWeekdaysOnly: false,
  focusSessionDurationMinutes: FOCUS_SESSION_DURATION_DEFAULT,
  reminderSoundEnabled: false,
  hapticEnabled: true,
  locale: 'de',
  emailDigestEnabled: false,
  locationContext: 'unknown',
  activityLevel: 'medium',
  weatherForInsights: true,
  // Predictive Health (optional)
  sleepHoursLastNight: null,
  weightKg: null,
  age: null,
  sex: 'unknown',
  lastSportMinutesAgo: null,
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
  const [settings, setSettings] = useState(() => {
    const stored = getStoredSettings(null)
    return {
      ...defaultSettings,
      ...stored,
      timezone:
        typeof Intl !== 'undefined' && Intl.DateTimeFormat?.().resolvedOptions?.().timeZone
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : 'UTC',
    }
  })
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
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'today'
    const tab = new URLSearchParams(window.location.search).get('tab')
    return tab === 'stats' ? 'stats' : tab === 'settings' ? 'settings' : 'today'
  })
  const [isCompactView, setCompactView] = useState(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'compact'
  )
  const [introVisible, setIntroVisible] = useState(true)
  const [leaderboardPercentile, setLeaderboardPercentile] = useState(null)
  const [shareFeedback, setShareFeedback] = useState(false)
  const [dailyContext, setDailyContextState] = useState(() => getStoredDailyContext({}))
  const [weather, setWeather] = useState(null)
  const timerApiRef = useRef(null)
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
    reminderWeekdaysOnly = false,
    focusSessionDurationMinutes = 25,
    reminderSoundEnabled = false,
    hapticEnabled = true,
    locale = 'de',
    emailDigestEnabled = false,
    locationContext = 'unknown',
    activityLevel = 'medium',
    weatherForInsights = true,
    sleepHoursLastNight = null,
    weightKg = null,
    age = null,
    sex = 'unknown',
    lastSportMinutesAgo = null,
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

  // Rangliste / Top-X% (anonymisiert). Backend liefert z. B. { percentile: 20 }.
  useEffect(() => {
    if (!token) return
    userApi.getLeaderboardPercentile().then((data) => {
      if (data && typeof data.percentile === 'number') setLeaderboardPercentile(data.percentile)
    }).catch(() => {})
  }, [token])

  const handleShareWeek = useCallback(() => {
    if (!token) return
    userApi.getShareText()
      .then(({ text }) => navigator.clipboard.writeText(text))
      .then(() => {
        setShareFeedback(true)
        setTimeout(() => setShareFeedback(false), 2000)
      })
      .catch(() => {})
  }, [token])

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

  // Heutigen Standort-/Aktivitäts-Kontext in dailyContext schreiben (für AI-Muster)
  useEffect(() => {
    const today = getTodayKey()
    setDailyContextState((prev) => {
      const next = { ...prev, [today]: { location: locationContext, activityLevel } }
      setStoredDailyContext(next)
      return next
    })
  }, [locationContext, activityLevel])

  // Wetter optional für AI-Insights (nur bei Zustimmung)
  useEffect(() => {
    if (!weatherForInsights) return
    fetchWeatherWithGeolocation().then(setWeather)
  }, [weatherForInsights])

  // Web Push: Abo beim Backend registrieren, wenn eingeloggt und Benachrichtigungen an
  useEffect(() => {
    if (!token || !notificationsEnabled) return
    import('./utils/pushSubscription.js').then(({ subscribeAndSendToBackend }) => {
      subscribeAndSendToBackend().catch(() => {})
    })
  }, [token, notificationsEnabled])

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

  const onWaterFire = useCallback(() => {
    if (token) userApi.postReminderSent('water').catch(() => {})
    setWaterMessage(pickRandom(getMotivationalMessages('water', { dailyStreak: gamification?.dailyStreak ?? 0 })))
    if (reminderSoundEnabled) playReminderSound()
    if (notificationsEnabled) {
      showNotification(t('notifications.waterTitle'), { body: t('notifications.waterBody') })
    }
  }, [token, gamification?.dailyStreak, reminderSoundEnabled, notificationsEnabled])

  const onStandFire = useCallback(() => {
    if (token) userApi.postReminderSent('stand').catch(() => {})
    setStandMessage(pickRandom(getMotivationalMessages('stand', { dailyStreak: gamification?.dailyStreak ?? 0 })))
    if (reminderSoundEnabled) playReminderSound()
    if (notificationsEnabled) {
      showNotification(t('notifications.standTitle'), { body: t('notifications.standBody') })
    }
  }, [token, gamification?.dailyStreak, reminderSoundEnabled, notificationsEnabled])

  const onEyeFire = useCallback(() => {
    if (token) userApi.postReminderSent('eye').catch(() => {})
    setEyeMessage(pickRandom(getMotivationalMessages('eye', { dailyStreak: gamification?.dailyStreak ?? 0 })))
    if (reminderSoundEnabled) playReminderSound()
    if (notificationsEnabled) {
      showNotification(t('notifications.eyeTitle'), { body: t('notifications.eyeBody') })
    }
    setEyeModalOpen(true)
  }, [token, gamification?.dailyStreak, reminderSoundEnabled, notificationsEnabled])

  const handleDrinkNow = useCallback(() => {
    if (hapticEnabled) triggerHaptic(50)
    const today = getTodayKey()
    const progressAfter = {
      ...progress,
      todayMl: Math.min(waterGoalMl, progress.todayMl + WATER_GLASS_ML),
    }
    setProgress(progressAfter)
    setStoredProgress(progressAfter)
    timerApiRef.current?.resetWater?.()
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
    timerApiRef.current?.resetStand?.()
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
    timerApiRef.current?.resetEye?.()
    setEyeMessage('')
    setQuickActionFeedback({ type: 'eye', xp: 0 })
    setTimeout(() => setQuickActionFeedback(null), 1600)
  }, [eyeBreakIntervalMinutes])

  const actionHandledRef = useRef(false)
  useEffect(() => {
    if (actionHandledRef.current) return
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')
    if (!action) return
    actionHandledRef.current = true
    if (action === 'drink') handleDrinkNow()
    else if (action === 'stand') handleStartBreak()
    else if (action === 'eye') handleStartEyeBreak()
    window.history.replaceState({}, '', window.location.pathname || '/')
  }, [handleDrinkNow, handleStartBreak, handleStartEyeBreak])

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) return
      const key = e.key?.toLowerCase()
      if (key === '1' || key === 'd') {
        handleDrinkNow()
        e.preventDefault()
      } else if (key === '2' || key === 's') {
        handleStartBreak()
        e.preventDefault()
      } else if (key === '3' || key === 'e') {
        handleStartEyeBreak()
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleDrinkNow, handleStartBreak, handleStartEyeBreak])

  const voice = useVoiceCommands(
    {
      onDrink: handleDrinkNow,
      onStand: handleStartBreak,
      onEye: handleStartEyeBreak,
    },
    { lang: locale?.startsWith('de') ? 'de-DE' : 'en-US' }
  )

  const handleEyeBreakComplete = useCallback(() => {
    if (hapticEnabled) triggerHaptic(50)
    const today = getTodayKey()
    timerApiRef.current?.resetEye?.()

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
    timerApiRef.current?.setWaterRemaining?.(SNOOZE_MINUTES * 60)
    setWaterMessage('')
  }, [])
  const handleSnoozeStand = useCallback(() => {
    timerApiRef.current?.setStandRemaining?.(SNOOZE_MINUTES * 60)
    setStandMessage('')
  }, [])
  const handleSnoozeEye = useCallback(() => {
    timerApiRef.current?.setEyeRemaining?.(SNOOZE_MINUTES * 60)
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
    if (ok) {
      persistSettings((s) => ({ ...s, notificationsEnabled: true }))
      const { subscribeAndSendToBackend } = await import('./utils/pushSubscription.js')
      subscribeAndSendToBackend().catch(() => {})
    }
  }, [persistSettings])

  const handleRefresh = useCallback(async () => {
    if (token) {
      const [apiSettings, apiProgress, apiStats, apiGamification] = await Promise.all([
        userApi.getSettings().catch(() => null),
        userApi.getProgress().catch(() => null),
        userApi.getStats().catch(() => null),
        userApi.getGamification().catch(() => null),
      ])
      if (apiSettings && Object.keys(apiSettings).length > 0) {
        setSettings((prev) => ({ ...defaultSettings, ...prev, ...apiSettings }))
        setStoredSettings({ ...defaultSettings, ...apiSettings })
      }
      if (apiProgress?.date === getTodayKey()) {
        setProgress(apiProgress)
        setStoredProgress(apiProgress)
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
    }
    timerApiRef.current?.setWaterRemaining?.(waterIntervalMinutes * 60)
    timerApiRef.current?.setStandRemaining?.(standUpIntervalMinutes * 60)
    timerApiRef.current?.setEyeRemaining?.(eyeBreakIntervalMinutes * 60)
  }, [
    token,
    waterIntervalMinutes,
    standUpIntervalMinutes,
    eyeBreakIntervalMinutes,
  ])

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

  if (isCompactView) {
    return (
      <div className="min-h-screen bg-app-bg transition-colors">
        {storageErrorMessage && (
          <StorageErrorBanner
            message={storageErrorMessage}
            onDismiss={() => setStorageErrorMessage(null)}
          />
        )}
        {!online && <OfflineBanner />}
        <CompactView
          todayMl={progress.todayMl}
          waterGoalMl={waterGoalMl}
          onDrink={handleDrinkNow}
          onStand={handleStartBreak}
          onEye={handleStartEyeBreak}
          feedback={quickActionFeedback}
          onOpenFullApp={() => {
            window.history.replaceState({}, '', '/')
            setCompactView(false)
          }}
          voice={voice}
        />
        <Suspense fallback={null}>
          <EyeBreakModal
            open={eyeModalOpen}
            onClose={() => setEyeModalOpen(false)}
            onComplete={handleEyeBreakComplete}
          />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg transition-colors flex flex-col">
      {introVisible && (
        <IntroAnimation onComplete={() => setIntroVisible(false)} />
      )}
      {storageErrorMessage && (
        <StorageErrorBanner
          message={storageErrorMessage}
          onDismiss={() => setStorageErrorMessage(null)}
        />
      )}
      {!online && <OfflineBanner />}
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col px-5 pt-5 pb-2 min-h-0 sm:px-6">
        {showComebackBanner && (
          <ComebackBanner
            show={showComebackBanner}
            bonusXp={COMEBACK_BONUS_XP}
            onDismiss={() => setShowComebackBanner(false)}
          />
        )}

        {activeTab === 'today' && (
          <ReminderTimersProvider
            config={{
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
            }}
            onWaterFire={onWaterFire}
            onStandFire={onStandFire}
            onEyeFire={onEyeFire}
            timerApiRef={timerApiRef}
          >
            <TodayTab
              todayProps={{
                user,
                voice,
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
                waterMessage,
                standMessage,
                eyeMessage,
                gamification,
                weeklySummaries,
                leaderboardPercentile,
                waterGoalMl,
                todayActivity,
                heatmapData,
                milestonesForDisplay,
                progress,
                showStats,
                dailyHistory,
                weeklyTotal,
                focusSessionDurationMinutes,
                APP_VERSION,
                handleDrinkNow,
                handleStartBreak,
                handleStartEyeBreak,
                handleSnoozeWater,
                handleSnoozeStand,
                handleSnoozeEye,
                handleClaimChallenge,
                handleToggleStats,
                setStatsModalOpen,
                handleRefresh,
                handleOpenLegal,
                handleShareWeek,
                quickActionFeedback,
                dailyContext,
                weather,
                stats,
                settings,
                todayKey,
              }}
            />
          </ReminderTimersProvider>
        )}

        {activeTab === 'stats' && (
          <h2 className="text-lg font-semibold text-[var(--app-primary)] px-1 pb-2 shrink-0">
            {t('nav.stats')}
          </h2>
        )}
        {activeTab === 'settings' && (
          <h2 className="text-lg font-semibold text-[var(--app-primary)] px-1 pb-2 shrink-0">
            {t('nav.settings')}
          </h2>
        )}

        {activeTab === 'stats' && (
          <div className="flex-1 min-h-0 overflow-y-auto pb-20">
            <StatsPage
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
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 min-h-0 overflow-y-auto pb-20">
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
              reminderWeekdaysOnly={reminderWeekdaysOnly}
              onReminderWeekdaysOnlyChange={(v) =>
                persistSettings((s) => ({ ...s, reminderWeekdaysOnly: v }))
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
              emailDigestEnabled={emailDigestEnabled}
              onEmailDigestChange={(v) =>
                persistSettings((s) => ({ ...s, emailDigestEnabled: v }))
              }
              locationContext={locationContext}
              activityLevel={activityLevel}
              weatherForInsights={weatherForInsights}
              onLocationContextChange={(v) =>
                persistSettings((s) => ({ ...s, locationContext: v }))
              }
              onActivityLevelChange={(v) =>
                persistSettings((s) => ({ ...s, activityLevel: v }))
              }
              onWeatherForInsightsChange={(v) =>
                persistSettings((s) => ({ ...s, weatherForInsights: v }))
              }
              sleepHoursLastNight={sleepHoursLastNight}
              weightKg={weightKg}
              age={age}
              sex={sex}
              lastSportMinutesAgo={lastSportMinutesAgo}
              onSleepHoursChange={(v) => persistSettings((s) => ({ ...s, sleepHoursLastNight: v }))}
              onWeightKgChange={(v) => persistSettings((s) => ({ ...s, weightKg: v }))}
              onAgeChange={(v) => persistSettings((s) => ({ ...s, age: v }))}
              onSexChange={(v) => persistSettings((s) => ({ ...s, sex: v }))}
              onLastSportMinutesAgoChange={(v) => persistSettings((s) => ({ ...s, lastSportMinutesAgo: v }))}
            />
            </Suspense>
            <AppFooter onOpenLegal={handleOpenLegal} version={APP_VERSION} />
          </div>
        )}

      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

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

      {shareFeedback && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[99] px-4 py-2 rounded-card bg-app-surface border border-app-border shadow-modal dark:shadow-modal-dark text-sm text-[var(--app-primary)]"
          role="status"
          aria-live="polite"
        >
          {t('share.copied')}
        </div>
      )}

    </div>
  )
}
