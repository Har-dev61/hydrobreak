/**
 * HydroBreak – Konstanten für Intervalle, Limits und motivierende Nachrichten
 */

// Wasser-Erinnerung: Min/Max-Intervall in Minuten
export const WATER_INTERVAL_MIN = 15
export const WATER_INTERVAL_MAX = 120
export const WATER_INTERVAL_DEFAULT = 45

// Tagesziel Wasser in Millilitern (2 Liter Standard)
export const WATER_GOAL_ML = 2000
// Optionen für Onboarding (Wasserziel) – Labels über i18n (waterGoalOptions)
export const WATER_GOAL_OPTIONS = [{ ml: 1500 }, { ml: 2000 }, { ml: 2500 }]
// Standard-Glas in ml (für "Drink Now")
export const WATER_GLASS_ML = 250

// Sitz-Pause: Standard nach 60 Minuten
export const STAND_UP_INTERVAL_DEFAULT = 60

// 20-20-20 Regel: 20 Sekunden Pause
export const EYE_BREAK_DURATION = 20
export const EYE_BREAK_INTERVAL_DEFAULT = 20 // alle 20 Min Augenpause anbieten

// Snooze: Erinnerung um X Minuten verschieben
export const SNOOZE_MINUTES = 10

// Fokus-Session: manuell startbarer Timer (z. B. 25 Min), danach Pause vorschlagen
export const FOCUS_SESSION_DURATION_DEFAULT = 25 // Minuten
export const FOCUS_SESSION_OPTIONS = [15, 25, 45] // Minuten

// API (Backend): VITE_API_URL setzen, wenn Frontend und Backend getrennt deployt werden.
// Wenn nicht gesetzt und Production-Build: gleiche Origin (Backend liefert auch Frontend).
const envUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_URL : undefined
export const API_BASE_URL =
  envUrl != null && String(envUrl).trim() !== ''
    ? String(envUrl).trim()
    : typeof import.meta !== 'undefined' && import.meta.env?.PROD
      ? ''
      : 'http://localhost:3001'

// App version (für „Was ist neu?“-Modal)
export const APP_VERSION = '2.0.0'

// Max. Aufbewahrung von Tagesdaten (Stats, Gamification) in Tagen
export const MAX_STORAGE_DAYS = 90

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hydrobreak_token',
  AUTH_USER: 'hydrobreak_user',
  SETTINGS: 'hydrobreak_settings',
  PROGRESS: 'hydrobreak_progress',
  STATS: 'hydrobreak_stats',
  THEME: 'hydrobreak_theme',
  GAMIFICATION: 'hydrobreak_gamification',
  ONBOARDING_DONE: 'hydrobreak_onboarding_done',
  LAST_SEEN_VERSION: 'hydrobreak_last_seen_version',
  DAILY_CONTEXT: 'hydrobreak_daily_context',
}

/** Kontext für AI-Insights: Standort */
export const LOCATION_CONTEXT = {
  HOME: 'home',
  OFFICE: 'office',
  OTHER: 'other',
  UNKNOWN: 'unknown',
}

/** Kontext für AI-Insights: Aktivitätslevel */
export const ACTIVITY_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

// ——— Gamification ———
export const XP = {
  WATER_GLASS: 10,
  MOVEMENT_BREAK: 15,
  EYE_BREAK: 15,
  DAILY_CHALLENGE: 50,
}

/** XP pro Level (kumuliert): Level 1 = 0–99, Level 2 = 100–249, … */
export const XP_PER_LEVEL = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 6500, 8500, 11000, 14000, 18000,
]

// Badge-IDs, Icons und Kategorie – name/desc über i18n (badges.<id>)
export const BADGES = [
  { id: 'first_sip', icon: 'Droplets', category: 'water' },
  { id: 'hydration_hero', icon: 'Trophy', category: 'water' },
  { id: 'water_5', icon: 'Droplets', category: 'water' },
  { id: 'break_master', icon: 'Zap', category: 'stand' },
  { id: 'first_break', icon: 'Move', category: 'stand' },
  { id: 'focus_champion', icon: 'Eye', category: 'eye' },
  { id: 'eye_care', icon: 'Eye', category: 'eye' },
  { id: 'streak_3', icon: 'Flame', category: 'streak' },
  { id: 'streak_7', icon: 'Flame', category: 'streak' },
  { id: 'streak_week', icon: 'Calendar', category: 'streak' },
  { id: 'challenge_daily', icon: 'Target', category: 'challenge' },
  { id: 'comeback', icon: 'RotateCcw', category: 'streak' },
]

/** Comeback: nach X Tagen Inaktivität Willkommen-zurück + Bonus */
export const COMEBACK_INACTIVE_DAYS = 3
export const COMEBACK_BONUS_XP = 20

/** Meilensteine: { id, type, target, unit } – target in ml (water) oder Anzahl (breaks) */
export const MILESTONES = [
  { id: 'milestone_water_50', type: 'water', target: 50 * 1000, unit: 'L' },
  { id: 'milestone_water_100', type: 'water', target: 100 * 1000, unit: 'L' },
  { id: 'milestone_water_250', type: 'water', target: 250 * 1000, unit: 'L' },
  { id: 'milestone_eye_25', type: 'eyeBreaks', target: 25, unit: '' },
  { id: 'milestone_eye_50', type: 'eyeBreaks', target: 50, unit: '' },
  { id: 'milestone_eye_100', type: 'eyeBreaks', target: 100, unit: '' },
  { id: 'milestone_stand_25', type: 'standBreaks', target: 25, unit: '' },
  { id: 'milestone_stand_50', type: 'standBreaks', target: 50, unit: '' },
  { id: 'milestone_stand_100', type: 'standBreaks', target: 100, unit: '' },
]

/** Typen für tägliche Challenges */
export const CHALLENGE_TYPES = {
  WATER_2L: 'water_2l',
  WATER_GLASSES: 'water_glasses',
  MOVEMENT_BREAKS: 'movement_breaks',
  EYE_BREAKS: 'eye_breaks',
}

// Motivierende Nachrichten → i18n tArray('messages.water'|'messages.stand'|'messages.eye')
