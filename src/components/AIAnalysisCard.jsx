import React, { memo, useMemo } from 'react'
import { Sparkles, TrendingUp, Target, Lightbulb, Droplets } from 'lucide-react'
import { t } from '../i18n'
import { getAIInsights } from '../utils/aiAnalysis'

/**
 * AI-Insights-Karte: Muster, Prognose (Ziel erreicht/verfehlt?), Begründung, Empfehlungen.
 */
function AIAnalysisCard({
  progress,
  waterGoalMl,
  stats,
  settings,
  dailyContext,
  weather,
  onDrinkNow,
}) {
  const insights = useMemo(
    () => getAIInsights(progress, waterGoalMl, stats, settings, dailyContext, weather),
    [progress, waterGoalMl, stats, settings, dailyContext, weather]
  )

  const { patterns, prediction, recommendations } = insights

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400" aria-hidden />
        <h3 className="text-sm font-medium text-[var(--app-primary)]">{t('ai.title')}</h3>
      </div>
      <p className="text-xs text-app-muted-foreground mb-4">{t('ai.subtitle')}</p>

      {/* Prognose für heute */}
      <section className="mb-4" aria-labelledby="ai-prediction-heading">
        <h4
          id="ai-prediction-heading"
          className="text-xs font-medium text-app-muted-foreground flex items-center gap-1.5 mb-2"
        >
          <Target className="w-3.5 h-3.5" />
          {t('ai.predictionTitle')}
        </h4>
        <div
          className={`rounded-button px-3 py-2.5 text-sm ${
            prediction.willReach
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
              : 'bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-800 dark:text-amber-200'
          }`}
        >
          <p className="font-medium">
            {prediction.reasonKey === 'ai.predictionGoalReached'
              ? t('ai.predictionGoalReached')
              : prediction.willReach
                ? t('ai.predictionOnTrack')
                : t('ai.predictionRateTooLow')}
            {prediction.projectedMl != null && prediction.reasonKey !== 'ai.predictionGoalReached' && (
              <span className="block mt-1 text-xs font-normal opacity-90">
                {t('ai.predictionProj', {
                  projectedMl: prediction.projectedMl,
                  waterGoalMl: waterGoalMl,
                })}
              </span>
            )}
          </p>
          <p className="mt-1.5 text-xs opacity-90">{t(prediction.reasonKey)}</p>
        </div>
      </section>

      {/* Erkannte Muster */}
      {patterns.length > 0 && (
        <section className="mb-4" aria-labelledby="ai-patterns-heading">
          <h4
            id="ai-patterns-heading"
            className="text-xs font-medium text-app-muted-foreground flex items-center gap-1.5 mb-2"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {t('ai.patternTitle')}
          </h4>
          <ul className="space-y-2">
            {patterns.slice(0, 3).map((p, i) => (
              <li
                key={i}
                className="text-sm text-[var(--app-primary)] bg-app-surface border border-app-border-subtle rounded-button px-3 py-2"
              >
                <span className="font-medium">{t(p.labelKey, { value: p.value })}</span>
                <span className="block text-xs text-app-muted-foreground mt-0.5">
                  {t(p.descriptionKey)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {patterns.length === 0 && (
        <p className="text-xs text-app-muted-foreground mb-4">{t('ai.noPatternsYet')}</p>
      )}

      {/* Handlungsempfehlungen */}
      {recommendations.length > 0 && (
        <section aria-labelledby="ai-rec-heading">
          <h4
            id="ai-rec-heading"
            className="text-xs font-medium text-app-muted-foreground flex items-center gap-1.5 mb-2"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {t('ai.recommendationsTitle')}
          </h4>
          <ul className="space-y-2">
            {recommendations.slice(0, 3).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                </span>
                <span className="flex-1 text-[var(--app-primary)]">
                  {r.meta?.count != null
                    ? t(r.actionKey, { count: r.meta.count })
                    : t(r.actionKey)}
                </span>
                {(r.actionKey === 'ai.recDrinkNowGlasses' || r.actionKey === 'ai.recOneMoreGlass') &&
                  onDrinkNow && (
                    <button
                      type="button"
                      onClick={onDrinkNow}
                      className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-button bg-[var(--app-accent)] text-white text-xs font-medium hover:opacity-90"
                      aria-label={t('reminder.drinkNow')}
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      {t('reminder.drinkNow')}
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default memo(AIAnalysisCard)
