# HydroBreak auf Netlify deployen

Das **Frontend** (Vite/React) kann direkt auf Netlify laufen. Das **Backend** (`server/`) musst du separat hosten (z. B. Render, Railway) und die URL in Netlify eintragen.

---

## 1. Frontend auf Netlify

### Option A: Über die Netlify-Website (empfohlen)

1. **Repository verbinden**
   - Gehe zu [netlify.com](https://www.netlify.com) und melde dich an.
   - „Add new site“ → „Import an existing project“.
   - GitHub/GitLab verbinden und das HydroBreak-Repo auswählen.

2. **Build-Einstellungen** (werden durch `netlify.toml` vorgegeben, ggf. prüfen)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** leer (Projekt-Root)

3. **Umgebungsvariable für die API**
   - Site → „Site configuration“ → „Environment variables“.
   - Variable anlegen:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://deine-backend-url.de` (siehe Schritt 2)
   - Nach Änderung einen neuen Deploy auslösen („Trigger deploy“ → „Deploy site“).

4. **Deploy**
   - Bei verbundenem Git: Jeder Push ins Haupt-Branch löst einen Deploy aus.
   - Oder „Deploys“ → „Trigger deploy“ → „Deploy site“.

### Option B: Über Netlify CLI

```bash
# Einmalig: Netlify CLI installieren
npm install -g netlify-cli

# Im Projektordner anmelden
cd /pfad/zu/hydrobreak
netlify login

# Neuen Site anlegen und mit dem aktuellen Build verbinden
npm run build
netlify init
# Fragen: "Create & configure a new site", Team wählen, Site-Name optional.

# Danach: Deploys mit
netlify deploy --prod
```

Auch hier in der Netlify-UI unter „Environment variables“ `VITE_API_URL` setzen und ggf. erneut deployen.

---

## 2. Backend separat hosten

Das Verzeichnis `server/` (Express, Auth, Nutzerdaten) läuft **nicht** auf Netlify. Du brauchst einen zweiten Host:

- **Render:** [render.com](https://render.com) – „Web Service“, Repo verbinden, Root auf `server` setzen, Start-Command `node server.js` (oder wie dein Einstiegspunkt heißt).
- **Railway:** [railway.app](https://railway.app) – Projekt aus Repo, `server/` als Root, Start-Command anpassen.
- **Fly.io / andere:** Node-App wie gewohnt deployen.

Wichtig für das Backend:

- **CORS:** Erlaube deine Netlify-Domain (z. B. `https://deine-app.netlify.app`) in der Express-App.
- **Umgebungsvariablen:** z. B. `DATA_DIR`, SMTP für E-Mails (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`), ggf. `APP_NAME`.

Die **URL des Backends** (z. B. `https://hydrobreak-api.onrender.com`) trägst du in Netlify als `VITE_API_URL` ein.

---

## 3. Kurz-Checkliste

- [ ] Repo mit Netlify verbunden
- [ ] Build: `npm run build`, Publish: `dist`
- [ ] `VITE_API_URL` in Netlify auf die Backend-URL gesetzt
- [ ] Backend woanders deployed und erreichbar
- [ ] CORS im Backend für die Netlify-URL konfiguriert
- [ ] Nach dem ersten Deploy: Anmeldung/Registrierung in der App testen

Wenn du nur das Frontend ohne Backend testen willst, kannst du `VITE_API_URL` weglassen; dann nutzt die App im Browser weiter `http://localhost:3001` und funktioniert nur lokal mit laufendem Server.
