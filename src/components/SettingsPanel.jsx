import React, { useState } from 'react'
import { Settings, Bell, ChevronDown, Clock, User, LogOut, RotateCcw, Download, Briefcase, Timer, Volume2, Smartphone } from 'lucide-react'
import {
  WATER_INTERVAL_MIN,
  WATER_INTERVAL_MAX,
  WATER_INTERVAL_DEFAULT,
  STAND_UP_INTERVAL_DEFAULT,
  EYE_BREAK_INTERVAL_DEFAULT,
  FOCUS_SESSION_OPTIONS,
} from '../constants'
import { getExportableData } from '../utils/storage'
import { t } from '../i18n'

/**
 * Einstellungen: Wasser-Intervall, Aufsteh-Intervall, Augen-Pausen-Intervall,
 * Benachrichtigungen aktivieren, Dark Mode.
 */
export default function SettingsPanel({
  waterIntervalMinutes,
  standUpIntervalMinutes,
  eyeBreakIntervalMinutes,
  notificationsEnabled,
  focusModeEnabled,
  focusStart,
  focusEnd,
  onWaterIntervalChange,
  onStandUpIntervalChange,
  onEyeBreakIntervalChange,
  onNotificationsChange,
  onFocusModeChange,
  onFocusStartChange,
  onFocusEndChange,
  reminderWindowEnabled,
  reminderWindowStart,
  reminderWindowEnd,
  onReminderWindowChange,
  onReminderWindowStartChange,
  onReminderWindowEndChange,
  focusSessionDurationMinutes,
  onFocusSessionDurationChange,
  onRequestNotificationPermission,
  reminderSoundEnabled,
  onReminderSoundChange,
  hapticEnabled,
  onHapticChange,
  darkMode,
  onDarkModeChange,
  locale = 'de',
  onLocaleChange,
  onOpenLegal,
  user,
  onLoginClick,
  onLogout,
  onResetApp,
}) {
  const [open, setOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetClick = () => {
    if (showResetConfirm) {
      onResetApp?.()
      setShowResetConfirm(false)
    } else {
      setShowResetConfirm(true)
    }
  }

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-app-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] focus:ring-inset rounded-t-card"
        aria-expanded={open}
        aria-label={t('settings.toggleAriaLabel')}
      >
        <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
          <Settings className="w-4 h-4 text-app-muted-foreground" aria-hidden />
          {t('settings.title')}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-app-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-4 pb-5 pt-0 space-y-5 border-t border-app-border-subtle">
          {/* Account / Sync */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
              <User className="w-4 h-4 text-app-muted-foreground" />
              {t('settings.account')}
            </span>
            {user ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-xs text-app-muted-foreground truncate max-w-[140px]"
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline flex items-center gap-1"
                  aria-label={t('settings.logout')}
                >
                  <LogOut className="w-4 h-4" aria-hidden /> {t('settings.logout')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
                aria-label={t('settings.loginRegister')}
              >
                {t('settings.loginRegister')}
              </button>
            )}
          </div>
          {user && (
            <p className="text-xs text-app-muted-foreground">{t('settings.syncNote')}</p>
          )}

          {/* Wasser-Intervall */}
          <div>
            <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
              {t('settings.waterIntervalLabel')}
            </label>
            <input
              type="range"
              min={WATER_INTERVAL_MIN}
              max={WATER_INTERVAL_MAX}
              value={waterIntervalMinutes}
              onChange={(e) => onWaterIntervalChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-app-muted accent-blue-500"
            />
            <p className="text-sm text-app-muted-foreground mt-1">
              {t('settings.waterIntervalHint', {
                minutes: waterIntervalMinutes,
                default: WATER_INTERVAL_DEFAULT,
              })}
            </p>
          </div>

          {/* Aufstehen-Intervall */}
          <div>
            <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
              {t('settings.standUpIntervalLabel')}
            </label>
            <input
              type="number"
              min={15}
              max={120}
              value={standUpIntervalMinutes}
              onChange={(e) =>
                onStandUpIntervalChange(Number(e.target.value) || STAND_UP_INTERVAL_DEFAULT)
              }
              className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)]"
            />
          </div>

          {/* Augen-Pause Intervall */}
          <div>
            <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
              {t('settings.eyeBreakIntervalLabel')}
            </label>
            <input
              type="number"
              min={10}
              max={60}
              value={eyeBreakIntervalMinutes}
              onChange={(e) =>
                onEyeBreakIntervalChange(Number(e.target.value) || EYE_BREAK_INTERVAL_DEFAULT)
              }
              className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)]"
            />
            <p className="text-sm text-app-muted-foreground mt-1">
              {t('settings.eyeBreakHint')}
            </p>
          </div>

          {/* Fokuszeiten: Keine Erinnerungen von–bis */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('settings.focusTimes')}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={focusModeEnabled ?? false}
                  onChange={(e) => onFocusModeChange?.(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
                <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
              </label>
            </div>
            {focusModeEnabled && (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="time"
                  value={focusStart ?? '12:00'}
                  onChange={(e) => onFocusStartChange?.(e.target.value)}
                  className="rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                />
                <span className="text-app-muted-foreground">{t('settings.until')}</span>
                <input
                  type="time"
                  value={focusEnd ?? '13:00'}
                  onChange={(e) => onFocusEndChange?.(e.target.value)}
                  className="rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                />
              </div>
            )}
            <p className="text-xs text-app-muted-foreground">
              {t('settings.focusTimesHint')}
            </p>
          </div>

          {/* Fokus-Session: Dauer des Timers */}
          <div>
            <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
              <span className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-app-muted-foreground" />
                {t('settings.focusSessionDurationLabel')}
              </span>
            </label>
            <select
              value={focusSessionDurationMinutes ?? 25}
              onChange={(e) => onFocusSessionDurationChange?.(Number(e.target.value))}
              className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
              aria-label={t('settings.focusSessionDurationLabel')}
            >
              {FOCUS_SESSION_OPTIONS.map((min) => (
                <option key={min} value={min}>
                  {min} Min
                </option>
              ))}
            </select>
            <p className="text-xs text-app-muted-foreground mt-1">
              {t('settings.focusSessionDurationHint')}
            </p>
          </div>

          {/* Arbeitszeiten / Zeitfenster für Reminder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('settings.reminderWindow')}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderWindowEnabled ?? false}
                  onChange={(e) => onReminderWindowChange?.(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
                <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
              </label>
            </div>
            {reminderWindowEnabled && (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="time"
                  value={reminderWindowStart ?? '08:00'}
                  onChange={(e) => onReminderWindowStartChange?.(e.target.value)}
                  className="rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                />
                <span className="text-app-muted-foreground">{t('settings.until')}</span>
                <input
                  type="time"
                  value={reminderWindowEnd ?? '18:00'}
                  onChange={(e) => onReminderWindowEndChange?.(e.target.value)}
                  className="rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                />
              </div>
            )}
            <p className="text-xs text-app-muted-foreground">
              {t('settings.reminderWindowHint')}
            </p>
          </div>

          {/* Benachrichtigungen */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
              <Bell className="w-4 h-4" />
              {t('settings.notifications')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRequestNotificationPermission}
                className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
                aria-label={t('settings.allowNotifications')}
              >
                {t('settings.allowNotifications')}
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => onNotificationsChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
                <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
              </label>
            </div>
          </div>

          {/* Sound bei Erinnerung */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-app-muted-foreground" aria-hidden />
                {t('settings.reminderSound')}
              </span>
              <p className="text-xs text-app-muted-foreground mt-0.5">{t('settings.reminderSoundHint')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={reminderSoundEnabled ?? false}
                onChange={(e) => onReminderSoundChange?.(e.target.checked)}
                className="sr-only peer"
                aria-label={t('settings.reminderSound')}
              />
              <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
              <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
            </label>
          </div>

          {/* Haptik bei Aktionen */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-app-muted-foreground" aria-hidden />
                {t('settings.hapticFeedback')}
              </span>
              <p className="text-xs text-app-muted-foreground mt-0.5">{t('settings.hapticFeedbackHint')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={hapticEnabled ?? true}
                onChange={(e) => onHapticChange?.(e.target.checked)}
                className="sr-only peer"
                aria-label={t('settings.hapticFeedback')}
              />
              <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
              <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--app-primary)]">
              {t('settings.darkMode')}
            </span>
            <select
              value={darkMode}
              onChange={(e) => onDarkModeChange(e.target.value)}
              className="rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-[var(--app-primary)]"
            >
              <option value="light">{t('settings.themeLight')}</option>
              <option value="dark">{t('settings.themeDark')}</option>
              <option value="system">{t('settings.themeSystem')}</option>
            </select>
          </div>

          {/* Sprache */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--app-primary)]">
              {t('settings.language')}
            </span>
            <select
              value={locale}
              onChange={(e) => onLocaleChange?.(e.target.value)}
              className="rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-[var(--app-primary)]"
              aria-label={t('settings.language')}
            >
              <option value="de">{t('settings.languageDe')}</option>
              <option value="en">{t('settings.languageEn')}</option>
            </select>
          </div>

          {/* Rechtliches: Datenschutz, Impressum, AGB */}
          {onOpenLegal && (
            <div className="pt-3 border-t border-app-border-subtle">
              <p className="text-sm font-medium text-[var(--app-primary)] mb-2">
                {t('legal.privacyTitle')} / {t('legal.imprintTitle')}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
                >
                  {t('settings.privacy')}
                </button>
                <span className="text-app-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('imprint')}
                  className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
                >
                  {t('settings.imprint')}
                </button>
                <span className="text-app-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="text-sm text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
                >
                  {t('settings.terms')}
                </button>
              </div>
            </div>
          )}

          {/* Daten exportieren */}
          <div className="pt-3 border-t border-app-border-subtle">
            <p className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2 mb-1">
              <Download className="w-4 h-4" />
              {t('settings.exportData')}
            </p>
            <p className="text-xs text-app-muted-foreground mb-2">
              {t('settings.exportDataHint')}
            </p>
            <button
              type="button"
              onClick={() => {
                const data = getExportableData(user ? { email: user.email } : null)
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: 'application/json',
                })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `hydrobreak-export-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-input border border-app-border text-[var(--app-primary)] hover:bg-app-surface-hover transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('settings.exportData')}
            </button>
          </div>

          {/* App zurücksetzen */}
          {onResetApp && (
            <div className="pt-3 border-t border-app-border-subtle">
              <p className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2 mb-1">
                <RotateCcw className="w-4 h-4" />
                {t('settings.resetApp')}
              </p>
              <p className="text-xs text-app-muted-foreground mb-2">
                {t('settings.resetAppHint')}
              </p>
              {showResetConfirm ? (
                <div className="space-y-2">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {t('settings.resetConfirm')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-sm rounded-input border border-app-border text-[var(--app-primary)] hover:bg-app-surface-hover"
                      aria-label={t('app.close')}
                    >
                      {t('app.close')}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetClick}
                      className="px-3 py-1.5 text-sm rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {t('settings.resetButton')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResetClick}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {t('settings.resetApp')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
