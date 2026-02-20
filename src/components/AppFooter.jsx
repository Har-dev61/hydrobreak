import React from 'react'
import { t } from '../i18n'

/**
 * Footer mit Links zu Datenschutz, Impressum, AGB und optional Version.
 */
export default function AppFooter({ onOpenLegal, version }) {
  return (
    <footer
      className="mt-10 pt-6 border-t border-app-border-subtle text-center text-sm text-app-muted-foreground"
      role="contentinfo"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {onOpenLegal && (
          <>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[var(--app-accent)] hover:underline"
            >
              {t('settings.privacy')}
            </button>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('imprint')}
              className="hover:text-[var(--app-accent)] hover:underline"
            >
              {t('settings.imprint')}
            </button>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[var(--app-accent)] hover:underline"
            >
              {t('settings.terms')}
            </button>
            {version && (
              <>
                <span aria-hidden>·</span>
                <span className="tabular-nums">v{version}</span>
              </>
            )}
          </>
        )}
      </div>
    </footer>
  )
}
