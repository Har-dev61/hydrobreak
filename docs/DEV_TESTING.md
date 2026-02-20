# Als Dev prüfen: Heatmap & Statistik

## Wo findest du was?

- **Heatmap:** In der Hauptansicht nach unten scrollen → Bereich **„Statistiken & Badges“** (GamificationPanel) aufklappen → die Heatmap steht unter den Badges. Zeigt die letzten 12 Wochen, pro Tag eine Zelle (Aktivität 0–4).
- **Statistik-Modal:** Neben der Karte **„Fortschritt“** (Wasser) gibt es den Button mit dem **Balkendiagramm-Icon**. Klick öffnet das Modal mit:
  - **Wasser – letzte Tage** (Balken pro Tag)
  - **Wochenvergleich** (diese Woche vs. Vorwoche)

## Ohne Testdaten

- **Heatmap:** Mit frischer App sind alle Zellen grau (keine Aktivität). Sobald du heute **Wasser trinkst** und/oder **Pausen** machst (Quick Actions oder in den Karten), wird der **heutige** Tag in der Heatmap farbig. Ältere Tage füllen sich erst, wenn ein neuer Tag beginnt (Mitternacht), weil der vorherige Tag dann in `stats.daily` übernommen wird.
- **Statistik-Modal:** Zeigt „Noch keine Verlaufsdaten“, bis Einträge in `stats.daily` existieren – also wieder erst nach Mitternacht oder nach dem Seed (siehe unten).

## Mit Testdaten (nur Entwicklung)

Damit du sofort Heatmap und Statistik prüfen kannst, gibt es einen **Dev-Seed**:

1. App im **Dev-Modus** starten (`npm run dev`).
2. **Browser-Konsole** öffnen (F12 → Console).
3. Ausführen:
   ```js
   __hydrobreakSeedDevData()
   ```
4. Die Seite lädt neu; danach sind die letzten **12 Wochen** mit Dummy-Wasser- und Pausendaten gefüllt.

Die Funktion ist nur in **Development** verfügbar (`import.meta.env.DEV`). Sie schreibt in `localStorage` (Stats + Gamification) und führt ein Reload aus. Deine heutigen echten Daten (z. B. heutiger Fortschritt) bleiben erhalten; nur die Vergangenheit wird mit Testwerten belegt.

## Kurzfassung

| Was            | Wo in der App                          | Ohne Daten              | Mit `__hydrobreakSeedDevData()`   |
|----------------|----------------------------------------|-------------------------|-----------------------------------|
| **Heatmap**    | Gamification → „Statistiken & Badges“ aufklappen | Nur heute evtl. farbig  | 12 Wochen mit Farbstufen sichtbar |
| **Statistik**  | Button „Balken“ neben Fortschritt      | „Noch keine Verlaufsdaten“ | Balken + Wochenvergleich gefüllt  |
