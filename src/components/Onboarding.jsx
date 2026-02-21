import React, { useState } from 'react'
import { Droplets, Bell, CheckCircle2, ChevronRight, Smartphone } from 'lucide-react'
import { WATER_GOAL_OPTIONS } from '../constants'
import { requestNotificationPermission } from '../utils/notifications'
import { t } from '../i18n'

const TOTAL_STEPS = 4

/**
 * 4-Schritte-Onboarding: Wasserziel → Benachrichtigungen → Zusammenfassung → App zum Startbildschirm.
 */
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [waterGoalMl, setWaterGoalMl] = useState(2000)
  const [notificationsAllowed, setNotificationsAllowed] = useState(false)

  const handleFinish = () => {
    onComplete({ waterGoalMl, notificationsAllowed })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center gap-2" aria-label={`Schritt ${step} von ${TOTAL_STEPS}`}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'w-8 bg-sky-500' : 'w-1.5 bg-gray-200 dark:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                <Droplets className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
              {t('onboarding.step1Title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-1">
              {t('onboarding.step1Question')}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-center text-xs mb-6">
              {t('onboarding.step1Hint')}
            </p>
            <div className="flex flex-col gap-3">
              {WATER_GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.ml}
                  type="button"
                  onClick={() => setWaterGoalMl(opt.ml)}
                  className={`w-full py-3 px-4 rounded-xl text-left font-medium transition-all ${
                    waterGoalMl === opt.ml
                      ? 'bg-sky-600 text-white ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-zinc-900'
                      : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-600'
                  }`}
                >
                  {t('waterGoalOptions.' + opt.ml)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-8 w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium flex items-center justify-center gap-2"
            >
              {t('onboarding.continue')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Bell className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
              {t('onboarding.step2Title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-2">
              {t('onboarding.step2Description')}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-center text-xs mb-6">
              {t('onboarding.step2Benefits')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={async () => {
                  const granted = await requestNotificationPermission()
                  setNotificationsAllowed(granted)
                  setStep(3)
                }}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium"
              >
                {t('onboarding.allow')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotificationsAllowed(false)
                  setStep(3)
                }}
                className="w-full py-3 px-4 rounded-xl bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium"
              >
                {t('onboarding.later')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
              {t('onboarding.step3Title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
              {t('onboarding.step3Goal', { liters: (waterGoalMl / 1000).toFixed(1) })}
              {notificationsAllowed
                ? t('onboarding.step3WithNotifications')
                : t('onboarding.step3WithoutNotifications')}
            </p>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium flex items-center justify-center gap-2"
            >
              {t('onboarding.continue')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
              {t('onboarding.step4Title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
              {t('onboarding.step4Description')}
            </p>
            <div className="text-left text-xs text-gray-500 dark:text-gray-400 space-y-2 mb-6 bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-600">
              <p><strong className="text-gray-700 dark:text-gray-300">iOS:</strong> {t('onboarding.step4Ios')}</p>
              <p><strong className="text-gray-700 dark:text-gray-300">Android:</strong> {t('onboarding.step4Android')}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium"
              >
                {t('onboarding.start')}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
              >
                {t('onboarding.step4Skip')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
