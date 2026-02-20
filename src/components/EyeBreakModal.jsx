import React, { useEffect } from 'react'
import { Eye, X } from 'lucide-react'
import { useTimer } from '../hooks/useTimer'
import { EYE_BREAK_DURATION } from '../constants'
import { t } from '../i18n'

/**
 * Modal für die 20-20-20 Augenpause: 20 Sekunden Countdown mit Kreis-Animation.
 */
export default function EyeBreakModal({ open, onClose, onComplete }) {
  const { seconds, start, reset } = useTimer(EYE_BREAK_DURATION, open, () => {
    onComplete?.()
    onClose?.()
  })

  useEffect(() => {
    if (open) {
      start()
    } else {
      reset()
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null

  const progress = 1 - seconds / EYE_BREAK_DURATION
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="eye-break-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-app-surface rounded-card-lg shadow-modal dark:shadow-modal-dark max-w-sm w-full p-8 animate-slide-up border border-app-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 text-violet-500">
            <Eye className="w-7 h-7" />
            <h2 id="eye-break-title" className="text-lg font-semibold text-[var(--app-primary)]">
              {t('eyeBreak.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button hover:bg-app-surface-hover text-app-muted-foreground"
            aria-label={t('app.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-app-muted-foreground mb-8 text-center">
          {t('eyeBreak.description')}
        </p>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200 dark:text-zinc-600"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-sky-500 transition-all duration-1000 ease-linear"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
              {seconds}
            </span>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {t('eyeBreak.seconds')}
        </p>
      </div>
    </div>
  )
}
