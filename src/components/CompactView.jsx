import React from 'react'
import { Droplets, Move, Eye, ExternalLink } from 'lucide-react'
import { t } from '../i18n'
import QuickActions from './QuickActions'
import VoiceCommandButton from './VoiceCommandButton'

/**
 * Widget-Ansicht für Startbildschirm: Wasserfortschritt + Quick Actions + Link zur Vollansicht.
 * Wird bei ?view=compact oder als Start-URL der PWA genutzt.
 */
function CompactView({
  todayMl,
  waterGoalMl,
  onDrink,
  onStand,
  onEye,
  feedback,
  onOpenFullApp,
  voice,
}) {
  const percent = Math.min(100, Math.round((todayMl / waterGoalMl) * 100))
  const liters = (todayMl / 1000).toFixed(1)
  const goalLiters = (waterGoalMl / 1000).toFixed(1)

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-lg font-semibold text-[var(--app-primary)] text-center">
          {t('app.title')}
        </h1>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              {t('progress.todayDrunk')}
            </span>
            <span className="text-sm tabular-nums text-app-muted-foreground">
              {liters} / {goalLiters} L
            </span>
          </div>
          <div className="h-2 rounded-full bg-app-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={todayMl}
              aria-valuemin={0}
              aria-valuemax={waterGoalMl}
              aria-label={t('progress.progress')}
            />
          </div>
        </div>
        {voice && (
          <div className="flex justify-center">
            <VoiceCommandButton
              isListening={voice.isListening}
              isSupported={voice.isSupported}
              error={voice.error}
              onStart={voice.start}
              onStop={voice.stop}
              className="bg-app-surface border border-app-border-subtle hover:bg-app-surface-hover"
            />
          </div>
        )}
        <QuickActions
          onDrink={onDrink}
          onStand={onStand}
          onEye={onEye}
          feedback={feedback}
        />
        <button
          type="button"
          onClick={onOpenFullApp}
          className="w-full py-3 px-4 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-hover text-sm font-medium text-[var(--app-primary)] flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" aria-hidden />
          {t('widget.openFullApp')}
        </button>
      </div>
    </div>
  )
}

export default CompactView
