import React, { memo } from 'react'
import { Droplets, TrendingUp, Calendar, BarChart3 } from 'lucide-react'
import { WATER_GOAL_ML } from '../constants'
import { t } from '../i18n'

/**
 * Zeigt den täglichen Wasserfortschritt bis zum Tagesziel, optional Tages-/Wochenstatistik.
 * Button „Verläufe“ öffnet das Statistik-Modal.
 */
function ProgressTracker({
  todayMl,
  waterGoalMl = WATER_GOAL_ML,
  showStats,
  dailyHistory,
  weeklyTotal,
  onToggleStats,
  onOpenStatsModal,
}) {
  const percent = Math.min(100, Math.round((todayMl / waterGoalMl) * 100))
  const liters = (todayMl / 1000).toFixed(1)
  const goalLiters = (waterGoalMl / 1000).toFixed(1)

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          {t('progress.todayDrunk')}
        </h3>
        <div className="flex items-center gap-1">
          {onOpenStatsModal && (
            <button
              type="button"
              onClick={onOpenStatsModal}
              className="p-2 rounded-button text-app-muted-foreground hover:text-[var(--app-primary)] hover:bg-app-surface-hover transition-colors focus-ring"
              aria-label={t('progress.openStatsModal')}
              title={t('progress.openStatsModal')}
            >
              <BarChart3 className="w-4 h-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={onToggleStats}
            className="text-sm text-app-muted-foreground hover:text-[var(--app-primary)] px-2 py-1 rounded-button hover:bg-app-surface-hover transition-colors focus-ring"
            aria-expanded={showStats}
            aria-label={showStats ? t('progress.progress') : t('progress.stats')}
          >
            {showStats ? t('progress.progress') : t('progress.stats')}
            <TrendingUp className="w-4 h-4 inline-block ml-0.5" aria-hidden />
          </button>
        </div>
      </div>

      {!showStats ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums text-[var(--app-primary)]">{liters}</span>
            <span className="text-sm text-app-muted-foreground">
              / {goalLiters} {t('progress.liters')}
            </span>
          </div>
          <div
            className="mt-3 h-2 rounded-full bg-app-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={percent >= 100 ? t('progress.goalReached') : t('progress.percentToGo', { percent: 100 - percent })}
          >
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm text-app-muted-foreground mt-2">
            {percent >= 100
              ? t('progress.goalReached')
              : t('progress.percentToGo', { percent: 100 - percent })}
          </p>
        </>
      ) : (
        <div className="space-y-3">
          {weeklyTotal != null && (
            <div className="flex items-center gap-2 text-sm text-app-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{t('progress.thisWeek', { liters: (weeklyTotal / 1000).toFixed(1) })}</span>
            </div>
          )}
          {dailyHistory && dailyHistory.length > 0 && (
            <div className="text-sm text-app-muted-foreground">
              {t('progress.lastDays', {
                list: dailyHistory
                  .slice(-5)
                  .reverse()
                  .map((d) => `${d.ml} ml`)
                  .join(', '),
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(ProgressTracker)
