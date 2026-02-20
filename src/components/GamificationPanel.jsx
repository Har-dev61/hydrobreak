import React, { useState, memo } from 'react'
import { Trophy, ChevronDown } from 'lucide-react'
import XPBar from './XPBar'
import StreakTracker from './StreakTracker'
import DailyChallengeCard from './DailyChallengeCard'
import BadgeCard from './BadgeCard'
import ActivityHeatmap from './ActivityHeatmap'
import MilestoneList from './MilestoneList'
import { BADGES } from '../constants'
import { getLevelFromXP } from '../utils/gamification'
import { generateDailyChallenge } from '../utils/gamification'
import { t } from '../i18n'

/**
 * Zentrale Gamification-UI: XP/Level-Balken, Streaks, Daily Challenge, Badges und Statistik-Dashboard.
 */
function GamificationPanel({
  gamification,
  progress,
  waterGoalMl,
  todayActivity,
  onClaimChallenge,
  heatmapData = [],
  milestonesForDisplay = [],
}) {
  const [statsOpen, setStatsOpen] = useState(false)
  const { level, xpInLevel, xpNeededForNext, totalXp } = getLevelFromXP(gamification.totalXp ?? 0)

  const todayKey = new Date().toDateString()
  let challenge =
    gamification.dailyChallenges?.date === todayKey ? gamification.dailyChallenges : null
  if (!challenge) {
    challenge = { date: todayKey, ...generateDailyChallenge(todayKey), completed: false }
  }
  const completedChallenge =
    gamification.dailyChallenges?.date === todayKey && gamification.dailyChallenges?.completed

  const waterMlToday = progress?.date === todayKey ? (progress.todayMl ?? 0) : 0
  const waterGlassesToday = todayActivity?.waterGlasses ?? 0
  const standBreaksToday = todayActivity?.standBreaks ?? 0
  const eyeBreaksToday = todayActivity?.eyeBreaks ?? 0

  const badgesEarned = gamification.badgesEarned ?? []
  const dailyStreak = gamification.dailyStreak ?? 0
  const weeklyStreak = gamification.weeklyStreak ?? 0

  return (
    <div className="space-y-4">
      <XPBar
        level={level}
        xpInLevel={xpInLevel}
        xpNeededForNext={xpNeededForNext}
        totalXp={totalXp}
      />

      <DailyChallengeCard
        challenge={{
          type: challenge.type,
          target: challenge.target,
        }}
        waterGoalMl={waterGoalMl}
        waterMlToday={waterMlToday}
        waterGlassesToday={waterGlassesToday}
        standBreaksToday={standBreaksToday}
        eyeBreaksToday={eyeBreaksToday}
        completed={completedChallenge}
        onComplete={onClaimChallenge}
      />

      <StreakTracker dailyStreak={dailyStreak} weeklyStreak={weeklyStreak} />

      <div className="card overflow-hidden">
        <button
          type="button"
          onClick={() => setStatsOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-app-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] focus:ring-inset rounded-t-card"
          aria-expanded={statsOpen}
          aria-controls="gamification-stats-panel"
          id="gamification-stats-toggle"
          aria-label={statsOpen ? t('gamification.statsAndBadges') + ' einklappen' : t('gamification.statsAndBadges') + ' ausklappen'}
        >
          <span className="text-sm font-medium text-[var(--app-primary)] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" aria-hidden />
            {t('gamification.statsAndBadges')}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-app-muted-foreground transition-transform duration-200 ${statsOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {statsOpen && (
          <div id="gamification-stats-panel" className="px-4 pb-5 pt-0 space-y-5 border-t border-app-border-subtle" role="region" aria-labelledby="gamification-stats-toggle">
            <ActivityHeatmap cells={heatmapData} />
            <MilestoneList milestones={milestonesForDisplay} />
            <div>
              <h4 className="text-sm font-medium text-app-muted-foreground mb-2">
                {t('gamification.badgesEarned', {
                  current: badgesEarned.length,
                  total: BADGES.length,
                })}
              </h4>
              {badgesEarned.length === 0 ? (
                <div
                  className="rounded-input bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 p-4"
                  role="status"
                  aria-label={t('emptyStates.noBadgesYet')}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-input bg-amber-500/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {t('emptyStates.noBadgesYet')}
                      </p>
                      <p className="text-xs text-amber-700/90 dark:text-amber-300/90 mt-0.5">
                        {t('emptyStates.noBadgesYetSub')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BADGES.map((b) => (
                    <BadgeCard
                      key={b.id}
                      badgeId={b.id}
                      earned={badgesEarned.includes(b.id)}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-app-muted-foreground space-y-1">
              <p><strong className="text-[var(--app-primary)]">{t('gamification.totalXp')}</strong> {totalXp}</p>
              <p><strong className="text-[var(--app-primary)]">{t('gamification.level')}</strong> {level}</p>
              <p><strong className="text-[var(--app-primary)]">{t('gamification.dailyStreak')}</strong> {dailyStreak} {t('gamification.days')}</p>
              <p><strong className="text-[var(--app-primary)]">{t('gamification.weeklyStreak')}</strong> {weeklyStreak} {t('gamification.weeks')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(GamificationPanel)
