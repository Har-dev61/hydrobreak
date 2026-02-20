import React from 'react'
import {
  Droplets,
  Trophy,
  Zap,
  Move,
  Eye,
  Flame,
  Calendar,
  Target,
  RotateCcw,
} from 'lucide-react'
import { BADGES } from '../constants'
import { tObject } from '../i18n'

const iconMap = {
  Droplets,
  Trophy,
  Zap,
  Move,
  Eye,
  Flame,
  Calendar,
  Target,
  RotateCcw,
}

/**
 * Einzelne Badge-Karte – angezeigt als erworben (farbig) oder gesperrt (grau).
 */
export default function BadgeCard({ badgeId, earned, compact }) {
  const badge = BADGES.find((b) => b.id === badgeId)
  if (!badge) return null
  const label = tObject('badges.' + badgeId)
  const name = label?.name ?? badgeId
  const desc = label?.desc ?? ''

  const Icon = iconMap[badge.icon] || Trophy

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300 ${
          earned
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
            : 'bg-app-muted text-app-muted-foreground'
        }`}
        title={name}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium truncate">{name}</span>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-300 ${
        earned
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
          : 'bg-app-muted border-app-border-subtle text-app-muted-foreground'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            earned ? 'bg-amber-500/20' : 'bg-app-border'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{name}</p>
          <p className="text-xs opacity-90 truncate">{desc}</p>
        </div>
      </div>
    </div>
  )
}
