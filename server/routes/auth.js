/**
 * Auth-Routen: Registrierung + Login (JWT) + E-Mail-Verifizierung
 */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import {
  getUserByEmail,
  createUser,
  setVerificationCode,
  setUserEmailVerified,
  setResetPasswordCode,
  clearResetPasswordCode,
  updateUserPassword,
} from '../db.js'
import { signToken } from '../middleware/auth.js'
import { sendVerificationEmail, sendPasswordResetEmail } from '../email.js'

const router = Router()
const VERIFICATION_CODE_TTL_MINUTES = 15

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6
}

router.post('/register', async (req, res) => {
  const { email: rawEmail, password } = req.body || {}
  const email = rawEmail?.trim()?.toLowerCase()
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' })
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' })
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen haben.' })
  }
  if (getUserByEmail(email)) {
    return res.status(409).json({ error: 'Diese E-Mail ist bereits registriert.' })
  }
  const passwordHash = bcrypt.hashSync(password, 10)
  createUser(email, passwordHash, { emailVerified: false })
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000).toISOString()
  setVerificationCode(email, code, expiresAt)
  await sendVerificationEmail(email, code).catch((err) =>
    console.error('Verification email send failed:', err.message)
  )
  res.status(201).json({ needVerification: true, email })
})

router.post('/login', (req, res) => {
  const { email: rawEmail, password } = req.body || {}
  const email = rawEmail?.trim()?.toLowerCase()
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' })
  }
  const row = getUserByEmail(email)
  if (!row) {
    return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' })
  }
  if (!bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' })
  }
  if (row.email_verified === false) {
    return res.status(403).json({ needVerification: true, email: row.email })
  }
  const user = { id: row.id, email: row.email }
  const token = signToken(row.id)
  res.json({ user, token })
})

/** E-Mail-Verifizierung: Code prüfen, User freischalten, JWT zurückgeben. */
router.post('/verify-email', (req, res) => {
  const { email: rawEmail, code } = req.body || {}
  const email = rawEmail?.trim()?.toLowerCase()
  if (!email || !code) {
    return res.status(400).json({ error: 'E-Mail und Code erforderlich.' })
  }
  const row = getUserByEmail(email)
  if (!row) {
    return res.status(404).json({ error: 'Kein Konto mit dieser E-Mail gefunden.' })
  }
  if (row.email_verified) {
    return res.status(400).json({ error: 'E-Mail ist bereits bestätigt. Bitte anmelden.' })
  }
  const now = new Date().toISOString()
  if (row.verification_code_expires_at && row.verification_code_expires_at < now) {
    return res.status(400).json({ error: 'Der Code ist abgelaufen. Bitte neuen Code anfordern.' })
  }
  if (String(row.verification_code) !== String(code)) {
    return res.status(401).json({ error: 'Ungültiger Code. Bitte prüfen und erneut eingeben.' })
  }
  setUserEmailVerified(email)
  const user = { id: row.id, email: row.email }
  const token = signToken(row.id)
  res.json({ user, token })
})

/** Neuen Verifizierungscode anfordern (z. B. wenn abgelaufen). */
router.post('/resend-code', async (req, res) => {
  const { email: rawEmail } = req.body || {}
  const email = rawEmail?.trim()?.toLowerCase()
  if (!email) {
    return res.status(400).json({ error: 'E-Mail erforderlich.' })
  }
  const row = getUserByEmail(email)
  if (!row) {
    return res.status(404).json({ error: 'Kein Konto mit dieser E-Mail gefunden.' })
  }
  if (row.email_verified) {
    return res.status(400).json({ error: 'E-Mail ist bereits bestätigt. Bitte anmelden.' })
  }
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000).toISOString()
  setVerificationCode(email, code, expiresAt)
  await sendVerificationEmail(email, code).catch((err) =>
    console.error('Verification email send failed:', err.message)
  )
  res.json({ ok: true })
})

/** Passwort vergessen: E-Mail eingeben → Code senden. */
const RESET_CODE_TTL_MINUTES = 15

router.post('/forgot-password', async (req, res) => {
  const { email: rawEmail } = req.body || {}
  const email = rawEmail?.trim()?.toLowerCase()
  if (!email) {
    return res.status(400).json({ error: 'E-Mail erforderlich.' })
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' })
  }
  const row = getUserByEmail(email)
  if (!row) {
    return res.status(404).json({ error: 'Kein Konto mit dieser E-Mail gefunden.' })
  }
  if (row.provider !== 'email') {
    return res.status(400).json({ error: 'Dieses Konto verwendet eine andere Anmeldemethode.' })
  }
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000).toISOString()
  setResetPasswordCode(email, code, expiresAt)
  await sendPasswordResetEmail(email, code).catch((err) =>
    console.error('Password reset email send failed:', err.message)
  )
  res.json({ ok: true, email })
})

/** Passwort zurücksetzen: Code + neues Passwort. */
router.post('/reset-password', (req, res) => {
  const { email: rawEmail, code, newPassword } = req.body || {}
  const email = rawEmail?.trim()?.toLowerCase()
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'E-Mail, Code und neues Passwort erforderlich.' })
  }
  if (!validatePassword(newPassword)) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen haben.' })
  }
  const row = getUserByEmail(email)
  if (!row) {
    return res.status(404).json({ error: 'Kein Konto mit dieser E-Mail gefunden.' })
  }
  const now = new Date().toISOString()
  if (!row.reset_password_code || !row.reset_password_expires_at) {
    return res.status(400).json({ error: 'Kein Reset angefordert. Bitte Code erneut anfordern.' })
  }
  if (row.reset_password_expires_at < now) {
    clearResetPasswordCode(email)
    return res.status(400).json({ error: 'Der Code ist abgelaufen. Bitte neuen Code anfordern.' })
  }
  if (String(row.reset_password_code) !== String(code)) {
    return res.status(401).json({ error: 'Ungültiger Code.' })
  }
  const passwordHash = bcrypt.hashSync(newPassword, 10)
  updateUserPassword(email, passwordHash)
  clearResetPasswordCode(email)
  const user = { id: row.id, email: row.email }
  const token = signToken(row.id)
  res.json({ user, token })
})

export default router
