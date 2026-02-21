import React from 'react'
import { Calendar, BarChart3, Settings } from 'lucide-react'
import { t } from '../i18n'

const TABS = [
  { id: 'today', label: t('nav.today'), icon: Calendar },
  { id: 'stats', label: t('nav.stats'), icon: BarChart3 },
  { id: 'settings', label: t('nav.settings'), icon: Settings },
]

/**
 * Feste Leiste unten: Heute / Statistik / Einstellungen.
 */
export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-app-surface border-t border-app-border-subtle safe-area-pb"
      role="navigation"
      aria-label={t('nav.today') + ', ' + t('nav.stats') + ', ' + t('nav.settings')}
    >
      <div className="max-w-xl mx-auto flex">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 px-2 min-w-0 transition-colors ${
                isActive
                  ? 'text-[var(--app-accent)]'
                  : 'text-app-muted-foreground hover:text-[var(--app-primary)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden />
              <span className="text-xs font-medium truncate w-full text-center">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
