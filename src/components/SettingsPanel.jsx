import React, { useState, useEffect } from 'react'
import { Settings, Bell, ChevronDown, Clock, User, LogOut, RotateCcw, Download, Briefcase, Timer, Volume2, Smartphone, Mail, History, Droplets, Move, Eye, MapPin, Activity, BarChart3 } from 'lucide-react'
import { user as userApi } from '../api/client'
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
  reminderWeekdaysOnly,
  onReminderWeekdaysOnlyChange,
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
  emailDigestEnabled = false,
  onEmailDigestChange,
  locationContext = 'unknown',
  activityLevel = 'medium',
  weatherForInsights = true,
  onLocationContextChange,
  onActivityLevelChange,
  onWeatherForInsightsChange,
  sleepHoursLastNight = null,
  weightKg = null,
  age = null,
  sex = 'unknown',
  lastSportMinutesAgo = null,
  onSleepHoursChange,
  onWeightKgChange,
  onAgeChange,
  onSexChange,
  onLastSportMinutesAgoChange,
}) {
  const [open, setOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [reminderHistoryOpen, setReminderHistoryOpen] = useState(false)
  const [reminderHistoryTodayOnly, setReminderHistoryTodayOnly] = useState(true)
  const [reminderHistoryItems, setReminderHistoryItems] = useState([])
  const [reminderHistoryLoading, setReminderHistoryLoading] = useState(false)

  useEffect(() => {
    if (!user || !reminderHistoryOpen) return
    setReminderHistoryLoading(true)
    userApi.getReminderHistory(reminderHistoryTodayOnly).then((data) => {
      setReminderHistoryItems(data?.items ?? [])
    }).catch(() => setReminderHistoryItems([])).finally(() => setReminderHistoryLoading(false))
  }, [user, reminderHistoryOpen, reminderHistoryTodayOnly])

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
          {user && onEmailDigestChange && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                <Mail className="w-4 h-4 text-app-muted-foreground" />
                {t('settings.emailDigest')}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailDigestEnabled}
                  onChange={(e) => onEmailDigestChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
                <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
              </label>
            </div>
          )}
          {user && emailDigestEnabled && (
            <p className="text-xs text-app-muted-foreground">{t('settings.emailDigestHint')}</p>
          )}
          {/* Standort & Aktivität für AI-Insights */}
          {onLocationContextChange && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--app-primary)] mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-app-muted-foreground" />
                  {t('settings.locationContext')}
                </label>
                <select
                  value={locationContext}
                  onChange={(e) => onLocationContextChange(e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                  aria-describedby="location-context-hint"
                >
                  <option value="unknown">{t('settings.locationUnknown')}</option>
                  <option value="home">{t('settings.locationHome')}</option>
                  <option value="office">{t('settings.locationOffice')}</option>
                  <option value="other">{t('settings.locationOther')}</option>
                </select>
                <p id="location-context-hint" className="text-xs text-app-muted-foreground mt-1">
                  {t('settings.locationContextHint')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-primary)] mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-app-muted-foreground" />
                  {t('settings.activityLevel')}
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => onActivityLevelChange(e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                  aria-describedby="activity-level-hint"
                >
                  <option value="low">{t('settings.activityLow')}</option>
                  <option value="medium">{t('settings.activityMedium')}</option>
                  <option value="high">{t('settings.activityHigh')}</option>
                </select>
                <p id="activity-level-hint" className="text-xs text-app-muted-foreground mt-1">
                  {t('settings.activityLevelHint')}
                </p>
              </div>
              {onWeatherForInsightsChange && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                    {t('settings.weatherForInsights')}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weatherForInsights}
                      onChange={(e) => onWeatherForInsightsChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
                    <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
                  </label>
                </div>
              )}
              {onWeatherForInsightsChange && (
                <p className="text-xs text-app-muted-foreground">{t('settings.weatherForInsightsHint')}</p>
              )}
            </div>
          )}

          {/* Predictive Health – optionale Nutzerparameter */}
          {(onSleepHoursChange || onWeightKgChange || onAgeChange || onSexChange || onLastSportMinutesAgoChange) && (
            <div className="space-y-3 pt-2 border-t border-app-border-subtle">
              <p className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-app-muted-foreground" />
                {t('settings.predictiveHealth')}
              </p>
              <p className="text-xs text-app-muted-foreground">{t('settings.predictiveHealthHint')}</p>
              {onSleepHoursChange && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
                    {t('settings.sleepHoursLastNight')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    step={0.5}
                    value={sleepHoursLastNight ?? ''}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value)
                      onSleepHoursChange(v)
                    }}
                    placeholder="z. B. 7"
                    className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                    aria-describedby="sleep-hours-hint"
                  />
                  <p id="sleep-hours-hint" className="text-xs text-app-muted-foreground mt-1">
                    {t('settings.sleepHoursHint')}
                  </p>
                </div>
              )}
              {onWeightKgChange && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
                    {t('settings.weightKg')}
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={300}
                    value={weightKg ?? ''}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value)
                      onWeightKgChange(v)
                    }}
                    placeholder="z. B. 70"
                    className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                    aria-describedby="weight-hint"
                  />
                  <p id="weight-hint" className="text-xs text-app-muted-foreground mt-1">
                    {t('settings.weightKgHint')}
                  </p>
                </div>
              )}
              {onAgeChange && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
                    {t('settings.age')}
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={age ?? ''}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value)
                      onAgeChange(v)
                    }}
                    placeholder="z. B. 30"
                    className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                    aria-describedby="age-hint"
                  />
                  <p id="age-hint" className="text-xs text-app-muted-foreground mt-1">
                    {t('settings.ageHint')}
                  </p>
                </div>
              )}
              {onSexChange && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
                    {t('settings.sex')}
                  </label>
                  <select
                    value={sex ?? 'unknown'}
                    onChange={(e) => onSexChange(e.target.value)}
                    className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                  >
                    <option value="unknown">{t('settings.sexUnknown')}</option>
                    <option value="male">{t('settings.sexMale')}</option>
                    <option value="female">{t('settings.sexFemale')}</option>
                  </select>
                </div>
              )}
              {onLastSportMinutesAgoChange && (
                <div>
                  <label className="block text-sm font-medium text-[var(--app-primary)] mb-1">
                    {t('settings.lastSportMinutesAgo')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1440}
                    value={lastSportMinutesAgo ?? ''}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value)
                      onLastSportMinutesAgoChange(v)
                    }}
                    placeholder="z. B. 120 (vor 2 h)"
                    className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-[var(--app-primary)] text-sm"
                    aria-describedby="last-sport-hint"
                  />
                  <p id="last-sport-hint" className="text-xs text-app-muted-foreground mt-1">
                    {t('settings.lastSportHint')}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-app-muted-foreground">{t('widget.addToHomeHintDesc')}</p>
            <a
              href="/?view=compact"
              className="text-sm font-medium text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              {t('widget.addToHomeHint')}
            </a>
          </div>
          {user && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setReminderHistoryOpen((o) => !o)}
                className="w-full flex items-center justify-between text-left text-sm font-medium text-[var(--app-primary)] gap-2"
                aria-expanded={reminderHistoryOpen}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-app-muted-foreground" />
                  {t('reminderHistory.title')}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-app-muted-foreground transition-transform duration-200 ${reminderHistoryOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {reminderHistoryOpen && (
                <div className="pl-6 space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReminderHistoryTodayOnly(true)}
                      className={`text-xs px-2 py-1 rounded-md ${reminderHistoryTodayOnly ? 'bg-[var(--app-accent)] text-white' : 'bg-app-muted text-app-muted-foreground'}`}
                    >
                      {t('reminderHistory.todayOnly')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReminderHistoryTodayOnly(false)}
                      className={`text-xs px-2 py-1 rounded-md ${!reminderHistoryTodayOnly ? 'bg-[var(--app-accent)] text-white' : 'bg-app-muted text-app-muted-foreground'}`}
                    >
                      {t('reminderHistory.all')}
                    </button>
                  </div>
                  <div className="text-sm space-y-1.5 max-h-48 overflow-y-auto">
                    {reminderHistoryLoading && <p className="text-app-muted-foreground">{t('app.loading')}</p>}
                    {!reminderHistoryLoading && reminderHistoryItems.length === 0 && (
                      <p className="text-app-muted-foreground">
                        {reminderHistoryTodayOnly ? t('reminderHistory.emptyToday') : t('reminderHistory.empty')}
                      </p>
                    )}
                    {!reminderHistoryLoading && reminderHistoryItems.map((item, i) => {
                      const isToday = item.triggeredAt && new Date(item.triggeredAt).toDateString() === new Date().toDateString()
                      const Icon = item.type === 'water' ? Droplets : item.type === 'stand' ? Move : Eye
                      const label = item.type === 'water' ? t('reminderHistory.water') : item.type === 'stand' ? t('reminderHistory.stand') : t('reminderHistory.eye')
                      const timeStr = item.triggeredAt
                        ? (isToday
                          ? new Date(item.triggeredAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                          : new Date(item.triggeredAt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))
                        : '–'
                      return (
                        <div key={i} className="flex items-center gap-2 py-1 border-b border-app-border-subtle last:border-0">
                          <Icon className="w-4 h-4 shrink-0 text-app-muted-foreground" aria-hidden />
                          <span className="text-[var(--app-primary)]">{label}</span>
                          <span className="text-app-muted-foreground text-xs ml-auto">{timeStr}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
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
            <div className="pt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--app-primary)]">
                  {t('settings.reminderWeekdaysOnly')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderWeekdaysOnly ?? false}
                    onChange={(e) => onReminderWeekdaysOnlyChange?.(e.target.checked)}
                    className="sr-only peer"
                    aria-describedby="reminder-weekdays-hint"
                  />
                  <div className="w-10 h-6 rounded-full bg-app-muted peer-checked:bg-blue-500 transition-colors" />
                  <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
                </label>
              </div>
              <p id="reminder-weekdays-hint" className="text-xs text-app-muted-foreground">
                {t('settings.reminderWeekdaysOnlyHint')}
              </p>
            </div>
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
