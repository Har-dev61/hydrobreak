/**
 * AI-Analyse-Modul: Mustererkennung, Prognose und Handlungsempfehlungen
 * auf Basis historischer Trinkdaten, Tageszeit, Wochentag, Standort, Aktivität und Wetter.
 */

const MS_PER_HOUR = 60 * 60 * 1000
const HOURS_ACTIVE_DAY = 16 // 6–22 Uhr als „aktiver Tag“

/**
 * Aktueller Kontext für heute (Tageszeit, Wochentag, Standort, Aktivität, Wetter).
 * @param {object} settings – locationContext, activityLevel
 * @param {string} todayKey – toDateString()
 * @param {object} dailyContext – getStoredDailyContext()
 * @param {object} [weather] – { temp, conditionCode } optional
 */
export function getContextForToday(settings, todayKey, dailyContext, weather) {
  const now = new Date()
  const d = new Date(todayKey)
  const weekday = d.getDay() // 0 So … 6 Sa
  const hour = now.getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  const todayContext = dailyContext?.[todayKey] || {}
  return {
    weekday,
    weekdayName: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][weekday],
    isWeekend: weekday === 0 || weekday === 6,
    timeOfDay,
    hour,
    location: todayContext.location ?? settings?.locationContext ?? 'unknown',
    activityLevel: todayContext.activityLevel ?? settings?.activityLevel ?? 'medium',
    weather: weather ? { temp: weather.temp, conditionCode: weather.conditionCode } : null,
  }
}

/**
 * Historische Tage mit Kontext anreichern (für Muster).
 */
function getEnrichedDaily(stats, dailyContext) {
  const daily = stats?.daily || []
  return daily.map((entry) => {
    const ctx = dailyContext?.[entry.date] || {}
    const d = new Date(entry.date)
    return {
      ...entry,
      weekday: d.getDay(),
      location: ctx.location || 'unknown',
      activityLevel: ctx.activityLevel || 'medium',
    }
  })
}

/**
 * Erkennt Muster: z. B. „Du trinkst an Homeoffice-Tagen 30% weniger“.
 * @returns {Array<{ type: string, labelKey: string, value: number, unit: string, descriptionKey: string, meta?: object }>}
 */
export function detectPatterns(stats, settings, dailyContext) {
  const patterns = []
  const enriched = getEnrichedDaily(stats, dailyContext)
  if (enriched.length < 5) return patterns

  const byLocation = {}
  const byWeekday = {}
  const byActivity = {}
  for (const e of enriched) {
    const loc = e.location || 'unknown'
    if (!byLocation[loc]) byLocation[loc] = []
    byLocation[loc].push(e.ml)
    const wd = e.weekday
    if (!byWeekday[wd]) byWeekday[wd] = []
    byWeekday[wd].push(e.ml)
    const act = e.activityLevel || 'medium'
    if (!byActivity[act]) byActivity[act] = []
    byActivity[act].push(e.ml)
  }

  const avg = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length

  // Home vs Büro
  const home = byLocation.home
  const office = byLocation.office
  if (home?.length >= 3 && office?.length >= 3) {
    const avgHome = avg(home)
    const avgOffice = avg(office)
    const diff = avgOffice - avgHome
    const pct = avgOffice > 0 ? Math.round((diff / avgOffice) * 100) : 0
    if (Math.abs(pct) >= 15) {
      patterns.push({
        type: 'location',
        labelKey: pct > 0 ? 'ai.patternHomeLess' : 'ai.patternOfficeLess',
        value: Math.abs(pct),
        unit: 'percent',
        descriptionKey: pct > 0 ? 'ai.patternHomeLessDesc' : 'ai.patternOfficeLessDesc',
        meta: { avgHome: Math.round(avgHome), avgOffice: Math.round(avgOffice) },
      })
    }
  }

  // Wochenende vs Werktag
  const weekend = [...(byWeekday[0] || []), ...(byWeekday[6] || [])]
  const weekday = [1, 2, 3, 4, 5].flatMap((d) => byWeekday[d] || [])
  if (weekend.length >= 3 && weekday.length >= 5) {
    const avgWeekend = avg(weekend)
    const avgWeekday = avg(weekday)
    const pct = avgWeekday > 0 ? Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100) : 0
    if (Math.abs(pct) >= 15) {
      patterns.push({
        type: 'weekday',
        labelKey: pct > 0 ? 'ai.patternWeekendMore' : 'ai.patternWeekendLess',
        value: Math.abs(pct),
        unit: 'percent',
        descriptionKey: pct > 0 ? 'ai.patternWeekendMoreDesc' : 'ai.patternWeekendLessDesc',
      })
    }
  }

  // Aktivitätslevel
  const low = byActivity.low
  const high = byActivity.high
  if (low?.length >= 2 && high?.length >= 2) {
    const avgLow = avg(low)
    const avgHigh = avg(high)
    const pct = avgHigh > 0 ? Math.round(((avgLow - avgHigh) / avgHigh) * 100) : 0
    if (Math.abs(pct) >= 15) {
      patterns.push({
        type: 'activity',
        labelKey: pct > 0 ? 'ai.patternLowActivityMore' : 'ai.patternHighActivityMore',
        value: Math.abs(pct),
        unit: 'percent',
        descriptionKey: 'ai.patternActivityDesc',
      })
    }
  }

  return patterns
}

/**
 * Prognose: Wird das Tagesziel voraussichtlich erreicht?
 * Nutzt lineare Extrapolation + historisches Mittel ähnlicher Tage.
 * @returns {{
 *   willReach: boolean,
 *   confidence: number,
 *   projectedMl: number,
 *   reasonKey: string,
 *   reasonMeta?: object,
 *   similarDaysAvg?: number,
 *   remainingMl: number,
 *   hoursLeft: number
 * }}
 */
export function predictGoal(progress, waterGoalMl, stats, settings, dailyContext, contextToday) {
  const now = new Date()
  const todayKey = progress?.date || new Date().toDateString()
  const todayMl = progress?.todayMl ?? 0
  const remainingMl = Math.max(0, waterGoalMl - todayMl)

  // Verbleibende Stunden bis „Ende Tag“ (22 Uhr)
  const endOfDay = new Date(now)
  endOfDay.setHours(22, 0, 0, 0)
  const hoursLeft = Math.max(0, (endOfDay - now) / MS_PER_HOUR)
  if (hoursLeft < 0.25) {
    return {
      willReach: todayMl >= waterGoalMl,
      confidence: 1,
      projectedMl: todayMl,
      reasonKey: todayMl >= waterGoalMl ? 'ai.predictionGoalReached' : 'ai.predictionDayEnd',
      remainingMl,
      hoursLeft: 0,
    }
  }

  // Vergangene Stunden seit 6 Uhr
  const startOfDay = new Date(now)
  startOfDay.setHours(6, 0, 0, 0)
  const elapsedHours = Math.max(0.5, (now - startOfDay) / MS_PER_HOUR)
  const currentRate = todayMl / elapsedHours
  const projectedByRate = todayMl + currentRate * hoursLeft

  // Ähnliche Tage: gleicher Wochentag + optional gleicher Standort
  const enriched = getEnrichedDaily(stats, dailyContext)
  const similar = enriched.filter(
    (e) =>
      e.weekday === contextToday.weekday &&
      (contextToday.location === 'unknown' || e.location === contextToday.location)
  )
  const similarDaysAvg = similar.length >= 2 ? similar.reduce((s, e) => s + e.ml, 0) / similar.length : null

  // Prognose: Mischung aus Rate und ähnlichen Tagen
  let projectedMl = projectedByRate
  if (similarDaysAvg != null && similar.length >= 3) {
    projectedMl = 0.6 * projectedByRate + 0.4 * similarDaysAvg
  }
  projectedMl = Math.round(projectedMl)

  const willReach = projectedMl >= waterGoalMl
  const gap = waterGoalMl - projectedMl
  let confidence = 0.6
  if (similar.length >= 5) confidence = 0.8
  else if (elapsedHours >= 4 && todayMl > 0) confidence = 0.75

  let reasonKey = 'ai.predictionBasedOnRate'
  const reasonMeta = { projectedMl, waterGoalMl, similarDays: similar.length }
  if (willReach) {
    reasonKey = gap <= 200 ? 'ai.predictionOnTrack' : 'ai.predictionOnTrackComfortable'
  } else {
    if (similarDaysAvg != null && similarDaysAvg < waterGoalMl)
      reasonKey = 'ai.predictionSimilarDaysMiss'
    else reasonKey = 'ai.predictionRateTooLow'
    reasonMeta.gapMl = gap
  }

  return {
    willReach,
    confidence,
    projectedMl,
    reasonKey,
    reasonMeta: { ...reasonMeta, similarDaysAvg: similarDaysAvg ?? undefined },
    similarDaysAvg: similarDaysAvg ?? undefined,
    remainingMl,
    hoursLeft,
  }
}

/**
 * Dynamische Handlungsempfehlungen basierend auf Prognose und Kontext.
 * @returns {Array<{ actionKey: string, priority: number, meta?: object }>}
 */
export function getRecommendations(prediction, progress, waterGoalMl, contextToday) {
  const recs = []
  const todayMl = progress?.todayMl ?? 0
  const remainingMl = Math.max(0, waterGoalMl - todayMl)

  if (prediction.willReach) {
    if (remainingMl > 0 && remainingMl <= 500) {
      recs.push({ actionKey: 'ai.recOneMoreGlass', priority: 1 })
    }
    recs.push({ actionKey: 'ai.recKeepHabit', priority: 2 })
    return recs
  }

  // Ziel voraussichtlich verfehlt
  const glassesToCatchUp = Math.ceil(remainingMl / 250)
  if (prediction.hoursLeft > 2 && glassesToCatchUp <= 4) {
    recs.push({
      actionKey: 'ai.recDrinkNowGlasses',
      priority: 1,
      meta: { count: Math.min(glassesToCatchUp, 3) },
    })
  }
  recs.push({ actionKey: 'ai.recSetReminder', priority: 2 })
  if (contextToday?.location === 'home') {
    recs.push({ actionKey: 'ai.recHomeOfficeTip', priority: 3 })
  }
  if (contextToday?.activityLevel === 'high') {
    recs.push({ actionKey: 'ai.recHighActivity', priority: 3 })
  }
  return recs
}

/**
 * Ein vollständiges Insight-Objekt für die UI.
 */
export function getAIInsights(progress, waterGoalMl, stats, settings, dailyContext, weather) {
  const todayKey = progress?.date || new Date().toDateString()
  const contextToday = getContextForToday(settings, todayKey, dailyContext, weather)
  const patterns = detectPatterns(stats, settings, dailyContext)
  const prediction = predictGoal(progress, waterGoalMl, stats, settings, dailyContext, contextToday)
  const recommendations = getRecommendations(prediction, progress, waterGoalMl, contextToday)
  return {
    context: contextToday,
    patterns,
    prediction,
    recommendations,
  }
}
