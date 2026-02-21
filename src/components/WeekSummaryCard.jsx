import React, { memo } from 'react'
import { Calendar, Droplets, Move, Eye, Flame, Share2 } from 'lucide-react'
import { t } from '../i18n'

/**
 * Wochenrückblick: Diese Woche (Gläser, Pausen, Streak) + optional Vorwoche.
 * Mit „Meine Woche teilen“ (nur bei eingeloggtem Nutzer).
 */
function WeekSummaryCard({
  thisWeek,
  prevWeek,
  dailyStreak,
  user,
  onShareWeek,
}) {
  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-app-muted-foreground" />
          {t('weekSummary.title')}
        </h3>
        {user && onShareWeek && (
          <button
            type="button"
            onClick={onShareWeek}
            className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] flex items-center gap-1.5"
            aria-label={t('share.weekButton')}
          >
            <Share2 className="w-4 h-4" />
            {t('share.weekButton')}
          </button>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-app-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-500" />
            {t('weekSummary.thisWeek')}: {t('weekSummary.glasses', { count: thisWeek.glasses })}
          </span>
          <span className="flex items-center gap-1.5">
            <Move className="w-4 h-4 text-emerald-500" />
            <Eye className="w-4 h-4 text-violet-500" />
            {t('weekSummary.pauses', { count: thisWeek.totalPauses })}
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
            {t('weekSummary.streakDays', { count: dailyStreak })}
          </span>
        </div>
        {prevWeek && (
          <p className="text-xs text-app-muted-foreground">
            {t('weekSummary.prevWeek')}: {prevWeek.glasses} Gläser, {prevWeek.totalPauses} Pausen
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(WeekSummaryCard)
