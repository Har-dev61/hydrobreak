/**
 * Aktivitäts-Score für diese Woche (Montag bis heute): Gläser + Pausen + Streak-Bonus.
 * Für Leaderboard-Perzentil (niedrig = besser).
 */

/** Montag der Woche zu dateKey (toDateString()) */
export function getWeekKey(dateKey) {
  const d = new Date(dateKey)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  return monday.toDateString()
}

/** Alle Datum-Keys (toDateString()) einer Woche, Montag–Sonntag */
export function getWeekDateKeys(weekKey) {
  const monday = new Date(weekKey)
  const keys = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    keys.push(d.toDateString())
  }
  return keys
}

/**
 * Berechnet Aktivitäts-Score für die aktuelle Woche (nur Tage bis heute).
 * @param {{ date?: string, todayMl?: number }} progress
 * @param {{ daily?: Array<{date: string, ml: number}> }} stats
 * @param {{ todayCounts?: Record<string, {standBreaks?: number, eyeBreaks?: number}>, weeklyStreak?: number }} gamification
 * @param {string} todayKey – heute als toDateString()
 * @returns {number}
 */
export function computeWeekActivityScore(progress, stats, gamification, todayKey) {
  const thisWeekKey = getWeekKey(todayKey)
  const weekKeys = getWeekDateKeys(thisWeekKey).filter((d) => d <= todayKey)
  const dailyByDate = Object.fromEntries((stats?.daily || []).map((d) => [d.date, d.ml]))
  const counts = gamification?.todayCounts || {}

  let glasses = 0
  let standBreaks = 0
  let eyeBreaks = 0
  for (const dateKey of weekKeys) {
    const ml = dateKey === todayKey ? (progress?.todayMl ?? 0) : (dailyByDate[dateKey] ?? 0)
    glasses += Math.floor(ml / 250)
    standBreaks += counts[dateKey]?.standBreaks ?? 0
    eyeBreaks += counts[dateKey]?.eyeBreaks ?? 0
  }

  const weeklyStreak = gamification?.weeklyStreak ?? 0
  const streakBonus = Math.min(weeklyStreak * 5, 25)
  return glasses + standBreaks + eyeBreaks + streakBonus
}
