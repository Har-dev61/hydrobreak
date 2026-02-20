/**
 * LocalStorage-Helfer für HydroBreak (Settings, Fortschritt, Statistiken)
 * Alle Zugriffe in try/catch; bei Fehler (z. B. Privatmodus, Speicher voll) wird
 * ein optionaler Callback aufgerufen und Fallback-Werte genutzt.
 */

import { STORAGE_KEYS, MAX_STORAGE_DAYS } from '../constants'
import { t } from '../i18n'

function getCutoffDateKey() {
  const d = new Date()
  d.setDate(d.getDate() - MAX_STORAGE_DAYS)
  return d.toDateString()
}

/** Entfernt Einträge in stats.daily, die älter als MAX_STORAGE_DAYS sind. */
export function trimStatsToMaxDays(stats) {
  if (!stats || !Array.isArray(stats.daily)) return stats
  const cutoff = getCutoffDateKey()
  const daily = stats.daily.filter((entry) => entry.date >= cutoff)
  return { ...stats, daily }
}

/** Entfernt Einträge in gamification.todayCounts, die älter als MAX_STORAGE_DAYS sind. */
export function trimGamificationToMaxDays(data) {
  if (!data || typeof data.todayCounts !== 'object') return data
  const cutoff = getCutoffDateKey()
  const todayCounts = {}
  for (const [dateKey, value] of Object.entries(data.todayCounts)) {
    if (dateKey >= cutoff) todayCounts[dateKey] = value
  }
  return { ...data, todayCounts }
}

/** Nutzerhinweis bei LocalStorage-Fehler – Text aus i18n. */
export const STORAGE_ERROR_MESSAGE = () => t('errors.storageUnavailable')

let storageErrorCallback = null

/**
 * Registriert einen Callback, der bei LocalStorage-Fehlern mit der Fehlermeldung aufgerufen wird.
 * @param {(message: string) => void} cb
 */
export function setStorageErrorCallback(cb) {
  storageErrorCallback = cb
}

/**
 * Wird bei LocalStorage-Fehlern aufgerufen (auch von api/client.js).
 * @param {string} [message]
 */
export function notifyStorageError(message) {
  if (typeof storageErrorCallback === 'function') {
    storageErrorCallback(message ?? STORAGE_ERROR_MESSAGE())
  }
}

function safeGetItem(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? value : fallback
  } catch {
    notifyStorageError()
    return fallback
  }
}

function safeSetItem(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    notifyStorageError()
  }
}

const safeParse = (str, fallback) => {
  try {
    return str ? JSON.parse(str) : fallback
  } catch {
    return fallback
  }
}

export function getStoredSettings(fallback) {
  const raw = safeGetItem(STORAGE_KEYS.SETTINGS, null)
  return safeParse(raw, fallback)
}

export function setStoredSettings(settings) {
  safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

export function getStoredProgress(fallback) {
  const raw = safeGetItem(STORAGE_KEYS.PROGRESS, null)
  return safeParse(raw, fallback)
}

export function setStoredProgress(progress) {
  safeSetItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}

export function getStoredStats(fallback) {
  const raw = safeGetItem(STORAGE_KEYS.STATS, null)
  const parsed = safeParse(raw, fallback)
  if (!parsed) return parsed
  const trimmed = trimStatsToMaxDays(parsed)
  if (trimmed.daily.length < (parsed.daily?.length ?? 0)) {
    safeSetItem(STORAGE_KEYS.STATS, JSON.stringify(trimmed))
  }
  return trimmed
}

export function setStoredStats(stats) {
  const trimmed = stats ? trimStatsToMaxDays(stats) : stats
  safeSetItem(STORAGE_KEYS.STATS, JSON.stringify(trimmed))
}

export function getStoredTheme() {
  return safeGetItem(STORAGE_KEYS.THEME, 'system') || 'system'
}

export function setStoredTheme(theme) {
  safeSetItem(STORAGE_KEYS.THEME, theme)
}

export function getStoredGamification(fallback) {
  const raw = safeGetItem(STORAGE_KEYS.GAMIFICATION, null)
  const parsed = safeParse(raw, fallback)
  if (!parsed) return parsed
  const trimmed = trimGamificationToMaxDays(parsed)
  const origKeys = Object.keys(parsed.todayCounts || {}).length
  const newKeys = Object.keys(trimmed.todayCounts || {}).length
  if (newKeys < origKeys) {
    safeSetItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(trimmed))
  }
  return trimmed
}

export function setStoredGamification(data) {
  const trimmed = data ? trimGamificationToMaxDays(data) : data
  safeSetItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(trimmed))
}

export function getStoredOnboardingDone() {
  return safeGetItem(STORAGE_KEYS.ONBOARDING_DONE, '') === 'true'
}

export function setStoredOnboardingDone(done) {
  safeSetItem(STORAGE_KEYS.ONBOARDING_DONE, done ? 'true' : 'false')
}

export function getStoredLastSeenVersion() {
  return safeGetItem(STORAGE_KEYS.LAST_SEEN_VERSION, '') || ''
}

export function setStoredLastSeenVersion(version) {
  safeSetItem(STORAGE_KEYS.LAST_SEEN_VERSION, version)
}

/**
 * Liefert alle exportierbaren App-Daten (ohne Token) für einen Download.
 * @param {{ email?: string }} [user] – optional, z. B. { email: user.email } zur Zuordnung
 * @returns {object} Objekt mit exportedAt, version, settings, progress, stats, gamification, theme, onboardingDone, userEmail?
 */
export function getExportableData(user) {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    app: 'HydroBreak',
    settings: getStoredSettings(null),
    progress: getStoredProgress(null),
    stats: getStoredStats(null),
    gamification: getStoredGamification(null),
    theme: getStoredTheme(),
    onboardingDone: getStoredOnboardingDone(),
    ...(user?.email && { userEmail: user.email }),
  }
}

/**
 * Löscht alle HydroBreak-Daten aus dem LocalStorage (Einstellungen, Fortschritt,
 * Stats, Theme, Gamification, Onboarding, Auth). Nach dem Aufruf z. B. Seite neu laden.
 */
export function clearAllAppData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  } catch {
    notifyStorageError()
  }
}
