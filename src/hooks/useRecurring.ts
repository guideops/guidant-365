'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { RecurringItem, RecurrenceInterval } from '@/types/domain'

export interface CreateRecurringInput {
  title: string
  amount?: number | null
  recurrence: RecurrenceInterval
  next_date: string
}

export function useRecurring() {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  const query = useQuery({
    queryKey: ['recurring', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring')
        .select('*')
        .eq('user_id', user!.id)
        .order('next_date')
      if (error) throw error
      return (data ?? []) as RecurringItem[]
    },
  })

  const createRecurring = useMutation({
    mutationFn: async (input: CreateRecurringInput) => {
      const { data, error } = await supabase
        .from('recurring')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as RecurringItem
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring'] }),
  })

  const updateRecurring = useMutation({
    mutationFn: async ({ id, ...update }: Partial<RecurringItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('recurring')
        .update(update)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()
      if (error) throw error
      return data as RecurringItem
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring'] }),
  })

  const deleteRecurring = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('recurring').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring'] }),
  })

  return {
    items: query.data ?? [],
    loading: query.isLoading,
    createRecurring,
    updateRecurring,
    deleteRecurring,
  }
}
