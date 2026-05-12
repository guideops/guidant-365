'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { Customer } from '@/types/domain'

export interface CreateCustomerInput {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  notes?: string | null
}

export function useCustomers() {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  const query = useQuery({
    queryKey: ['customers', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user!.id)
        .order('name')
      if (error) throw error
      return (data ?? []) as Customer[]
    },
  })

  const createCustomer = useMutation({
    mutationFn: async (input: CreateCustomerInput) => {
      const { data, error } = await supabase
        .from('customers')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as Customer
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...update }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(update)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()
      if (error) throw error
      return data as Customer
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customer', data.id] })
    },
  })

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const bulkCreateCustomers = useMutation({
    mutationFn: async (inputs: CreateCustomerInput[]) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(inputs.map(c => ({ ...c, user_id: user!.id })))
        .select()
      if (error) throw error
      return data as Customer[]
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  return {
    customers: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    bulkCreateCustomers,
  }
}
