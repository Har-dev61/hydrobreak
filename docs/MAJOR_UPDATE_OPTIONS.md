# HydroBreak – Major Update: Drei Richtungen

Du willst ein **größeres Release** machen. Hier sind **drei konkrete Pakete** – jeweils mit klarem Mehrwert und grobem Aufwand. Du kannst eines wählen, dann können wir es Schritt für Schritt umsetzen.

---

## Option 1: **Mehrsprachigkeit + Rechtliches** („App wird professionell“)

**Idea:** App auf DE/EN umstellbar, plus rechtliche Seiten für Nutzer mit Account.

| Was | Kurzbeschreibung |
|-----|------------------|
| **Sprache umschaltbar** | In Einstellungen: „Sprache“ → Deutsch / English. i18n-Struktur hast du schon; wir fügen EN-Übersetzungen hinzu und einen Locale-Switch. |
| **Rechtliche Seiten** | „Datenschutz“, „Impressum“ (evtl. „Nutzungsbedingungen“) – als eigene Routen/Seiten oder einfache Modals mit Text/Link. In Einstellungen oder Footer verlinkt. |
| **Version & Changelog** | `package.json` auf z. B. 2.0.0; optional „Was ist neu?“-Modal beim ersten Start nach Update. |

**Impact:** Wirkt seriös, gut für Veröffentlichung und Nutzer mit Rechtssicherheit.  
**Aufwand:** Mittel (i18n durchziehen + 2–3 Seiten/Modals).

---

## Option 2: **Navigation + Statistik-Bereich** („Struktur & Übersicht“)

**Idea:** Klare Trennung „Heute“ / „Statistik“ / „Einstellungen“ und Statistik als eigener Bereich.

| Was | Kurzbeschreibung |
|-----|------------------|
| **Bottom Navigation / Tabs** | Feste Leiste unten (oder Tabs oben): **Heute** (aktuelles Dashboard), **Statistik** (eigener Bereich), **Einstellungen**. Reduziert die lange Scroll-Seite. |
| **Statistik-Seite** | Eigener View: Heatmap, „Wasser – letzte Tage“, Wochenvergleich, evtl. Streak-Verlauf. Inhalte aus StatsModal + GamificationPanel bündeln. |
| **Heute-View entlasten** | Auf „Heute“ nur: Header, Quick Actions, Fokus-Session, Reminder-Karten, ggf. kompakte Wochenübersicht. Gamification/Heatmap optional verlinkt oder gekürzt. |

**Impact:** Klarere Struktur, Statistik bekommt einen eigenen Ort.  
**Aufwand:** Mittel–hoch (Routing oder View-State, 1–2 neue „Seiten“).

---

## Option 3: **Erlebnis & Feedback** („App fühlt sich lebendiger an“)

**Idea:** Mehr sinnliches Feedback und motivierende Inhalte.

| Was | Kurzbeschreibung |
|-----|------------------|
| **Sound bei Erinnerung** | Optionale kurze Sound-Datei (z. B. weicher Ton), wenn eine Erinnerung erscheint. Einstellung „Sound bei Erinnerung“ (an/aus), Respekt vor Stumm. |
| **Haptik** | Auf unterstützten Geräten `navigator.vibrate(50)` bei „Glas getrunken“, Challenge-Claim, evtl. Session-Ende – dezent, nicht bei jeder Kleinigkeit. |
| **Mehr motivierende Texte** | i18n-Arrays erweitern: nach Tageszeit (morgens/mittags/abends) oder nach Streak variierende Sprüche für Wasser/Bewegung/Augen. |
| **Leere Zustände aufpolieren** | Badges/Streak/Challenges: klare Texte + kleine Illustrationen oder Icons, damit leere Bereiche einladen statt kahl wirken. |

**Impact:** App fühlt sich reaktiver und motivierender an.  
**Aufwand:** Mittel (Sound/Haptik optional, Texte und leere Zustände gut planbar).

---

## Kurzvergleich

| Kriterium | Option 1 (i18n + Recht) | Option 2 (Nav + Statistik) | Option 3 (Erlebnis) |
|-----------|-------------------------|-----------------------------|----------------------|
| **Sichtbar für Nutzer** | Sprache + Links | Neue Navigation, eigener Statistik-Bereich | Sound, Haptik, Texte |
| **Technischer Aufwand** | Mittel | Mittel–hoch | Mittel |
| **Backend nötig?** | Nein | Nein | Nein |
| **Gut für** | Release, Rechtssicherheit | Nutzer mit Fokus auf Verläufe/Statistik | Retention, „Gefühl“ |

---

## Empfehlung

- **Wenn du die App bald „richtig“ rausbringen willst:** Option 1 (Sprache + Rechtliches) ist ein starkes, professionelles Major Update.
- **Wenn Nutzer schon nach mehr Statistik fragen:** Option 2 (Navigation + Statistik-Bereich) gibt dem Thema einen klaren Platz.
- **Wenn du vor allem das Gefühl und die Motivation stärken willst:** Option 3 (Erlebnis & Feedback) ist ein guter Hebel ohne große Architektur.

Du kannst auch **zwei Optionen kombinieren** (z. B. 1 + 3: Sprache + Recht + Sound/Haptik/Texte) und das als **2.0** vermarkten.

Sag einfach, welche Option (oder Kombination) du als nächstes umsetzen willst – dann gehen wir es konkret an (z. B. zuerst Sprache + Einstellung, dann EN-Texte, dann Datenschutz/Impressum).
