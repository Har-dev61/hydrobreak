import React from 'react'
import { t, getDailyQuote } from '../i18n'
import ReminderCard from './ReminderCard'
import ProgressTracker from './ProgressTracker'
import GamificationPanel from './GamificationPanel'
import WeekSummaryCard from './WeekSummaryCard'
import LeaderboardCard from './LeaderboardCard'
import QuickActions from './QuickActions'
import VoiceCommandButton from './VoiceCommandButton'
import FocusSessionCard from './FocusSessionCard'
import AIAnalysisCard from './AIAnalysisCard'
import PredictiveHealthCard from './PredictiveHealthCard'
import PullToRefresh from './PullToRefresh'
import ErrorBoundary from './ErrorBoundary'
import AppFooter from './AppFooter'
import { useReminderTimers } from '../context/ReminderTimersContext'
import { SNOOZE_MINUTES } from '../constants'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatCountdown(seconds) {
  if (seconds <= 0) return t('app.now')
  if (seconds < 60) return `${seconds} ${t('app.seconds')}`
  const min = Math.floor(seconds / 60)
  return `${min} ${t('app.minutes')}`
}

function isInFocusTime(enabled, start, end) {
  if (!enabled || !start || !end) return false
  const now = new Date()
  const min = now.getHours() * 60 + now.getMinutes()
  const [sH, sM] = start.split(':').map(Number)
  const [eH, eM] = end.split(':').map(Number)
  const startMin = sH * 60 + sM
  const endMin = eH * 60 + eM
  if (startMin <= endMin) return min >= startMin && min < endMin
  return min >= startMin || min < endMin
}

function isOutsideReminderWindow(enabled, start, end) {
  if (!enabled || !start || !end) return false
  return !isInFocusTime(true, start, end)
}

/**
 * Heute-Tab: Header + Hauptinhalt mit Erinnerungs-Karten.
 * Nutzt useReminderTimers() – nur dieser Teilbaum rendert jede Sekunde, nicht die ganze App.
 */
export default function TodayTab({ todayProps }) {
  const {
    user,
    voice,
    focusModeEnabled,
    focusStart,
    focusEnd,
    reminderWindowEnabled,
    reminderWindowStart,
    reminderWindowEnd,
    reminderWeekdaysOnly,
    waterIntervalMinutes,
    standUpIntervalMinutes,
    eyeBreakIntervalMinutes,
    waterMessage,
    standMessage,
    eyeMessage,
    gamification,
    weeklySummaries,
    leaderboardPercentile,
    waterGoalMl,
    todayActivity,
    heatmapData,
    milestonesForDisplay,
    progress,
    showStats,
    dailyHistory,
    weeklyTotal,
    focusSessionDurationMinutes,
    APP_VERSION,
    handleDrinkNow,
    handleStartBreak,
    handleStartEyeBreak,
    handleSnoozeWater,
    handleSnoozeStand,
    handleSnoozeEye,
    handleClaimChallenge,
    handleToggleStats,
    setStatsModalOpen,
    handleRefresh,
    handleOpenLegal,
    quickActionFeedback,
    dailyContext = {},
    weather = null,
    stats = { daily: [] },
    settings = {},
    todayKey: todayKeyProp,
  } = todayProps
  const todayKey = todayKeyProp || new Date().toDateString()

  const {
    waterRemaining,
    standRemaining,
    eyeRemaining,
    resetWater,
    resetStand,
    resetEye,
  } = useReminderTimers()

  const onDrink = () => {
    handleDrinkNow()
    resetWater()
  }
  const onStand = () => {
    handleStartBreak()
    resetStand()
  }
  const onEye = () => {
    handleStartEyeBreak()
    resetEye()
  }

  return (
    <>
      <header className="mb-6 text-center animate-fade-in shrink-0" role="banner">
        {isInFocusTime(focusModeEnabled, focusStart, focusEnd) && (
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-button bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-2 text-amber-800 dark:text-amber-200 text-sm font-medium"
            role="status"
            aria-live="polite"
            aria-label={t('app.focusTimeBanner')}
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden />
            {t('app.focusTimeBanner')}
          </div>
        )}
        {reminderWindowEnabled &&
          isOutsideReminderWindow(reminderWindowEnabled, reminderWindowStart, reminderWindowEnd) && (
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-button bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 px-3 py-2 text-blue-800 dark:text-blue-200 text-sm font-medium"
              role="status"
              aria-live="polite"
              aria-label={t('app.reminderWindowBanner')}
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden />
              {t('app.reminderWindowBanner')}
            </div>
          )}
        {reminderWeekdaysOnly && (() => {
          const d = new Date().getDay()
          if (d !== 0 && d !== 6) return null
          return (
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-button bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 px-3 py-2 text-blue-800 dark:text-blue-200 text-sm font-medium"
              role="status"
              aria-live="polite"
              aria-label={t('app.reminderWeekendBanner')}
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden />
              {t('app.reminderWeekendBanner')}
            </div>
          )
        })()}
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--app-primary)]" id="app-title">
          {t('app.title')}
        </h1>
        <p className="mt-1 text-sm text-app-muted-foreground">{t('app.subtitle')}</p>
        <div className="mt-3 flex flex-col items-center gap-1">
          <VoiceCommandButton
            isListening={voice.isListening}
            isSupported={voice.isSupported}
            error={voice.error}
            onStart={voice.start}
            onStop={voice.stop}
            className="bg-app-surface hover:bg-app-surface-hover border border-app-border-subtle"
          />
          {voice.isSupported && !voice.error && (
            <p className="text-[10px] text-app-muted-foreground text-center max-w-[260px]">
              {t('voice.hint')}
            </p>
          )}
          {voice.error === 'denied' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
              {t('voice.denied')}
            </p>
          )}
        </div>
        {(user?.name || user?.email) && (
          <p className="mt-2 text-sm text-app-muted-foreground" aria-live="polite">
            {user?.name
              ? t('app.greeting', { name: user.name })
              : t('app.greeting', { name: user.email?.split('@')[0] || 'Du' })}
          </p>
        )}
        {!(user?.name || user?.email) && getDailyQuote() && (
          <p className="mt-2 text-sm text-app-muted-foreground italic" aria-live="polite">
            {getDailyQuote()}
          </p>
        )}
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <PullToRefresh onRefresh={handleRefresh}>
          <main id="main-content" className="space-y-5 pb-20" role="main" tabIndex={-1}>
            <ErrorBoundary retryable>
              <QuickActions
                onDrink={onDrink}
                onStand={onStand}
                onEye={onEye}
                feedback={quickActionFeedback}
              />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <FocusSessionCard
                durationMinutes={focusSessionDurationMinutes}
                onStartEyeBreak={onEye}
                onStartStandBreak={onStand}
              />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <AIAnalysisCard
                progress={progress}
                waterGoalMl={waterGoalMl}
                stats={stats}
                settings={settings}
                dailyContext={dailyContext}
                weather={weather}
                onDrinkNow={onDrink}
              />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <PredictiveHealthCard
                progress={progress}
                settings={settings}
                weather={weather}
                todayActivity={todayActivity}
                todayKey={todayKey}
              />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <WeekSummaryCard
                thisWeek={weeklySummaries.thisWeek}
                prevWeek={weeklySummaries.prevWeek}
                dailyStreak={gamification.dailyStreak ?? 0}
                user={user}
                onShareWeek={todayProps.handleShareWeek}
              />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <LeaderboardCard percentile={leaderboardPercentile} />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <GamificationPanel
                gamification={gamification}
                progress={progress}
                waterGoalMl={waterGoalMl}
                todayActivity={todayActivity}
                onClaimChallenge={handleClaimChallenge}
                heatmapData={heatmapData}
                milestonesForDisplay={milestonesForDisplay}
              />
            </ErrorBoundary>
            <ErrorBoundary retryable>
              <ProgressTracker
                todayMl={progress.todayMl}
                waterGoalMl={waterGoalMl}
                showStats={showStats}
                dailyHistory={dailyHistory}
                weeklyTotal={weeklyTotal}
                onToggleStats={handleToggleStats}
                onOpenStatsModal={() => setStatsModalOpen(true)}
              />
              <ReminderCard
                type="water"
                title={t('reminder.waterTitle')}
                subtitle={t('reminder.waterSubtitle', { minutes: waterIntervalMinutes })}
                nextIn={formatCountdown(waterRemaining)}
                nextInSeconds={waterRemaining}
                totalSeconds={waterIntervalMinutes * 60}
                message={waterMessage}
                primaryLabel={t('reminder.drinkNow')}
                onPrimary={onDrink}
                onSnooze={handleSnoozeWater}
                snoozeLabel={t('reminder.snoozeIn', { minutes: SNOOZE_MINUTES })}
              />
              <ReminderCard
                type="stand"
                title={t('reminder.standTitle')}
                subtitle={t('reminder.standSubtitle', { minutes: standUpIntervalMinutes })}
                nextIn={formatCountdown(standRemaining)}
                nextInSeconds={standRemaining}
                totalSeconds={standUpIntervalMinutes * 60}
                message={standMessage}
                primaryLabel={t('reminder.startBreak')}
                onPrimary={onStand}
                onSnooze={handleSnoozeStand}
                snoozeLabel={t('reminder.snoozeIn', { minutes: SNOOZE_MINUTES })}
              />
              <ReminderCard
                type="eye"
                title={t('reminder.eyeTitle')}
                subtitle={t('reminder.eyeSubtitle')}
                nextIn={formatCountdown(eyeRemaining)}
                nextInSeconds={eyeRemaining}
                totalSeconds={eyeBreakIntervalMinutes * 60}
                message={eyeMessage}
                primaryLabel={t('reminder.startBreak')}
                onPrimary={onEye}
                onSnooze={handleSnoozeEye}
                snoozeLabel={t('reminder.snoozeIn', { minutes: SNOOZE_MINUTES })}
              />
            </ErrorBoundary>
            <AppFooter onOpenLegal={handleOpenLegal} version={APP_VERSION} />
          </main>
        </PullToRefresh>
      </div>
    </>
  )
}
