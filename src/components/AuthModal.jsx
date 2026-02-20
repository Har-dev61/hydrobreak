import React, { useState, useEffect } from 'react'
import { X, Mail, Lock, LogIn, UserPlus, ShieldCheck, KeyRound } from 'lucide-react'
import { t } from '../i18n'
import { auth as authApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

/**
 * Modal für Anmelden / Registrieren (E-Mail + Passwort) + E-Mail-Verifizierung + Passwort vergessen.
 */
export default function AuthModal({ open, onClose, onSuccess, onVerify, initialMode = 'login' }) {
  const { resetPassword: doResetPassword } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [step, setStep] = useState('form') // 'form' | 'verify' | 'forgot' | 'reset'
  const [pendingEmail, setPendingEmail] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setStep('form')
      setPendingEmail('')
      setCode('')
      setNewPassword('')
      setError('')
      setResendMessage('')
    }
  }, [open, initialMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await onSuccess(mode, email.trim(), password)
      if (result?.needVerification && result?.email) {
        setPendingEmail(result.email)
        setStep('verify')
      } else {
        onClose()
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      if (err?.data?.needVerification && err?.data?.email) {
        setPendingEmail(err.data.email)
        setStep('verify')
        setError('')
      } else {
        setError(err?.message || t('auth.loginError'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    if (!onVerify || !pendingEmail || !code.trim()) return
    setError('')
    setLoading(true)
    try {
      await onVerify(pendingEmail, code.trim())
      onClose()
      setStep('form')
      setPendingEmail('')
      setCode('')
    } catch (err) {
      setError(err?.message || t('auth.verifyError'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!pendingEmail) return
    setResendMessage('')
    setError('')
    try {
      await authApi.resendCode(pendingEmail)
      setResendMessage(t('auth.verifyResendSent'))
    } catch (err) {
      setError(err?.message || t('auth.verifyError'))
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    const em = email.trim()
    if (!em) return
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(em)
      setPendingEmail(em)
      setStep('reset')
      setResendMessage('')
    } catch (err) {
      setError(err?.message || t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (!pendingEmail || !code.trim() || !newPassword) return
    setError('')
    setLoading(true)
    try {
      await doResetPassword(pendingEmail, code.trim(), newPassword)
      onClose()
      setStep('form')
      setPendingEmail('')
      setCode('')
      setNewPassword('')
    } catch (err) {
      setError(err?.message || t('auth.resetError'))
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100 dark:border-zinc-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 'verify'
              ? t('auth.verifyTitle')
              : step === 'forgot'
                ? t('auth.forgotTitle')
                : step === 'reset'
                  ? t('auth.resetTitle')
                  : mode === 'login'
                    ? t('auth.login')
                    : t('auth.register')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-500"
            aria-label={t('app.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'forgot' ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium flex items-center justify-center gap-2"
            >
              <KeyRound className="w-5 h-5" />
              {t('auth.forgotSubmit')}
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={() => { setStep('form'); setError(''); }}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                ← {t('auth.login')}
              </button>
            </p>
          </form>
        ) : step === 'reset' ? (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('auth.forgotSent', { email: pendingEmail })}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.verifyCodeLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('auth.verifyCodePlaceholder')}
                maxLength={6}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white text-center text-lg tracking-widest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.newPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.newPasswordPlaceholder')}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6 || newPassword.length < 6}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {t('auth.resetSubmit')}
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={() => { setStep('forgot'); setError(''); setCode(''); setNewPassword(''); }}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                ← {t('auth.forgotTitle')}
              </button>
            </p>
          </form>
        ) : step === 'verify' ? (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            {resendMessage && (
              <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                {resendMessage}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('auth.verifySent', { email: pendingEmail })}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.verifyCodeLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('auth.verifyCodePlaceholder')}
                maxLength={6}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white text-center text-lg tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {t('auth.verifySubmit')}
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                {t('auth.verifyResend')}
              </button>
            </p>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={() => { setStep('form'); setError(''); setCode(''); setResendMessage(''); }}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                ← {mode === 'login' ? t('auth.login') : t('auth.register')}
              </button>
            </p>
          </form>
        ) : (
          <>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === 'login'
                    ? t('auth.passwordPlaceholderLogin')
                    : t('auth.passwordPlaceholderRegister')
                }
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium flex items-center justify-center gap-2"
          >
            {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {mode === 'login' ? t('auth.submitLogin') : t('auth.submitRegister')}
          </button>
          {mode === 'login' && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={() => { setStep('forgot'); setError(''); }}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                {t('auth.forgotPassword')}
              </button>
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {mode === 'login' ? (
            <>
              {t('auth.noAccount')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setError('')
                }}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                {t('auth.register')}
              </button>
            </>
          ) : (
            <>
              {t('auth.alreadyRegistered')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
                className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] hover:underline"
              >
                {t('auth.login')}
              </button>
            </>
          )}
        </p>
          </>
        )}
      </div>
    </div>
  )
}
