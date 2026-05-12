'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { StatusSelector } from './StatusSelector'
import { useJobs, type CreateJobInput } from '@/hooks/useJobs'
import { useCustomers } from '@/hooks/useCustomers'
import { useToast } from '@/providers/ToastProvider'
import type { JobWithCustomer, JobStatus, JobPriority } from '@/types/domain'

interface JobFormValues {
  title: string
  customer_id: string
  status: JobStatus
  priority: JobPriority
  next_action: string
  next_due: string
  start_date: string
  end_date: string
  notes: string
}

interface JobFormProps {
  open: boolean
  onClose: () => void
  job?: JobWithCustomer
  prefilledCustomerId?: string
}

export function JobForm({ open, onClose, job, prefilledCustomerId }: JobFormProps) {
  const { createJob, updateJob } = useJobs()
  const { customers } = useCustomers()
  const { success, error: showError } = useToast()

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<JobFormValues>({
    defaultValues: {
      title: '',
      customer_id: prefilledCustomerId ?? '',
      status: 'inquiry',
      priority: 'medium',
      next_action: '',
      next_due: '',
      start_date: '',
      end_date: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset(job ? {
        title: job.title,
        customer_id: job.customer_id ?? '',
        status: job.status,
        priority: job.priority,
        next_action: job.next_action ?? '',
        next_due: job.next_due ?? '',
        start_date: job.start_date ?? '',
        end_date: job.end_date ?? '',
        notes: job.notes ?? '',
      } : {
        title: '',
        customer_id: prefilledCustomerId ?? '',
        status: 'inquiry',
        priority: 'medium',
        next_action: '',
        next_due: '',
        start_date: '',
        end_date: '',
        notes: '',
      })
    }
  }, [open, job, prefilledCustomerId, reset])

  async function onSubmit(data: JobFormValues) {
    const input: CreateJobInput = {
      title: data.title,
      customer_id: data.customer_id || null,
      status: data.status,
      priority: data.priority,
      next_action: data.next_action || null,
      next_due: data.next_due || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      notes: data.notes || null,
    }
    try {
      if (job) {
        await updateJob.mutateAsync({ id: job.id, ...input })
        success('Job updated')
      } else {
        await createJob.mutateAsync(input)
        success('Job created')
      }
      onClose()
    } catch (e) {
      showError(job ? 'Failed to update job' : 'Failed to create job', String(e))
    }
  }

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))
  const priorityOptions: { value: JobPriority; label: string }[] = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]

  return (
    <Modal open={open} onClose={onClose} title={job ? 'Edit Job' : 'New Job'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Job title *"
          placeholder="e.g. Kitchen renovation"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />

        <Select
          label="Customer"
          placeholder="Select a customer"
          options={customerOptions}
          {...register('customer_id')}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => <StatusSelector value={field.value} onChange={field.onChange} />}
          />
        </div>

        <Select
          label="Priority"
          options={priorityOptions}
          {...register('priority')}
        />

        <Input
          label="Next action"
          placeholder="e.g. Send quote, Book site visit"
          {...register('next_action')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Next due date" type="date" {...register('next_due')} />
          <Input label="Start date" type="date" {...register('start_date')} />
          <Input label="End date" type="date" {...register('end_date')} />
        </div>

        <Textarea
          label="Notes"
          placeholder="Any additional notes…"
          rows={3}
          {...register('notes')}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
            {job ? 'Save changes' : 'Create job'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
