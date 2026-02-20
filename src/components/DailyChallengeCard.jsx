import React from 'react'
import { Target, CheckCircle2, Sparkles } from 'lucide-react'
import { getChallengeLabel } from '../utils/gamification'
import { CHALLENGE_TYPES } from '../constants'
import { WATER_GOAL_ML } from '../constants'
import { t } from '../i18n'

/**
 * Zeigt die heutige Daily Challenge, Fortschritt und Abschluss (mit Belohnung +50 XP).
 */
export default function DailyChallengeCard({
  challenge,
  waterGoalMl = WATER_GOAL_ML,
  waterMlToday,
  waterGlassesToday,
  standBreaksToday,
  eyeBreaksToday,
  completed,
  onComplete,
}) {
  if (!challenge) return null

  const { type, target } = challenge
  let current = 0
  if (type === CHALLENGE_TYPES.WATER_2L) current = waterMlToday
  else if (type === CHALLENGE_TYPES.WATER_GLASSES) current = waterGlassesToday
  else if (type === CHALLENGE_TYPES.MOVEMENT_BREAKS) current = standBreaksToday
  else if (type === CHALLENGE_TYPES.EYE_BREAKS) current = eyeBreaksToday

  const isDone = type === CHALLENGE_TYPES.WATER_2L ? current >= waterGoalMl : current >= target
  const displayCurrent = type === CHALLENGE_TYPES.WATER_2L ? current : current
  const displayTarget = type === CHALLENGE_TYPES.WATER_2L ? waterGoalMl : target
  const percent = displayTarget > 0 ? Math.min(100, (displayCurrent / displayTarget) * 100) : 0
  const noProgressYet = !completed && percent === 0

  return (
    <div
      className="card p-4 animate-slide-up"
      role="region"
      aria-label={t('challenge.daily')}
    >
      {noProgressYet && (
        <div className="mb-3 rounded-input bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">{t('emptyStates.firstChallenge')}</p>
              <p className="text-xs text-emerald-700/90 dark:text-emerald-300/90 mt-0.5">{t('emptyStates.firstChallengeCta')}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--app-primary)]">
          <Target className="w-4 h-4 text-emerald-500" />
          {t('challenge.daily')}
        </span>
        {completed ? (
          <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            {t('challenge.claimXp')}
          </span>
        ) : null}
      </div>
      <p className="text-sm text-app-muted-foreground mb-3">
        {type === CHALLENGE_TYPES.WATER_2L
          ? t('challenge.drinkLiters', { liters: (waterGoalMl / 1000).toFixed(1) })
          : getChallengeLabel(type, target)}
      </p>
      <div className="h-2 rounded-full bg-app-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-app-muted-foreground mt-1.5">
        {type === CHALLENGE_TYPES.WATER_2L
          ? t('challenge.progressLiters', {
              current: (displayCurrent / 1000).toFixed(1),
              target: (displayTarget / 1000).toFixed(1),
            })
          : t('challenge.progressCount', { current: displayCurrent, target: displayTarget })}
      </p>
      {isDone && !completed && onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="mt-3 w-full py-2.5 rounded-button bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors focus-ring"
        >
          {t('challenge.completeButton')}
        </button>
      )}
    </div>
  )
}
