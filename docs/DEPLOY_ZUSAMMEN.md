# Backend + Frontend zusammen deployen

HydroBreak ist so vorbereitet, dass **ein** Service sowohl die API als auch das gebaute Frontend ausliefert. Du brauchst nur **eine** URL und keine CORS-Konfiguration.

---

## Empfohlen: Render.com (kostenlos möglich)

**Warum Render:** Ein Web Service, ein Repo, Build baut Frontend + Server-Install, Start startet den Server – der liefert dann `/api/*` und alles andere aus `dist/` (SPA).

### Schritte

1. **Account:** [render.com](https://render.com) → Sign up (z. B. mit GitHub).

2. **Neuen Web Service anlegen**
   - Dashboard → **"New +"** → **"Web Service"**.
   - Repo verbinden (GitHub/GitLab), HydroBreak auswählen.

3. **Einstellungen** (oder `render.yaml` im Repo nutzen, dann werden viele Werte vorausgefüllt):

   | Einstellung      | Wert |
   |------------------|------|
   | **Name**         | z. B. `hydrobreak` |
   | **Region**       | z. B. Frankfurt |
   | **Branch**       | `main` (oder dein Default-Branch) |
   | **Root Directory** | *leer* (Projekt-Root) |
   | **Runtime**      | Node |
   | **Build Command** | `npm install && npm run build && cd server && npm install` |
   | **Start Command** | `cd server && node index.js` |
   | **Plan**         | Free (oder Paid) |

4. **Umgebungsvariablen** (optional, unter "Environment"):
   - `NODE_ENV` = `production` (oft schon gesetzt)
   - Für E-Mails (Verifizierung, Passwort vergessen): `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` (wie lokal in `.env`).

5. **Create Web Service** → Render baut und startet. Die URL ist z. B. `https://hydrobreak-xxxx.onrender.com`.

6. **Fertig:** Diese eine URL öffnen – dort läuft die App (Frontend + API). Es ist **kein** `VITE_API_URL` nötig, weil die API unter derselben Domain läuft.

### Wenn nur „Not found“ oder eine Fehlerseite erscheint

- **Render Dashboard** → dein Service → **„Logs“** (Runtime, nicht Build):
  - Steht dort **„Frontend wird ausgeliefert aus: …“**? Dann wird das Frontend gefunden; das Problem liegt woanders.
  - Steht **„Frontend dist/ nicht gefunden“**? Dann hat der Server den Build-Ordner nicht gefunden.
- **Build-Logs** prüfen: Läuft `npm run build` durch und ohne Fehler? Es muss im **Projekt-Root** laufen (nicht nur in `server/`).
- **Root Directory** in den Render-Einstellungen muss **leer** sein (oder auf den Repo-Root zeigen), damit `npm run build` und `dist/` im richtigen Verzeichnis entstehen.
- Nach Änderungen an der Server-Logik: **„Manual Deploy“** → **„Deploy latest commit“** ausführen.

### Mit Blueprint (render.yaml)

Im Repo liegt `render.yaml`. Statt manuell einen Web Service anzulegen:

- **"New +"** → **"Blueprint"** → Repo verbinden.
- Render wählt die `render.yaml` und legt den Service wie darin beschrieben an. Build/Start-Commands und Basis-Env sind dann schon gesetzt.

---

## Alternative: Railway

1. [railway.app](https://railway.app) → Login mit GitHub.
2. **"New Project"** → **"Deploy from GitHub repo"** → HydroBreak wählen.
3. **Settings** der erstellten Service:
   - **Root Directory:** leer (Root).
   - **Build Command:** `npm install && npm run build && cd server && npm install`
   - **Start Command:** `cd server && node index.js`
4. **Variables:** z. B. `NODE_ENV=production`, bei Bedarf SMTP wie oben.
5. **Deploy** – Railway vergibt eine URL; alles läuft wieder unter einer Domain.

---

## Alternative: Fly.io

1. [fly.io](https://fly.io) → CLI installieren und anmelden.
2. Im Projektroot z. B. eine `Dockerfile` nutzen (siehe unten) oder **Build/Start manuell** über `fly.toml` konfigurieren (Build: gleiche Commands wie bei Render, Start: `cd server && node index.js`).

Beispiel **Dockerfile** (optional, im Projektroot):

```dockerfile
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server
COPY --from=frontend /app/dist ./dist
WORKDIR /app/server
EXPOSE 3000
ENV PORT=3000
CMD ["node", "index.js"]
```

Dann z. B. `fly launch` und `fly deploy`.

---

## Was im Projekt angepasst wurde

- **Server (`server/index.js`):** Wenn im Ordner `../dist` ein Build existiert, liefert der Server diese Dateien aus und antwortet auf alle anderen GET-Requests mit `index.html` (SPA). API-Routen (`/api/*`, `/health`) haben weiterhin Vorrang.
- **Frontend (`src/constants.js`):** Im Production-Build wird, wenn **kein** `VITE_API_URL` gesetzt ist, die API als gleiche Origin (`''`) angesprochen. So funktioniert alles unter einer URL ohne CORS.

Wenn du später Frontend und Backend **getrennt** hostest (z. B. Frontend auf Netlify, Backend auf Render), setzt du beim Frontend-Deploy die Umgebungsvariable **`VITE_API_URL`** auf die Backend-URL – dann wird wieder die externe API genutzt.
