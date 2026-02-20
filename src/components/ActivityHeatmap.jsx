import React from 'react'
import { Activity } from 'lucide-react'
import { t } from '../i18n'

/**
 * GitHub-Style Aktivitäts-Heatmap: letzte 12 Wochen, 7 Tage pro Zeile.
 * cells: Array<{ date, activityScore 0–4 }>, ältester Tag zuerst.
 */
export default function ActivityHeatmap({ cells }) {
  if (!cells || cells.length === 0) {
    return (
      <div
        className="rounded-input bg-app-muted/50 p-4 flex items-center justify-center gap-3 text-app-muted-foreground"
        role="status"
        aria-label={t('heatmap.noData')}
      >
        <Activity className="w-4 h-4 flex-shrink-0" aria-hidden />
        <span className="text-sm">{t('heatmap.noData')}</span>
      </div>
    )
  }

  const weeks = []
  for (let w = 0; w < Math.ceil(cells.length / 7); w++) {
    const week = cells.slice(w * 7, w * 7 + 7)
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  const paddedWeeks = weeks

  const colorClass = (score) => {
    if (score == null) return 'bg-app-muted'
    switch (score) {
      case 0:
        return 'bg-app-muted'
      case 1:
        return 'bg-blue-200 dark:bg-blue-900/50'
      case 2:
        return 'bg-blue-400 dark:bg-blue-700'
      case 3:
        return 'bg-blue-500'
      case 4:
        return 'bg-blue-600 dark:bg-blue-500'
      default:
        return 'bg-app-muted'
    }
  }

  return (
    <div className="rounded-input bg-app-muted/50 p-3">
      <p className="text-xs text-app-muted-foreground mb-2 flex justify-between">
        <span>{t('heatmap.title')}</span>
        <span className="flex items-center gap-1">
          <span className="text-app-muted-foreground">{t('heatmap.legend')}</span>
          {[0, 1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={`inline-block w-3 h-3 rounded-sm ${colorClass(s)}`}
              aria-hidden
            />
          ))}
        </span>
      </p>
      <div className="flex gap-0.5 overflow-x-auto">
        {paddedWeeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5 shrink-0">
            {week.map((cell, di) => (
              <div
                key={di}
                className={`w-3 h-3 rounded-sm ${colorClass(cell?.activityScore)}`}
                title={cell?.date}
                role="img"
                aria-label={cell ? `Tag ${cell.date}, Aktivität ${cell.activityScore}` : 'Kein Tag'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
