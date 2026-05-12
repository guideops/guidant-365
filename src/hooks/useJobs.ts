'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { Job, JobWithCustomer, JobStatus, JobPriority } from '@/types/domain'

export interface CreateJobInput {
  title: string
  customer_id?: string | null
  status?: JobStatus
  priority?: JobPriority
  next_action?: string | null
  next_due?: string | null
  start_date?: string | null
  end_date?: string | null
  notes?: string | null
}

export function useJobs() {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  const jobsQuery = useQuery({
    queryKey: ['jobs', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, customer:customers(id, name, email, phone)`)
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return (data ?? []) as JobWithCustomer[]
    },
  })

  const createJob = useMutation({
    mutationFn: async (input: CreateJobInput) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...input, user_id: user!.id })
        .select(`*, customer:customers(id, name, email, phone)`)
        .single()
      if (error) throw error
      return data as JobWithCustomer
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const updateJob = useMutation({
    mutationFn: async ({ id, ...update }: Partial<Job> & { id: string }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(update)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select(`*, customer:customers(id, name, email, phone)`)
        .single()
      if (error) throw error
      return data as JobWithCustomer
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', data.id] })
    },
  })

  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  return {
    jobs: jobsQuery.data ?? [],
    loading: jobsQuery.isLoading,
    error: jobsQuery.error,
    createJob,
    updateJob,
    deleteJob,
    refetch: jobsQuery.refetch,
  }
}
