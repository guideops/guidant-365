'use client'

import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useToast } from '@/providers/ToastProvider'
import { useQueryClient } from '@tanstack/react-query'
import type { InvoiceStatus } from '@/types/domain'

interface InvoiceFormValues {
  amount: string
  paid_amount: string
  due_date: string
  status: InvoiceStatus
}

interface InvoiceFormProps {
  open: boolean
  onClose: () => void
  jobId: string
}

export function InvoiceForm({ open, onClose, jobId }: InvoiceFormProps) {
  const { success, error: showError } = useToast()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<InvoiceFormValues>({
    defaultValues: { amount: '', paid_amount: '0', due_date: '', status: 'sent' },
  })

  async function onSubmit(data: InvoiceFormValues) {
    try {
      const { error } = await supabase.from('invoices').insert({
        job_id: jobId,
        amount: parseFloat(data.amount),
        paid_amount: parseFloat(data.paid_amount || '0'),
        due_date: data.due_date || null,
        status: data.status,
      })
      if (error) throw error
      success('Invoice added')
      reset()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
    } catch (e) {
      showError('Failed to add invoice', String(e))
    }
  }

  const statusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Add Invoice">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Invoice amount (£) *"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { required: 'Amount is required' })}
        />
        <Input
          label="Amount paid (£)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('paid_amount')}
        />
        <Input label="Due date" type="date" {...register('due_date')} />
        <Select label="Status" options={statusOptions} {...register('status')} />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>Add invoice</Button>
        </div>
      </form>
    </Modal>
  )
}
