import React from 'react'
import { Flame, Calendar, Sparkles } from 'lucide-react'
import { t } from '../i18n'

/**
 * Zeigt Daily- und Weekly-Streak mit Icons und kurzer Animation bei Anzeige.
 * Leerer Zustand mit Icon + Text, wenn noch keine Streaks.
 */
export default function StreakTracker({ dailyStreak, weeklyStreak }) {
  const hasAnyStreak = (dailyStreak ?? 0) > 0 || (weeklyStreak ?? 0) > 0

  if (!hasAnyStreak) {
    return (
      <div
        className="rounded-card bg-app-muted/50 border border-app-border-subtle px-4 py-3"
        role="status"
        aria-label={t('emptyStates.noStreaksYet')}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-input bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--app-primary)]">
              {t('emptyStates.noStreaksYet')}
            </p>
            <p className="text-xs text-app-muted-foreground mt-0.5">
              {t('emptyStates.noStreaksYetSub')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label={t('gamification.dailyStreak')}>
      <div className="flex items-center gap-2 rounded-input bg-amber-500/10 px-3 py-2 border border-amber-500/20">
        <Flame className="w-4 h-4 text-amber-500" aria-hidden />
        <div>
          <p className="text-base font-semibold text-[var(--app-primary)] tabular-nums">{dailyStreak}</p>
          <p className="text-xs text-app-muted-foreground">{t('streak.dayStreak')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-input bg-violet-500/10 px-3 py-2 border border-violet-500/20">
        <Calendar className="w-4 h-4 text-violet-500" aria-hidden />
        <div>
          <p className="text-base font-semibold text-[var(--app-primary)] tabular-nums">{weeklyStreak}</p>
          <p className="text-xs text-app-muted-foreground">{t('streak.weekStreak')}</p>
        </div>
      </div>
    </div>
  )
}
