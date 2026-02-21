# Web Push – Erinnerungen bei geschlossenem Tab

Wenn der Tab zu ist, kann die App keine lokalen Timer mehr ausführen. **Web Push** löst das: Das Backend sendet in einem festen Intervall (z. B. jede Minute) Push-Nachrichten an alle Nutzer, bei denen eine Erinnerung fällig ist.

---

## Ablauf

1. **Nutzer** erlaubt Benachrichtigungen in der App („Erlauben“ in den Einstellungen).
2. **Frontend** holt den öffentlichen VAPID-Key vom Backend, abonniert Push im Service Worker und sendet die **Subscription** (Endpoint + Keys) an das Backend.
3. **Backend** speichert die Subscription pro User. Wenn die App geöffnet ist und eine Erinnerung auslöst, ruft das Frontend **„Reminder gesendet“** auf – das Backend aktualisiert den Zeitstempel für die nächste Erinnerung.
4. **Cron** (alle 60 Sekunden): Für jeden User mit Subscription und aktivierten Benachrichtigungen prüft das Backend: Liegt die aktuelle Zeit (in der Zeitzone des Users) im Erinnerungs-Fenster und außerhalb der Fokuszeit? Ist das Intervall (Wasser/Stand/Eye) seit der letzten Erinnerung abgelaufen? Wenn ja → Push senden und Zeitstempel aktualisieren.

---

## Backend einrichten

### 1. VAPID-Keys erzeugen

Einmalig (z. B. auf dem Rechner oder Server):

```bash
cd server
npx web-push generate-vapid-keys
```

Es erscheinen `publicKey` und `privateKey`. Diese in die Umgebung eintragen (nicht ins Repo committen).

### 2. Umgebungsvariablen

In `server/.env` (oder auf dem Ubuntu-Server in der Systemumgebung / systemd):

```env
VAPID_PUBLIC_KEY=BIid...   # der angezeigte publicKey
VAPID_PRIVATE_KEY=abc...  # der angezeigte privateKey
VAPID_MAILTO=mailto:noreply@deine-domain.de
```

- **VAPID_MAILTO:** Kontakt für den Push-Dienst (kann eine E-Mail-Adresse sein).

Ohne diese Variablen startet die API normal, aber **Web Push ist deaktiviert** (kein Cron, `/api/push/vapid-public-key` antwortet mit 503).

### 3. Abhängigkeit

Im Ordner `server` ist `web-push` bereits in `package.json` eingetragen. Nach `npm install` ist alles bereit.

---

## Frontend / PWA

- Der **Service Worker** (`public/sw.js`) hat einen **push**-Listener: Er zeigt die Nachricht als System-Benachrichtigung an. Beim Klick wird das App-Fenster fokussiert (falls offen) oder die App geöffnet.
- Das Frontend ruft beim **Aktivieren von Benachrichtigungen** die Push-Subscription an und sendet sie an `POST /api/user/push-subscription`.
- Bei **jeder ausgelösten Erinnerung** (Wasser/Stand/Eye) sendet die App `POST /api/user/reminder-sent` mit `{ type: 'water'|'stand'|'eye' }`, damit das Backend den nächsten Zeitpunkt berechnen kann.
- Die **Zeitzone** des Users wird in den Einstellungen mitgespeichert (`timezone`, z. B. `Europe/Berlin`), damit der Cron die Fokuszeiten und das Erinnerungsfenster korrekt prüft.

---

## Einschränkungen

- **Browser-Unterstützung:** Web Push funktioniert in Chrome, Firefox, Edge und Safari (mit Einschränkungen). In manchen Umgebungen (z. B. in manchen In-App-Browsern) ist Push deaktiviert.
- **Genauigkeit:** Der Cron läuft nur etwa alle 60 Sekunden. Erinnerungen können daher bis zu 1 Minute verzögert sein.
- **Mehrere Geräte:** Pro Browser/ Gerät wird eine Subscription gespeichert. Mehrere Tabs desselben Browsers teilen sich in der Regel eine Subscription.
