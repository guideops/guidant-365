'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { JobDetail, TimelineType } from '@/types/domain'

export function useJob(jobId: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    enabled: !!user && !!jobId,
    queryFn: async () => {
      const [jobRes, filesRes, invoicesRes, timelineRes, tagsRes] = await Promise.all([
        supabase
          .from('jobs')
          .select(`*, customer:customers(*)`)
          .eq('id', jobId)
          .single(),
        supabase
          .from('job_files')
          .select('*')
          .eq('job_id', jobId)
          .order('created_at', { ascending: false }),
        supabase
          .from('invoices')
          .select('*')
          .eq('job_id', jobId)
          .order('created_at', { ascending: false }),
        supabase
          .from('job_timeline')
          .select('*')
          .eq('job_id', jobId)
          .order('created_at', { ascending: false }),
        supabase
          .from('job_tags')
          .select('tag:tags(*)')
          .eq('job_id', jobId),
      ])

      if (jobRes.error) throw jobRes.error

      return {
        ...jobRes.data,
        customer: jobRes.data.customer ?? null,
        tags: (tagsRes.data ?? []).map(t => t.tag).filter(Boolean),
        files: filesRes.data ?? [],
        invoices: invoicesRes.data ?? [],
        timeline: timelineRes.data ?? [],
      } as JobDetail
    },
  })

  // Realtime subscription
  useEffect(() => {
    if (!user || !jobId) return
    const channel = supabase
      .channel(`job-${jobId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs', filter: `id=eq.${jobId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_timeline', filter: `job_id=eq.${jobId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, jobId, supabase, queryClient])

  const addTimelineEntry = useMutation({
    mutationFn: async ({ content, type }: { content: string; type: TimelineType }) => {
      const { error } = await supabase
        .from('job_timeline')
        .insert({ job_id: jobId, content, type })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job', jobId] }),
  })

  return {
    job: jobQuery.data ?? null,
    loading: jobQuery.isLoading,
    error: jobQuery.error,
    addTimelineEntry,
  }
}
