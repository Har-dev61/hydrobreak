import React from 'react'
import { Mic, MicOff } from 'lucide-react'
import { t } from '../i18n'

/**
 * Mikrofon-Button für Sprachbefehle: „Glas getrunken“, „Pause“, „Augenpause“.
 */
function VoiceCommandButton({
  isListening,
  isSupported,
  error,
  onStart,
  onStop,
  className = '',
}) {
  if (!isSupported) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs text-app-muted-foreground ${className}`}
        title={t('voice.unsupported')}
      >
        <MicOff className="w-4 h-4" aria-hidden />
        <span>{t('voice.unsupported')}</span>
      </span>
    )
  }

  const handleClick = () => {
    if (isListening) onStop()
    else onStart()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] focus:ring-offset-2 focus:ring-offset-[var(--app-bg)] ${className}`}
      aria-label={isListening ? t('voice.stop') : t('voice.start')}
      title={isListening ? t('voice.stop') : t('voice.start')}
    >
      {isListening ? (
        <>
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-400/60" aria-hidden />
            <Mic className="relative h-5 w-5 text-red-500" aria-hidden />
          </span>
          <span className="text-xs font-medium text-red-600 dark:text-red-400">{t('voice.listening')}</span>
        </>
      ) : (
        <>
          <Mic className="h-5 w-5 text-[var(--app-primary)]" aria-hidden />
          <span className="text-xs font-medium text-[var(--app-primary)]">{t('voice.start')}</span>
        </>
      )}
    </button>
  )
}

export default VoiceCommandButton
