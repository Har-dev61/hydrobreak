/**
 * Speicher: User + user_data in JSON-Dateien (keine nativen Module nötig)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || join(__dirname, 'data')

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readJson(name, fallback) {
  ensureDir()
  const path = join(DATA_DIR, name + '.json')
  if (!existsSync(path)) return fallback
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJson(name, data) {
  ensureDir()
  writeFileSync(join(DATA_DIR, name + '.json'), JSON.stringify(data, null, 0), 'utf8')
}

export function getUserByEmail(email) {
  const users = readJson('users', [])
  return users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) || null
}

export function getUserById(id) {
  const users = readJson('users', [])
  const u = users.find((u) => u.id === id)
  if (!u) return null
  return { id: u.id, email: u.email, name: u.name, avatar: u.avatar }
}

/** OAuth: User anhand Provider + Provider-Sub finden */
export function getUserByOAuth(provider, providerId) {
  const users = readJson('users', [])
  return users.find(
    (u) => u.provider === provider && String(u.provider_id) === String(providerId)
  ) || null
}

/** Erstellt User (E-Mail/Passwort). emailVerified: false = Verifizierung per E-Mail-Code nötig. */
export function createUser(email, passwordHash, options = {}) {
  const { emailVerified = true } = options
  const users = readJson('users', [])
  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
  users.push({
    id,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    provider: 'email',
    email_verified: !!emailVerified,
    verification_code: null,
    verification_code_expires_at: null,
    reset_password_code: null,
    reset_password_expires_at: null,
    created_at: new Date().toISOString(),
  })
  writeJson('users', users)
  return id
}

/** Setzt Verifizierungscode und Ablaufzeit für einen E-Mail-User. */
export function setVerificationCode(email, code, expiresAt) {
  const users = readJson('users', [])
  const u = users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
  if (!u) return false
  u.verification_code = String(code)
  u.verification_code_expires_at = expiresAt
  writeJson('users', users)
  return true
}

/** Setzt User als E-Mail-verifiziert und entfernt Code. */
export function setUserEmailVerified(email) {
  const users = readJson('users', [])
  const u = users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
  if (!u) return false
  u.email_verified = true
  u.verification_code = null
  u.verification_code_expires_at = null
  writeJson('users', users)
  return true
}

/** Setzt Reset-Passwort-Code und Ablaufzeit. */
export function setResetPasswordCode(email, code, expiresAt) {
  const users = readJson('users', [])
  const u = users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
  if (!u) return false
  u.reset_password_code = String(code)
  u.reset_password_expires_at = expiresAt
  writeJson('users', users)
  return true
}

/** Entfernt Reset-Passwort-Code. */
export function clearResetPasswordCode(email) {
  const users = readJson('users', [])
  const u = users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
  if (!u) return false
  u.reset_password_code = null
  u.reset_password_expires_at = null
  writeJson('users', users)
  return true
}

/** Aktualisiert Passwort-Hash (nach Reset). */
export function updateUserPassword(email, passwordHash) {
  const users = readJson('users', [])
  const u = users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
  if (!u) return false
  u.password_hash = passwordHash
  writeJson('users', users)
  return true
}

/** OAuth: Neuen User anlegen (provider_id = z. B. Google sub) */
export function createUserOAuth({ provider, providerId, email, name, avatar }) {
  const users = readJson('users', [])
  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
  users.push({
    id,
    email: (email || '').toLowerCase() || null,
    password_hash: null,
    provider,
    provider_id: String(providerId),
    name: name || null,
    avatar: avatar || null,
    created_at: new Date().toISOString(),
  })
  writeJson('users', users)
  return id
}

export function getData(userId, kind) {
  const data = readJson('user_data', {})
  const raw = data[`${userId}:${kind}`]
  return raw ?? null
}

export function setData(userId, kind, payload) {
  const data = readJson('user_data', {})
  data[`${userId}:${kind}`] = payload
  writeJson('user_data', data)
}
