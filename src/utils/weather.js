/**
 * Wetter für AI-Insights (Open-Meteo, kein API-Key nötig).
 * Optional: nur bei Nutzerzustimmung (Geolocation) und weatherForInsights aktiv.
 */

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast'

/**
 * Holt aktuelles Wetter für lat/lon.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{ temp: number, conditionCode: number } | null>}
 */
export async function fetchCurrentWeather(lat, lon) {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'temperature_2m,weather_code',
    })
    const res = await fetch(`${OPEN_METEO}?${params}`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = await res.json()
    const cur = data?.current
    if (!cur) return null
    return {
      temp: cur.temperature_2m ?? 0,
      conditionCode: cur.weather_code ?? 0,
    }
  } catch {
    return null
  }
}

/**
 * Geolocation, dann Wetter abrufen.
 * @returns {Promise<{ temp: number, conditionCode: number } | null>}
 */
export function fetchWeatherWithGeolocation() {
  return new Promise((resolve) => {
    if (!navigator?.geolocation?.getCurrentPosition) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchCurrentWeather(pos.coords.latitude, pos.coords.longitude).then(resolve)
      },
      () => resolve(null),
      { timeout: 6000, maximumAge: 30 * 60 * 1000 }
    )
  })
}
