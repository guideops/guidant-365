'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useRecurring, type CreateRecurringInput } from '@/hooks/useRecurring'
import { useToast } from '@/providers/ToastProvider'
import type { RecurringItem } from '@/types/domain'
import { formatDateInput } from '@/lib/utils'

interface RecurringFormProps {
  open: boolean
  onClose: () => void
  item?: RecurringItem
}

export function RecurringForm({ open, onClose, item }: RecurringFormProps) {
  const { createRecurring, updateRecurring } = useRecurring()
  const { success, error: showError } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateRecurringInput>({
    defaultValues: { title: '', amount: undefined, recurrence: 'monthly', next_date: '' },
  })

  useEffect(() => {
    if (open) {
      reset(item ? {
        title: item.title,
        amount: item.amount ?? undefined,
        recurrence: item.recurrence,
        next_date: formatDateInput(item.next_date),
      } : { title: '', amount: undefined, recurrence: 'monthly', next_date: '' })
    }
  }, [open, item, reset])

  async function onSubmit(data: CreateRecurringInput) {
    try {
      if (item) {
        await updateRecurring.mutateAsync({ id: item.id, ...data })
        success('Recurring item updated')
      } else {
        await createRecurring.mutateAsync(data)
        success('Recurring item added')
      }
      onClose()
    } catch (e) {
      showError(item ? 'Failed to update' : 'Failed to add', String(e))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit Recurring Item' : 'New Recurring Item'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title *"
          placeholder="Monthly rent, Insurance, etc."
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Input
          label="Amount (£)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
        />
        <Select
          label="Frequency"
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
          {...register('recurrence')}
        />
        <Input
          label="Next due date *"
          type="date"
          error={errors.next_date?.message}
          {...register('next_date', { required: 'Next date is required' })}
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
            {item ? 'Save changes' : 'Add item'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
