import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// PWA: Service Worker registrieren (autoUpdate = automatische Aktualisierung bei neuem Build)
if (import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  })
}

// Dev: Testdaten für Heatmap & Statistik in Konsole seeden – __hydrobreakSeedDevData()
if (import.meta.env.DEV) {
  import('./utils/devSeedData.js').then((m) => {
    window.__hydrobreakSeedDevData = () => {
      m.seedDevStatsAndGamification()
      window.location.reload()
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
