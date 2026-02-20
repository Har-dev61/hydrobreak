import React from 'react'
import { Sparkles } from 'lucide-react'
import { t, tArray } from '../i18n'

/**
 * Kleines „Was ist neu?“-Modal für neue App-Versionen.
 */
export default function WhatsNewModal({ open, onClose }) {
  if (!open) return null

  const items = tArray('whatsNew.items')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsnew-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-app-surface rounded-card-lg shadow-modal dark:shadow-modal-dark max-w-sm w-full p-6 border border-app-border animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center" aria-hidden>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <h2 id="whatsnew-title" className="text-lg font-semibold text-[var(--app-primary)]">
            {t('whatsNew.title')}
          </h2>
        </div>
        <ul className="space-y-2 text-sm text-[var(--app-primary)] list-disc list-inside mb-5">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[var(--app-accent)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          {t('whatsNew.close')}
        </button>
      </div>
    </div>
  )
}
