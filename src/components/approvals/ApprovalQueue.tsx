'use client'

import { ApprovalCard } from './ApprovalCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useApprovals } from '@/hooks/useApprovals'
import { CheckCircle } from 'lucide-react'

export function ApprovalQueue() {
  const { pending, loading, approveItem, rejectItem } = useApprovals()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (pending.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle className="w-8 h-8" />}
        title="All caught up"
        description="No pending approvals. New document extractions and email drafts will appear here."
      />
    )
  }

  async function handleApprove(id: string, editedData?: Record<string, unknown>) {
    await approveItem.mutateAsync({ id, editedData })
  }

  async function handleReject(id: string) {
    await rejectItem.mutateAsync(id)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{pending.length} pending approval{pending.length !== 1 ? 's' : ''}</p>
      {pending.map(item => (
        <ApprovalCard
          key={item.id}
          item={item}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  )
}
