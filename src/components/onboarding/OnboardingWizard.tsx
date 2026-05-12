'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Step1Profile } from './Step1Profile'
import { Step2Customer } from './Step2Customer'
import { Step3Job } from './Step3Job'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'

const STEPS = ['Profile', 'First customer', 'First job']

export function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { user } = useSession()

  async function completeOnboarding() {
    const supabase = getSupabaseBrowserClient()
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user?.id ?? '')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-xs font-medium ${i <= step ? 'text-brand' : 'text-slate-400'}`}>{s}</span>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          {step === 0 && <Step1Profile onNext={() => setStep(1)} />}
          {step === 1 && <Step2Customer onNext={() => setStep(2)} onSkip={() => setStep(2)} />}
          {step === 2 && <Step3Job onNext={completeOnboarding} onSkip={completeOnboarding} />}
        </div>
      </div>
    </div>
  )
}
