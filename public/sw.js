/* eslint-disable no-restricted-globals */
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  if (!event.data) return
  let payload = { title: 'HydroBreak', body: '' }
  try {
    payload = { ...payload, ...event.data.json() }
  } catch {
    payload.body = event.data.text() || ''
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'HydroBreak', {
      body: payload.body || '',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: payload.type || 'reminder',
      requireInteraction: false,
      data: { url: self.registration.scope },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus()
      } else if (self.clients.openWindow) {
        self.clients.openWindow(event.notification.data?.url || '/')
      }
    })
  )
})
