/**
 * Web-Push: VAPID, Versand und Cron für Erinnerungen bei geschlossenem Tab
 */
import webpush from 'web-push'
import { getData, setData, getAllUserIds, getUserByIdForPush } from './db.js'

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY
const MAILTO = process.env.VAPID_MAILTO || 'mailto:noreply@hydrobreak.local'

let vapidConfigured = false

export function isPushConfigured() {
  return !!(VAPID_PUBLIC && VAPID_PRIVATE)
}

export function getVapidPublicKey() {
  return VAPID_PUBLIC || null
}

export function initPush() {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn('Web Push: VAPID keys not set (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY). Push when tab closed is disabled.')
    return
  }
  webpush.setVapidDetails(MAILTO, VAPID_PUBLIC, VAPID_PRIVATE)
  vapidConfigured = true
  console.log('Web Push: VAPID configured')
}

export async function sendPush(subscription, payload) {
  if (!vapidConfigured) return
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      return { gone: true }
    }
    throw err
  }
}

/** User-Zeitzone: aus Settings oder UTC */
function getUserNow(settings) {
  const tz = settings?.timezone || 'UTC'
  return new Date(new Date().toLocaleString('en-US', { timeZone: tz }))
}

/** Liegt die gegebene Zeit (Date) in der Fokuszeit? */
function isInFocusTime(settings, now) {
  if (!settings?.focusModeEnabled || !settings?.focusStart || !settings?.focusEnd) return false
  const min = now.getHours() * 60 + now.getMinutes()
  const [sH, sM] = settings.focusStart.split(':').map(Number)
  const [eH, eM] = settings.focusEnd.split(':').map(Number)
  const startMin = sH * 60 + sM
  const endMin = eH * 60 + eM
  if (startMin <= endMin) return min >= startMin && min < endMin
  return min >= startMin || min < endMin
}

/** Liegt die Zeit außerhalb des Reminder-Fensters (Arbeitszeiten)? */
function isOutsideReminderWindow(settings, now) {
  if (!settings?.reminderWindowEnabled || !settings?.reminderWindowStart || !settings?.reminderWindowEnd) return false
  const min = now.getHours() * 60 + now.getMinutes()
  const [sH, sM] = settings.reminderWindowStart.split(':').map(Number)
  const [eH, eM] = settings.reminderWindowEnd.split(':').map(Number)
  const startMin = sH * 60 + sM
  const endMin = eH * 60 + eM
  if (startMin <= endMin) return min < startMin || min >= endMin
  return min >= endMin && min < startMin
}

const REMINDER_TITLES = {
  water: { titleKey: 'notifications.waterTitle', bodyKey: 'notifications.waterBody' },
  stand: { titleKey: 'notifications.standTitle', bodyKey: 'notifications.standBody' },
  eye: { titleKey: 'notifications.eyeTitle', bodyKey: 'notifications.eyeBody' },
}

export async function runPushCron() {
  if (!vapidConfigured) return
  const userIds = getAllUserIds()
  for (const userId of userIds) {
    const user = getUserByIdForPush(userId)
    if (!user) continue
    const subscriptions = getData(userId, 'push_subscriptions')
    if (!Array.isArray(subscriptions) || subscriptions.length === 0) continue
    const settings = getData(userId, 'settings') || {}
    if (!settings.notificationsEnabled) continue
    const now = getUserNow(settings)
    if (isInFocusTime(settings, now)) continue
    if (isOutsideReminderWindow(settings, now)) continue
    const state = getData(userId, 'reminder_state') || {}
    const nowTs = now.getTime()
    const intervals = {
      water: (settings.waterIntervalMinutes ?? 45) * 60 * 1000,
      stand: (settings.standUpIntervalMinutes ?? 60) * 60 * 1000,
      eye: (settings.eyeBreakIntervalMinutes ?? 20) * 60 * 1000,
    }
    for (const type of ['water', 'stand', 'eye']) {
      const last = state[`last${type.charAt(0).toUpperCase() + type.slice(1)}At`] || 0
      const lastTs = typeof last === 'string' ? new Date(last).getTime() : last
      if (nowTs - lastTs < intervals[type]) continue
      const meta = REMINDER_TITLES[type]
      const payload = {
        title: meta.titleKey === 'notifications.waterTitle' ? 'HydroBreak – Wasser' : meta.titleKey === 'notifications.standTitle' ? 'HydroBreak – Aufstehen' : 'HydroBreak – Augenpause',
        body: meta.bodyKey === 'notifications.waterBody' ? 'Zeit für einen Schluck Wasser!' : meta.bodyKey === 'notifications.standBody' ? 'Kurz aufstehen und bewegen.' : '20 Sekunden in die Ferne schauen.',
        type,
      }
      const stillValid = []
      for (const sub of subscriptions) {
        try {
          await sendPush(sub, payload)
          stillValid.push(sub)
        } catch (e) {
          if (e.statusCode === 410 || e.statusCode === 404) continue
          stillValid.push(sub)
        }
      }
      if (stillValid.length < subscriptions.length) setData(userId, 'push_subscriptions', stillValid)
      state[`last${type.charAt(0).toUpperCase() + type.slice(1)}At`] = new Date().toISOString()
      setData(userId, 'reminder_state', state)
      break
    }
  }
}

let cronInterval = null

export function startPushCron() {
  if (!vapidConfigured || cronInterval) return
  cronInterval = setInterval(() => {
    runPushCron().catch((err) => console.error('Push cron error:', err.message))
  }, 60 * 1000)
  console.log('Web Push: cron started (every 60s)')
}

export function stopPushCron() {
  if (cronInterval) {
    clearInterval(cronInterval)
    cronInterval = null
  }
}
