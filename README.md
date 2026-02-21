# HydroBreak

Modern, minimalist web app (Notion/Linear/Headspace-inspired) for healthier habits at work: **drink water**, **stand up**, and **20-20-20 eye breaks** — with web notifications, LocalStorage, and optional dark mode.

## Features

- **Water reminder**: Default every 45 min (configurable 15–120 min), daily progress toward 2 L goal
- **Stand-up reminder**: Default after 60 min of sitting
- **20-20-20 rule**: Reminder with 20-second countdown animation
- **Browser notifications** (Web Notifications API)
- **Settings & progress** stored in LocalStorage
- **Dark mode**: Light / Dark / System
- **Motivational messages** and actions: “Drink now”, “Start break”
- **Daily and weekly stats** (toggleable)
- **Gamification**: XP & levels, badges, daily/weekly streaks, daily challenges, reward animations
- **PWA**: Installable (“Add to home screen”), offline after first visit, automatic updates
- **Backend (optional)**: Sign in / Register, sync of settings, progress, stats, and gamification across devices
- **Hydration insights**: Pattern detection, goal forecast, and recommendations from history, location, activity, and weather
- **Predictive Health**: Real-time scores for dehydration risk, performance impact, fatigue, headache probability, and recovery (from hydration, activity, sleep, weather, and optional user parameters)

## Tech Stack

- **React 18** (Hooks)
- **Vite**
- **TailwindCSS**
- **Lucide React** (Icons)

## Project structure

```
hydrobreak/
├── public/
│   ├── favicon.svg
│   ├── icon-512.svg       # PWA icon (512×512)
│   └── sw.js              # Service Worker (injectManifest)
├── src/
│   ├── components/
│   │   ├── ReminderCard.jsx      # Card per reminder type
│   │   ├── SettingsPanel.jsx     # Settings (intervals, notifications, dark mode)
│   │   ├── ProgressTracker.jsx   # Water progress & stats
│   │   ├── EyeBreakModal.jsx     # 20-20-20 countdown modal
│   │   ├── GamificationPanel.jsx # XP, streaks, challenges, badges
│   │   ├── XPBar.jsx             # Level and XP progress bar
│   │   ├── BadgeCard.jsx         # Single badge (unlocked/locked)
│   │   ├── StreakTracker.jsx     # Daily and weekly streak
│   │   ├── DailyChallengeCard.jsx # Daily challenge with progress
│   │   ├── RewardToast.jsx       # Short reward (+XP / badge)
│   │   ├── LevelUpModal.jsx      # Level-up animation
│   │   ├── Onboarding.jsx        # 3-step onboarding (water goal, notifications)
│   │   ├── QuickActions.jsx      # Quick actions (glass, movement, eyes)
│   │   ├── AuthModal.jsx         # Sign in / Register
│   │   ├── AIAnalysisCard.jsx    # Hydration insights (patterns, forecast, tips)
│   │   └── PredictiveHealthCard.jsx # Predictive Health scores
│   ├── hooks/
│   │   ├── useTimer.js           # Countdown hook (e.g. 20 sec)
│   │   └── useLocalStorage.js    # Persistence hook (optional)
│   ├── utils/
│   │   ├── storage.js            # LocalStorage (settings, progress, stats, gamification)
│   │   ├── notifications.js      # Web Notifications API
│   │   ├── gamification.js       # Level from XP, badge check, streaks, challenges
│   │   ├── gamificationUpdate.js # XP/streak/badge updates per action
│   │   ├── aiAnalysis.js         # Pattern detection, goal prediction, recommendations
│   │   ├── predictiveHealth.js   # Dehydration, performance, fatigue, headache, recovery scores
│   │   └── weather.js            # Weather for insights (Open-Meteo)
│   ├── api/
│   │   └── client.js             # API client (auth + CRUD)
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state (user, token, login, register, logout)
│   ├── constants.js              # Intervals, goals, messages, XP, badges, API_BASE_URL
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/                        # Backend (Express + SQLite)
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

## Setup & run

### Requirements

- **Node.js** (e.g. 18+)
- **npm** or **yarn**

### Install

```bash
cd hydrobreak
npm install
```

### Development

```bash
npm run dev
```

App runs at **http://localhost:5173** (or the port shown).

### Production build

```bash
npm run build
```

Output in `dist/`. Preview with:

```bash
npm run preview
```

## Usage

1. **Notifications**: Tap “Allow” once (in Settings); reminders can then appear in the background.
2. **Water**: “Drink now” adds 250 ml and resets the interval timer.
3. **Stand up**: “Start break” resets the timer for the next reminder.
4. **Eyes**: “Start break” opens the modal with the 20-second countdown; afterward the interval timer is reset.
5. **Settings**: Adjust intervals and dark mode in the settings card; everything is saved in LocalStorage.
6. **Gamification**: XP for water (+10), movement break (+15), eye break (+15), and completed daily challenge (+50). Badges and streaks are awarded automatically; levels increase with total XP. Stats & badges in the expandable section under the Daily Challenge.
7. **Install PWA**: In the browser (Chrome/Edge on desktop: menu → “Install app”; Safari iOS: Share → “Add to Home Screen”) install the app on your device. HydroBreak then runs like a native app and works offline (after the first load).
8. **Backend & sync**: Optionally start the API (`cd server && npm install && npm run dev`). In the app under **Settings → Account** use “Sign in / Register”. After login, settings, progress, stats, and gamification sync with the server; changes are uploaded automatically.

### Start backend

```bash
cd server
npm install
cp .env.example .env   # optional: set JWT_SECRET, PORT
npm run dev
```

API: `http://localhost:3001`. The frontend uses this URL by default; for other hosts set `VITE_API_URL` in a `.env` in the project root.

## License

MIT.
