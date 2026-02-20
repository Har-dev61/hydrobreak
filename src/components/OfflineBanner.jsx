import React from 'react'
import { WifiOff } from 'lucide-react'
import { t } from '../i18n'

/**
 * Dezentes Banner, wenn die App offline ist.
 * Erklärt, dass Daten beim nächsten Mal synchronisiert werden.
 * Verschwindet automatisch, sobald die Verbindung wieder da ist (kein Schließen-Button).
 */
export default function OfflineBanner() {
  return (
    <div
      className="sticky top-0 z-40 flex items-center gap-2 px-4 py-2.5 bg-slate-500/10 dark:bg-slate-400/10 border-b border-slate-500/20 dark:border-slate-400/20 text-slate-700 dark:text-slate-300"
      role="status"
      aria-live="polite"
      aria-label={t('app.offlineBanner')}
    >
      <WifiOff className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
      <p className="text-sm">{t('app.offlineBanner')}</p>
    </div>
  )
}
