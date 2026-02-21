/**
 * API-Client für HydroBreak Backend: Auth + CRUD (Settings, Progress, Stats, Gamification)
 * LocalStorage-Zugriffe (Token/User) in try/catch; bei Fehler wird notifyStorageError aufgerufen.
 */
import { API_BASE_URL, STORAGE_KEYS } from '../constants'
import { notifyStorageError } from '../utils/storage'

function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch {
    notifyStorageError()
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    else localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch {
    notifyStorageError()
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    notifyStorageError()
    return null
  }
}

export function setStoredUser(user) {
  try {
    if (user) localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
  } catch {
    notifyStorageError()
  }
}

async function request(method, path, body = undefined) {
  const url = `${API_BASE_URL}${path}`
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  const token = getToken()
  if (token) opts.headers.Authorization = `Bearer ${token}`
  if (body != null) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const auth = {
  login: (email, password) => request('POST', '/api/auth/login', { email, password }),
  register: (email, password) => request('POST', '/api/auth/register', { email, password }),
  verifyEmail: (email, code) => request('POST', '/api/auth/verify-email', { email, code }),
  resendCode: (email) => request('POST', '/api/auth/resend-code', { email }),
  forgotPassword: (email) => request('POST', '/api/auth/forgot-password', { email }),
  resetPassword: (email, code, newPassword) =>
    request('POST', '/api/auth/reset-password', { email, code, newPassword }),
}

export const user = {
  getMe: () => request('GET', '/api/me'),
  getSettings: () => request('GET', '/api/user/settings'),
  putSettings: (payload) => request('PUT', '/api/user/settings', payload),
  getProgress: () => request('GET', '/api/user/progress'),
  putProgress: (payload) => request('PUT', '/api/user/progress', payload),
  getStats: () => request('GET', '/api/user/stats'),
  putStats: (payload) => request('PUT', '/api/user/stats', payload),
  getGamification: () => request('GET', '/api/user/gamification'),
  putGamification: (payload) => request('PUT', '/api/user/gamification', payload),
  postPushSubscription: (subscription) => request('POST', '/api/user/push-subscription', { subscription }),
  postReminderSent: (type) => request('POST', '/api/user/reminder-sent', { type }),
  /** Anonymisierter Rang: Prozentil (1–100, niedrig = besser). Backend liefert z. B. { percentile: 20, period: 'week' }. */
  getLeaderboardPercentile: () => request('GET', '/api/user/leaderboard-percentile').catch(() => null),
  /** „Meine Woche teilen“: Text zum Kopieren/Teilen (z. B. „7 Tage Streak, 14 L getrunken“). */
  getShareText: () => request('GET', '/api/user/share-text'),
  /** Letzte Erinnerungen (optional ?today=true nur heute). */
  getReminderHistory: (todayOnly = false) =>
    request('GET', `/api/user/reminder-history${todayOnly ? '?today=true' : ''}`),
}

export const push = {
  getVapidPublicKey: () => request('GET', '/api/push/vapid-public-key'),
}

export { getToken }
