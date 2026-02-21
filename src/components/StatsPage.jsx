import React, { useMemo, useState } from 'react'
import { Droplets, Calendar, BarChart3 } from 'lucide-react'
import { t } from '../i18n'
import { getWeekSummary } from '../utils/statsHelpers'
import { getWeekKey } from '../utils/gamification'

function formatDayLabel(dateKey) {
  const d = new Date(dateKey)
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'numeric' })
}

function formatWeekShort(weekKey) {
  const d = new Date(weekKey)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

const NUM_DAYS_OPTIONS = [7, 14, 30]
const NUM_WEEKS_ACTIVITY = 6

/**
 * Statistik als Vollbild-Seite (für Tab „Statistik“). Gleicher Inhalt wie StatsModal.
 */
export default function StatsPage({
  dailyHistory = [],
  todayKey,
  todayMl,
  waterGoalMl,
  thisWeek,
  prevWeek,
  stats = {},
  gamification = {},
  progress = {},
}) {
  const [numDays, setNumDays] = useState(14)

  const chartData = useMemo(() => {
    const dailyByDate = Object.fromEntries((dailyHistory || []).map((d) => [d.date, d.ml]))
    const start = new Date(todayKey)
    start.setDate(start.getDate() - numDays + 1)
    const rows = []
    for (let i = 0; i < numDays; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const dateKey = d.toDateString()
      const ml = dateKey === todayKey ? todayMl : (dailyByDate[dateKey] ?? 0)
      rows.push({ dateKey, ml, isToday: dateKey === todayKey })
    }
    return rows
  }, [dailyHistory, todayKey, todayMl, numDays])

  const weeklyActivityData = useMemo(() => {
    const thisWeekKey = getWeekKey(todayKey)
    const rows = []
    for (let i = 0; i < NUM_WEEKS_ACTIVITY; i++) {
      const monday = new Date(thisWeekKey)
      monday.setDate(monday.getDate() - 7 * i)
      const weekKey = monday.toDateString()
      const summary = getWeekSummary(stats, gamification, progress, weekKey, todayKey)
      const activity = summary.glasses + summary.totalPauses
      rows.push({ weekKey, ...summary, activity })
    }
    return rows.reverse()
  }, [stats, gamification, progress, todayKey])

  const maxMl = Math.max(waterGoalMl, ...chartData.map((r) => r.ml), 1)
  const maxActivity = Math.max(1, ...weeklyActivityData.map((w) => w.activity))

  return (
    <div className="p-4 pb-8 space-y-6" role="main" aria-label={t('statsModal.title')}>
      <section aria-labelledby="stats-daily-heading">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3
            id="stats-daily-heading"
            className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2"
          >
            <Droplets className="w-4 h-4 text-blue-500" />
            {t('statsModal.dailyTrend')}
          </h3>
          <div className="flex rounded-lg border border-app-border overflow-hidden">
            {NUM_DAYS_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumDays(n)}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  numDays === n
                    ? 'bg-sky-500 text-white'
                    : 'bg-app-surface text-app-muted-foreground hover:bg-app-surface-hover'
                }`}
              >
                {n === 7 ? t('statsModal.days7') : n === 14 ? t('statsModal.days14') : t('statsModal.days30')}
              </button>
            ))}
          </div>
        </div>
        {chartData.length === 0 ? (
          <p className="text-sm text-app-muted-foreground">{t('statsModal.noData')}</p>
        ) : (
          <div className="flex items-end gap-1.5 h-36">
            {chartData.map(({ dateKey, ml, isToday }) => {
              const percent = maxMl > 0 ? (ml / maxMl) * 100 : 0
              const reached = waterGoalMl > 0 && ml >= waterGoalMl
              return (
                <div
                  key={dateKey}
                  className="flex-1 flex flex-col items-center gap-1 min-w-0"
                  title={`${formatDayLabel(dateKey)}: ${(ml / 1000).toFixed(1)} L`}
                >
                  <div className="w-full flex flex-col justify-end h-24">
                    <div
                      className={`w-full rounded-t transition-all ${
                        reached
                          ? 'bg-emerald-500 dark:bg-emerald-500'
                          : isToday
                            ? 'bg-sky-500 dark:bg-sky-500'
                            : 'bg-sky-300 dark:bg-sky-600'
                      }`}
                      style={{ height: `${Math.max(percent, 2)}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] truncate w-full text-center ${
                      isToday ? 'font-semibold text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatDayLabel(dateKey).split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        <p className="text-xs text-app-muted-foreground mt-2">
          {t('statsModal.daysLabel', { count: numDays })}
        </p>
      </section>

      <section aria-labelledby="stats-weekly-activity-heading">
        <h3
          id="stats-weekly-activity-heading"
          className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2 mb-2"
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          {t('statsModal.weeklyActivity')}
        </h3>
        <p className="text-xs text-app-muted-foreground mb-3">
          {t('statsModal.weeklyActivityHint')}
        </p>
        <div className="flex items-end gap-1.5 h-20">
          {weeklyActivityData.map(({ weekKey, glasses, totalPauses, activity }) => {
            const percent = maxActivity > 0 ? (activity / maxActivity) * 100 : 0
            return (
              <div
                key={weekKey}
                className="flex-1 flex flex-col items-center gap-0.5 min-w-0"
                title={`${formatWeekShort(weekKey)}: ${t('weekSummary.glasses', { count: glasses })}, ${t('weekSummary.pauses', { count: totalPauses })}`}
              >
                <div className="w-full flex flex-col justify-end h-12">
                  <div
                    className="w-full rounded-t bg-emerald-400 dark:bg-emerald-600 transition-all"
                    style={{ height: `${Math.max(percent, 4)}%` }}
                  />
                </div>
                <span className="text-[9px] text-app-muted-foreground truncate w-full text-center">
                  {formatWeekShort(weekKey)}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="stats-week-heading">
        <h3
          id="stats-week-heading"
          className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2 mb-3"
        >
          <Calendar className="w-4 h-4 text-blue-500" />
          {t('statsModal.weekCompare')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-input bg-blue-500/10 border border-blue-500/20 p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
              {t('weekSummary.thisWeek')}
            </p>
            <p className="text-sm text-[var(--app-primary)]">
              {t('weekSummary.glasses', { count: thisWeek?.glasses ?? 0 })}
              {', '}
              {t('weekSummary.pauses', { count: thisWeek?.totalPauses ?? 0 })}
            </p>
          </div>
          <div className="rounded-input bg-app-muted/50 border border-app-border-subtle p-3">
            <p className="text-xs text-app-muted-foreground font-medium mb-1">
              {t('weekSummary.prevWeek')}
            </p>
            <p className="text-sm text-app-muted-foreground">
              {t('weekSummary.glasses', { count: prevWeek?.glasses ?? 0 })}
              {', '}
              {t('weekSummary.pauses', { count: prevWeek?.totalPauses ?? 0 })}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
