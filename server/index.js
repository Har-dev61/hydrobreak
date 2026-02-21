/**
 * HydroBreak API: Auth (JWT) + CRUD für Settings, Progress, Stats, Gamification, Web Push
 * Start: npm run dev (oder npm start) im Ordner server/
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import { authMiddleware } from './middleware/auth.js'
import cron from 'node-cron'
import { initPush, getVapidPublicKey, isPushConfigured, startPushCron } from './pushService.js'
import { runWeeklyDigest } from './digestService.js'

initPush()

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

app.get('/api/push/vapid-public-key', (_req, res) => {
  const key = getVapidPublicKey()
  if (!key) return res.status(503).json({ error: 'Push not configured' })
  res.json({ publicKey: key })
})

app.get('/health', (req, res) => {
  res.json({ ok: true, push: isPushConfigured() })
})

const DEFAULT_DIGEST_CRON = '0 20 * * 0' // Sonntag 20:00
const digestCronExpr = process.env.DIGEST_CRON ?? DEFAULT_DIGEST_CRON
const digestCronValid = typeof digestCronExpr === 'string' && /^[\d*,\-\/ ]+$/.test(digestCronExpr)

app.listen(PORT, () => {
  if (isPushConfigured()) startPushCron()
  if (digestCronValid) {
    cron.schedule(digestCronExpr, () => {
      runWeeklyDigest().catch((err) => console.error('[Digest Cron]', err))
    })
    console.log(`HydroBreak API läuft auf http://localhost:${PORT} (Digest: ${digestCronExpr})`)
  } else {
    if (process.env.DIGEST_CRON) console.warn('[Digest] Ungültiges DIGEST_CRON, Digest-Cron deaktiviert. Beispiel: 0 20 * * 0 (So 20:00)')
    console.log(`HydroBreak API läuft auf http://localhost:${PORT}`)
  }
})
