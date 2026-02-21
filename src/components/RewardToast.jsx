import React, { useEffect, useState } from 'react'
import { Sparkles, Award } from 'lucide-react'
import { t } from '../i18n'

/**
 * Kurze Toast-Animation für XP-Gewinn oder Badge – erscheint oben und verschwindet nach ein paar Sekunden.
 */
export default function RewardToast({ open, onClose, type = 'xp', value, badgeName }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 2500)
    return () => clearTimeout(t)
  }, [open, onClose])

  if (!open) return null

  const liveText =
    type === 'xp'
      ? t('reward.xpAnnouncement', { value })
      : t('reward.badgeAnnouncement', { badge: badgeName })

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Inhalt der Live-Region wird von Screenreadern beim Erscheinen vorgelesen */}
      <span className="sr-only">{liveText}</span>
      <div className="rounded-card shadow-modal dark:shadow-modal-dark bg-app-surface border border-app-border px-4 py-3 flex items-center gap-3 animate-slide-up">
        {type === 'xp' ? (
          <>
            <div className="w-9 h-9 rounded-input bg-amber-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-500" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--app-primary)]">+{value} XP</p>
              <p className="text-xs text-app-muted-foreground">{t('reward.keepGoing')}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-input bg-amber-500/15 flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-500" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--app-primary)]">
                {t('reward.badgeUnlocked')}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{badgeName}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
