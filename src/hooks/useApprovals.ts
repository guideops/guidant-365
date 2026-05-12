'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { ApprovalItem } from '@/types/domain'

export function useApprovals() {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  const query = useQuery({
    queryKey: ['approvals', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_queue')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as ApprovalItem[]
    },
  })

  const pendingCount = query.data?.filter(a => a.status === 'pending').length ?? 0

  const approveItem = useMutation({
    mutationFn: async ({ id, editedData }: { id: string; editedData?: Record<string, unknown> }) => {
      const update: { status: string; suggested_update?: unknown } = {
        status: editedData ? 'edited' : 'approved',
        ...(editedData ? { suggested_update: editedData } : {}),
      }
      const { error } = await supabase
        .from('approval_queue')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(update as any)
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['approvals'] }),
  })

  const rejectItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('approval_queue')
        .update({ status: 'rejected' })
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['approvals'] }),
  })

  return {
    approvals: query.data ?? [],
    pending: query.data?.filter(a => a.status === 'pending') ?? [],
    pendingCount,
    loading: query.isLoading,
    approveItem,
    rejectItem,
  }
}
