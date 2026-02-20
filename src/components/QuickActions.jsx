import React, { memo } from 'react'
import { Droplets, Move, Eye, Check } from 'lucide-react'
import { t } from '../i18n'

/**
 * Schnellaktionen: Ein Klick für „Glas getrunken“, „Bewegungspause“, „Augenpause“ –
 * ohne in die jeweilige Karte zu wechseln. Zeigt kurzes „+X XP“ oder Häkchen als Bestätigung.
 */
function QuickActions({ onDrink, onStand, onEye, feedback }) {
  const show = (type) => feedback?.type === type
  const xpLabel = (xp) => (xp > 0 ? t('quickActions.xpGained', { xp }) : null)
  const labelFor = (type, defaultLabel) => {
    if (!show(type)) return defaultLabel
    const xp = feedback?.xp ?? 0
    return xp > 0 ? xpLabel(xp) : t('quickActions.done')
  }

  const btnBase =
    'relative flex flex-col items-center gap-2 rounded-card p-4 transition-all duration-150 border border-app-border-subtle focus-ring '
  const btnDefault =
    'bg-app-surface hover:bg-app-surface-hover hover:border-app-border'
  const btnFeedback =
    'ring-2 ring-blue-500/30 border-blue-500/40 bg-blue-500/5'

  return (
    <div className="grid grid-cols-3 gap-3" role="group" aria-label={t('quickActions.title')}>
      <button
        type="button"
        onClick={onDrink}
        className={btnBase + (show('drink') ? btnFeedback : btnDefault)}
        aria-label={t('quickActions.drink')}
      >
        {show('drink') && (
          <span
            className="absolute top-2 right-2 text-xs font-semibold text-amber-600 dark:text-amber-400 animate-fade-in"
            aria-live="polite"
          >
            {feedback.xp > 0 ? xpLabel(feedback.xp) : <Check className="w-4 h-4" aria-hidden />}
          </span>
        )}
        <div className="w-11 h-11 rounded-input bg-blue-500/10 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-blue-500" aria-hidden />
        </div>
        <span className="text-xs font-medium text-[var(--app-primary)] text-center leading-tight">
          {labelFor('drink', t('quickActions.drink'))}
        </span>
      </button>
      <button
        type="button"
        onClick={onStand}
        className={btnBase + (show('stand') ? btnFeedback : btnDefault)}
        aria-label={t('quickActions.movement')}
      >
        {show('stand') && (
          <span
            className="absolute top-2 right-2 text-xs font-semibold text-amber-600 dark:text-amber-400 animate-fade-in"
            aria-live="polite"
          >
            {feedback.xp > 0 ? xpLabel(feedback.xp) : <Check className="w-4 h-4" aria-hidden />}
          </span>
        )}
        <div className="w-11 h-11 rounded-input bg-emerald-500/10 flex items-center justify-center">
          <Move className="w-5 h-5 text-emerald-500" aria-hidden />
        </div>
        <span className="text-xs font-medium text-[var(--app-primary)] text-center leading-tight">
          {labelFor('stand', t('quickActions.movement'))}
        </span>
      </button>
      <button
        type="button"
        onClick={onEye}
        className={btnBase + (show('eye') ? btnFeedback : btnDefault)}
        aria-label={t('quickActions.eye')}
      >
        {show('eye') && (
          <span
            className="absolute top-2 right-2 text-xs font-semibold text-amber-600 dark:text-amber-400 animate-fade-in"
            aria-live="polite"
          >
            {feedback.xp > 0 ? xpLabel(feedback.xp) : <Check className="w-4 h-4" aria-hidden />}
          </span>
        )}
        <div className="w-11 h-11 rounded-input bg-violet-500/10 flex items-center justify-center">
          <Eye className="w-5 h-5 text-violet-500" aria-hidden />
        </div>
        <span className="text-xs font-medium text-[var(--app-primary)] text-center leading-tight">
          {labelFor('eye', t('quickActions.eye'))}
        </span>
      </button>
    </div>
  )
}

export default memo(QuickActions)
