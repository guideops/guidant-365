'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useCustomers, type CreateCustomerInput } from '@/hooks/useCustomers'
import { useToast } from '@/providers/ToastProvider'
import type { Customer } from '@/types/domain'

interface CustomerFormProps {
  open: boolean
  onClose: () => void
  customer?: Customer
}

export function CustomerForm({ open, onClose, customer }: CustomerFormProps) {
  const { createCustomer, updateCustomer } = useCustomers()
  const { success, error: showError } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCustomerInput>({
    defaultValues: { name: '', email: '', phone: '', address: '', notes: '' },
  })

  useEffect(() => {
    if (open) {
      reset(customer ? {
        name: customer.name,
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        address: customer.address ?? '',
        notes: customer.notes ?? '',
      } : { name: '', email: '', phone: '', address: '', notes: '' })
    }
  }, [open, customer, reset])

  async function onSubmit(data: CreateCustomerInput) {
    const input = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
    }
    try {
      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, ...input })
        success('Customer updated')
      } else {
        await createCustomer.mutateAsync(input)
        success('Customer added')
      }
      onClose()
    } catch (e) {
      showError(customer ? 'Failed to update' : 'Failed to add customer', String(e))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={customer ? 'Edit Customer' : 'New Customer'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name *"
          placeholder="John Smith"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input label="Email" type="email" placeholder="john@example.com" {...register('email')} />
        <Input label="Phone" type="tel" placeholder="+44 7700 000000" {...register('phone')} />
        <Input label="Address" placeholder="123 High Street, London" {...register('address')} />
        <Textarea label="Notes" placeholder="Any notes about this customer…" rows={2} {...register('notes')} />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
            {customer ? 'Save changes' : 'Add customer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
