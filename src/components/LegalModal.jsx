import React from 'react'
import { X } from 'lucide-react'
import { t, tArray } from '../i18n'

/**
 * Modal für rechtliche Seiten: Datenschutz, Impressum, AGB.
 * @param {{ open: boolean, onClose: () => void, type: 'privacy'|'imprint'|'terms' }} props
 */
export default function LegalModal({ open, onClose, type }) {
  if (!open || !type) return null

  const titleKey = `legal.${type}Title`
  const contentKey = `legal.${type}Content`
  const paragraphs = tArray(contentKey)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-app-surface rounded-card-lg shadow-modal dark:shadow-modal-dark max-w-lg w-full max-h-[85vh] flex flex-col border border-app-border animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between shrink-0 p-4 border-b border-app-border-subtle">
          <h2 id="legal-modal-title" className="text-lg font-semibold text-[var(--app-primary)]">
            {t(titleKey)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button hover:bg-app-surface-hover text-app-muted-foreground hover:text-[var(--app-primary)] transition-colors"
            aria-label={t('legal.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3 text-sm text-[var(--app-primary)]">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="shrink-0 p-4 border-t border-app-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--app-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            {t('legal.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
