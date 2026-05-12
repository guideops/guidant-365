'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useSession } from '@/hooks/useSession'
import { useToast } from '@/providers/ToastProvider'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface ProfileData {
  email: string
}

export function ProfileForm() {
  const { user } = useSession()
  const { success, error: showError } = useToast()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileData>({
    defaultValues: { email: user?.email ?? '' },
  })

  async function onSubmit(data: ProfileData) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ email: data.email })
    if (error) { showError('Failed to update', error.message); return }
    success('Profile updated. Check your email to confirm any address change.')
  }

  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email address" type="email" {...register('email')} />
          <Button type="submit" variant="primary" size="md" loading={isSubmitting}>Save changes</Button>
        </form>
      </div>
    </Card>
  )
}
