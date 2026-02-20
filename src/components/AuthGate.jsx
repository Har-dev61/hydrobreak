import React from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { t } from '../i18n'

/**
 * Vollbild-Anzeige wenn Nutzer nicht eingeloggt ist.
 * Zeigt App-Titel und Buttons für Registrieren / Anmelden.
 */
export default function AuthGate({ onRegister, onLogin }) {
  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--app-primary)] tracking-tight">
            {t('auth.gateTitle')}
          </h1>
          <p className="text-sm text-app-muted-foreground mt-2">{t('auth.gateSubtitle')}</p>
        </div>
        <p className="text-sm text-app-muted-foreground">{t('auth.gateRequired')}</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onRegister}
            className="w-full py-3 px-4 rounded-button bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white font-medium flex items-center justify-center gap-2 transition-colors"
            aria-label={t('auth.gateRegister')}
          >
            <UserPlus className="w-5 h-5" aria-hidden />
            {t('auth.gateRegister')}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full py-3 px-4 rounded-button border border-app-border hover:border-[var(--app-accent)] hover:bg-app-surface-hover text-[var(--app-primary)] font-medium flex items-center justify-center gap-2 transition-colors"
            aria-label={t('auth.gateLogin')}
          >
            <LogIn className="w-5 h-5" aria-hidden />
            {t('auth.gateLogin')}
          </button>
        </div>
      </div>
    </div>
  )
}
