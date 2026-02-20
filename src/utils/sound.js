/**
 * Kurzer, dezenter Ton bei Erinnerung (Web Audio API, keine externe Datei).
 * Nur abspielen wenn Nutzer Sound aktiviert hat.
 */
let audioContext = null

function getAudioContext() {
  if (audioContext) return audioContext
  if (typeof window === 'undefined') return null
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  } catch {
    return null
  }
  return audioContext
}

/**
 * Spielt einen weichen Erinnerungs-Ton (kurzer Sinus, ~800 Hz, ~150 ms).
 * Kein Abspielen wenn Seite stumm ist (user gesture / Autoplay-Richtlinien).
 */
export function playReminderSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'sine'
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc.start(now)
    osc.stop(now + 0.15)
  } catch {
    // Autoplay blockiert oder nicht unterstützt – still ignorieren
  }
}
