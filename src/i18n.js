/**
 * i18n-Vorbereitung: Zentrale Übersetzungs-Keys (DE als Default).
 * Später z. B. react-i18next einbinden und diese Struktur als Übersetzungsdateien nutzen.
 *
 * Verwendung: t('app.title'), t('progress.percentToGo', { percent: 50 })
 * Interpolation: {{variableName}} im String wird durch vars.variableName ersetzt.
 */

const de = {
  app: {
    title: 'HydroBreak',
    subtitle: 'Trinken · Bewegen · Augen entspannen',
    focusTimePaused: 'Fokuszeit – Erinnerungen pausiert',
    focusTimeBanner: 'Erinnerungen pausiert – Fokuszeit',
    reminderWindowBanner: 'Außerhalb der Arbeitszeiten – Erinnerungen pausiert',
    reminderWeekendBanner: 'Am Wochenende – Erinnerungen pausiert',
    offlineBanner: 'Du bist offline – deine Daten werden beim nächsten Mal synchronisiert.',
    now: 'Jetzt',
    seconds: 'Sek',
    minutes: 'Min',
    close: 'Schließen',
    loading: 'Wird geladen …',
    greeting: 'Hallo, {{name}}!',
    nextReminderIn: 'Nächste Erinnerung in {{time}}',
  },

  emptyStates: {
    firstGlass: 'Trink dein erstes Glas!',
    firstBreak: 'Starte deine erste Pause.',
    firstChallenge: 'Erledige heute eine Aktion – dann siehst du hier deine erste Challenge abgehakt.',
    firstChallengeCta: 'Trink ein Glas, mach eine Pause oder eine Augenübung.',
    noBadgesYet: 'Noch keine Badges.',
    noBadgesYetSub: 'Trink dein erstes Glas, mach Pausen und erledige Challenges – dann füllt sich diese Sammlung.',
    noStreaksYet: 'Noch kein Streak.',
    noStreaksYetSub: 'Sei an mehreren Tagen hintereinander aktiv – dann startet dein Streak.',
    noMilestonesYet: 'Meilensteine kommen mit der Zeit.',
  },

  dailyQuotes: [
    'Jeder Schluck zählt.',
    'Kleine Pausen, großer Effekt.',
    'Heute ein bisschen besser als gestern.',
    'Dein Körper dankt dir.',
    'Bleib hydratisiert, bleib fokussiert.',
    'Eine Pause ist kein Stillstand.',
    'Trinken nicht vergessen!',
    'Zeit für eine kurze Auszeit.',
  ],

  onboarding: {
    step1Title: 'Dein Tagesziel',
    step1Question: 'Wie viel Wasser möchtest du pro Tag trinken?',
    step1Hint: 'Du kannst das jederzeit in den Einstellungen anpassen.',
    continue: 'Weiter',
    step2Title: 'Erinnerungen erhalten',
    step2Description:
      'Erlaube Benachrichtigungen – dann erinnerst du dich an Trinken, Aufstehen und die 20-20-20 Augenpause, auch wenn die App im Hintergrund ist.',
    step2Benefits: 'Wasser · Pausen · Augen',
    allow: 'Erlauben',
    later: 'Später',
    step3Title: 'Fast geschafft!',
    step3Goal: 'Dein Ziel: {{liters}} Liter pro Tag.',
    step3WithNotifications: ' Erinnerungen sind aktiviert.',
    step3WithoutNotifications:
      ' Du kannst Benachrichtigungen später in den Einstellungen aktivieren.',
    step4Title: 'App zum Startbildschirm',
    step4Description: 'So hast du HydroBreak immer griffbereit – wie eine native App.',
    step4Ios: 'Safari: Teilen → „Zum Home-Bildschirm“.',
    step4Android: 'Chrome: Menü (⋮) → „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
    step4Skip: 'Überspringen',
    start: "Los geht's!",
  },

  waterGoalOptions: {
    1500: '1,5 Liter',
    2000: '2 Liter',
    2500: '2,5 Liter',
  },

  settings: {
    title: 'Einstellungen',
    toggleAriaLabel: 'Einstellungen ein- oder ausklappen',
    account: 'Account',
    logout: 'Abmelden',
    loginRegister: 'Anmelden / Registrieren',
    syncNote: 'Deine Daten werden mit dem Server synchronisiert.',
    waterIntervalLabel: 'Wasser-Erinnerung (Minuten)',
    waterIntervalHint: 'Alle {{minutes}} Min (Standard: {{default}})',
    standUpIntervalLabel: 'Aufstehen-Erinnerung (Minuten)',
    eyeBreakIntervalLabel: '20-20-20 Erinnerung (Minuten)',
    eyeBreakHint: 'Alle 20 Min 20 Sek in die Ferne schauen',
    focusTimes: 'Fokuszeiten',
    focusTimesHint: 'In dieser Zeit werden keine Erinnerungen angezeigt.',
    focusSessionDurationLabel: 'Fokus-Session Dauer',
    focusSessionDurationHint: 'Timer-Länge für eine konzentrierte Arbeitsphase.',
    reminderWindow: 'Arbeitszeiten',
    reminderWindowHint: 'Erinnerungen nur in diesem Zeitfenster (z. B. 8–18 Uhr).',
    reminderWeekdaysOnly: 'Erinnerungen nur an Werktagen',
    reminderWeekdaysOnlyHint: 'Mo–Fr; am Wochenende keine Erinnerungen.',
    until: 'bis',
    notifications: 'Browser-Benachrichtigungen',
    allowNotifications: 'Erlauben',
    darkMode: 'Dark Mode',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeSystem: 'System',
    exportData: 'Daten exportieren',
    exportDataHint: 'Lade Einstellungen, Fortschritt und Statistiken als JSON-Datei herunter.',
    resetApp: 'App zurücksetzen',
    resetAppHint: 'Löscht alle lokalen Daten und startet mit dem Onboarding neu.',
    resetConfirm: 'Wirklich zurücksetzen? Alle Einstellungen, dein Fortschritt und Statistiken werden gelöscht.',
    resetButton: 'Ja, zurücksetzen',
    reminderSound: 'Sound bei Erinnerung',
    reminderSoundHint: 'Kurzer Ton, wenn eine Erinnerung erscheint.',
    hapticFeedback: 'Haptik bei Aktionen',
    hapticFeedbackHint: 'Vibration bei „Glas getrunken“, Pause, Challenge (falls vom Gerät unterstützt).',
    emailDigest: 'Wochen-Zusammenfassung per E-Mail',
    emailDigestHint: 'Sonntag Abend: Liter, Pausen, Streak und Badges an deine E-Mail.',
    language: 'Sprache',
    languageDe: 'Deutsch',
    languageEn: 'English',
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    terms: 'AGB',
    locationContext: 'Standort für Insights',
    locationContextHint: 'Homeoffice, Büro oder unterwegs – hilft bei personalisierten Mustern.',
    locationHome: 'Homeoffice',
    locationOffice: 'Büro',
    locationOther: 'Unterwegs / Sonstiges',
    locationUnknown: 'Keine Angabe',
    activityLevel: 'Aktivitätslevel',
    activityLevelHint: 'Beeinflusst Trinkempfehlungen.',
    activityLow: 'Niedrig',
    activityMedium: 'Mittel',
    activityHigh: 'Hoch',
    weatherForInsights: 'Wetter für Insights',
    weatherForInsightsHint: 'Standort für Wetter (optional). Verbessert Kontext der Analyse.',
    predictiveHealth: 'Predictive Health – Parameter',
    predictiveHealthHint: 'Optional. Verbessern Dehydrations-, Müdigkeits- und Recovery-Scores.',
    sleepHoursLastNight: 'Schlafstunden (letzte Nacht)',
    sleepHoursHint: 'Ca. wie viele Stunden hast du geschlafen?',
    weightKg: 'Gewicht (kg)',
    weightKgHint: 'Für personalisierte Trinkempfehlungen.',
    age: 'Alter',
    ageHint: 'Optional für bessere Schätzungen.',
    sex: 'Geschlecht',
    sexUnknown: 'Keine Angabe',
    sexMale: 'Männlich',
    sexFemale: 'Weiblich',
    lastSportMinutesAgo: 'Minuten seit letztem Sport',
    lastSportHint: 'Leer = kein Sport. Sonst z. B. 120 = vor 2 Stunden.',
  },

  ai: {
    title: 'Deine Hydration-Insights',
    subtitle: 'Muster, Prognose und Tipps',
    patternTitle: 'Erkannte Muster',
    predictionTitle: 'Prognose für heute',
    recommendationsTitle: 'Empfehlungen',
    patternHomeLess: 'Du trinkst an Homeoffice-Tagen {{value}}% weniger.',
    patternHomeLessDesc: 'An Tagen im Büro trinkst du im Schnitt mehr. Nutze Erinnerungen zu Hause.',
    patternOfficeLess: 'Du trinkst im Büro {{value}}% weniger.',
    patternOfficeLessDesc: 'Zu Hause trinkst du mehr. Im Büro öfter ans Glas denken.',
    patternWeekendMore: 'Am Wochenende trinkst du {{value}}% mehr.',
    patternWeekendMoreDesc: 'Am Wochenende bist du oft besser hydriert.',
    patternWeekendLess: 'Am Wochenende trinkst du {{value}}% weniger.',
    patternWeekendLessDesc: 'Unter der Woche trinkst du mehr. Auch am Wochenende ans Ziel denken.',
    patternLowActivityMore: 'Bei wenig Aktivität trinkst du {{value}}% mehr.',
    patternHighActivityMore: 'Bei hoher Aktivität trinkst du {{value}}% mehr.',
    patternActivityDesc: 'Aktivität und Trinkmenge hängen zusammen – Insights nutzen.',
    predictionOnTrack: 'Du bist auf Kurs.',
    predictionOnTrackComfortable: 'Bei deinem aktuellen Rhythmus erreichst du dein Ziel.',
    predictionGoalReached: 'Tagesziel bereits erreicht.',
    predictionDayEnd: 'Der Tag geht zu Ende – Ziel heute nicht mehr erreicht.',
    predictionBasedOnRate: 'Basierend auf deinem heutigen Rhythmus und ähnlichen Tagen.',
    predictionSimilarDaysMiss: 'An ähnlichen Tagen (gleicher Wochentag/Standort) bliebst du oft unter dem Ziel.',
    predictionRateTooLow: 'Dein aktueller Trinkrhythmus reicht nicht für das Tagesziel.',
    predictionProj: 'Prognose: ca. {{projectedMl}} ml von {{waterGoalMl}} ml.',
    recOneMoreGlass: 'Noch ein Glas – dann hast du es geschafft!',
    recKeepHabit: 'Weiter so – bleib dran!',
    recDrinkNowGlasses: 'Trink in den nächsten Stunden {{count}} Glas/Gläser, um auf Kurs zu kommen.',
    recSetReminder: 'Stell dir eine Erinnerung, um regelmäßiger zu trinken.',
    recHomeOfficeTip: 'Tipp: Im Homeoffice oft vergessen – Glas sichtbar hinstellen.',
    recHighActivity: 'Bei hoher Aktivität brauchst du mehr – trink bewusst mehr.',
    noPatternsYet: 'Noch keine Muster. Trink weiter und gib Standort/Aktivität an – dann siehst du hier Insights.',
    loading: 'Insights werden berechnet …',
  },

  ph: {
    title: 'Predictive Health',
    subtitle: 'Echtzeit-Scores aus Hydration, Aktivität, Schlaf & Wetter – erklärbar.',
    dehydrationRisk: 'Dehydrations-Risiko',
    performanceImpact: 'Performance-Impact',
    fatiguePrognosis: 'Müdigkeits-Prognose',
    headacheProbability: 'Kopfschmerz-Wahrscheinlichkeit',
    recoveryScore: 'Recovery (nach Belastung)',
    scoreOutOf100: '{{value}} / 100',
    impactPercent: '{{value}}%',
    probabilityPercent: '{{value}}%',
    why: 'Warum?',
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    good: 'Gut',
    moderate: 'Mäßig',
    positive: 'Leicht positiv',
    negative: 'Leicht negativ',
    dehydration: {
      labelLow: 'Niedrig',
      labelMedium: 'Mittel',
      labelHigh: 'Hoch',
      factorHydration: 'Aktueller Trinkfortschritt unter Ziel',
      factorActivity: 'Aktivitätslevel (Schwitzen)',
      factorWeather: 'Wärme erhöht Flüssigkeitsbedarf',
      factorSleep: 'Weniger Schlaf verschlechtert Flüssigkeitsbilanz',
      factorTime: 'Typisches Nachmittagstief',
    },
    performance: {
      labelPositive: 'Leicht positiv',
      labelNegative: 'Leicht negativ',
      factorHydrationGood: 'Gute Hydration unterstützt Leistung',
      factorHydrationLow: 'Wenig getrunken → Leistungsabfall',
      factorHydrationMid: 'Hydration unter Optimum',
      factorFatigueHigh: 'Müdigkeit mindert Leistung',
      factorFatigueMid: 'Leichte Müdigkeit',
      factorSleepOk: 'Ausreichend Schlaf',
      factorSleepPoor: 'Schlafmangel mindert Leistung',
    },
    fatigue: {
      labelLow: 'Gering',
      labelMedium: 'Mäßig',
      labelHigh: 'Hoch',
      factorSleepVeryLow: 'Sehr wenig Schlaf',
      factorSleepLow: 'Unter 7 h Schlaf',
      factorSleepGood: 'Guter Schlaf',
      factorAfternoon: 'Nachmittagstief',
      factorEvening: 'Abendmüdigkeit',
      factorHydration: 'Wenig getrunken verstärkt Müdigkeit',
    },
    headache: {
      labelLow: 'Gering',
      labelMedium: 'Mäßig',
      labelHigh: 'Erhöht',
      factorDehydrationHigh: 'Dehydration erhöht Kopfschmerzrisiko',
      factorDehydrationMid: 'Leichter Flüssigkeitsmangel',
      factorDehydrationLow: 'Leicht unter Hydrationsziel',
      factorFatigue: 'Müdigkeit begünstigt Kopfschmerzen',
      factorFatigueMid: 'Müdigkeit als Faktor',
      factorSleep: 'Schlafmangel begünstigt Kopfschmerzen',
    },
    recovery: {
      labelGood: 'Gut',
      labelModerate: 'Mäßig',
      labelLow: 'Noch erholen',
      factorTimeSinceSport: 'Ausreichend Zeit seit Belastung',
      factorTimeSinceSportMid: 'Moderate Erholungszeit',
      factorJustFinished: 'Sport gerade beendet',
      factorHydrationGood: 'Gute Hydration unterstützt Erholung',
      factorHydrationMid: 'Hydration ok',
      factorHydrationLow: 'Wenig getrunken hemmt Erholung',
      factorSleepGood: 'Guter Schlaf fördert Erholung',
      factorSleepPoor: 'Wenig Schlaf hemmt Erholung',
      noSportNote: 'Kein Sport eingetragen – Score aus Hydration & Schlaf.',
    },
  },

  progress: {
    todayDrunk: 'Heute getrunken',
    progress: 'Fortschritt',
    stats: 'Statistik',
    liters: 'Liter',
    goalReached: 'Tagesziel erreicht!',
    percentToGo: '{{percent}}% bis zum Ziel',
    thisWeek: 'Diese Woche: {{liters}} Liter',
    lastDays: 'Letzte Tage: {{list}}',
    openStatsModal: 'Statistik mit Verläufen öffnen',
  },

  statsModal: {
    title: 'Statistik',
    dailyTrend: 'Wasser – letzte Tage',
    weekCompare: 'Wochenvergleich',
    daysLabel: 'Letzte {{count}} Tage',
    noData: 'Noch keine Verlaufsdaten.',
    days7: '7 Tage',
    days14: '14 Tage',
    days30: '30 Tage',
    weeklyActivity: 'Aktivität pro Woche',
    weeklyActivityHint: 'Gläser + Pausen pro Woche (letzte 6 Wochen)',
  },

  quickActions: {
    title: 'Schnellaktionen',
    drink: 'Glas getrunken',
    movement: 'Bewegungspause',
    eye: 'Augenpause',
    done: 'Erledigt',
    xpGained: '+{{xp}} XP',
    keyboardHint: 'Tastatur: 1 / 2 / 3 oder D / S / E',
  },

  voice: {
    start: 'Sprachbefehl',
    stop: 'Mikrofon aus',
    listening: 'Höre zu…',
    unsupported: 'Sprache nicht unterstützt',
    denied: 'Mikrofon-Zugriff erlauben',
    hint: 'Sag z. B. „Glas getrunken“, „Pause“ oder „Augenpause“.',
  },

  reminder: {
    waterTitle: 'Wasser trinken',
    waterSubtitle: 'Alle {{minutes}} Min',
    standTitle: 'Aufstehen',
    standSubtitle: 'Alle {{minutes}} Min',
    eyeTitle: '20-20-20 Augenpause',
    eyeSubtitle: '20 Sek in die Ferne schauen',
    nextIn: 'Nächste Erinnerung in',
    drinkNow: 'Jetzt trinken',
    startBreak: 'Pause starten',
    snoozeIn: 'In {{minutes}} Min',
  },

  gamification: {
    statsAndBadges: 'Statistiken & Badges',
    badgesEarned: 'Erreichte Badges ({{current}}/{{total}})',
    totalXp: 'Gesamt-XP:',
    level: 'Level:',
    dailyStreak: 'Tages-Streak:',
    weeklyStreak: 'Wochen-Streak:',
    days: 'Tage',
    weeks: 'Wochen',
    levelLabel: 'Level {{level}}',
    xpTotal: '{{xp}} XP gesamt',
    xpToNext: '{{current}} / {{needed}} XP bis Level {{level}}',
    maxLevel: 'Max. Level erreicht!',
  },

  challenge: {
    daily: 'Tägliche Challenge',
    claimXp: '+50 XP',
    completeButton: 'Challenge abschließen (+50 XP)',
    drinkLiters: '{{liters}} Liter heute trinken',
    waterGlasses: '{{count}} Gläser Wasser',
    movementBreaks: '{{count}} Bewegungs-Pausen',
    eyeBreaks: '{{count}} Augenpausen',
    progressLiters: '{{current}} / {{target}} Liter',
    progressCount: '{{current}} / {{target}}',
  },

  streak: {
    dayStreak: 'Tage-Streak',
    weekStreak: 'Wochen-Streak',
  },

  badges: {
    first_sip: { name: 'Erster Schluck', desc: 'Erstes Glas Wasser getrunken' },
    hydration_hero: { name: 'Hydration Hero', desc: '2 Liter an einem Tag getrunken' },
    water_5: { name: 'Fünferpack', desc: '5 Gläser Wasser an einem Tag' },
    break_master: { name: 'Break Master', desc: '5 Bewegungs-Pausen an einem Tag' },
    first_break: { name: 'Erste Pause', desc: 'Erste Bewegungs-Pause absolviert' },
    focus_champion: { name: 'Focus Champion', desc: '3 Augenpausen an einem Tag' },
    eye_care: { name: 'Augenpflege', desc: 'Erste 20-20-20 Pause absolviert' },
    streak_3: { name: 'Dranbleiber', desc: '3 Tage in Folge aktiv' },
    streak_7: { name: 'Wochen-Champion', desc: '7 Tage in Folge aktiv' },
    streak_week: { name: 'Wochen-Streak', desc: 'Eine Woche lang täglich aktiv' },
    challenge_daily: { name: 'Tages-Challenge', desc: 'Tägliche Challenge abgeschlossen' },
    comeback: { name: 'Willkommen zurück', desc: 'Nach Pause wieder eingestiegen' },
  },

  weekSummary: {
    title: 'Wochenrückblick',
    thisWeek: 'Diese Woche',
    prevWeek: 'Vorwoche',
    glasses: '{{count}} Gläser',
    pauses: '{{count}} Pausen',
    streakDays: '{{count}} Tage Streak',
  },

  leaderboard: {
    title: 'Rangliste',
    topPercent: 'Du bist diese Woche unter den aktivsten {{percent}} %.',
    topPercentSub: 'Anonymisierter Vergleich mit anderen Nutzer:innen.',
    comingSoon: 'Rangliste demnächst',
    comingSoonSub: 'Bald siehst du hier, wie du im Vergleich zu anderen stehst (anonym).',
  },

  share: {
    weekButton: 'Meine Woche teilen',
    copied: 'In Zwischenablage kopiert',
    error: 'Teilen fehlgeschlagen.',
  },

  reminderHistory: {
    title: 'Letzte Erinnerungen',
    todayOnly: 'Heute',
    all: 'Alle',
    water: 'Wasser',
    stand: 'Aufstehen',
    eye: 'Augen',
    empty: 'Noch keine Erinnerungen.',
    emptyToday: 'Heute noch keine Erinnerungen.',
  },

  widget: {
    openFullApp: 'Vollständige App öffnen',
    title: 'Widget-Ansicht',
    addToHomeHint: 'Widget-Ansicht öffnen',
    addToHomeHintDesc: 'Öffnet die kompakte Ansicht – dann „Zum Startbildschirm hinzufügen“ für ein App-Icon mit Wasser & Schnellaktionen.',
  },

  nav: {
    today: 'Heute',
    stats: 'Statistik',
    settings: 'Einstellungen',
  },

  pullRefresh: {
    hint: 'Ziehen zum Aktualisieren',
    updating: 'Wird aktualisiert …',
  },

  heatmap: {
    title: 'Aktivität',
    legend: 'Weniger – Mehr',
    noData: 'Noch keine Daten',
  },

  milestones: {
    title: 'Meilensteine',
    water: '{{liters}} Liter getrunken',
    eyeBreaks: '{{count}} Augenpausen',
    standBreaks: '{{count}} Bewegungs-Pausen',
  },

  comeback: {
    title: 'Willkommen zurück!',
    subtitle: 'Schön, dass du wieder da bist.',
    bonus: '+{{xp}} XP',
  },

  auth: {
    login: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    emailPlaceholder: 'deine@email.de',
    password: 'Passwort',
    passwordPlaceholderLogin: '••••••••',
    passwordPlaceholderRegister: 'mind. 6 Zeichen',
    submitLogin: 'Anmelden',
    submitRegister: 'Registrieren',
    noAccount: 'Noch kein Konto?',
    alreadyRegistered: 'Bereits registriert?',
    loginError: 'Fehler bei der Anmeldung.',
    verifyTitle: 'E-Mail bestätigen',
    verifySent: 'Wir haben einen Bestätigungscode an {{email}} gesendet.',
    verifyCodeLabel: 'Code eingeben',
    verifyCodePlaceholder: 'z. B. 123456',
    verifySubmit: 'Bestätigen',
    verifyResend: 'Code erneut senden',
    verifyResendSent: 'Neuer Code wurde gesendet.',
    verifyError: 'Ungültiger oder abgelaufener Code.',
    gateTitle: 'HydroBreak',
    gateSubtitle: 'Trinken · Bewegen · Augen entspannen',
    gateRegister: 'Registrieren',
    gateLogin: 'Anmelden',
    gateRequired: 'Bitte registriere dich oder melde dich an, um die App zu nutzen.',
    forgotPassword: 'Passwort vergessen?',
    forgotTitle: 'Passwort zurücksetzen',
    forgotSubmit: 'Code senden',
    forgotSent: 'Falls ein Konto mit {{email}} existiert, haben wir einen Code dorthin gesendet. Der Code ist 15 Min gültig.',
    resetTitle: 'Neues Passwort setzen',
    newPassword: 'Neues Passwort',
    newPasswordPlaceholder: 'mind. 6 Zeichen',
    resetSubmit: 'Passwort speichern',
    resetSuccess: 'Passwort wurde geändert. Du bist jetzt angemeldet.',
    resetError: 'Code ungültig oder abgelaufen.',
  },

  errors: {
    boundaryTitle: 'Etwas ist schiefgelaufen',
    boundaryMessage:
      'Dieser Bereich konnte nicht geladen werden. Der Rest der App funktioniert weiter.',
    retry: 'Erneut versuchen',
    storageUnavailable:
      'Speicher voll oder Privatmodus – Einstellungen und Fortschritt werden nur in dieser Sitzung gespeichert.',
  },

  storage: {
    errorBannerDismiss: 'Hinweis schließen',
  },

  notifications: {
    waterTitle: 'HydroBreak – Wasser',
    waterBody: 'Zeit für einen Schluck Wasser!',
    standTitle: 'HydroBreak – Aufstehen',
    standBody: 'Kurz aufstehen und bewegen.',
    eyeTitle: 'HydroBreak – Augenpause',
    eyeBody: '20 Sekunden in die Ferne schauen.',
  },

  messages: {
    water: [
      'Du machst das großartig – weiter so!',
      'Jeder Schluck zählt. Bleib dran!',
      'Dein Körper dankt dir.',
      'Kleiner Schluck, großer Effekt.',
      'Hydration ist Selbstfürsorge.',
      'Du bleibst im Flow.',
    ],
    waterMorning: [
      'Guter Start – erstes Glas?',
      'Morgen-Wasser bringt den Kopf in Schwung.',
      'Hydration am Morgen wirkt den ganzen Tag.',
    ],
    waterAfternoon: [
      'Nach dem Mittag: Zeit für einen Schluck.',
      'Kurze Pause, neuer Fokus.',
      'Dein Körper freut sich über Nachschub.',
    ],
    waterEvening: [
      'Noch ein Schluck für einen guten Abschluss.',
      'Auch am Abend zählt jeder Schluck.',
    ],
    waterStreak: [
      'Dein Streak lebt – bleib dran!',
      'Weiter so, du bist im Flow!',
    ],
    stand: [
      'Zeit, die Beine zu vertreten.',
      'Kurze Pause, großer Gewinn.',
      'Bewegung bringt den Kopf auf Trab.',
      'Steh auf – dein Rücken freut sich.',
    ],
    standMorning: [
      'Früh bewegen, gut durch den Tag.',
      'Erste Pause – Beine strecken.',
    ],
    standAfternoon: [
      'Nachmittagstief? Kurz aufstehen hilft.',
      'Bewegung jetzt bringt neuen Schwung.',
    ],
    standEvening: [
      'Noch eine Runde – dann verdient ausruhen.',
    ],
    standStreak: [
      'Pausen-Streak läuft – mach weiter!',
    ],
    eye: [
      'Gib deinen Augen 20 Sekunden Pause.',
      'Blick in die Ferne – entspannend für die Augen.',
      '20-20-20: Du tust deinen Augen Gutes.',
    ],
    eyeMorning: [
      'Augen schon früh entlasten – gut für den Tag.',
    ],
    eyeAfternoon: [
      'Bildschirmpause – 20 Sek in die Ferne.',
      'Deine Augen verdienen eine Pause.',
    ],
    eyeEvening: [
      'Letzte Augenpause – dann entspannen.',
    ],
    eyeStreak: [
      'Augen-Streak – weiter so!',
    ],
  },

  eyeBreak: {
    title: '20-20-20 Pause',
    description: 'Schau 20 Sekunden in die Ferne – entspannt die Augen.',
    seconds: 'Sekunden',
  },

  focusSession: {
    title: 'Fokus-Session',
    description: 'Starte eine konzentrierte Arbeitsphase. Danach schlagen wir dir eine Pause vor.',
    start: 'Fokus starten',
    cancel: 'Abbrechen',
    timeLeft: 'Noch {{min}}:{{sec}}',
    ended: 'Fokus vorbei!',
    takeBreak: 'Zeit für eine Pause?',
    eyeBreak: 'Augenpause',
    movement: 'Bewegung',
    done: 'Fertig',
  },

  levelUp: {
    title: 'Level {{level}}!',
    subtitle: 'Du bist aufgestiegen.',
  },

  reward: {
    keepGoing: 'Weiter so!',
    badgeUnlocked: 'Badge freigeschaltet',
    xpAnnouncement: '+{{value}} XP. Weiter so!',
    badgeAnnouncement: 'Badge freigeschaltet: {{badge}}',
  },

  legal: {
    privacyTitle: 'Datenschutz',
    imprintTitle: 'Impressum',
    termsTitle: 'Allgemeine Geschäftsbedingungen',
    close: 'Schließen',
    privacyContent: [
      'Verantwortlich für die HydroBreak-App und die Verarbeitung personenbezogener Daten ist der in unserem Impressum genannte Anbieter.',
      'Wir erheben und speichern nur die Daten, die für den Betrieb der App nötig sind (z. B. E-Mail bei Registrierung, Fortschrittsdaten auf dem Gerät bzw. auf unserem Server bei Anmeldung).',
      'Die Daten werden nicht an Dritte verkauft. Eine Weitergabe erfolgt nur, soweit gesetzlich vorgeschrieben oder für den technischen Betrieb (z. B. Hosting) erforderlich.',
      'Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Widerspruch und Beschwerde bei einer Aufsichtsbehörde sind möglich.',
      'Bei Fragen wenden Sie sich bitte an die im Impressum angegebene Kontaktadresse.',
    ],
    imprintContent: [
      'Angaben gemäß § 5 TMG:',
      '[Name / Firma]\n[Straße, Hausnummer]\n[PLZ Ort]',
      'Kontakt: [E-Mail oder Kontaktformular]',
      'Umsatzsteuer-ID: [falls vorhanden]',
      'Verantwortlich für den Inhalt: [Name, Anschrift]',
      'Hinweis: Bitte ersetzen Sie die Platzhalter durch Ihre eigenen Angaben.',
    ],
    termsContent: [
      'Die Nutzung der HydroBreak-App erfolgt auf eigene Verantwortung. Der Anbieter übernimmt keine Haftung für Schäden, die durch die Nutzung entstehen.',
      'Die App und ihre Inhalte unterliegen dem Urheberrecht. Eine Vervielfältigung oder Weitergabe ohne Zustimmung ist nicht gestattet.',
      'Der Anbieter behält sich vor, die App und diese Bedingungen jederzeit zu ändern. Bei fortgesetzter Nutzung gelten die geänderten Bedingungen.',
      'Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit zulässig, der Sitz des Anbieters.',
    ],
  },

  whatsNew: {
    title: 'Was ist neu in HydroBreak 2.0?',
    close: 'Schließen',
    items: [
      'Sprache umschaltbar: Deutsch und Englisch in den Einstellungen.',
      'Rechtliche Seiten: Datenschutz, Impressum und AGB – verlinkt im Footer und in den Einstellungen.',
      'Kleines „Was ist neu?“-Modal bei neuen Versionen.',
    ],
  },
}

const en = {
  app: {
    title: 'HydroBreak',
    subtitle: 'Drink · Move · Rest your eyes',
    focusTimePaused: 'Focus time – reminders paused',
    focusTimeBanner: 'Reminders paused – focus time',
    reminderWindowBanner: 'Outside working hours – reminders paused',
    reminderWeekendBanner: 'Weekend – reminders paused',
    offlineBanner: "You're offline – your data will sync next time.",
    now: 'Now',
    seconds: 'sec',
    minutes: 'min',
    close: 'Close',
    loading: 'Loading…',
    greeting: 'Hi, {{name}}!',
    nextReminderIn: 'Next reminder in {{time}}',
  },

  emptyStates: {
    firstGlass: 'Drink your first glass!',
    firstBreak: 'Start your first break.',
    firstChallenge: 'Complete one action today – then you’ll see your first challenge checked here.',
    firstChallengeCta: 'Drink a glass, take a break, or do an eye exercise.',
    noBadgesYet: 'No badges yet.',
    noBadgesYetSub: 'Drink your first glass, take breaks, and complete challenges – then this collection will fill up.',
    noStreaksYet: 'No streak yet.',
    noStreaksYetSub: 'Be active on consecutive days – then your streak will start.',
    noMilestonesYet: 'Milestones come with time.',
  },

  dailyQuotes: [
    'Every sip counts.',
    'Short breaks, big impact.',
    'A bit better today than yesterday.',
    'Your body thanks you.',
    'Stay hydrated, stay focused.',
    'A break is not standing still.',
    "Don't forget to drink!",
    'Time for a short break.',
  ],

  onboarding: {
    step1Title: 'Your daily goal',
    step1Question: 'How much water do you want to drink per day?',
    step1Hint: 'You can change this anytime in settings.',
    continue: 'Continue',
    step2Title: 'Get reminders',
    step2Description:
      'Allow notifications – we’ll remind you to drink, stand up, and take 20-20-20 eye breaks, even when the app is in the background.',
    step2Benefits: 'Water · Breaks · Eyes',
    allow: 'Allow',
    later: 'Later',
    step3Title: 'Almost there!',
    step3Goal: 'Your goal: {{liters}} litres per day.',
    step3WithNotifications: ' Reminders are enabled.',
    step3WithoutNotifications: ' You can enable notifications later in settings.',
    step4Title: 'Add to home screen',
    step4Description: 'Keep HydroBreak one tap away – like a native app.',
    step4Ios: 'Safari: Share → “Add to Home Screen”.',
    step4Android: 'Chrome: Menu (⋮) → “Install app” or “Add to Home screen”.',
    step4Skip: 'Skip',
    start: "Let's go!",
  },

  waterGoalOptions: {
    1500: '1.5 litres',
    2000: '2 litres',
    2500: '2.5 litres',
  },

  settings: {
    title: 'Settings',
    toggleAriaLabel: 'Expand or collapse settings',
    account: 'Account',
    logout: 'Log out',
    loginRegister: 'Log in / Register',
    syncNote: 'Your data is synced with the server.',
    waterIntervalLabel: 'Water reminder (minutes)',
    waterIntervalHint: 'Every {{minutes}} min (default: {{default}})',
    standUpIntervalLabel: 'Stand up reminder (minutes)',
    eyeBreakIntervalLabel: '20-20-20 reminder (minutes)',
    eyeBreakHint: 'Every 20 min, look into the distance for 20 seconds',
    focusTimes: 'Focus times',
    focusTimesHint: 'No reminders during this period.',
    focusSessionDurationLabel: 'Focus session duration',
    focusSessionDurationHint: 'Timer length for a focused work block.',
    reminderWindow: 'Working hours',
    reminderWindowHint: 'Reminders only in this time window (e.g. 8am–6pm).',
    reminderWeekdaysOnly: 'Reminders only on weekdays',
    reminderWeekdaysOnlyHint: 'Mon–Fri; no reminders on weekends.',
    until: 'until',
    notifications: 'Browser notifications',
    allowNotifications: 'Allow',
    darkMode: 'Dark mode',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    exportData: 'Export data',
    exportDataHint: 'Download settings, progress and stats as a JSON file.',
    resetApp: 'Reset app',
    resetAppHint: 'Deletes all local data and restarts with onboarding.',
    resetConfirm: 'Really reset? All settings, progress and stats will be deleted.',
    resetButton: 'Yes, reset',
    reminderSound: 'Sound on reminder',
    reminderSoundHint: 'Short sound when a reminder appears.',
    hapticFeedback: 'Haptic feedback',
    hapticFeedbackHint: 'Vibration on “glass drunk”, break, challenge (if supported by device).',
    emailDigest: 'Weekly summary by email',
    emailDigestHint: 'Sunday evening: litres, breaks, streak and badges sent to your email.',
    language: 'Language',
    languageDe: 'Deutsch',
    languageEn: 'English',
    privacy: 'Privacy policy',
    imprint: 'Imprint',
    terms: 'Terms of service',
    locationContext: 'Location for insights',
    locationContextHint: 'Home office, office, or on the go – improves personalised patterns.',
    locationHome: 'Home office',
    locationOffice: 'Office',
    locationOther: 'On the go / Other',
    locationUnknown: 'Not specified',
    activityLevel: 'Activity level',
    activityLevelHint: 'Affects drinking recommendations.',
    activityLow: 'Low',
    activityMedium: 'Medium',
    activityHigh: 'High',
    weatherForInsights: 'Weather for insights',
    weatherForInsightsHint: 'Use location for weather (optional). Improves analysis context.',
    predictiveHealth: 'Predictive Health – parameters',
    predictiveHealthHint: 'Optional. Improves dehydration, fatigue and recovery scores.',
    sleepHoursLastNight: 'Sleep hours (last night)',
    sleepHoursHint: 'Approx. how many hours did you sleep?',
    weightKg: 'Weight (kg)',
    weightKgHint: 'For personalised drinking recommendations.',
    age: 'Age',
    ageHint: 'Optional for better estimates.',
    sex: 'Sex',
    sexUnknown: 'Not specified',
    sexMale: 'Male',
    sexFemale: 'Female',
    lastSportMinutesAgo: 'Minutes since last exercise',
    lastSportHint: 'Empty = no exercise. E.g. 120 = 2 hours ago.',
  },

  ai: {
    title: 'Your hydration insights',
    subtitle: 'Patterns, forecast & tips',
    patternTitle: 'Detected patterns',
    predictionTitle: 'Forecast for today',
    recommendationsTitle: 'Recommendations',
    patternHomeLess: 'You drink {{value}}% less on home office days.',
    patternHomeLessDesc: 'On office days you drink more on average. Use reminders at home.',
    patternOfficeLess: 'You drink {{value}}% less at the office.',
    patternOfficeLessDesc: 'You drink more at home. Remember to drink at the office.',
    patternWeekendMore: 'You drink {{value}}% more on weekends.',
    patternWeekendMoreDesc: 'You tend to stay better hydrated on weekends.',
    patternWeekendLess: 'You drink {{value}}% less on weekends.',
    patternWeekendLessDesc: 'You drink more on weekdays. Keep your goal in mind on weekends too.',
    patternLowActivityMore: 'With low activity you drink {{value}}% more.',
    patternHighActivityMore: 'With high activity you drink {{value}}% more.',
    patternActivityDesc: 'Activity and intake are linked – use these insights.',
    predictionOnTrack: 'You’re on track.',
    predictionOnTrackComfortable: 'At your current pace you’ll reach your goal.',
    predictionGoalReached: 'Daily goal already reached.',
    predictionDayEnd: 'Day is almost over – goal not reached today.',
    predictionBasedOnRate: 'Based on your pace today and similar days.',
    predictionSimilarDaysMiss: 'On similar days (same weekday/location) you often missed the goal.',
    predictionRateTooLow: 'Your current drinking pace is below what’s needed for your goal.',
    predictionProj: 'Forecast: ~{{projectedMl}} ml of {{waterGoalMl}} ml.',
    recOneMoreGlass: 'One more glass – then you’ve got it!',
    recKeepHabit: 'Keep it up!',
    recDrinkNowGlasses: 'Drink {{count}} glass(es) in the next few hours to get back on track.',
    recSetReminder: 'Set a reminder to drink more regularly.',
    recHomeOfficeTip: 'Tip: Easy to forget at home – keep a glass visible.',
    recHighActivity: 'With high activity you need more – drink consciously.',
    noPatternsYet: 'No patterns yet. Keep drinking and set location/activity – then you’ll see insights here.',
    loading: 'Computing insights…',
  },

  ph: {
    title: 'Predictive Health',
    subtitle: 'Real-time scores from hydration, activity, sleep & weather – explainable.',
    dehydrationRisk: 'Dehydration risk',
    performanceImpact: 'Performance impact',
    fatiguePrognosis: 'Fatigue prognosis',
    headacheProbability: 'Headache probability',
    recoveryScore: 'Recovery (post-exertion)',
    scoreOutOf100: '{{value}} / 100',
    impactPercent: '{{value}}%',
    probabilityPercent: '{{value}}%',
    why: 'Why?',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    good: 'Good',
    moderate: 'Moderate',
    positive: 'Slightly positive',
    negative: 'Slightly negative',
    dehydration: {
      labelLow: 'Low',
      labelMedium: 'Medium',
      labelHigh: 'High',
      factorHydration: 'Current intake below goal',
      factorActivity: 'Activity level (sweating)',
      factorWeather: 'Heat increases fluid need',
      factorSleep: 'Less sleep worsens fluid balance',
      factorTime: 'Typical afternoon dip',
    },
    performance: {
      labelPositive: 'Slightly positive',
      labelNegative: 'Slightly negative',
      factorHydrationGood: 'Good hydration supports performance',
      factorHydrationLow: 'Low intake → performance drop',
      factorHydrationMid: 'Hydration below optimum',
      factorFatigueHigh: 'Fatigue reduces performance',
      factorFatigueMid: 'Mild fatigue',
      factorSleepOk: 'Sufficient sleep',
      factorSleepPoor: 'Lack of sleep reduces performance',
    },
    fatigue: {
      labelLow: 'Low',
      labelMedium: 'Moderate',
      labelHigh: 'High',
      factorSleepVeryLow: 'Very little sleep',
      factorSleepLow: 'Under 7 h sleep',
      factorSleepGood: 'Good sleep',
      factorAfternoon: 'Afternoon dip',
      factorEvening: 'Evening tiredness',
      factorHydration: 'Low intake increases fatigue',
    },
    headache: {
      labelLow: 'Low',
      labelMedium: 'Moderate',
      labelHigh: 'Elevated',
      factorDehydrationHigh: 'Dehydration raises headache risk',
      factorDehydrationMid: 'Mild fluid deficit',
      factorDehydrationLow: 'Slightly below hydration goal',
      factorFatigue: 'Fatigue favours headaches',
      factorFatigueMid: 'Fatigue as factor',
      factorSleep: 'Lack of sleep favours headaches',
    },
    recovery: {
      labelGood: 'Good',
      labelModerate: 'Moderate',
      labelLow: 'Still recovering',
      factorTimeSinceSport: 'Enough time since exertion',
      factorTimeSinceSportMid: 'Moderate recovery time',
      factorJustFinished: 'Just finished exercise',
      factorHydrationGood: 'Good hydration supports recovery',
      factorHydrationMid: 'Hydration ok',
      factorHydrationLow: 'Low intake hinders recovery',
      factorSleepGood: 'Good sleep aids recovery',
      factorSleepPoor: 'Poor sleep hinders recovery',
      noSportNote: 'No sport logged – score from hydration & sleep.',
    },
  },

  progress: {
    todayDrunk: 'Drunk today',
    progress: 'Progress',
    stats: 'Stats',
    liters: 'Litres',
    goalReached: 'Daily goal reached!',
    percentToGo: '{{percent}}% to goal',
    thisWeek: 'This week: {{liters}} litres',
    lastDays: 'Last days: {{list}}',
    openStatsModal: 'Open stats with trends',
  },

  statsModal: {
    title: 'Statistics',
    dailyTrend: 'Water – last days',
    weekCompare: 'Week comparison',
    daysLabel: 'Last {{count}} days',
    noData: 'No trend data yet.',
    days7: '7 days',
    days14: '14 days',
    days30: '30 days',
    weeklyActivity: 'Weekly activity',
    weeklyActivityHint: 'Glasses + breaks per week (last 6 weeks)',
  },

  quickActions: {
    title: 'Quick actions',
    drink: 'Glass drunk',
    movement: 'Movement break',
    eye: 'Eye break',
    done: 'Done',
    xpGained: '+{{xp}} XP',
    keyboardHint: 'Keyboard: 1 / 2 / 3 or D / S / E',
  },

  voice: {
    start: 'Voice command',
    stop: 'Stop microphone',
    listening: 'Listening…',
    unsupported: 'Voice not supported',
    denied: 'Allow microphone access',
    hint: 'Say e.g. “Glass”, “Break” or “Eye break”.',
  },

  reminder: {
    waterTitle: 'Drink water',
    waterSubtitle: 'Every {{minutes}} min',
    standTitle: 'Stand up',
    standSubtitle: 'Every {{minutes}} min',
    eyeTitle: '20-20-20 eye break',
    eyeSubtitle: 'Look into the distance for 20 seconds',
    nextIn: 'Next reminder in',
    drinkNow: 'Drink now',
    startBreak: 'Start break',
    snoozeIn: 'In {{minutes}} min',
  },

  gamification: {
    statsAndBadges: 'Stats & badges',
    badgesEarned: 'Badges earned ({{current}}/{{total}})',
    totalXp: 'Total XP:',
    level: 'Level:',
    dailyStreak: 'Daily streak:',
    weeklyStreak: 'Weekly streak:',
    days: 'days',
    weeks: 'weeks',
    levelLabel: 'Level {{level}}',
    xpTotal: '{{xp}} XP total',
    xpToNext: '{{current}} / {{needed}} XP to level {{level}}',
    maxLevel: 'Max level reached!',
  },

  challenge: {
    daily: 'Daily challenge',
    claimXp: '+50 XP',
    completeButton: 'Complete challenge (+50 XP)',
    drinkLiters: 'Drink {{liters}} litres today',
    waterGlasses: '{{count}} glasses of water',
    movementBreaks: '{{count}} movement breaks',
    eyeBreaks: '{{count}} eye breaks',
    progressLiters: '{{current}} / {{target}} litres',
    progressCount: '{{current}} / {{target}}',
  },

  streak: {
    dayStreak: 'Day streak',
    weekStreak: 'Week streak',
  },

  badges: {
    first_sip: { name: 'First sip', desc: 'Drank first glass of water' },
    hydration_hero: { name: 'Hydration Hero', desc: 'Drank 2 litres in one day' },
    water_5: { name: 'Fiver', desc: '5 glasses of water in one day' },
    break_master: { name: 'Break Master', desc: '5 movement breaks in one day' },
    first_break: { name: 'First break', desc: 'First movement break completed' },
    focus_champion: { name: 'Focus Champion', desc: '3 eye breaks in one day' },
    eye_care: { name: 'Eye care', desc: 'First 20-20-20 break completed' },
    streak_3: { name: 'Stick with it', desc: '3 days in a row active' },
    streak_7: { name: 'Week champion', desc: '7 days in a row active' },
    streak_week: { name: 'Week streak', desc: 'Active every day for a week' },
    challenge_daily: { name: 'Daily challenge', desc: 'Daily challenge completed' },
    comeback: { name: 'Welcome back', desc: 'Back after a break' },
  },

  weekSummary: {
    title: 'Week summary',
    thisWeek: 'This week',
    prevWeek: 'Last week',
    glasses: '{{count}} glasses',
    pauses: '{{count}} breaks',
    streakDays: '{{count}} day streak',
  },

  leaderboard: {
    title: 'Leaderboard',
    topPercent: "You're in the top {{percent}}% most active this week.",
    topPercentSub: 'Anonymous comparison with other users.',
    comingSoon: 'Leaderboard coming soon',
    comingSoonSub: "Soon you'll see how you compare to others (anonymous).",
  },

  share: {
    weekButton: 'Share my week',
    copied: 'Copied to clipboard',
    error: 'Share failed.',
  },

  reminderHistory: {
    title: 'Last reminders',
    todayOnly: 'Today',
    all: 'All',
    water: 'Water',
    stand: 'Stand up',
    eye: 'Eyes',
    empty: 'No reminders yet.',
    emptyToday: 'No reminders today yet.',
  },

  widget: {
    openFullApp: 'Open full app',
    title: 'Widget view',
    addToHomeHint: 'Open widget view',
    addToHomeHintDesc: 'Opens the compact view – then “Add to Home screen” for an app icon with water & quick actions.',
  },

  nav: {
    today: 'Today',
    stats: 'Stats',
    settings: 'Settings',
  },

  pullRefresh: {
    hint: 'Pull to refresh',
    updating: 'Updating…',
  },

  heatmap: {
    title: 'Activity',
    legend: 'Less – More',
    noData: 'No data yet',
  },

  milestones: {
    title: 'Milestones',
    water: '{{liters}} litres drunk',
    eyeBreaks: '{{count}} eye breaks',
    standBreaks: '{{count}} movement breaks',
  },

  comeback: {
    title: 'Welcome back!',
    subtitle: 'Good to see you again.',
    bonus: '+{{xp}} XP',
  },

  auth: {
    login: 'Log in',
    register: 'Register',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholderLogin: '••••••••',
    passwordPlaceholderRegister: 'min. 6 characters',
    submitLogin: 'Log in',
    submitRegister: 'Register',
    noAccount: "Don't have an account?",
    alreadyRegistered: 'Already registered?',
    loginError: 'Login failed.',
    verifyTitle: 'Verify email',
    verifySent: 'We sent a verification code to {{email}}.',
    verifyCodeLabel: 'Enter code',
    verifyCodePlaceholder: 'e.g. 123456',
    verifySubmit: 'Verify',
    verifyResend: 'Resend code',
    verifyResendSent: 'New code sent.',
    verifyError: 'Invalid or expired code.',
    gateTitle: 'HydroBreak',
    gateSubtitle: 'Drink · Move · Rest your eyes',
    gateRegister: 'Register',
    gateLogin: 'Log in',
    gateRequired: 'Please register or log in to use the app.',
    forgotPassword: 'Forgot password?',
    forgotTitle: 'Reset password',
    forgotSubmit: 'Send code',
    forgotSent: 'If an account exists for {{email}}, we sent a code there. The code is valid for 15 minutes.',
    resetTitle: 'Set new password',
    newPassword: 'New password',
    newPasswordPlaceholder: 'min. 6 characters',
    resetSubmit: 'Save password',
    resetSuccess: 'Password changed. You are now logged in.',
    resetError: 'Code invalid or expired.',
  },

  errors: {
    boundaryTitle: 'Something went wrong',
    boundaryMessage: 'This section could not be loaded. The rest of the app keeps working.',
    retry: 'Try again',
    storageUnavailable:
      'Storage full or private mode – settings and progress are only saved for this session.',
  },

  storage: {
    errorBannerDismiss: 'Dismiss notice',
  },

  notifications: {
    waterTitle: 'HydroBreak – Water',
    waterBody: 'Time for a sip of water!',
    standTitle: 'HydroBreak – Stand up',
    standBody: 'Stand up and move a little.',
    eyeTitle: 'HydroBreak – Eye break',
    eyeBody: 'Look into the distance for 20 seconds.',
  },

  messages: {
    water: [
      "You're doing great – keep it up!",
      'Every sip counts. Stay on track!',
      'Your body thanks you.',
      'Small sip, big effect.',
      'Hydration is self-care.',
      "You're staying in the flow.",
    ],
    waterMorning: [
      'Good start – first glass?',
      'Morning water gets your head going.',
      'Hydration in the morning lasts all day.',
    ],
    waterAfternoon: [
      'After lunch: time for a sip.',
      'Short break, new focus.',
      'Your body will thank you for a refill.',
    ],
    waterEvening: [
      'One more sip for a good finish.',
      'Every sip counts in the evening too.',
    ],
    waterStreak: [
      'Your streak is alive – keep going!',
      'Keep it up, you’re in the flow!',
    ],
    stand: [
      'Time to stretch your legs.',
      'Short break, big gain.',
      'Movement gets your head going.',
      'Stand up – your back will thank you.',
    ],
    standMorning: [
      'Move early, get through the day well.',
      'First break – stretch your legs.',
    ],
    standAfternoon: [
      'Afternoon slump? Standing up helps.',
      'Movement now gives you a boost.',
    ],
    standEvening: [
      'One more round – then you’ve earned a rest.',
    ],
    standStreak: [
      'Break streak going – keep it up!',
    ],
    eye: [
      'Give your eyes 20 seconds off.',
      'Look into the distance – relaxing for your eyes.',
      '20-20-20: you’re doing your eyes good.',
    ],
    eyeMorning: [
      'Ease the strain on your eyes early – good for the day.',
    ],
    eyeAfternoon: [
      'Screen break – 20 sec into the distance.',
      'Your eyes deserve a break.',
    ],
    eyeEvening: [
      'Last eye break – then relax.',
    ],
    eyeStreak: [
      'Eye streak – keep it up!',
    ],
  },

  eyeBreak: {
    title: '20-20-20 break',
    description: 'Look into the distance for 20 seconds – relaxes your eyes.',
    seconds: 'Seconds',
  },

  focusSession: {
    title: 'Focus session',
    description: 'Start a focused work block. Afterwards we’ll suggest a break.',
    start: 'Start focus',
    cancel: 'Cancel',
    timeLeft: '{{min}}:{{sec}} left',
    ended: 'Focus over!',
    takeBreak: 'Time for a break?',
    eyeBreak: 'Eye break',
    movement: 'Movement',
    done: 'Done',
  },

  levelUp: {
    title: 'Level {{level}}!',
    subtitle: "You've levelled up.",
  },

  reward: {
    keepGoing: 'Keep it up!',
    badgeUnlocked: 'Badge unlocked',
    xpAnnouncement: '+{{value}} XP. Keep it up!',
    badgeAnnouncement: 'Badge unlocked: {{badge}}',
  },

  legal: {
    privacyTitle: 'Privacy policy',
    imprintTitle: 'Imprint',
    termsTitle: 'Terms of service',
    close: 'Close',
    privacyContent: [
      'The provider named in our imprint is responsible for the HydroBreak app and the processing of personal data.',
      'We only collect and store data necessary to run the app (e.g. email on registration, progress data on your device or on our server when logged in).',
      'Data is not sold to third parties. It is only shared where required by law or for technical operation (e.g. hosting).',
      'You have the right to access, rectify, delete and restrict processing of your data. You may object and lodge a complaint with a supervisory authority.',
      'For questions, please use the contact details given in the imprint.',
    ],
    imprintContent: [
      'Information according to § 5 TMG (Germany):',
      '[Name / Company]\n[Street, number]\n[Postcode City]',
      'Contact: [Email or contact form]',
      'VAT ID: [if applicable]',
      'Responsible for content: [Name, address]',
      'Note: Please replace the placeholders with your own details.',
    ],
    termsContent: [
      'Use of the HydroBreak app is at your own risk. The provider is not liable for damage arising from use.',
      'The app and its content are subject to copyright. Reproduction or distribution without consent is not permitted.',
      'The provider reserves the right to change the app and these terms at any time. Continued use constitutes acceptance of the amended terms.',
      'The law of the Federal Republic of Germany applies. Place of jurisdiction, where permitted, is the provider’s registered office.',
    ],
  },

  whatsNew: {
    title: "What's new in HydroBreak 2.0?",
    close: 'Close',
    items: [
      'Language switch: German and English in settings.',
      'Legal pages: Privacy policy, Imprint and Terms – linked in footer and settings.',
      "Small “What's new?” modal for new versions.",
    ],
  },
}

const translations = { de, en }

let currentLocale = 'de'

export function setLocale(locale) {
  currentLocale = locale === 'en' || locale === 'de' ? locale : 'de'
}

export function getLocale() {
  return currentLocale
}

/**
 * Liefert die Übersetzung für key (Punkt-Notation, z. B. 'app.title').
 * Optional: vars für Interpolation ({{varName}} wird ersetzt).
 * @param {string} key
 * @param {Record<string, string|number>} [vars]
 * @returns {string}
 */
export function t(key, vars = {}) {
  const locale = currentLocale
  const map = translations[locale] || translations.de
  const parts = key.split('.')
  let value = map
  for (const part of parts) {
    value = value?.[part]
  }
  if (typeof value !== 'string') return key
  return Object.keys(vars).reduce((str, k) => {
    return str.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(vars[k]))
  }, value)
}

/**
 * Liefert ein Array von Strings (z. B. für motivierende Nachrichten).
 * @param {string} key - z. B. 'messages.water'
 * @returns {string[]}
 */
export function tArray(key) {
  const locale = currentLocale
  const map = translations[locale] || translations.de
  const parts = key.split('.')
  let value = map
  for (const part of parts) {
    value = value?.[part]
  }
  return Array.isArray(value) ? value : []
}

/**
 * Liefert ein Objekt für einen Unterkey (z. B. badges.first_sip).
 * @param {string} key
 * @returns {Record<string, string>|null}
 */
export function tObject(key) {
  const locale = currentLocale
  const map = translations[locale] || translations.de
  const parts = key.split('.')
  let value = map
  for (const part of parts) {
    value = value?.[part]
  }
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null
}

/** Tages-Spruch (stabil pro Tag, aus dailyQuotes). */
export function getDailyQuote() {
  const list = (translations[currentLocale] || translations.de)?.dailyQuotes
  if (!Array.isArray(list) || list.length === 0) return ''
  const start = new Date(new Date().getFullYear(), 0, 0)
  const now = new Date()
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return list[dayOfYear % list.length]
}

/**
 * Motivierende Nachrichten nach Typ, Tageszeit und optional Streak.
 * @param {'water'|'stand'|'eye'} type
 * @param {{ dailyStreak?: number }} [context]
 * @returns {string[]}
 */
export function getMotivationalMessages(type, context = {}) {
  const base = tArray(`messages.${type}`) || []
  const hour = typeof document !== 'undefined' ? new Date().getHours() : 12
  let timeKey = ''
  if (hour >= 5 && hour < 12) timeKey = 'Morning'
  else if (hour >= 12 && hour < 18) timeKey = 'Afternoon'
  else if (hour >= 18 || hour < 5) timeKey = 'Evening'
  const timeArr = tArray(`messages.${type}${timeKey}`) || []
  const streak = (context.dailyStreak ?? 0) >= 3 ? (tArray(`messages.${type}Streak`) || []) : []
  return [...base, ...timeArr, ...streak]
}

export { de as translationsDe }
export default t
