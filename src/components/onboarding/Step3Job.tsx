'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useJobs } from '@/hooks/useJobs'
import { useToast } from '@/providers/ToastProvider'

interface Step3JobProps {
  onNext: () => void
  onSkip: () => void
}

interface JobQuickInput {
  title: string
  next_action: string
}

export function Step3Job({ onNext, onSkip }: Step3JobProps) {
  const { createJob } = useJobs()
  const { error: showError } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobQuickInput>({
    defaultValues: { title: '', next_action: '' },
  })

  async function onSubmit(data: JobQuickInput) {
    try {
      await createJob.mutateAsync({
        title: data.title,
        status: 'inquiry',
        priority: 'medium',
        next_action: data.next_action || null,
        customer_id: null,
        next_due: null,
        start_date: null,
        end_date: null,
        notes: null,
      })
      onNext()
    } catch (e) {
      showError('Failed to create job', String(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your first job</h2>
        <p className="text-slate-500">Track a project or enquiry you&apos;re working on</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Job title *"
          placeholder="Kitchen renovation, Roof repair…"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Input
          label="Next action"
          placeholder="Send quote, Call back…"
          {...register('next_action')}
        />

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
            Create job & go to dashboard
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={onSkip} className="w-full">
            Skip — go to dashboard
          </Button>
        </div>
      </form>
    </div>
  )
}
