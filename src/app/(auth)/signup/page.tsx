'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/providers/ToastProvider'

interface SignupForm {
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>()
  const password = watch('password')

  async function onSubmit(data: SignupForm) {
    setLoading(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      showError('Sign up failed', error.message)
    } else {
      success('Account created!', 'Check your email to confirm your account, then sign in.')
      router.push('/login')
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Create your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: v => v === password || 'Passwords do not match',
          })}
        />
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  )
}
