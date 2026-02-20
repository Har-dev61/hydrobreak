# E-Mail-Versand einrichten (kostenlose Optionen)

HydroBreak nutzt **Nodemailer** mit SMTP. Du brauchst **keinen eigenen Server** – ein kostenloser E-Mail-Dienst reicht.

---

## Option 1: Gmail (kostenlos, schnell eingerichtet)

**Limit:** ca. 500 E-Mails/Tag (persönlicher Account).

1. **2-Faktor-Authentifizierung** in deinem Google-Konto aktivieren (Einstellungen → Sicherheit).
2. **App-Passwort** erstellen:  
   [Google-Konto](https://myaccount.google.com/) → Sicherheit → „App-Passwörter“ → App auswählen (z. B. „Mail“), Gerät „Andere“, Namen vergeben → Passwort kopieren.
3. In `server/.env` eintragen:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=deine.email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
MAIL_FROM=deine.email@gmail.com
APP_NAME=HydroBreak
```

---

## Option 2: Brevo (ehemals Sendinblue) – kostenlos

**Limit:** 300 E-Mails/Tag dauerhaft kostenlos.

1. Account erstellen: [brevo.com](https://www.brevo.com/)
2. **Einstellungen** → **SMTP & API** → SMTP-Daten anzeigen (Server, Port, Login).
3. **SMTP Key** erzeugen (das ist dein Passwort).
4. In `server/.env`:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=deine-registrierte-email@beispiel.de
SMTP_PASS=dein-smtp-key-von-brevo
MAIL_FROM=deine-registrierte-email@beispiel.de
APP_NAME=HydroBreak
```

---

## Option 3: SendGrid – kostenlos

**Limit:** 100 E-Mails/Tag dauerhaft kostenlos.

1. Account: [sendgrid.com](https://sendgrid.com/)
2. **Settings** → **Sender Authentication**: Absender verifizieren (Domain oder Single Sender).
3. **Settings** → **API Keys** → Create API Key („Restricted“ reicht, nur „Mail Send“).
4. SendGrid bietet **SMTP Relay**:
   - Host: `smtp.sendgrid.net`
   - Port: 587
   - User: `apikey`
   - Pass: dein API-Key (nicht die E-Mail-Adresse)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxx
MAIL_FROM=verifizierte-absender@deine-domain.de
APP_NAME=HydroBreak
```

---

## Option 4: Mailtrap (nur für Tests)

**Kein echter Versand** – E-Mails landen in einer Inbox zum Testen. Ideal für Entwicklung.

1. Account: [mailtrap.io](https://mailtrap.io/)
2. **Email Testing** → Inbox → **SMTP Settings**.
3. In `server/.env` die angezeigten Werte eintragen (Host, Port, User, Pass).

E-Mails erscheinen dann nur im Mailtrap-Dashboard, nicht in echten Postfächern.

---

## Übersicht

| Dienst   | Kostenlos        | Echte Zustellung | Aufwand   |
|----------|------------------|------------------|-----------|
| Gmail    | ~500/Tag         | Ja               | Gering    |
| Brevo    | 300/Tag          | Ja               | Gering    |
| SendGrid | 100/Tag          | Ja               | Mittel*   |
| Mailtrap | Unbegrenzt (Test)| Nein             | Gering    |

\* SendGrid verlangt verifizierten Absender (E-Mail oder Domain).

---

## Ohne Konfiguration (lokale Entwicklung)

Wenn **keine** SMTP-Variablen gesetzt sind, schreibt der Server den Verifizierungscode nur in die **Konsole**, z. B.:

```
[HydroBreak] Kein SMTP konfiguriert – Verifizierungscode für user@example.com: 482917
```

Zum Testen kannst du diesen Code im Modal eingeben – ein eigener SMTP-Server ist dafür nicht nötig.
