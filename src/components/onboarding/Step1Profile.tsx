'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'
import { useToast } from '@/providers/ToastProvider'

interface Step1Data {
  display_name: string
  business_name: string
}

interface Step1ProfileProps {
  onNext: () => void
}

export function Step1Profile({ onNext }: Step1ProfileProps) {
  const { user } = useSession()
  const { error: showError } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Step1Data>({
    defaultValues: { display_name: '', business_name: '' },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(_data: Step1Data) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from('profiles')
      .update({ email: user?.email ?? '' })
      .eq('id', user?.id ?? '')
    if (error) { showError('Failed to save profile', error.message); return }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tell us about yourself</h2>
        <p className="text-slate-500">Help us personalise your experience</p>
      </div>

      <Input
        label="Your name *"
        placeholder="John Smith"
        error={errors.display_name?.message}
        {...register('display_name', { required: 'Name is required' })}
      />
      <Input
        label="Business name"
        placeholder="Smith Plumbing Ltd (optional)"
        {...register('business_name')}
      />

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
        Continue
      </Button>
    </form>
  )
}
