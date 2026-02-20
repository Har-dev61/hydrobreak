# HydroBreak – Verbesserungsideen

Konkrete Vorschläge für neue Features, UI/UX und technische Verbesserungen. Priorisierung und Aufwand sind grobe Schätzungen.

---

## 1. Neue Features

### Schnell umsetzbar

| Idee | Beschreibung | Aufwand |
|------|--------------|--------|
| **Daten exportieren** | In Einstellungen: „Meine Daten exportieren“ (JSON/CSV) – Fortschritt, Stats, Gamification. Gut für Vertrauen und DSGVO. | Klein |
| **Arbeitszeiten** | Einstellung „Reminder nur Mo–Fr“ oder „Nur zwischen 8–18 Uhr“ – weniger Störung am Abend/Wochenende. | Klein |
| **Sound bei Erinnerung** | Optionale kurze Sound-Datei oder Vibration, wenn eine Erinnerung erscheint (Respekt vor Stumm). | Klein |
| **Mehr motivierende Texte** | Erweiterte i18n-Arrays für Wasser/Bewegung/Augen, evtl. nach Tageszeit oder Streak variieren. | Klein |

### Mittlerer Aufwand

| Idee | Beschreibung | Aufwand |
|------|--------------|--------|
| **Statistik-Modal/Seite** | Eigener Bereich „Statistik“: Heatmap (habt ihr schon), „Wasser pro Tag“-Verlauf, „Streak-Verlauf“ als kleine Grafik. | Mittel |
| **Saison-Challenge** | z. B. „Februar: 20 Tage mit mind. 1,5 L“ – eigenes Badge + XP. Erfordert Backend-Logik für Zeitraum. | Mittel |
| **Passwort vergessen** | Flow „E-Mail eingeben“ → Link/Code zum Zurücksetzen (Backend: Token + Mail nötig). | Mittel |
| **Benachrichtigung bei Streak-Risiko** | Optional: „Dein Streak könnte morgen weitergehen“ (E-Mail/Push, wenn Account + Kommunikation da). | Mittel |

### Größere Projekte (später)

- **Erinnerungen bei geschlossenem Tab:** Service Worker / Alarms API oder Web Push (Backend).
- **Sprache umschaltbar:** z. B. DE/EN über i18n-Struktur + Sprachwahl in Einstellungen.
- **Rangliste / „Top 20 % diese Woche“:** Anonymisierte Vergleichs-Funktion (Backend + Konzept).

---

## 2. UI-Verbesserungen

### Erste Schritte (hoher Impact)

| Bereich | Aktuell | Vorschlag |
|---------|---------|-----------|
| **Leere Zustände** | Leere Badges/Challenges/Streak können kahl wirken. | Klare Texte: „Noch keine Badges – trink dein erstes Glas!“ + kleines Icon. Gleiches für Streak, Challenges. |
| **Header** | Immer gleicher Titel. | Optional: Begrüßung mit Namen (wenn aus Auth), oder kurzer Tages-Spruch („Guter Tag für Hydration!“). |
| **Quick Actions** | Gut sichtbar. | Leichtes visuelles Feedback nach Klick (z. B. kurzes „+10 XP“ oder Häkchen), damit die Aktion bestätigt wird. |
| **Reminder-Karten** | Countdown „in X Min“. | Zusätzlich oder stattdessen **Fortschritts-Ring** (kreisrunder Countdown) für „nächste Erinnerung in …“ – wirkt modern und klar. |
| **Fokuszeit** | Nur Text „Fokuszeit – Erinnerungen pausiert“. | Dezentes Banner oder Badge oben (z. B. amber/gelb), damit sofort erkennbar ist, dass Pause aktiv ist. |

### Optik & Konsistenz

| Thema | Vorschlag |
|-------|-----------|
| **Abstände & Hierarchie** | Einheitliche `space-y-6` bzw. `gap-4`; wichtigste Infos (Wasser-Fortschritt, Quick Actions) etwas hervorgehoben (Größe/Abstand). |
| **Farbakzente** | Wasser = Sky, Bewegung = Emerald, Augen = Violet beibehalten; evtl. einen „Primary“-Akzent (z. B. Sky) für Buttons/CTAs durchgängig nutzen. |
| **Karten** | Leichter Schatten (habt ihr), konsistente `rounded-2xl`; bei Hover evtl. nur leichter Schattenanstieg, keine großen Sprünge. |
| **Dark Mode** | Prüfen, ob alle Texte ausreichend Kontrast haben (z. B. `text-gray-500` auf `dark:bg-zinc-800`); ggf. `dark:text-gray-400`. |

### Mobile & Interaktion

| Thema | Vorschlag |
|-------|-----------|
| **Touch-Ziele** | Buttons und Quick Actions mind. 44px hoch – bei euch oft schon erfüllt; in Einstellungen Slider/Toggles prüfen. |
| **Bottom Navigation** | Optional: Feste Leiste unten („Heute“ / „Statistik“ / „Einstellungen“), wenn ihr später mehrere Bereiche habt. |
| **Pull-to-Refresh** | Optional: Auf der Hauptseite „Ziehen zum Aktualisieren“, um Timer/Zeit im Blick zu behalten. |
| **Haptik** | Auf unterstützten Geräten `navigator.vibrate(50)` bei „Glas getrunken“ / Challenge-Claim (kurz, dezent). |

### Barrierefreiheit (A11y)

| Thema | Vorschlag |
|-------|-----------|
| **Fokus** | Sicherstellen, dass Tastatur-Navigation sinnvoll ist (Reihenfolge: Header → Quick Actions → Karten → Einstellungen). |
| **ARIA** | Wichtige Buttons mit `aria-label` wo der Inhalt nicht eindeutig ist (z. B. „Schließen“, „Snooze“). |
| **Kontrast** | WCAG AA: Text mind. 4.5:1 zum Hintergrund; Links/Buttons prüfen (Sky auf Weiß/Dunkel). |
| **Screenreader** | Live-Region für Toasts („+10 XP“, „Badge freigeschaltet“), damit sich ändernde Infos angesagt werden. |

---

## 3. Technik & Qualität

| Thema | Vorschlag |
|-------|-----------|
| **Code-Splitting** | Schwere Bereiche (z. B. Statistik, Einstellungs-Panel) mit `React.lazy` + `Suspense` laden, um initiales Bundle zu verkleinern. |
| **LocalStorage** | Alte Einträge in `stats.daily` / `todayCounts` nach z. B. 90 Tagen kappen, um Speicher zu begrenzen. |
| **Offline** | PWA habt ihr; klare Offline-Seite („Du bist offline – deine Daten werden beim nächsten Mal synchronisiert.“). |
| **Rechtliches** | Datenschutz, Impressum, AGB (wenn ihr Account/Sync anbietet); Link in Einstellungen oder Footer. |

---

## 4. Priorisierungs-Vorschlag

**Zuerst (schnell, sichtbar):**
1. Leere Zustände für Badges/Streak/Challenges
2. Kleines Feedback auf Quick-Action-Klick („+10 XP“ oder Häkchen)
3. Daten exportieren (Button in Einstellungen)

**Dann:**
4. Arbeitszeiten / Zeitfenster für Reminder
5. Statistik-Modal mit Verläufen
6. Passwort vergessen (wenn E-Mail-Versand läuft)

**Später:**
7. Saison-Challenges, Sound/Haptik, Sprache, evtl. Rangliste

---

Wenn du möchtest, können wir eine dieser Ideen konkret ausarbeiten (z. B. „Leere Zustände“ oder „Daten exportieren“ Schritt für Schritt umsetzen).
