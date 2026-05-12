import type { Metadata } from 'next'
import { ApprovalQueue } from '@/components/approvals/ApprovalQueue'

export const metadata: Metadata = { title: 'Approvals — Guidant 365' }

export default function ApprovalsPage() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Approvals</h1>
        <p className="text-slate-500 text-sm mt-0.5">Review AI-extracted documents and email drafts before applying</p>
      </div>
      <ApprovalQueue />
    </div>
  )
}
