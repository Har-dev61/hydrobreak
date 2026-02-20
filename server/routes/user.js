/**
 * CRUD für User-Daten: Settings, Progress, Stats, Gamification (GET/PUT pro Typ)
 */
import { Router } from 'express'
import { getData, setData } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

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

export default router
