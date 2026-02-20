import React, { useState, useEffect } from 'react'
import { Timer, Eye, Move, X } from 'lucide-react'
import { useTimer } from '../hooks/useTimer'
import { t } from '../i18n'

function pad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Fokus-Session: Manuell startbarer Timer (z. B. 25 Min).
 * Nach Ablauf erscheint ein Modal mit der Option, eine Pause zu starten.
 */
export default function FocusSessionCard({
  durationMinutes,
  onStartEyeBreak,
  onStartStandBreak,
}) {
  const [sessionActive, setSessionActive] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)
  const durationSeconds = durationMinutes * 60

  const { seconds, start, reset } = useTimer(durationSeconds, sessionActive, () => {
    setSessionActive(false)
    setShowEndModal(true)
  })

  useEffect(() => {
    if (sessionActive) start()
  }, [sessionActive]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => setSessionActive(true)

  const handleCancel = () => {
    setSessionActive(false)
    reset()
  }

  const handleCloseEndModal = () => setShowEndModal(false)

  const min = Math.floor(seconds / 60)
  const sec = seconds % 60

  return (
    <>
      <div
        className="card p-5 animate-slide-up"
        style={{ animationFillMode: 'backwards' }}
        role="region"
        aria-label={t('focusSession.title')}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-input bg-violet-500/10 flex items-center justify-center text-violet-500">
            <Timer className="w-5 h-5" strokeWidth={1.8} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[var(--app-primary)]">{t('focusSession.title')}</h3>
            <p className="text-xs text-app-muted-foreground mt-0.5">{t('focusSession.description')}</p>
            {!sessionActive ? (
              <button
                type="button"
                onClick={handleStart}
                className="mt-4 px-4 py-2 rounded-button bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors focus-ring"
                aria-label={t('focusSession.start') + ` (${durationMinutes} Min)`}
              >
                {t('focusSession.start')} ({durationMinutes} Min)
              </button>
            ) : (
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span
                  className="text-lg font-semibold tabular-nums text-violet-600 dark:text-violet-400"
                  aria-live="polite"
                  aria-label={t('focusSession.timeLeft', { min: pad(min), sec: pad(sec) })}
                >
                  {t('focusSession.timeLeft', { min: pad(min), sec: pad(sec) })}
                </span>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-button bg-app-muted hover:bg-app-surface-hover text-[var(--app-primary)] text-sm font-medium transition-colors focus-ring"
                  aria-label={t('focusSession.cancel')}
                >
                  {t('focusSession.cancel')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Fokus vorbei – Pause? */}
      {showEndModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="focus-session-ended-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
          onClick={handleCloseEndModal}
        >
          <div
            className="bg-app-surface rounded-card-lg shadow-modal dark:shadow-modal-dark max-w-sm w-full p-6 border border-app-border animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-violet-500">
                <Timer className="w-6 h-6" aria-hidden />
                <h2 id="focus-session-ended-title" className="text-lg font-semibold text-[var(--app-primary)]">
                  {t('focusSession.ended')}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseEndModal}
                className="p-2 rounded-button hover:bg-app-surface-hover text-app-muted-foreground"
                aria-label={t('app.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-app-muted-foreground mb-4">{t('focusSession.takeBreak')}</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onStartEyeBreak?.()
                  handleCloseEndModal()
                }}
                className="w-full px-4 py-2.5 rounded-button bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors focus-ring"
                aria-label={t('focusSession.eyeBreak')}
              >
                <Eye className="w-4 h-4" aria-hidden />
                {t('focusSession.eyeBreak')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onStartStandBreak?.()
                  handleCloseEndModal()
                }}
                className="w-full px-4 py-2.5 rounded-button bg-app-muted hover:bg-app-surface-hover text-[var(--app-primary)] text-sm font-medium flex items-center justify-center gap-2 transition-colors focus-ring"
                aria-label={t('focusSession.movement')}
              >
                <Move className="w-4 h-4" aria-hidden />
                {t('focusSession.movement')}
              </button>
              <button
                type="button"
                onClick={handleCloseEndModal}
                className="w-full px-4 py-2 rounded-button border border-app-border text-app-muted-foreground hover:bg-app-surface-hover text-sm transition-colors focus-ring"
                aria-label={t('focusSession.done')}
              >
                {t('focusSession.done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
