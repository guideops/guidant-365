'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCustomers, type CreateCustomerInput } from '@/hooks/useCustomers'
import { useToast } from '@/providers/ToastProvider'

interface Step2CustomerProps {
  onNext: () => void
  onSkip: () => void
}

export function Step2Customer({ onNext, onSkip }: Step2CustomerProps) {
  const { createCustomer } = useCustomers()
  const { error: showError } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCustomerInput>({
    defaultValues: { name: '', email: '', phone: '' },
  })

  async function onSubmit(data: CreateCustomerInput) {
    try {
      await createCustomer.mutateAsync({ name: data.name, email: data.email || null, phone: data.phone || null, address: null, notes: null })
      onNext()
    } catch (e) {
      showError('Failed to add customer', String(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add your first customer</h2>
        <p className="text-slate-500">You can add more later — skip if you prefer</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Customer name *"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input label="Email" type="email" placeholder="jane@example.com" {...register('email')} />
        <Input label="Phone" type="tel" placeholder="+44 7700 000000" {...register('phone')} />

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
            Add customer & continue
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={onSkip} className="w-full">
            Skip for now
          </Button>
        </div>
      </form>
    </div>
  )
}
