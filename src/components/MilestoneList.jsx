import React from 'react'
import { Trophy, Droplets, Eye, Move } from 'lucide-react'
import { t } from '../i18n'

const typeIcons = {
  water: Droplets,
  eyeBreaks: Eye,
  standBreaks: Move,
}

/**
 * Zeigt erreichte Meilensteine mit kleinem Badge/Icon.
 * milestones: Array<{ id, target, unit, type }>
 * Leerer Zustand mit Icon + Text, wenn noch keine Meilensteine.
 */
export default function MilestoneList({ milestones }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div
        className="rounded-input bg-app-muted/50 border border-app-border-subtle p-4 flex items-center gap-3"
        role="status"
        aria-label={t('emptyStates.noMilestonesYet')}
      >
        <Trophy className="w-4 h-4 text-app-muted-foreground flex-shrink-0" aria-hidden />
        <p className="text-sm text-app-muted-foreground">{t('emptyStates.noMilestonesYet')}</p>
      </div>
    )
  }

  const label = (m) => {
    if (m.type === 'water') return t('milestones.water', { liters: m.target / 1000 })
    if (m.type === 'eyeBreaks') return t('milestones.eyeBreaks', { count: m.target })
    return t('milestones.standBreaks', { count: m.target })
  }

  return (
    <div className="rounded-input bg-amber-500/10 border border-amber-500/20 p-3">
      <h4 className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-1.5">
        <Trophy className="w-4 h-4" />
        {t('milestones.title')}
      </h4>
      <ul className="flex flex-wrap gap-2">
        {milestones.map((m) => {
          const Icon = typeIcons[m.type] || Trophy
          return (
            <li
              key={m.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-input bg-app-surface border border-app-border-subtle text-sm text-[var(--app-primary)]"
            >
              <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{label(m)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
