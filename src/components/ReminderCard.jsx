import React, { memo } from 'react'
import { Droplets, Move, Eye } from 'lucide-react'
import { t } from '../i18n'

const icons = {
  water: Droplets,
  stand: Move,
  eye: Eye,
}

/** Kreisrunder Fortschritts-Ring (SVG): 0 = leer, 1 = voll. progress = verstrichene Zeit bis zur nächsten Erinnerung. */
function CountdownRing({ progress, size = 44, strokeWidth = 4, className = '' }) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`flex-shrink-0 ${className}`}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-neutral-200 dark:text-neutral-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-blue-500 transition-all duration-1000"
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
    </svg>
  )
}

/**
 * Karte für einen einzelnen Erinnerungstyp (Wasser, Aufstehen, Augen).
 * Zeigt Icon, Titel, nächste Erinnerung mit Fortschritts-Ring und Aktionen.
 */
function ReminderCard({
  type,
  title,
  subtitle,
  nextIn,
  nextInSeconds,
  totalSeconds,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onSnooze,
  snoozeLabel = 'In 10 Min',
  disabled,
}) {
  const Icon = icons[type] || Droplets
  const countdownProgress =
    typeof nextInSeconds === 'number' && totalSeconds > 0
      ? 1 - nextInSeconds / totalSeconds
      : null

  return (
    <div
      className="card p-5 animate-slide-up"
      style={{ animationFillMode: 'backwards' }}
      role="article"
      aria-label={`${title}, ${t('reminder.nextIn')} ${nextIn ?? t('app.now')}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-input bg-blue-500/10 flex items-center justify-center text-blue-500">
          <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[var(--app-primary)]">{title}</h3>
          {subtitle && (
            <p className="text-xs text-app-muted-foreground mt-0.5">{subtitle}</p>
          )}
          {nextIn != null && (
            <div className="flex items-center gap-3 mt-2">
              {countdownProgress != null && (
                <CountdownRing progress={countdownProgress} size={44} strokeWidth={4} />
              )}
              <p className="text-sm text-app-muted-foreground flex items-center gap-1.5">
                <span>{t('reminder.nextIn')}</span>
                <span className="font-medium text-[var(--app-primary)] tabular-nums">{nextIn}</span>
              </p>
            </div>
          )}
          {message && (
            <p className="text-sm text-app-muted-foreground mt-2 italic">
              &quot;{message}&quot;
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {primaryLabel && (
              <button
                type="button"
                onClick={onPrimary}
                disabled={disabled}
                className="px-4 py-2 rounded-button bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] disabled:opacity-50 text-white text-sm font-medium transition-colors focus-ring"
                aria-label={primaryLabel}
              >
                {primaryLabel}
              </button>
            )}
            {onSnooze && (
              <button
                type="button"
                onClick={onSnooze}
                disabled={disabled}
                className="px-4 py-2 rounded-button bg-app-muted hover:bg-app-surface-hover text-[var(--app-primary)] text-sm font-medium transition-colors focus-ring"
                aria-label={snoozeLabel}
              >
                {snoozeLabel}
              </button>
            )}
            {secondaryLabel && !onSnooze && (
              <button
                type="button"
                onClick={onSecondary}
                disabled={disabled}
                className="px-4 py-2 rounded-button bg-app-muted hover:bg-app-surface-hover text-[var(--app-primary)] text-sm font-medium transition-colors focus-ring"
                aria-label={secondaryLabel}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ReminderCard)
