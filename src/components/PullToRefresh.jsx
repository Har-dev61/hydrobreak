import React, { useState, useRef, useCallback } from 'react'
import { t } from '../i18n'

const PULL_THRESHOLD = 72
const PULL_MAX = 100

/**
 * Ziehen zum Aktualisieren: am oberen Rand nach unten ziehen löst onRefresh aus.
 * Nutzt Touch-Events; bei Maus (Desktop) wird ein Fallback-Button angeboten.
 */
export default function PullToRefresh({ children, onRefresh, disabled }) {
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const scrollTop = useRef(0)

  const handleRefresh = useCallback(async () => {
    if (disabled || refreshing) return
    setRefreshing(true)
    try {
      await Promise.resolve(onRefresh())
    } finally {
      setRefreshing(false)
    }
  }, [onRefresh, disabled, refreshing])

  const onTouchStart = useCallback(
    (e) => {
      if (disabled || refreshing) return
      startY.current = e.touches[0].clientY
      scrollTop.current = e.target.scrollTop ?? 0
    },
    [disabled, refreshing]
  )

  const onTouchMove = useCallback(
    (e) => {
      if (disabled || refreshing) return
      if (scrollTop.current > 2) return
      const y = e.touches[0].clientY
      const delta = y - startY.current
      if (delta > 0) {
        setPullY(Math.min(delta, PULL_MAX))
      } else {
        setPullY(0)
      }
    },
    [disabled, refreshing]
  )

  const onTouchEnd = useCallback(() => {
    if (pullY >= PULL_THRESHOLD) {
      handleRefresh()
    }
    setPullY(0)
  }, [pullY, handleRefresh])

  const showTrigger = pullY >= PULL_THRESHOLD
  const progress = Math.min(1, pullY / PULL_THRESHOLD)

  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      {/* Pull-Indikator oben (nur sichtbar beim Ziehen / beim Aktualisieren) */}
      <div
        className="flex items-center justify-center h-12 shrink-0 transition-opacity duration-200"
        style={{
          opacity: pullY > 0 || refreshing ? 1 : 0,
          height: pullY > 0 || refreshing ? 48 : 0,
          minHeight: pullY > 0 || refreshing ? 48 : 0,
        }}
        aria-hidden
      >
        {refreshing ? (
          <span className="text-xs text-app-muted-foreground">{t('pullRefresh.updating')}</span>
        ) : (
          <span className="text-xs text-app-muted-foreground">
            {showTrigger ? t('pullRefresh.updating') : t('pullRefresh.hint')}
          </span>
        )}
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-behavior-contain -mt-3 pt-3"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {children}

        {/* Fallback für Desktop: Button „Aktualisieren“ */}
        {!refreshing && (
          <div className="flex justify-center py-4">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={disabled}
              className="text-xs text-app-muted-foreground hover:text-[var(--app-accent)] underline disabled:opacity-50"
            >
              {t('pullRefresh.hint')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
