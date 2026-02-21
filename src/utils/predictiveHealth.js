/**
 * Predictive Health Layer: Dehydration-Risiko, Performance-Impact, Müdigkeit,
 * Kopfschmerz-Wahrscheinlichkeit und Recovery-Score auf Basis von
 * Hydration, Aktivität, Schlaf, Wetter und Nutzerparametern.
 * Alle Werte 0–100 (bzw. Performance als Prozent-Impact), Echtzeit und erklärbar.
 */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

/**
 * Input-Struktur für alle Berechnungen.
 * @typedef {Object} PredictiveHealthInput
 * @property {number} todayMl - Heute getrunken (ml)
 * @property {number} waterGoalMl - Tagesziel (ml)
 * @property {string} activityLevel - 'low' | 'medium' | 'high'
 * @property {number|null} weatherTemp - Außentemperatur (°C) oder null
 * @property {number|null} sleepHoursLastNight - Schlafstunden letzte Nacht (optional)
 * @property {number|null} weightKg - Körpergewicht kg (optional)
 * @property {number|null} age - Alter (optional)
 * @property {number|null} lastSportMinutesAgo - Minuten seit letztem Sport (null = kein Sport heute/gestern)
 * @property {number} standBreaksToday - Bewegungs-Pausen heute (Proxy für Aktivität)
 * @property {string} timeOfDay - 'morning' | 'afternoon' | 'evening'
 * @property {number} hour - aktuelle Stunde 0–23
 */

/**
 * Dehydration-Risiko-Score 0–100 (höher = höheres Risiko).
 * Faktoren: Hydrationsfortschritt, Aktivität, Wetter, Schlaf, Tageszeit.
 */
export function computeDehydrationRisk(input) {
  const {
    todayMl = 0,
    waterGoalMl = 2000,
    activityLevel = 'medium',
    weatherTemp = null,
    sleepHoursLastNight = null,
    timeOfDay = 'afternoon',
  } = input

  let risk = 0
  const factors = []

  // Hydration: Anteil am Tagesziel (je weniger, desto höher Risiko)
  const hydrationRatio = waterGoalMl > 0 ? todayMl / waterGoalMl : 0
  const hydrationContrib = Math.round((1 - Math.min(1, hydrationRatio)) * 45) // bis 45 Punkte
  risk += hydrationContrib
  if (hydrationContrib > 5) {
    factors.push({ key: 'ph.dehydration.factorHydration', weight: hydrationContrib })
  }

  // Aktivität: mehr Aktivität → mehr Schweiß → höheres Risiko
  const activityMultiplier = { low: 0.8, medium: 1, high: 1.35 }
  const actMult = activityMultiplier[activityLevel] ?? 1
  const activityContrib = activityLevel === 'high' ? 18 : activityLevel === 'medium' ? 10 : 5
  risk += activityContrib
  factors.push({ key: 'ph.dehydration.factorActivity', weight: activityContrib })

  // Wetter: Hitze erhöht Risiko
  if (weatherTemp != null && weatherTemp > 20) {
    const tempContrib = Math.min(20, Math.round((weatherTemp - 20) * 1.5))
    risk += tempContrib
    factors.push({ key: 'ph.dehydration.factorWeather', weight: tempContrib, meta: { temp: Math.round(weatherTemp) } })
  }

  // Schlafmangel: erhöht Dehydrationswahrnehmung / Flüssigkeitsbilanz
  if (sleepHoursLastNight != null && sleepHoursLastNight < 7) {
    const sleepContrib = Math.min(15, Math.round((7 - sleepHoursLastNight) * 4))
    risk += sleepContrib
    factors.push({ key: 'ph.dehydration.factorSleep', weight: sleepContrib, meta: { hours: sleepHoursLastNight } })
  }

  // Nachmittag: typischer Tiefpunkt der Hydration
  if (timeOfDay === 'afternoon') {
    risk += 5
    factors.push({ key: 'ph.dehydration.factorTime', weight: 5 })
  }

  const score = Math.round(clamp(risk, 0, 100))
  return {
    score,
    label: score <= 25 ? 'ph.dehydration.labelLow' : score <= 55 ? 'ph.dehydration.labelMedium' : 'ph.dehydration.labelHigh',
    factors: factors.slice(0, 5),
  }
}

/**
 * Performance-Impact: geschätzter Einfluss auf Leistung in % (z. B. -15 bis +5).
 * Negativ = Leistungsabfall, positiv = gut hydriert/fit.
 */
export function computePerformanceImpact(input) {
  const dehydration = computeDehydrationRisk(input)
  const fatigue = computeFatiguePrognosis(input)
  const hydrationRatio = input.waterGoalMl > 0 ? (input.todayMl || 0) / input.waterGoalMl : 0
  const sleepOk = input.sleepHoursLastNight == null || input.sleepHoursLastNight >= 6.5

  let impact = 0
  const factors = []

  // Hydration: gut hydriert → leichter Plus, schlecht → Minus
  if (hydrationRatio >= 0.9) {
    impact += 3
    factors.push({ key: 'ph.performance.factorHydrationGood', weight: 3 })
  } else if (hydrationRatio < 0.5) {
    impact -= 8
    factors.push({ key: 'ph.performance.factorHydrationLow', weight: -8 })
  } else if (hydrationRatio < 0.75) {
    impact -= 3
    factors.push({ key: 'ph.performance.factorHydrationMid', weight: -3 })
  }

  // Müdigkeit zieht runter
  if (fatigue.score >= 70) {
    impact -= 6
    factors.push({ key: 'ph.performance.factorFatigueHigh', weight: -6 })
  } else if (fatigue.score >= 45) {
    impact -= 3
    factors.push({ key: 'ph.performance.factorFatigueMid', weight: -3 })
  }

  // Schlaf
  if (sleepOk && input.sleepHoursLastNight != null) {
    impact += 2
    factors.push({ key: 'ph.performance.factorSleepOk', weight: 2 })
  } else if (input.sleepHoursLastNight != null && input.sleepHoursLastNight < 6) {
    impact -= 4
    factors.push({ key: 'ph.performance.factorSleepPoor', weight: -4 })
  }

  impact = Math.round(clamp(impact, -20, 10))
  return {
    impactPercent: impact,
    label: impact >= 0 ? 'ph.performance.labelPositive' : 'ph.performance.labelNegative',
    factors: factors.slice(0, 5),
  }
}

/**
 * Müdigkeits-Prognose 0–100 (höher = müder).
 */
export function computeFatiguePrognosis(input) {
  const {
    sleepHoursLastNight = null,
    todayMl = 0,
    waterGoalMl = 2000,
    hour = 14,
    timeOfDay = 'afternoon',
    activityLevel = 'medium',
  } = input

  let score = 0
  const factors = []

  // Schlaf: Hauptfaktor
  if (sleepHoursLastNight != null) {
    if (sleepHoursLastNight < 5) {
      score += 45
      factors.push({ key: 'ph.fatigue.factorSleepVeryLow', weight: 45, meta: { hours: sleepHoursLastNight } })
    } else if (sleepHoursLastNight < 7) {
      score += 25
      factors.push({ key: 'ph.fatigue.factorSleepLow', weight: 25, meta: { hours: sleepHoursLastNight } })
    } else if (sleepHoursLastNight >= 8) {
      factors.push({ key: 'ph.fatigue.factorSleepGood', weight: -10, meta: { hours: sleepHoursLastNight } })
      score -= 10
    }
  }

  // Tageszeit: Nachmittagstief
  if (hour >= 13 && hour <= 16) {
    score += 15
    factors.push({ key: 'ph.fatigue.factorAfternoon', weight: 15 })
  } else if (hour >= 21) {
    score += 20
    factors.push({ key: 'ph.fatigue.factorEvening', weight: 20 })
  }

  // Dehydration verstärkt Müdigkeit
  const hydrationRatio = waterGoalMl > 0 ? todayMl / waterGoalMl : 0
  if (hydrationRatio < 0.5) {
    score += 15
    factors.push({ key: 'ph.fatigue.factorHydration', weight: 15 })
  }

  score = Math.round(clamp(score, 0, 100))
  return {
    score,
    label: score <= 30 ? 'ph.fatigue.labelLow' : score <= 60 ? 'ph.fatigue.labelMedium' : 'ph.fatigue.labelHigh',
    factors: factors.slice(0, 5),
  }
}

/**
 * Kopfschmerz-Wahrscheinlichkeit 0–100 (%).
 */
export function computeHeadacheProbability(input) {
  const dehydration = computeDehydrationRisk(input)
  const fatigue = computeFatiguePrognosis(input)
  const { sleepHoursLastNight = null } = input

  let prob = 0
  const factors = []

  // Dehydration ist starker Treiber für Kopfschmerzen
  if (dehydration.score >= 60) {
    prob += 40
    factors.push({ key: 'ph.headache.factorDehydrationHigh', weight: 40 })
  } else if (dehydration.score >= 40) {
    prob += 25
    factors.push({ key: 'ph.headache.factorDehydrationMid', weight: 25 })
  } else if (dehydration.score >= 25) {
    prob += 10
    factors.push({ key: 'ph.headache.factorDehydrationLow', weight: 10 })
  }

  // Müdigkeit
  if (fatigue.score >= 60) {
    prob += 25
    factors.push({ key: 'ph.headache.factorFatigue', weight: 25 })
  } else if (fatigue.score >= 40) {
    prob += 12
    factors.push({ key: 'ph.headache.factorFatigueMid', weight: 12 })
  }

  // Schlafmangel
  if (sleepHoursLastNight != null && sleepHoursLastNight < 6) {
    prob += 15
    factors.push({ key: 'ph.headache.factorSleep', weight: 15, meta: { hours: sleepHoursLastNight } })
  }

  prob = Math.round(clamp(prob, 0, 100))
  return {
    probability: prob,
    label: prob <= 25 ? 'ph.headache.labelLow' : prob <= 55 ? 'ph.headache.labelMedium' : 'ph.headache.labelHigh',
    factors: factors.slice(0, 5),
  }
}

/**
 * Recovery-Score nach sportlicher Belastung 0–100 (höher = besser erholt).
 */
export function computeRecoveryScore(input) {
  const {
    lastSportMinutesAgo = null,
    todayMl = 0,
    waterGoalMl = 2000,
    sleepHoursLastNight = null,
    activityLevel = 'medium',
  } = input

  // Kein Sport angegeben → Recovery als „allgemeiner Zustand“ (Hydration + Schlaf)
  const noSport = lastSportMinutesAgo == null || lastSportMinutesAgo < 0

  let score = 50 // Basis
  const factors = []

  if (!noSport) {
    // Zeit seit Sport: mehr Zeit = bessere Erholung (bis ~24h)
    const hoursSince = lastSportMinutesAgo / 60
    if (hoursSince >= 20) {
      score += 20
      factors.push({ key: 'ph.recovery.factorTimeSinceSport', weight: 20, meta: { hours: Math.round(hoursSince) } })
    } else if (hoursSince >= 8) {
      score += 10
      factors.push({ key: 'ph.recovery.factorTimeSinceSportMid', weight: 10, meta: { hours: Math.round(hoursSince) } })
    } else if (hoursSince < 2) {
      score -= 25
      factors.push({ key: 'ph.recovery.factorJustFinished', weight: -25 })
    }
  }

  // Hydration unterstützt Recovery
  const hydrationRatio = waterGoalMl > 0 ? todayMl / waterGoalMl : 0
  if (hydrationRatio >= 0.8) {
    score += 15
    factors.push({ key: 'ph.recovery.factorHydrationGood', weight: 15 })
  } else if (hydrationRatio >= 0.5) {
    score += 5
    factors.push({ key: 'ph.recovery.factorHydrationMid', weight: 5 })
  } else if (hydrationRatio < 0.3) {
    score -= 15
    factors.push({ key: 'ph.recovery.factorHydrationLow', weight: -15 })
  }

  // Schlaf
  if (sleepHoursLastNight != null) {
    if (sleepHoursLastNight >= 7) {
      score += 15
      factors.push({ key: 'ph.recovery.factorSleepGood', weight: 15, meta: { hours: sleepHoursLastNight } })
    } else if (sleepHoursLastNight < 5) {
      score -= 15
      factors.push({ key: 'ph.recovery.factorSleepPoor', weight: -15, meta: { hours: sleepHoursLastNight } })
    }
  }

  score = Math.round(clamp(score, 0, 100))
  return {
    score,
    label: score >= 70 ? 'ph.recovery.labelGood' : score >= 45 ? 'ph.recovery.labelModerate' : 'ph.recovery.labelLow',
    noSport,
    factors: factors.slice(0, 5),
  }
}

/**
 * Baut Input-Objekt aus App-State (Progress, Settings, Wetter, heute-Aktivität).
 */
export function buildPredictiveHealthInput({
  progress = {},
  settings = {},
  weather = null,
  todayActivity = {},
  todayKey,
}) {
  const now = new Date()
  const hour = now.getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  const dateKey = todayKey || now.toDateString()

  return {
    todayMl: progress.date === dateKey ? (progress.todayMl ?? 0) : 0,
    waterGoalMl: settings.waterGoalMl ?? 2000,
    activityLevel: settings.activityLevel ?? 'medium',
    weatherTemp: weather?.temp ?? null,
    sleepHoursLastNight: settings.sleepHoursLastNight ?? null,
    weightKg: settings.weightKg ?? null,
    age: settings.age ?? null,
    lastSportMinutesAgo: settings.lastSportMinutesAgo ?? null,
    standBreaksToday: todayActivity.standBreaks ?? 0,
    timeOfDay,
    hour,
  }
}

/**
 * Berechnet alle Predictive-Health-Metriken und Erklärungen in einem Aufruf.
 * Für Echtzeit-Updates: bei jeder Änderung von progress/settings/weather/todayActivity aufrufen.
 */
export function computePredictiveHealth(input) {
  const dehydration = computeDehydrationRisk(input)
  const performance = computePerformanceImpact(input)
  const fatigue = computeFatiguePrognosis(input)
  const headache = computeHeadacheProbability(input)
  const recovery = computeRecoveryScore(input)

  return {
    dehydrationRisk: dehydration,
    performanceImpact: performance,
    fatiguePrognosis: fatigue,
    headacheProbability: headache,
    recoveryScore: recovery,
    updatedAt: new Date().toISOString(),
  }
}
