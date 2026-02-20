import React from 'react'
import { t } from '../i18n'

/**
 * Vollbild-Ladeanzeige für Auth-Check und initialen App-Load.
 * Reduzierte Animation bei prefers-reduced-motion.
 */
export default function LoadingScreen() {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center gap-4 px-4"
      role="status"
      aria-live="polite"
      aria-label={t('app.loading')}
    >
      <div
        className="w-10 h-10 rounded-full border-2 border-sky-200 dark:border-sky-800 border-t-sky-600 dark:border-t-sky-400 motion-reduce:animate-none animate-spin"
        aria-hidden
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">{t('app.loading')}</p>
    </div>
  )
}
