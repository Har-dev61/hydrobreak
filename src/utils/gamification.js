/**
 * Gamification-Logik: Level aus XP, Streak-Berechnung, Badge-Checks, Challenge-Fortschritt
 */

import { XP_PER_LEVEL, WATER_GOAL_ML, CHALLENGE_TYPES } from '../constants'
import { t } from '../i18n'

/** Gibt aktuelles Level (1-basiert) und XP innerhalb des Levels zurück */
export function getLevelFromXP(totalXp) {
  let level = 1
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (totalXp >= XP_PER_LEVEL[i]) {
      level = i + 1
      break
    }
  }
  const xpInLevel = totalXp - (XP_PER_LEVEL[level - 1] ?? 0)
  const xpNeededForNext =
    (XP_PER_LEVEL[level] ?? XP_PER_LEVEL[level - 1] + 1000) - (XP_PER_LEVEL[level - 1] ?? 0)
  return { level, xpInLevel, xpNeededForNext, totalXp }
}

/** Prüft, ob ein neues Badge verdient wurde; gibt Array von Badge-Ids zurück */
export function checkBadgesEarned(alreadyEarned, context) {
  const earned = []
  const {
    waterGlassesToday = 0,
    waterMlToday = 0,
    standBreaksToday = 0,
    eyeBreaksToday = 0,
    dailyStreak = 0,
    weeklyStreak = 0,
    challengeCompletedToday = false,
    waterGoalMl: goalMl,
  } = context
  const goal = goalMl ?? WATER_GOAL_ML

  const badgesToCheck = [
    { id: 'challenge_daily', condition: challengeCompletedToday },
    { id: 'first_sip', condition: waterGlassesToday >= 1 },
    { id: 'hydration_hero', condition: waterMlToday >= goal },
    { id: 'water_5', condition: waterGlassesToday >= 5 },
    { id: 'break_master', condition: standBreaksToday >= 5 },
    { id: 'first_break', condition: standBreaksToday >= 1 },
    { id: 'focus_champion', condition: eyeBreaksToday >= 3 },
    { id: 'eye_care', condition: eyeBreaksToday >= 1 },
    { id: 'streak_3', condition: dailyStreak >= 3 },
    { id: 'streak_7', condition: dailyStreak >= 7 },
    { id: 'streak_week', condition: weeklyStreak >= 1 },
  ]

  for (const { id, condition } of badgesToCheck) {
    if (condition && !alreadyEarned.includes(id)) earned.push(id)
  }
  return earned
}

/** Aktualisiert Daily-Streak: lastActivityDate (YYYY-MM-DD oder dateString), gibt neue Streak-Länge zurück */
export function updateDailyStreak(lastActivityDate, todayKey) {
  if (!lastActivityDate) return 1
  const last = new Date(lastActivityDate)
  const today = new Date(todayKey)
  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return null // gleicher Tag, Streak unverändert
  if (diffDays === 1) return null // Aufrufer soll aktuellen Streak + 1 machen
  return 1 // Lücke → Streak auf 1
}

/** Wochen-Key für Weekly-Streak (Montag als Start) */
export function getWeekKey(dateKey) {
  const d = new Date(dateKey)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  return monday.toDateString()
}

/** Prüft ob gestern aktiv war (für Streak-Update) */
export function wasActiveYesterday(todayKey) {
  const today = new Date(todayKey)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toDateString()
}

/** Erzeugt eine zufällige tägliche Challenge basierend auf Datum (deterministisch pro Tag) */
export function generateDailyChallenge(dateKey) {
  const hash = dateKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const types = [
    CHALLENGE_TYPES.WATER_2L,
    CHALLENGE_TYPES.WATER_GLASSES,
    CHALLENGE_TYPES.MOVEMENT_BREAKS,
    CHALLENGE_TYPES.EYE_BREAKS,
  ]
  const type = types[hash % types.length]
  const r = Math.abs(hash) % 3
  let target = 1
  if (type === CHALLENGE_TYPES.WATER_2L) target = 2000
  else if (type === CHALLENGE_TYPES.WATER_GLASSES) target = [4, 6, 8][r]
  else if (type === CHALLENGE_TYPES.MOVEMENT_BREAKS) target = [3, 5, 7][r]
  else if (type === CHALLENGE_TYPES.EYE_BREAKS) target = [2, 3, 4][r]
  return { type, target }
}

export function getChallengeLabel(type, target) {
  if (type === CHALLENGE_TYPES.WATER_2L)
    return t('challenge.drinkLiters', { liters: (target / 1000).toFixed(1) })
  if (type === CHALLENGE_TYPES.WATER_GLASSES) return t('challenge.waterGlasses', { count: target })
  if (type === CHALLENGE_TYPES.MOVEMENT_BREAKS)
    return t('challenge.movementBreaks', { count: target })
  if (type === CHALLENGE_TYPES.EYE_BREAKS) return t('challenge.eyeBreaks', { count: target })
  return t('challenge.progressCount', { current: target, target })
}
