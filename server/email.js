/**
 * E-Mail-Versand für Verifizierungscodes.
 * Wenn SMTP nicht konfiguriert ist, wird der Code nur in die Konsole geloggt (z. B. für lokale Entwicklung).
 */
import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@hydrobreak.local'

const transporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
    : null

const APP_NAME = process.env.APP_NAME || 'HydroBreak'

/**
 * Sendet den Verifizierungscode an die E-Mail-Adresse.
 * Bei fehlender SMTP-Konfiguration wird der Code nur geloggt.
 */
export async function sendVerificationEmail(email, code) {
  const subject = `${APP_NAME} – Dein Bestätigungscode`
  const html = `
    <p>Hallo,</p>
    <p>dein Bestätigungscode lautet:</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p>
    <p>Der Code ist 15 Minuten gültig.</p>
    <p>Falls du dich nicht registriert hast, ignoriere diese E-Mail.</p>
    <p>– ${APP_NAME}</p>
  `.trim()

  if (transporter) {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject,
      html,
      text: `Dein Bestätigungscode: ${code}. Der Code ist 15 Minuten gültig.`,
    })
    return
  }

  console.log(`[${APP_NAME}] Kein SMTP konfiguriert – Verifizierungscode für ${email}: ${code}`)
}

/**
 * Sendet den Passwort-Reset-Code an die E-Mail-Adresse.
 */
export async function sendPasswordResetEmail(email, code) {
  const subject = `${APP_NAME} – Passwort zurücksetzen`
  const html = `
    <p>Hallo,</p>
    <p>du hast angefordert, dein Passwort zurückzusetzen. Dein Code lautet:</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p>
    <p>Der Code ist 15 Minuten gültig.</p>
    <p>Falls du das nicht warst, ignoriere diese E-Mail. Dein Passwort bleibt unverändert.</p>
    <p>– ${APP_NAME}</p>
  `.trim()

  if (transporter) {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject,
      html,
      text: `Passwort zurücksetzen – Dein Code: ${code}. Der Code ist 15 Minuten gültig.`,
    })
    return
  }

  console.log(`[${APP_NAME}] Kein SMTP konfiguriert – Passwort-Reset-Code für ${email}: ${code}`)
}
