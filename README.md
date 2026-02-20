# HydroBreak

Moderne, minimalistische Web-App (Notion/Linear/Headspace-inspiriert) für gesündere Gewohnheiten am Arbeitsplatz: **Wasser trinken**, **Aufstehen** und **20-20-20 Augenpause** – mit Web Notifications, LocalStorage und optionalem Dark Mode.

## Features

- **Wasser-Erinnerung**: Standard alle 45 Min (einstellbar 15–120 Min), Tagesfortschritt bis 2 Liter
- **Aufstehen-Erinnerung**: Standard nach 60 Min Sitzen
- **20-20-20 Regel**: Erinnerung mit 20-Sekunden-Countdown-Animation
- **Browser-Benachrichtigungen** (Web Notifications API)
- **Einstellungen & Fortschritt** in LocalStorage
- **Dark Mode**: Hell / Dunkel / System
- **Motivierende Nachrichten** und Aktionen „Jetzt trinken“, „Pause starten“
- **Tages- und Wochenstatistik** (optional umschaltbar)
- **Gamification**: XP & Level, Badges, Tages-/Wochen-Streaks, tägliche Challenges, Belohnungs-Animationen
- **PWA**: Installierbar („Zum Startbildschirm hinzufügen“), Offline-Nutzung nach erstem Besuch, automatische Updates
- **Backend (optional)**: Anmelden/Registrieren, Sync von Einstellungen, Fortschritt, Stats und Gamification über alle Geräte

## Tech-Stack

- **React 18** (Hooks)
- **Vite**
- **TailwindCSS**
- **Lucide React** (Icons)

## Projektstruktur

```
hydrobreak/
├── public/
│   ├── favicon.svg
│   ├── icon-512.svg       # PWA-Icon (512×512)
│   └── sw.js              # Service Worker (injectManifest)
├── src/
│   ├── components/
│   │   ├── ReminderCard.jsx   # Karte pro Erinnerungstyp
│   │   ├── SettingsPanel.jsx  # Einstellungen (Intervalle, Notifications, Dark Mode)
│   │   ├── ProgressTracker.jsx # Wasser-Fortschritt & Statistik
│   │   ├── EyeBreakModal.jsx  # 20-20-20 Countdown-Modal
│   │   ├── GamificationPanel.jsx # XP, Streaks, Challenges, Badges
│   │   ├── XPBar.jsx          # Level- und XP-Fortschrittsbalken
│   │   ├── BadgeCard.jsx      # Einzelnes Badge (freigeschaltet/gesperrt)
│   │   ├── StreakTracker.jsx  # Tages- und Wochen-Streak
│   │   ├── DailyChallengeCard.jsx # Tägliche Challenge mit Fortschritt
│   │   ├── RewardToast.jsx    # Kurze Belohnung (+XP / Badge)
│   │   └── LevelUpModal.jsx   # Level-Aufstiegs-Animation
│   │   ├── Onboarding.jsx     # 3-Schritte-Onboarding (Wasserziel, Notifications)
│   │   ├── QuickActions.jsx   # Schnellaktionen (Glas, Bewegung, Augen)
│   │   └── AuthModal.jsx      # Anmelden / Registrieren
│   ├── hooks/
│   │   ├── useTimer.js        # Countdown-Hook (z. B. 20 Sek)
│   │   └── useLocalStorage.js # Persistenz-Hook (optional)
│   ├── utils/
│   │   ├── storage.js         # LocalStorage (Settings, Progress, Stats, Gamification)
│   │   ├── notifications.js  # Web Notifications API
│   │   ├── gamification.js    # Level aus XP, Badge-Check, Streaks, Challenges
│   │   └── gamificationUpdate.js # XP/Streak/Badge-Updates pro Aktion
│   ├── api/
│   │   └── client.js          # API-Client (Auth + CRUD)
│   ├── context/
│   │   └── AuthContext.jsx   # Auth-State (user, token, login, register, logout)
│   ├── constants.js          # Intervalle, Ziele, Nachrichten, XP, Badges, API_BASE_URL
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/                   # Backend (Express + SQLite)
│   ├── index.js
│   ├── db.js
│   ├── middleware/auth.js
│   ├── routes/auth.js
│   ├── routes/user.js
│   └── README.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup & Start

### Voraussetzungen

- **Node.js** (z. B. 18+)
- **npm** oder **yarn**

### Installation

```bash
cd hydrobreak
npm install
```

### Entwicklung

```bash
npm run dev
```

App läuft unter **http://localhost:5173** (oder dem angezeigten Port).

### Produktion bauen

```bash
npm run build
```

Ausgabe in `dist/`. Vorschau mit:

```bash
npm run preview
```

## Verwendung

1. **Benachrichtigungen**: Einmal „Erlauben“ klicken (Einstellungen), dann können Erinnerungen auch im Hintergrund erscheinen.
2. **Wasser**: „Jetzt trinken“ addiert 250 ml und startet den Intervall-Timer neu.
3. **Aufstehen**: „Pause starten“ setzt den Timer für die nächste Erinnerung zurück.
4. **Augen**: „Pause starten“ öffnet das Modal mit 20-Sekunden-Countdown; danach wird der Intervall-Timer neu gestartet.
5. **Einstellungen**: Intervalle und Dark Mode in der Einstellungen-Karte anpassen; alles wird in LocalStorage gespeichert.
6. **Gamification**: XP gibt es für Wasser (+10), Bewegungs-Pause (+15), Augenpause (+15) und abgeschlossene Tages-Challenge (+50). Badges und Streaks werden automatisch vergeben; Level steigen mit Gesamt-XP. Statistiken & Badges im ausklappbaren Bereich unter der Daily Challenge.
7. **PWA installieren**: Im Browser (Chrome/Edge auf Desktop: Menü → „App installieren“; Safari iOS: Teilen → „Zum Home-Bildschirm“) die App auf dem Gerät installieren. Danach läuft HydroBreak wie eine native App und funktioniert offline (nach dem ersten Laden).
8. **Backend & Sync**: Optional API starten (`cd server && npm install && npm run dev`). In der App unter **Einstellungen → Account** „Anmelden / Registrieren“. Nach Login werden Einstellungen, Fortschritt, Stats und Gamification mit dem Server synchronisiert; Änderungen werden automatisch hochgeladen.

### Backend starten

```bash
cd server
npm install
cp .env.example .env   # optional: JWT_SECRET, PORT anpassen
npm run dev
```

API: `http://localhost:3001`. Das Frontend nutzt diese URL standardmäßig; für andere Hosts `VITE_API_URL` in einer `.env` im Projektroot setzen.

## Lizenz

MIT.
