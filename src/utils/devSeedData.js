/**
 * Nur für Entwicklung: Füllt Stats und Gamification mit Testdaten,
 * damit Heatmap und Statistik-Modal sichtbar getestet werden können.
 * In der Konsole: __hydrobreakSeedDevData() dann ggf. Seite neu laden.
 */

import { setStoredStats, setStoredGamification, getStoredGamification } from './storage'

const NUM_DAYS = 12 * 7 // 12 Wochen für Heatmap

/** Pseudozufall pro Tag (deterministisch aus dateKey) */
function seeded(dateKey) {
  const h = dateKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return () => (h * 9301 + 49297) % 233280 / 233280
}

/**
 * Legt Demo-Stats (daily mit ml) und Gamification (todayCounts mit standBreaks, eyeBreaks)
 * für die letzten 12 Wochen an. Heute wird nicht überschrieben.
 */
export function seedDevStatsAndGamification() {
  const today = new Date()
  const todayKey = today.toDateString()
  const daily = []
  const todayCounts = {}

  for (let i = NUM_DAYS - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateKey = d.toDateString()
    const r = seeded(dateKey)()
    const ml = Math.round(500 + r * 2000) // 500–2500 ml
    daily.push({ date: dateKey, ml })

    // Einige Tage mit Pausen für Heatmap-Farben
    todayCounts[dateKey] = {
      standBreaks: r > 0.5 ? Math.floor(1 + r * 3) : 0,
      eyeBreaks: r > 0.3 ? Math.floor(1 + r * 2) : 0,
    }
  }

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)
  const weeklyTotal = daily
    .filter((entry) => new Date(entry.date) >= weekStart)
    .reduce((sum, entry) => sum + entry.ml, 0)

  setStoredStats({ daily, weeklyTotal })

  const existing = getStoredGamification(null) || {}
  setStoredGamification({
    ...existing,
    todayCounts: { ...todayCounts, ...(existing.todayCounts || {}) },
  })

  return { daily: daily.length, todayCounts: Object.keys(todayCounts).length }
}
