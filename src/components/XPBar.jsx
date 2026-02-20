import React from 'react'
import { Sparkles } from 'lucide-react'
import { t } from '../i18n'

/**
 * Fortschrittsbalken für XP und Level – zeigt aktuelles Level, XP im Level und Fortschritt zum nächsten Level.
 */
export default function XPBar({ level, xpInLevel, xpNeededForNext, totalXp }) {
  const percent = xpNeededForNext > 0 ? Math.min(100, (xpInLevel / xpNeededForNext) * 100) : 100

  return (
    <div className="card p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--app-primary)]">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {t('gamification.levelLabel', { level })}
        </span>
        <span className="text-xs text-app-muted-foreground tabular-nums">
          {t('gamification.xpTotal', { xp: totalXp })}
        </span>
      </div>
      <div className="h-2 rounded-full bg-app-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-app-muted-foreground mt-1.5">
        {xpNeededForNext > 0
          ? t('gamification.xpToNext', {
              current: xpInLevel,
              needed: xpNeededForNext,
              level: level + 1,
            })
          : t('gamification.maxLevel')}
      </p>
    </div>
  )
}
