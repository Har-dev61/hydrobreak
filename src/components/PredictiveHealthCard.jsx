import React, { memo, useMemo, useState } from 'react'
import {
  Activity,
  Brain,
  Droplets,
  TrendingDown,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import { t } from '../i18n'
import {
  buildPredictiveHealthInput,
  computePredictiveHealth,
} from '../utils/predictiveHealth'

/**
 * Zeigt Predictive-Health-Scores in Echtzeit mit erklärbaren Faktoren.
 * Aktualisiert sich bei Änderung von progress, settings, weather, todayActivity.
 */
function PredictiveHealthCard({
  progress,
  settings,
  weather,
  todayActivity,
  todayKey,
}) {
  const input = useMemo(
    () =>
      buildPredictiveHealthInput({
        progress: progress || {},
        settings: settings || {},
        weather: weather ?? null,
        todayActivity: todayActivity || {},
        todayKey: todayKey || new Date().toDateString(),
      }),
    [progress, settings, weather, todayActivity, todayKey]
  )

  const health = useMemo(
    () => computePredictiveHealth(input),
    [
      input.todayMl,
      input.waterGoalMl,
      input.activityLevel,
      input.weatherTemp,
      input.sleepHoursLastNight,
      input.lastSportMinutesAgo,
      input.standBreaksToday,
      input.timeOfDay,
      input.hour,
    ]
  )

  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const scoreColor = (value, invert = false, centerAt50 = false) => {
    const v = invert ? 100 - value : value
    if (centerAt50) {
      if (v >= 60) return 'bg-emerald-500'
      if (v <= 40) return 'bg-red-500'
      return 'bg-amber-500'
    }
    if (v <= 33) return 'bg-emerald-500'
    if (v <= 66) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const scoreBar = (value, invert = false, centerAt50 = false) => {
    const v = clamp(value, 0, 100)
    const display = invert ? 100 - v : v
    return (
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreColor(v, invert, centerAt50)}`}
          style={{ width: `${display}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    )
  }

  const ScoreRow = ({
    id,
    icon: Icon,
    labelKey,
    value,
    valueLabel,
    invert,
    centerAt50,
    factors,
    extraNote,
  }) => {
    const isExpanded = expandedId === id
    return (
      <div className="border-b border-app-border-subtle last:border-0">
        <button
          type="button"
          onClick={() => toggleExpand(id)}
          className="w-full flex items-center gap-3 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] focus:ring-inset rounded-button"
          aria-expanded={isExpanded}
        >
          <Icon className="w-4 h-4 text-app-muted-foreground shrink-0" aria-hidden />
          <span className="text-sm font-medium text-[var(--app-primary)] flex-1">{t(labelKey)}</span>
          <span className="text-sm tabular-nums text-[var(--app-primary)]">{valueLabel}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-app-muted-foreground" aria-hidden />
          ) : (
            <ChevronDown className="w-4 h-4 text-app-muted-foreground" aria-hidden />
          )}
        </button>
        <div className="mb-2 px-1">{scoreBar(value, invert, centerAt50)}</div>
        {isExpanded && (
          <div className="pb-3 pl-7 pr-2 space-y-2">
            {extraNote && (
              <p className="text-xs text-app-muted-foreground">{t(extraNote)}</p>
            )}
            <p className="text-xs font-medium text-app-muted-foreground flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              {t('ph.why')}
            </p>
            <ul className="space-y-1">
              {factors.map((f, i) => (
                <li key={i} className="text-xs text-[var(--app-primary)]">
                  {f.meta
                    ? t(f.key, f.meta)
                    : t(f.key)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const { dehydrationRisk, performanceImpact, fatiguePrognosis, headacheProbability, recoveryScore } = health

  return (
    <div className="card p-5 animate-slide-up" role="region" aria-labelledby="ph-title">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-teal-500 dark:text-teal-400" aria-hidden />
        <h3 id="ph-title" className="text-sm font-medium text-[var(--app-primary)]">
          {t('ph.title')}
        </h3>
      </div>
      <p className="text-xs text-app-muted-foreground mb-4">{t('ph.subtitle')}</p>

      <div className="space-y-0">
        <ScoreRow
          id="dehydration"
          icon={Droplets}
          labelKey="ph.dehydrationRisk"
          value={dehydrationRisk.score}
          valueLabel={t('ph.scoreOutOf100', { value: dehydrationRisk.score })}
          invert
          factors={dehydrationRisk.factors}
        />
        <ScoreRow
          id="performance"
          icon={Zap}
          labelKey="ph.performanceImpact"
          value={clamp(50 + performanceImpact.impactPercent, 0, 100)}
          valueLabel={
            performanceImpact.impactPercent >= 0
              ? `+${performanceImpact.impactPercent}%`
              : `${performanceImpact.impactPercent}%`
          }
          centerAt50
          factors={performanceImpact.factors}
        />
        <ScoreRow
          id="fatigue"
          icon={Brain}
          labelKey="ph.fatiguePrognosis"
          value={fatiguePrognosis.score}
          valueLabel={t('ph.scoreOutOf100', { value: fatiguePrognosis.score })}
          invert
          factors={fatiguePrognosis.factors}
        />
        <ScoreRow
          id="headache"
          icon={TrendingDown}
          labelKey="ph.headacheProbability"
          value={headacheProbability.probability}
          valueLabel={t('ph.probabilityPercent', { value: headacheProbability.probability })}
          invert
          factors={headacheProbability.factors}
        />
        <ScoreRow
          id="recovery"
          icon={TrendingUp}
          labelKey="ph.recoveryScore"
          value={recoveryScore.score}
          valueLabel={t('ph.scoreOutOf100', { value: recoveryScore.score })}
          factors={recoveryScore.factors}
          extraNote={recoveryScore.noSport ? 'ph.recovery.noSportNote' : null}
        />
      </div>
    </div>
  )
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export default memo(PredictiveHealthCard)
