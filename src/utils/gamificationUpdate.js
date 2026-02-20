/**
 * Zentrale Gamification-Updates: XP vergeben, Streaks, Badges, Daily Challenge.
 * Wird von App bei jeder relevanten Aktion aufgerufen.
 */

import { XP } from '../constants'
import {
  getLevelFromXP,
  checkBadgesEarned,
  getWeekKey,
  generateDailyChallenge,
} from './gamification'

function getDefaultGamification(todayKey) {
  return {
    totalXp: 0,
    badgesEarned: [],
    lastActivityDate: null,
    lastComebackDate: null,
    milestonesReached: [],
    dailyStreak: 0,
    lastWeekKey: null,
    weeklyStreak: 0,
    todayCounts: {},
    dailyChallenges: { date: todayKey, ...generateDailyChallenge(todayKey), completed: false },
  }
}

/** Gibt aktuellen Tages-Kontext für Badge-Check zurück */
function getContext(gamification, progress, todayKey) {
  const counts = gamification.todayCounts?.[todayKey] ?? {}
  const waterGlasses = progress?.date === todayKey ? Math.floor((progress.todayMl ?? 0) / 250) : 0
  const waterMlToday = progress?.date === todayKey ? (progress.todayMl ?? 0) : 0
  return {
    waterGlassesToday: waterGlasses,
    waterMlToday,
    standBreaksToday: counts.standBreaks ?? 0,
    eyeBreaksToday: counts.eyeBreaks ?? 0,
    dailyStreak: gamification.dailyStreak ?? 0,
    weeklyStreak: gamification.weeklyStreak ?? 0,
  }
}

/** Streak aktualisieren bei Aktivität heute */
function updateStreaks(gamification, todayKey) {
  const last = gamification.lastActivityDate
  const today = new Date(todayKey)
  const lastDate = last ? new Date(last) : null
  let dailyStreak = gamification.dailyStreak ?? 0
  let weeklyStreak = gamification.weeklyStreak ?? 0
  const thisWeekKey = getWeekKey(todayKey)

  if (!lastDate) {
    dailyStreak = 1
    weeklyStreak = 1
  } else {
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      // gleicher Tag, Streaks unverändert
    } else if (diffDays === 1) {
      dailyStreak += 1
      const lastWeekKey = getWeekKey(last)
      if (lastWeekKey !== thisWeekKey) {
        const lastWeek = new Date(lastWeekKey)
        const thisWeek = new Date(thisWeekKey)
        const weekDiff = Math.floor((thisWeek - lastWeek) / (1000 * 60 * 60 * 24 * 7))
        weeklyStreak = weekDiff === 1 ? weeklyStreak + 1 : 1
      }
    } else {
      dailyStreak = 1
      weeklyStreak = 1
    }
  }

  return {
    lastActivityDate: todayKey,
    dailyStreak,
    lastWeekKey: thisWeekKey,
    weeklyStreak,
  }
}

/**
 * Nach einer Aktion aufrufen: liefert neues Gamification-State, XP-Plus, neue Badges und ob Level-Up.
 * progressAfterWater: optional, bei action 'water' der Fortschritt nach dem Trinken (für Badge-Check).
 * options.waterGoalMl: optional, Tagesziel in ml für Badge „Hydration Hero“.
 */
export function applyAction(
  gamification,
  progress,
  todayKey,
  action,
  progressAfterWater = null,
  options = {}
) {
  const def = getDefaultGamification(todayKey)
  const g = { ...def, ...gamification }

  if (g.dailyChallenges?.date !== todayKey) {
    g.dailyChallenges = { date: todayKey, ...generateDailyChallenge(todayKey), completed: false }
  }

  let totalXp = g.totalXp ?? 0
  let xpGained = 0
  const todayCounts = { ...(g.todayCounts?.[todayKey] ?? { standBreaks: 0, eyeBreaks: 0 }) }

  const progressForContext =
    action === 'water' && progressAfterWater ? progressAfterWater : progress

  if (action === 'water') {
    totalXp += XP.WATER_GLASS
    xpGained = XP.WATER_GLASS
  } else if (action === 'stand') {
    todayCounts.standBreaks = (todayCounts.standBreaks ?? 0) + 1
    totalXp += XP.MOVEMENT_BREAK
    xpGained = XP.MOVEMENT_BREAK
  } else if (action === 'eye') {
    todayCounts.eyeBreaks = (todayCounts.eyeBreaks ?? 0) + 1
    totalXp += XP.EYE_BREAK
    xpGained = XP.EYE_BREAK
  } else if (action === 'challenge') {
    totalXp += XP.DAILY_CHALLENGE
    xpGained = XP.DAILY_CHALLENGE
    g.dailyChallenges = { ...g.dailyChallenges, completed: true }
  }

  const streaks = updateStreaks(g, todayKey)
  const newCounts = { ...(g.todayCounts ?? {}), [todayKey]: todayCounts }

  const context = {
    ...getContext({ ...g, todayCounts: newCounts }, progressForContext, todayKey),
    standBreaksToday: todayCounts.standBreaks,
    eyeBreaksToday: todayCounts.eyeBreaks,
    dailyStreak: streaks.dailyStreak,
    weeklyStreak: streaks.weeklyStreak,
    challengeCompletedToday: action === 'challenge' || g.dailyChallenges?.completed,
    waterGoalMl: options.waterGoalMl,
  }
  if (action === 'water' && progressForContext) {
    context.waterGlassesToday = Math.floor((progressForContext.todayMl ?? 0) / 250)
    context.waterMlToday = progressForContext.todayMl ?? 0
  }

  const newBadges = checkBadgesEarned(g.badgesEarned ?? [], context)
  const badgesEarned = [...(g.badgesEarned ?? []), ...newBadges]
  const prevLevel = getLevelFromXP(g.totalXp ?? 0).level
  const nextLevel = getLevelFromXP(totalXp).level
  const levelUp = nextLevel > prevLevel

  return {
    gamification: {
      ...g,
      totalXp,
      badgesEarned,
      todayCounts: newCounts,
      dailyChallenges: g.dailyChallenges,
      ...streaks,
    },
    xpGained,
    newBadges,
    levelUp,
    newLevel: nextLevel,
  }
}

/**
 * Initiales Gamification laden oder für neuen Tag anpassen (Streak, Daily Challenge).
 */
export function ensureGamificationState(gamification, todayKey) {
  const def = getDefaultGamification(todayKey)
  const g = gamification ? { ...def, ...gamification } : def

  if (g.dailyChallenges?.date !== todayKey) {
    g.dailyChallenges = { date: todayKey, ...generateDailyChallenge(todayKey), completed: false }
  }

  return g
}
