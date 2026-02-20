import { describe, it, expect, vi } from 'vitest'
import {
  getLevelFromXP,
  checkBadgesEarned,
  updateDailyStreak,
  getWeekKey,
  wasActiveYesterday,
  generateDailyChallenge,
  getChallengeLabel,
} from './gamification'
import { CHALLENGE_TYPES } from '../constants'

vi.mock('../i18n', () => ({ t: (key, vars) => (vars ? `${key}:${JSON.stringify(vars)}` : key) }))

describe('getLevelFromXP', () => {
  it('gibt Level 1 bei 0 XP zurück', () => {
    const result = getLevelFromXP(0)
    expect(result.level).toBe(1)
    expect(result.xpInLevel).toBe(0)
    expect(result.xpNeededForNext).toBe(100)
    expect(result.totalXp).toBe(0)
  })

  it('gibt Level 1 bei 99 XP zurück', () => {
    const result = getLevelFromXP(99)
    expect(result.level).toBe(1)
    expect(result.xpInLevel).toBe(99)
    expect(result.xpNeededForNext).toBe(100)
  })

  it('gibt Level 2 bei 100 XP zurück', () => {
    const result = getLevelFromXP(100)
    expect(result.level).toBe(2)
    expect(result.xpInLevel).toBe(0)
    expect(result.xpNeededForNext).toBe(150)
  })

  it('gibt Level 2 bei 249 XP zurück', () => {
    const result = getLevelFromXP(249)
    expect(result.level).toBe(2)
    expect(result.xpInLevel).toBe(149)
  })

  it('gibt Level 3 bei 250 XP zurück', () => {
    const result = getLevelFromXP(250)
    expect(result.level).toBe(3)
    expect(result.xpInLevel).toBe(0)
  })

  it('berechnet hohe Level korrekt', () => {
    const result = getLevelFromXP(5000)
    expect(result.level).toBe(10)
    expect(result.totalXp).toBe(5000)
  })
})

describe('checkBadgesEarned', () => {
  it('gibt first_sip zurück bei mindestens 1 Glas heute', () => {
    const result = checkBadgesEarned([], { waterGlassesToday: 1 })
    expect(result).toContain('first_sip')
  })

  it('gibt first_sip nicht zurück wenn schon verdient', () => {
    const result = checkBadgesEarned(['first_sip'], { waterGlassesToday: 1 })
    expect(result).not.toContain('first_sip')
  })

  it('gibt hydration_hero zurück bei Tagesziel erreicht', () => {
    const result = checkBadgesEarned([], { waterMlToday: 2000, waterGoalMl: 2000 })
    expect(result).toContain('hydration_hero')
  })

  it('gibt water_5 zurück bei 5 Gläsern', () => {
    const result = checkBadgesEarned([], { waterGlassesToday: 5 })
    expect(result).toContain('water_5')
  })

  it('gibt first_break und break_master bei Pausen zurück', () => {
    const result = checkBadgesEarned([], { standBreaksToday: 5 })
    expect(result).toContain('first_break')
    expect(result).toContain('break_master')
  })

  it('gibt eye_care und focus_champion bei Augenpausen zurück', () => {
    const result = checkBadgesEarned([], { eyeBreaksToday: 3 })
    expect(result).toContain('eye_care')
    expect(result).toContain('focus_champion')
  })

  it('gibt streak_3 und streak_7 bei Daily-Streak zurück', () => {
    const result = checkBadgesEarned([], { dailyStreak: 7 })
    expect(result).toContain('streak_3')
    expect(result).toContain('streak_7')
  })

  it('gibt streak_week bei Weekly-Streak zurück', () => {
    const result = checkBadgesEarned([], { weeklyStreak: 1 })
    expect(result).toContain('streak_week')
  })

  it('gibt challenge_daily bei abgeschlossener Challenge zurück', () => {
    const result = checkBadgesEarned([], { challengeCompletedToday: true })
    expect(result).toContain('challenge_daily')
  })

  it('gibt leeres Array zurück wenn kein Kontext erfüllt', () => {
    const result = checkBadgesEarned([], {})
    expect(result).toEqual([])
  })
})

describe('updateDailyStreak', () => {
  it('gibt 1 zurück wenn keine letzte Aktivität', () => {
    expect(updateDailyStreak(null, 'Mon Jan 01 2024')).toBe(1)
  })

  it('gibt null zurück bei gleichem Tag (Streak unverändert)', () => {
    expect(updateDailyStreak('Mon Jan 01 2024', 'Mon Jan 01 2024')).toBe(null)
  })

  it('gibt null zurück bei gestern (Aufrufer addiert +1)', () => {
    expect(updateDailyStreak('Sun Dec 31 2023', 'Mon Jan 01 2024')).toBe(null)
  })

  it('gibt 1 zurück bei Lücke (Streak-Reset)', () => {
    expect(updateDailyStreak('Sat Dec 30 2023', 'Mon Jan 01 2024')).toBe(1)
  })
})

describe('getWeekKey', () => {
  it('gibt gleichen Key für Tage in derselben Woche zurück', () => {
    const mon = getWeekKey('Mon Jan 08 2024')
    const wed = getWeekKey('Wed Jan 10 2024')
    expect(mon).toBe(wed)
  })

  it('gibt Montag-Datum als Key zurück', () => {
    const key = getWeekKey('Wed Jan 10 2024')
    expect(key).toMatch(/Mon/)
  })
})

describe('wasActiveYesterday', () => {
  it('gibt Vortags-Datum zurück', () => {
    const yesterday = wasActiveYesterday('Tue Jan 02 2024')
    expect(yesterday).toBe('Mon Jan 01 2024')
  })
})

describe('generateDailyChallenge', () => {
  it('gibt type und target zurück', () => {
    const result = generateDailyChallenge('Mon Jan 01 2024')
    expect(result).toHaveProperty('type')
    expect(result).toHaveProperty('target')
    expect(typeof result.target).toBe('number')
  })

  it('ist deterministisch für gleiches Datum', () => {
    const a = generateDailyChallenge('Mon Jan 15 2024')
    const b = generateDailyChallenge('Mon Jan 15 2024')
    expect(a).toEqual(b)
  })

  it('nutzt gültige Challenge-Typen', () => {
    const types = Object.values(CHALLENGE_TYPES)
    for (let i = 0; i < 20; i++) {
      const result = generateDailyChallenge(`Mon Jan ${1 + i} 2024`)
      expect(types).toContain(result.type)
    }
  })

  it('setzt sinnvolle Ziele für WATER_2L und andere Typen', () => {
    const result = generateDailyChallenge('Mon Jan 01 2024')
    if (result.type === CHALLENGE_TYPES.WATER_2L) {
      expect(result.target).toBe(2000)
    } else if (result.type === CHALLENGE_TYPES.WATER_GLASSES) {
      expect([4, 6, 8]).toContain(result.target)
    } else if (result.type === CHALLENGE_TYPES.MOVEMENT_BREAKS) {
      expect([3, 5, 7]).toContain(result.target)
    } else if (result.type === CHALLENGE_TYPES.EYE_BREAKS) {
      expect([2, 3, 4]).toContain(result.target)
    }
  })
})

describe('getChallengeLabel', () => {
  it('gibt String für WATER_2L zurück', () => {
    const label = getChallengeLabel(CHALLENGE_TYPES.WATER_2L, 2000)
    expect(typeof label).toBe('string')
    expect(label).toContain('2')
  })

  it('gibt String für WATER_GLASSES mit count zurück', () => {
    const label = getChallengeLabel(CHALLENGE_TYPES.WATER_GLASSES, 6)
    expect(typeof label).toBe('string')
    expect(label).toContain('6')
  })

  it('gibt String für MOVEMENT_BREAKS zurück', () => {
    const label = getChallengeLabel(CHALLENGE_TYPES.MOVEMENT_BREAKS, 5)
    expect(typeof label).toBe('string')
  })

  it('gibt String für EYE_BREAKS zurück', () => {
    const label = getChallengeLabel(CHALLENGE_TYPES.EYE_BREAKS, 3)
    expect(typeof label).toBe('string')
  })
})
