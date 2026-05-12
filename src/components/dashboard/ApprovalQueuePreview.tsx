'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Mail, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApprovals } from '@/hooks/useApprovals'
import { formatRelativeDate } from '@/lib/utils'

export function ApprovalQueuePreview() {
  const { pending } = useApprovals()
  const preview = pending.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Approval Queue</CardTitle>
        {pending.length > 0 && (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            {pending.length} pending
          </Badge>
        )}
      </CardHeader>
      <CardBody className="pt-0">
        {preview.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-6 h-6" />}
            title="All caught up!"
            description="No AI suggestions waiting for your review."
            className="py-8"
          />
        ) : (
          <>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {preview.map(item => (
                <li key={item.id} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${item.type === 'document' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {item.type === 'document' ? <FileText className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                        {item.type === 'document' ? 'Document extraction' : 'Email draft'}
                      </p>
                      <p className="text-xs text-slate-400">{formatRelativeDate(item.created_at)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/approvals"
              className="flex items-center justify-center gap-1.5 mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
            >
              View all approvals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </CardBody>
    </Card>
  )
}
