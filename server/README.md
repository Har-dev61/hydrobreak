# HydroBreak API

Backend für Auth (JWT) und CRUD für User-Daten (Settings, Progress, Stats, Gamification).

## Abhängigkeiten

```bash
cd server && npm install
```

## Konfiguration

Kopie von `.env.example` nach `.env` und anpassen:

- `JWT_SECRET` – Geheimnis für JWT (Produktion: mind. 32 Zeichen)
- `PORT` – Server-Port (Standard: 3001)
- `DATA_DIR` – optional, Ordner für JSON-Dateien (Standard: `./data`)

## Start

```bash
npm run dev   # mit --watch
# oder
npm start
```

API läuft unter `http://localhost:3001`.

## Endpunkte

- `POST /api/auth/register` – Registrierung (Body: `{ "email", "password" }`)
- `POST /api/auth/login` – Login (Body: `{ "email", "password" }`)
- `GET /api/me` – aktueller User (Header: `Authorization: Bearer <token>`)
- `GET|PUT /api/user/settings` – Einstellungen
- `GET|PUT /api/user/progress` – Tagesfortschritt
- `GET|PUT /api/user/stats` – Statistiken
- `GET|PUT /api/user/gamification` – Gamification-Daten

Frontend nutzt standardmäßig `http://localhost:3001`. Für andere Umgebungen: `VITE_API_URL` in der Frontend-.env setzen.
