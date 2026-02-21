import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.js', 'src/**/*.spec.js'],
  },
  plugins: [
    react(),
    VitePWA({
      enforce: 'post',
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      includeAssets: ['favicon.svg', 'icon-512.svg'],
      manifest: {
        name: 'HydroBreak',
        short_name: 'HydroBreak',
        description: 'Trink- und Pausen-Erinnerungen für einen gesünderen Arbeitsalltag',
        theme_color: '#0ea5e9',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'de',
        icons: [
          { src: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        categories: ['health', 'lifestyle', 'productivity'],
        shortcuts: [
          { name: 'Glas getrunken', short_name: 'Wasser', url: '/?action=drink', icons: [{ src: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' }] },
          { name: 'Pause starten', short_name: 'Bewegung', url: '/?action=stand', icons: [{ src: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' }] },
          { name: 'Augenpause', short_name: '20-20-20', url: '/?action=eye', icons: [{ src: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' }] },
          { name: 'Statistik', short_name: 'Statistik', url: '/?tab=stats', icons: [{ src: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' }] },
        ],
      },
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
