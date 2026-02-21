# Performance – HydroBreak

## Umgesetzt

### Timer-Isolation (wichtigster Schritt)
- **Problem:** Ein `setInterval(..., 1000)` in der App hat jede Sekunde `setWaterRemaining` / `setStandRemaining` / `setEyeRemaining` aufgerufen → die **gesamte App** wurde jede Sekunde neu gerendert.
- **Lösung:** Timer-State und Interval liegen jetzt in `ReminderTimersProvider` + `useReminderTimers()`. Nur der **Heute-Tab** (TodayTab) ist Kind des Providers und rendert jede Sekunde; App, BottomNav, Stats, Einstellungen etc. bleiben unverändert.
- **Dateien:** `src/context/ReminderTimersContext.jsx`, `src/components/TodayTab.jsx`, Anpassungen in `App.jsx`.

---

## Nächste sinnvolle Schritte (Priorität)

1. **Lazy Loading für schwere Komponenten**
   - `StatsPage`, `StatsModal`, `GamificationPanel`, `LegalModal`, `WhatsNewModal` per `React.lazy()` laden, wenn sie zum ersten Mal gebraucht werden → kleineres Initial-Bundle, schnellerer First Paint.
   - Bereits lazy: SettingsPanel, EyeBreakModal, LevelUpModal, Onboarding, AuthModal, AuthGate.

2. **Build-Optimierung**
   - In `vite.config.js`: `build.rollupOptions.output.manualChunks` nutzen, z. B. `lucide-react` und ggf. große Utils in eigene Chunks packen.
   - Prüfen: `npm run build` → Chunk-Größen mit z. B. `vite-bundle-visualizer` oder im `dist/`-Output.

3. **Memoization**
   - Schwere Listen (z. B. in Stats/Heatmap) mit `React.memo` oder `useMemo` für abgeleitete Daten absichern, wenn beim Profilen viele Re-Renders auffallen.
   - Callbacks, die an viele Kinder gehen, mit `useCallback` stabil halten (teilweise schon umgesetzt).

4. **i18n**
   - Übersetzungen pro Sprache dynamisch laden (`import('./i18n/de.js')`), damit nur eine Sprache im Initial-Bundle ist.

5. **Service Worker / Caching**
   - PWA-Caching (vite-plugin-pwa) prüfen: ob kritische API-Calls oder Assets sinnvoll gecacht werden, ohne veraltete Daten.

---

## Messen

- **React DevTools Profiler:** Re-Renders pro Aktion prüfen (z. B. nur TodayTab bei Sekunden-Tick).
- **Chrome DevTools → Performance:** LCP, FCP, Long Tasks nach dem ersten Load und nach Tab-Wechsel.
- **Lighthouse:** Performance-Score und konkrete Empfehlungen.
