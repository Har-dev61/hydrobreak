import React, { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { t } from '../i18n'

/**
 * Modal beim Level-Aufstieg mit kurzer Feier-Animation.
 */
export default function LevelUpModal({ open, onClose, newLevel }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (open) {
      setAnimate(true)
      const t = setTimeout(onClose, 2200)
      return () => clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-app-surface rounded-card-lg shadow-modal dark:shadow-modal-dark max-w-sm w-full p-8 text-center border border-app-border animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mb-4 transition-transform duration-500 ${
            animate ? 'scale-110' : 'scale-95'
          }`}
          aria-hidden
        >
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <h2 id="level-up-title" className="text-xl font-semibold text-[var(--app-primary)]">
          {t('levelUp.title', { level: newLevel })}
        </h2>
        <p className="text-sm text-app-muted-foreground mt-1">{t('levelUp.subtitle')}</p>
      </div>
    </div>
  )
}
