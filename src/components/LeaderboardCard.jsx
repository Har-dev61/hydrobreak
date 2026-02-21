import React, { memo } from 'react'
import { Award } from 'lucide-react'
import { t } from '../i18n'

/**
 * Rangliste / Top-X%: Zeigt anonymisierten Vergleich (z. B. „Du bist diese Woche unter den aktivsten 20 %“).
 * percentile: 1–100 von Backend (niedrig = besser). Fehlt die API-Antwort, wird „Rangliste demnächst“ angezeigt.
 */
function LeaderboardCard({ percentile }) {
  const hasPercentile = typeof percentile === 'number' && percentile >= 1 && percentile <= 100

  return (
    <div
      className="card p-4"
      role="region"
      aria-label={t('leaderboard.title')}
    >
      <h3 className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2 mb-2">
        <Award className="w-4 h-4 text-amber-500" aria-hidden />
        {t('leaderboard.title')}
      </h3>
      {hasPercentile ? (
        <>
          <p className="text-sm text-[var(--app-primary)] font-medium">
            {t('leaderboard.topPercent', { percent: percentile })}
          </p>
          <p className="text-xs text-app-muted-foreground mt-0.5">
            {t('leaderboard.topPercentSub')}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-app-muted-foreground">
            {t('leaderboard.comingSoon')}
          </p>
          <p className="text-xs text-app-muted-foreground mt-0.5">
            {t('leaderboard.comingSoonSub')}
          </p>
        </>
      )}
    </div>
  )
}

export default memo(LeaderboardCard)
