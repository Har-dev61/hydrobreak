import React, { useEffect, useRef } from 'react'
import { Droplets } from 'lucide-react'
import { t } from '../i18n'

const INTRO_DURATION_MS = 2700
const INTRO_DURATION_REDUCED_MS = 400

/**
 * Vollbild-Intro nach dem Login: Logo + Untertitel, dann Ausblendung.
 * Ruft onComplete nach der Animation auf. Respektiert prefers-reduced-motion.
 */
export default function IntroAnimation({ onComplete }) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const duration = reducedMotion.current ? INTRO_DURATION_REDUCED_MS : INTRO_DURATION_MS
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--app-bg)]"
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center gap-4 px-6">
        <div
          className="flex items-center justify-center gap-3 opacity-0 motion-reduce:opacity-100 animate-intro-logo"
          style={
            reducedMotion.current
              ? { animation: 'none', opacity: 1 }
              : undefined
          }
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 dark:bg-sky-400/20">
            <Droplets className="h-8 w-8 text-sky-600 dark:text-sky-400" aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--app-primary)]">
            HydroBreak
          </h1>
        </div>
        <p
          className="text-sm text-app-muted-foreground opacity-0 motion-reduce:opacity-80 animate-intro-subtitle"
          style={
            reducedMotion.current
              ? { animation: 'none', opacity: 0.8 }
              : undefined
          }
        >
          {t('app.subtitle')}
        </p>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[var(--app-bg)] opacity-0 animate-intro-fade-out"
        style={
          reducedMotion.current
            ? { animation: `introFadeOut 0.2s ease-in ${(duration - 150) / 1000}s forwards` }
            : undefined
        }
        aria-hidden
      />
    </div>
  )
}
