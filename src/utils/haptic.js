/**
 * Haptisches Feedback (Vibration) bei Aktionen.
 * Nur auslösen wenn Nutzer Haptik aktiviert hat und API verfügbar ist.
 */

/**
 * Kurzes, dezentens Vibrationsmuster (z. B. bei „Glas getrunken“, Challenge erledigt).
 * @param {number|number[]} [pattern=50] – Dauer in ms oder Array [vibrate, pause, vibrate, …]
 */
export function triggerHaptic(pattern = 50) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  try {
    navigator.vibrate(pattern)
  } catch {
    // ignorieren
  }
}
