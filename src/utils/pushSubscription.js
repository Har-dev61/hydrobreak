/**
 * Web-Push-Abonnement: VAPID-Key holen, im Service Worker abonnieren, an Backend senden
 */
import { push as pushApi, user as userApi } from '../api/client'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Push abonnieren und Subscription an Backend senden.
 * Vorher: Notification-Permission muss „granted“ sein, User eingeloggt.
 * @returns {Promise<boolean>} true wenn Abo erfolgreich
 */
export async function subscribeAndSendToBackend() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  if (Notification.permission !== 'granted') return false
  try {
    const { publicKey } = await pushApi.getVapidPublicKey()
    if (!publicKey) return false
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
    await userApi.postPushSubscription(sub.toJSON())
    return true
  } catch (e) {
    console.warn('Push subscription failed:', e.message)
    return false
  }
}
