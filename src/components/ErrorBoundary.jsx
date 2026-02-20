import React from 'react'
import { t } from '../i18n'

/**
 * React Error Boundary (muss Klassenkomponente sein).
 * Fängt Fehler in Kind-Komponenten ab und zeigt eine Fallback-UI statt weißen Bildschirm.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo)
    }
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback
      if (Fallback && typeof Fallback === 'function') {
        return (
          <Fallback
            error={this.state.error}
            onRetry={this.props.retryable ? this.handleRetry : undefined}
          />
        )
      }
      return (
        <div
          className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-200"
          role="alert"
        >
          <p className="font-medium">{t('errors.boundaryTitle')}</p>
          <p className="text-sm mt-1 opacity-90">{t('errors.boundaryMessage')}</p>
          {this.props.retryable && (
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-3 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-200 dark:bg-red-900/60 hover:bg-red-300 dark:hover:bg-red-900 text-red-900 dark:text-red-100 transition-colors"
            >
              {t('errors.retry')}
            </button>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
