# HydroBreak auf einem Ubuntu-Server deployen

Anleitung, um Frontend und Backend auf einem eigenen Ubuntu-Server (VPS) öffentlich zu betreiben. Nginx liefert das Frontend aus und leitet `/api` an den Node-Server weiter.

---

## Voraussetzungen

- Ubuntu 22.04 (oder 24.04) mit SSH-Zugang
- Eine Domain, die auf die Server-IP zeigt (z. B. `hydrobreak.deine-domain.de`), optional für SSL
- Ohne Domain: Zugriff über `http://DEINE-SERVER-IP`

---

## 1. Server vorbereiten

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
```

---

## 2. Node.js installieren (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # sollte v20.x zeigen
```

---

## 3. Projekt klonen und bauen

```bash
# Z.B. in /var/www (oder ein anderes Verzeichnis)
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/Har-dev61/hydrobreak.git
cd hydrobreak
sudo chown -R $USER:$USER /var/www/hydrobreak
```

**Frontend bauen** (API wird später unter derselben Domain laufen, daher keine `VITE_API_URL` nötig):

```bash
npm install
npm run build
```

**Backend-Dependencies:**

```bash
cd server && npm install && cd ..
```

---

## 4. Backend-Umgebung (`.env`)

```bash
cd /var/www/hydrobreak/server
nano .env
```

Mindestens:

```env
PORT=3001
NODE_ENV=production
```

Optional für E-Mails (Verifizierung, Passwort vergessen):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=dein-user
SMTP_PASS=dein-passwort
MAIL_FROM=noreply@deine-domain.de
```

Optional: Datenverzeichnis (Standard: `server/data/`):

```env
DATA_DIR=/var/www/hydrobreak/server/data
```

Speichern: `Ctrl+O`, Enter, `Ctrl+X`.

---

## 5. API dauerhaft mit PM2 starten

```bash
sudo npm install -g pm2
cd /var/www/hydrobreak/server
pm2 start index.js --name hydrobreak-api
pm2 save
pm2 startup
# Den angezeigten Befehl (sudo env ...) ausführen
```

Kontrolle:

```bash
pm2 status
pm2 logs hydrobreak-api
```

---

## 6. Nginx: Frontend ausliefern + API weiterleiten

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/hydrobreak
```

Inhalt (ersetzt `deine-domain.de` durch deine Domain oder nutze die Server-IP):

```nginx
server {
    listen 80;
    server_name deine-domain.de;   # oder _ für beliebige Hosts / IP

    root /var/www/hydrobreak/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Aktivieren und testen:

```bash
sudo ln -s /etc/nginx/sites-available/hydrobreak /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Ohne Domain: `server_name _;` lassen, dann erreichst du die App unter `http://DEINE-SERVER-IP`.

---

## 7. Firewall (optional, empfohlen)

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

---

## 8. SSL mit Let’s Encrypt (optional, für HTTPS)

Nur sinnvoll, wenn eine Domain auf den Server zeigt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

Anweisungen von certbot folgen. Nginx wird automatisch auf HTTPS umgestellt.

**Wichtig:** Nach SSL die App im Browser über `https://deine-domain.de` aufrufen. Wenn du vorher `VITE_API_URL` gesetzt hattest, kann sie wieder entfernt werden (API läuft über dieselbe Domain).

---

## 9. Kurz-Checkliste

| Schritt              | Befehl / Ort |
|----------------------|--------------|
| Build                | `npm run build` im Projektroot |
| API läuft            | `pm2 status` → hydrobreak-api |
| Nginx lädt           | `sudo systemctl status nginx` |
| Öffentlich erreichbar| `http://DEINE-IP` oder `https://deine-domain.de` |

---

## 10. Updates einspielen

```bash
cd /var/www/hydrobreak
git pull
npm install
npm run build
cd server && npm install
pm2 restart hydrobreak-api
```

---

## Troubleshooting

- **502 Bad Gateway:** API läuft nicht → `pm2 status` und `pm2 logs hydrobreak-api`.
- **Leere Seite / nur API:** Nginx-`root` muss auf `/var/www/hydrobreak/dist` zeigen; nach Build muss `dist/index.html` existieren.
- **CORS-Fehler:** Sollte nicht auftreten, da Frontend und API über dieselbe Domain laufen (Nginx leitet `/api` weiter).
- **Daten/User:** Liegen unter `server/data/` (oder `DATA_DIR`). Dieses Verzeichnis bei Backups einschließen.
