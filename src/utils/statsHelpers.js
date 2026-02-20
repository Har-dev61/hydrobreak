/**
 * Hilfen für Wochenrückblick, Heatmap, Meilensteine und Comeback-Erkennung.
 */

import { getWeekKey } from './gamification'
import { COMEBACK_INACTIVE_DAYS, MILESTONES } from '../constants'

const MS_PER_DAY = 1000 * 60 * 60 * 24

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
 * Aggregat für eine Kalenderwoche (Montag–Sonntag).
 * @param {{ daily: Array<{date: string, ml: number}> }} stats
 * @param {{ todayCounts: Record<string, {standBreaks?: number, eyeBreaks?: number}> }} gamification
 * @param {{ date: string, todayMl: number }} progress – nur für „heute“ relevant
 * @param {string} weekKey – Montag-Datum der Woche (toDateString())
 * @param {string} todayKey
 */
export function getWeekSummary(stats, gamification, progress, weekKey, todayKey) {
  const keys = getWeekDateKeys(weekKey)
  let glasses = 0
  let standBreaks = 0
  let eyeBreaks = 0
  const dailyByDate = Object.fromEntries((stats.daily || []).map((d) => [d.date, d.ml]))
  const counts = gamification.todayCounts || {}

  for (const dateKey of keys) {
    const ml = dateKey === todayKey ? (progress?.todayMl ?? 0) : (dailyByDate[dateKey] ?? 0)
    glasses += Math.floor(ml / 250)
    standBreaks += counts[dateKey]?.standBreaks ?? 0
    eyeBreaks += counts[dateKey]?.eyeBreaks ?? 0
  }

  return { glasses, standBreaks, eyeBreaks, totalPauses: standBreaks + eyeBreaks }
}

/**
 * Diese Woche + Vorwoche für Anzeige.
 */
export function getWeeklySummaries(stats, gamification, progress, todayKey) {
  const thisWeekKey = getWeekKey(todayKey)
  const thisMonday = new Date(thisWeekKey)
  const prevMonday = new Date(thisMonday)
  prevMonday.setDate(prevMonday.getDate() - 7)
  const prevWeekKey = prevMonday.toDateString()

  return {
    thisWeek: getWeekSummary(stats, gamification, progress, thisWeekKey, todayKey),
    prevWeek: getWeekSummary(stats, gamification, progress, prevWeekKey, todayKey),
    thisWeekKey,
    prevWeekKey,
  }
}

/**
 * Heatmap: letzte N Wochen, pro Tag { date, ml, standBreaks, eyeBreaks, activityScore }.
 * activityScore 0–4 für Farbe (0 = nichts, 4 = viel).
 */
export function getHeatmapData(stats, gamification, progress, todayKey, numWeeks = 12) {
  const dailyByDate = Object.fromEntries((stats.daily || []).map((d) => [d.date, d.ml]))
  const counts = gamification.todayCounts || {}
  const today = new Date(todayKey)
  const cells = []
  const start = new Date(today)
  start.setDate(start.getDate() - numWeeks * 7)

  for (let i = 0; i < numWeeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dateKey = d.toDateString()
    const ml = dateKey === todayKey ? (progress?.todayMl ?? 0) : (dailyByDate[dateKey] ?? 0)
    const stand = counts[dateKey]?.standBreaks ?? 0
    const eye = counts[dateKey]?.eyeBreaks ?? 0
    const glasses = Math.floor(ml / 250)
    const activityScore = Math.min(4, Math.floor((glasses + stand + eye) / 2))
    cells.push({ date: dateKey, ml, standBreaks: stand, eyeBreaks: eye, glasses, activityScore })
  }

  return cells
}

/**
 * Gesamtwerte (alle Zeiten) für Meilensteine.
 */
export function getTotals(stats, gamification, progress, todayKey) {
  const dailyByDate = Object.fromEntries((stats.daily || []).map((d) => [d.date, d.ml]))
  const counts = gamification.todayCounts || {}
  let totalLiters = 0
  let totalStandBreaks = 0
  let totalEyeBreaks = 0

  const allDates = new Set([
    ...Object.keys(dailyByDate),
    ...Object.keys(counts),
    todayKey,
  ])
  for (const dateKey of allDates) {
    const ml = dateKey === todayKey ? (progress?.todayMl ?? 0) : (dailyByDate[dateKey] ?? 0)
    totalLiters += ml
    totalStandBreaks += counts[dateKey]?.standBreaks ?? 0
    totalEyeBreaks += counts[dateKey]?.eyeBreaks ?? 0
  }

  return {
    totalLiters,
    totalStandBreaks,
    totalEyeBreaks,
  }
}

/**
 * Welche Meilensteine sind neu erreicht? Gibt Array von { id, target, unit } zurück.
 */
export function getNewMilestones(totals, alreadyReached = []) {
  const reached = []
  const totalByType = {
    water: totals.totalLiters,
    eyeBreaks: totals.totalEyeBreaks,
    standBreaks: totals.totalStandBreaks,
  }
  for (const m of MILESTONES) {
    if (alreadyReached.includes(m.id)) continue
    const value = totalByType[m.type]
    if (value >= m.target) reached.push({ id: m.id, target: m.target, unit: m.unit, type: m.type })
  }
  return reached
}

/**
 * Comeback: war Nutzer mindestens COMEBACK_INACTIVE_DAYS inaktiv?
 * Zeige nur einmal pro Rückkehr (lastComebackDate === today).
 */
export function checkComeback(gamification, todayKey) {
  const last = gamification.lastActivityDate
  const lastComeback = gamification.lastComebackDate || null
  if (!last) return { show: false, inactiveDays: 0 }
  const today = new Date(todayKey)
  const lastDate = new Date(last)
  const inactiveDays = Math.floor((today - lastDate) / MS_PER_DAY)
  const alreadyShownThisVisit = lastComeback === todayKey
  const show =
    inactiveDays >= COMEBACK_INACTIVE_DAYS && !alreadyShownThisVisit
  return { show, inactiveDays }
}
