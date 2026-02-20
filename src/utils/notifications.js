/**
 * Web Notifications API – Erlaubnis anfragen und Benachrichtigungen anzeigen
 */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function showNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const notification = new Notification(title, {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    ...options,
  })
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
  return notification
}
