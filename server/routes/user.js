/**
 * CRUD für User-Daten: Settings, Progress, Stats, Gamification (GET/PUT pro Typ)
 * + Leaderboard-Perzentil, Share-Text, Erinnerungs-Historie
 */
import { Router } from 'express'
import { getData, setData, getAllUserIds } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { computeWeekActivityScore, getWeekKey, getWeekDateKeys } from '../utils/weekScore.js'

const REMINDER_HISTORY_MAX = 50

const router = Router()
router.use(authMiddleware)

router.get('/settings', (req, res) => {
  const data = getData(req.user.id, 'settings')
  res.json(data ?? {})
})

router.put('/settings', (req, res) => {
  const payload = req.body
  if (payload && typeof payload !== 'object') {
    return res.status(400).json({ error: 'Ungültige Daten.' })
  }
  setData(req.user.id, 'settings', payload ?? {})
  res.json(getData(req.user.id, 'settings') ?? {})
})

router.get('/progress', (req, res) => {
  const data = getData(req.user.id, 'progress')
  res.json(data ?? {})
})

router.put('/progress', (req, res) => {
  const payload = req.body
  if (payload && typeof payload !== 'object') {
    return res.status(400).json({ error: 'Ungültige Daten.' })
  }
  setData(req.user.id, 'progress', payload ?? {})
  res.json(getData(req.user.id, 'progress') ?? {})
})

router.get('/stats', (req, res) => {
  const data = getData(req.user.id, 'stats')
  res.json(data ?? {})
})

router.put('/stats', (req, res) => {
  const payload = req.body
  if (payload && typeof payload !== 'object') {
    return res.status(400).json({ error: 'Ungültige Daten.' })
  }
  setData(req.user.id, 'stats', payload ?? {})
  res.json(getData(req.user.id, 'stats') ?? {})
})

router.get('/gamification', (req, res) => {
  const data = getData(req.user.id, 'gamification')
  res.json(data ?? {})
})

router.put('/gamification', (req, res) => {
  const payload = req.body
  if (payload && typeof payload !== 'object') {
    return res.status(400).json({ error: 'Ungültige Daten.' })
  }
  setData(req.user.id, 'gamification', payload ?? {})
  res.json(getData(req.user.id, 'gamification') ?? {})
})

router.post('/push-subscription', (req, res) => {
  const { subscription } = req.body || {}
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Subscription (endpoint) erforderlich.' })
  }
  const subs = getData(req.user.id, 'push_subscriptions') || []
  const filtered = subs.filter((s) => s.endpoint !== subscription.endpoint)
  filtered.push({ endpoint: subscription.endpoint, keys: subscription.keys || {} })
  setData(req.user.id, 'push_subscriptions', filtered)
  res.json({ ok: true })
})

router.post('/reminder-sent', (req, res) => {
  const { type } = req.body || {}
  if (!['water', 'stand', 'eye'].includes(type)) {
    return res.status(400).json({ error: 'type muss water, stand oder eye sein.' })
  }
  const state = getData(req.user.id, 'reminder_state') || {}
  const key = `last${type.charAt(0).toUpperCase() + type.slice(1)}At`
  state[key] = new Date().toISOString()
  setData(req.user.id, 'reminder_state', state)
  const triggeredAt = new Date().toISOString()
  const history = getData(req.user.id, 'reminder_history') || []
  history.push({ type, triggeredAt })
  if (history.length > REMINDER_HISTORY_MAX) history.splice(0, history.length - REMINDER_HISTORY_MAX)
  setData(req.user.id, 'reminder_history', history)
  res.json({ ok: true })
})

/** Rangliste: Aktivitäts-Score diese Woche (Gläser + Pausen + Streak), Prozentil 1–100 (niedrig = besser). */
router.get('/leaderboard-percentile', (req, res) => {
  const todayKey = new Date().toDateString()
  const progress = getData(req.user.id, 'progress')
  const stats = getData(req.user.id, 'stats')
  const gamification = getData(req.user.id, 'gamification')
  const myScore = computeWeekActivityScore(progress, stats, gamification, todayKey)

  const userIds = getAllUserIds()
  const scores = userIds.map((id) => {
    const p = getData(id, 'progress')
    const s = getData(id, 'stats')
    const g = getData(id, 'gamification')
    return { id, score: computeWeekActivityScore(p, s, g, todayKey) }
  })
  scores.sort((a, b) => b.score - a.score)
  const rank = scores.findIndex((x) => x.id === req.user.id) + 1
  const percentile = rank >= 1 ? Math.max(1, Math.min(100, rank)) : 100
  res.json({ percentile, period: 'week' })
})

/** „Meine Woche teilen“: Text zum Kopieren/Teilen (z. B. „7 Tage Streak, 14 L getrunken“). */
router.get('/share-text', (req, res) => {
  const todayKey = new Date().toDateString()
  const progress = getData(req.user.id, 'progress')
  const stats = getData(req.user.id, 'stats')
  const gamification = getData(req.user.id, 'gamification')
  const weekKey = getWeekKey(todayKey)
  const weekKeys = getWeekDateKeys(weekKey).filter((d) => d <= todayKey)
  const dailyByDate = Object.fromEntries((stats?.daily || []).map((d) => [d.date, d.ml]))
  const totalMl = weekKeys.reduce((sum, dateKey) => {
    const ml = dateKey === todayKey ? (progress?.todayMl ?? 0) : (dailyByDate[dateKey] ?? 0)
    return sum + ml
  }, 0)
  const counts = gamification?.todayCounts || {}
  const standBreaks = weekKeys.reduce((s, d) => s + (counts[d]?.standBreaks ?? 0), 0)
  const eyeBreaks = weekKeys.reduce((s, d) => s + (counts[d]?.eyeBreaks ?? 0), 0)
  const liters = (totalMl / 1000).toFixed(1)
  const dailyStreak = gamification?.dailyStreak ?? 0
  const weeklyStreak = gamification?.weeklyStreak ?? 0
  const parts = []
  if (dailyStreak > 0) parts.push(`${dailyStreak} ${dailyStreak === 1 ? 'Tag' : 'Tage'} Streak`)
  if (weeklyStreak > 0) parts.push(`${weeklyStreak} Woche(n) Streak`)
  if (totalMl > 0) parts.push(`${liters} L getrunken`)
  if (standBreaks + eyeBreaks > 0) parts.push(`${standBreaks + eyeBreaks} Pausen`)
  const text = parts.length ? parts.join(', ') : 'Diese Woche mit HydroBreak gestartet.'
  res.json({ text })
})

/** Letzte Erinnerungen (heute oder alle): Wann Wasser/Stand/Eye ausgelöst wurden. */
router.get('/reminder-history', (req, res) => {
  const todayOnly = req.query.today === 'true' || req.query.today === '1'
  let history = getData(req.user.id, 'reminder_history') || []
  if (todayOnly) {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayStartIso = todayStart.toISOString()
    history = history.filter((e) => e.triggeredAt >= todayStartIso)
  }
  history = history.slice(-30).reverse()
  res.json({ items: history })
})

export default router
