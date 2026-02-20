import { describe, it, expect } from 'vitest'
import { applyAction, ensureGamificationState } from './gamificationUpdate'
import { XP, WATER_GOAL_ML } from '../constants'

describe('applyAction', () => {
  const todayKey = 'Mon Jan 15 2024'
  const baseGamification = {
    totalXp: 0,
    badgesEarned: [],
    lastActivityDate: null,
    dailyStreak: 0,
    weeklyStreak: 0,
    todayCounts: {},
  }
  const baseProgress = { date: todayKey, todayMl: 0 }

  it('verleiht XP für Wasser-Aktion', () => {
    const result = applyAction(baseGamification, baseProgress, todayKey, 'water', null, {})
    expect(result.xpGained).toBe(XP.WATER_GLASS)
    expect(result.gamification.totalXp).toBe(XP.WATER_GLASS)
  })

  it('verleiht XP für Bewegungs-Pause', () => {
    const result = applyAction(baseGamification, baseProgress, todayKey, 'stand', null, {})
    expect(result.xpGained).toBe(XP.MOVEMENT_BREAK)
    expect(result.gamification.totalXp).toBe(XP.MOVEMENT_BREAK)
    expect(result.gamification.todayCounts[todayKey].standBreaks).toBe(1)
  })

  it('verleiht XP für Augenpause', () => {
    const result = applyAction(baseGamification, baseProgress, todayKey, 'eye', null, {})
    expect(result.xpGained).toBe(XP.EYE_BREAK)
    expect(result.gamification.todayCounts[todayKey].eyeBreaks).toBe(1)
  })

  it('verleiht 50 XP für Daily Challenge und markiert als erledigt', () => {
    const g = {
      ...baseGamification,
      dailyChallenges: { date: todayKey, type: 'water_2l', target: 2000, completed: false },
    }
    const result = applyAction(g, baseProgress, todayKey, 'challenge', null, {})
    expect(result.xpGained).toBe(XP.DAILY_CHALLENGE)
    expect(result.gamification.totalXp).toBe(XP.DAILY_CHALLENGE)
    expect(result.gamification.dailyChallenges.completed).toBe(true)
  })

  it('setzt dailyStreak auf 1 bei erster Aktivität', () => {
    const result = applyAction(baseGamification, baseProgress, todayKey, 'water', null, {})
    expect(result.gamification.dailyStreak).toBe(1)
    expect(result.gamification.lastActivityDate).toBe(todayKey)
  })

  it('erkennt Level-Up bei genug XP', () => {
    const g = { ...baseGamification, totalXp: 99 }
    const result = applyAction(g, baseProgress, todayKey, 'water', null, {})
    expect(result.levelUp).toBe(true)
    expect(result.newLevel).toBe(2)
  })

  it('gibt newBadges zurück wenn Badge verdient', () => {
    const progressAfter = { date: todayKey, todayMl: 250 }
    const result = applyAction(baseGamification, baseProgress, todayKey, 'water', progressAfter, {
      waterGoalMl: WATER_GOAL_ML,
    })
    expect(result.newBadges).toContain('first_sip')
    expect(result.gamification.badgesEarned).toContain('first_sip')
  })

  it('addiert auf bestehende todayCounts', () => {
    const g = {
      ...baseGamification,
      todayCounts: { [todayKey]: { standBreaks: 2, eyeBreaks: 1 } },
    }
    const result = applyAction(g, baseProgress, todayKey, 'stand', null, {})
    expect(result.gamification.todayCounts[todayKey].standBreaks).toBe(3)
    expect(result.gamification.todayCounts[todayKey].eyeBreaks).toBe(1)
  })
})

describe('ensureGamificationState', () => {
  const todayKey = 'Mon Jan 15 2024'

  it('gibt Default-State zurück bei null/undefined', () => {
    const result = ensureGamificationState(null, todayKey)
    expect(result.totalXp).toBe(0)
    expect(result.badgesEarned).toEqual([])
    expect(result.dailyChallenges).toBeDefined()
    expect(result.dailyChallenges.date).toBe(todayKey)
  })

  it('behält bestehende Daten und setzt Daily Challenge für neuen Tag', () => {
    const existing = {
      totalXp: 100,
      badgesEarned: ['first_sip'],
      dailyChallenges: {
        date: 'Sun Jan 14 2024',
        type: 'water_glasses',
        target: 4,
        completed: true,
      },
    }
    const result = ensureGamificationState(existing, todayKey)
    expect(result.totalXp).toBe(100)
    expect(result.badgesEarned).toEqual(['first_sip'])
    expect(result.dailyChallenges.date).toBe(todayKey)
    expect(result.dailyChallenges.completed).toBe(false)
  })

  it('behält dailyChallenges wenn gleicher Tag', () => {
    const existing = {
      dailyChallenges: { date: todayKey, type: 'water_2l', target: 2000, completed: false },
    }
    const result = ensureGamificationState(existing, todayKey)
    expect(result.dailyChallenges.date).toBe(todayKey)
    expect(result.dailyChallenges.type).toBe('water_2l')
  })
})
