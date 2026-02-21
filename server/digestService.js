/**
 * Wochen-Digest: Sonntag Abend E-Mail mit Liter, Pausen, Streak, Badges.
 * Nur für Nutzer mit E-Mail-Login und aktivierter Option „Wochen-Zusammenfassung per E-Mail“.
 */
import { getAllUserIds, getData } from './db.js'
import { getUserByIdForPush } from './db.js'
import { getWeekKey, getWeekDateKeys } from './utils/weekScore.js'
import { sendWeeklyDigest } from './email.js'

export async function runWeeklyDigest() {
  const todayKey = new Date().toDateString()
  const weekKey = getWeekKey(todayKey)
  const weekKeys = getWeekDateKeys(weekKey).filter((d) => d <= todayKey)

  const userIds = getAllUserIds()
  let sent = 0
  for (const userId of userIds) {
    const user = getUserByIdForPush(userId)
    if (!user || !user.email) continue
    const settings = getData(userId, 'settings') || {}
    if (!settings.emailDigestEnabled) continue

    const progress = getData(userId, 'progress')
    const stats = getData(userId, 'stats')
    const gamification = getData(userId, 'gamification')
    const dailyByDate = Object.fromEntries((stats?.daily || []).map((d) => [d.date, d.ml]))
    const counts = gamification?.todayCounts || {}

    let totalMl = 0
    let pauses = 0
    for (const dateKey of weekKeys) {
      const ml = dateKey === todayKey ? (progress?.todayMl ?? 0) : (dailyByDate[dateKey] ?? 0)
      totalMl += ml
      pauses += counts[dateKey]?.standBreaks ?? 0
      pauses += counts[dateKey]?.eyeBreaks ?? 0
    }
    const liters = (totalMl / 1000).toFixed(1)
    const weeklyStreak = gamification?.weeklyStreak ?? 0
    const badges = gamification?.badgesEarned ?? []
    const monday = new Date(weekKey)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    const weekRangeLabel = `${monday.getDate()}. – ${sunday.getDate()}. ${monday.toLocaleDateString('de-DE', { month: 'long' })} ${monday.getFullYear()}`

    try {
      await sendWeeklyDigest(user.email, {
        liters,
        pauses,
        streak: weeklyStreak,
        badges,
        weekRangeLabel,
      })
      sent++
    } catch (err) {
      console.error(`[Digest] Fehler bei User ${userId}:`, err.message)
    }
  }
  if (sent > 0) console.log(`[Digest] ${sent} Wochen-Zusammenfassung(en) versendet.`)
  return sent
}
