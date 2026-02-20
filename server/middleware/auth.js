/**
 * JWT-Auth-Middleware: Token aus Header oder Query prüfen, req.user setzen
 */
import jwt from 'jsonwebtoken'
import { getUserById } from '../db.js'

const secret = process.env.JWT_SECRET || 'hydrobreak-dev-secret'

export function authMiddleware(req, res, next) {
  const raw = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : req.query?.token
  if (!raw) {
    return res.status(401).json({ error: 'Nicht autorisiert. Bitte anmelden.' })
  }
  try {
    const decoded = jwt.verify(raw, secret)
    const user = getUserById(decoded.userId)
    if (!user) return res.status(401).json({ error: 'Benutzer nicht gefunden.' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token.' })
  }
}

export function signToken(userId) {
  return jwt.sign({ userId }, secret, { expiresIn: '30d' })
}
