/**
 * HydroBreak API: Auth (JWT) + CRUD für Settings, Progress, Stats, Gamification.
 * Optional: Liefert das gebaute Frontend (dist/) aus, wenn vorhanden – für gemeinsames Deployment.
 * Start: npm run dev (oder npm start) im Ordner server/
 */
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import { authMiddleware } from './middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '..', 'dist')
const servesFrontend = existsSync(distPath)

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

app.get('/health', (req, res) => {
  res.json({ ok: true, frontend: servesFrontend })
})

// Gemeinsames Deployment: Frontend aus dist/ ausliefern (wenn vorhanden)
if (servesFrontend) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`HydroBreak API läuft auf http://localhost:${PORT}` + (servesFrontend ? ' (inkl. Frontend)' : ''))
})
