import React from 'react'
import { RotateCcw, X } from 'lucide-react'
import { t } from '../i18n'

/**
 * Banner nach längerer Inaktivität: „Willkommen zurück!“ + Hinweis auf Bonus-XP.
 */
export default function ComebackBanner({ show, bonusXp, onDismiss }) {
  if (!show) return null

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-card border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-800 dark:text-emerald-200 animate-slide-up"
      role="status"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-9 h-9 rounded-input bg-emerald-500/20 flex items-center justify-center">
          <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--app-primary)]">{t('comeback.title')}</p>
          <p className="text-xs text-app-muted-foreground">{t('comeback.subtitle')}</p>
          {bonusXp > 0 && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{t('comeback.bonus', { xp: bonusXp })}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 p-2 rounded-button hover:bg-app-surface-hover transition-colors"
        aria-label={t('app.close')}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
