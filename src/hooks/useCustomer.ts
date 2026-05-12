'use client'

import { useQuery } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { Customer, JobWithCustomer } from '@/types/domain'

export function useCustomer(customerId: string) {
  const { user } = useSession()
  const supabase = getSupabaseBrowserClient()

  const customerQuery = useQuery({
    queryKey: ['customer', customerId],
    enabled: !!user && !!customerId,
    queryFn: async () => {
      const [custRes, jobsRes] = await Promise.all([
        supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .eq('user_id', user!.id)
          .single(),
        supabase
          .from('jobs')
          .select('*, customer:customers(id, name)')
          .eq('customer_id', customerId)
          .eq('user_id', user!.id)
          .order('updated_at', { ascending: false }),
      ])
      if (custRes.error) throw custRes.error
      return {
        customer: custRes.data as Customer,
        jobs: (jobsRes.data ?? []) as JobWithCustomer[],
      }
    },
  })

  return {
    customer: customerQuery.data?.customer ?? null,
    jobs: customerQuery.data?.jobs ?? [],
    loading: customerQuery.isLoading,
    error: customerQuery.error,
  }
}
