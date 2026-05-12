'use client'

import Link from 'next/link'
import { Calendar, User, AlertCircle } from 'lucide-react'
import { JOB_PRIORITY_CONFIG } from '@/types/domain'
import type { JobWithCustomer } from '@/types/domain'
import { formatRelativeDate, isOverdue } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface JobKanbanCardProps {
  job: JobWithCustomer
}

export function JobKanbanCard({ job }: JobKanbanCardProps) {
  const overdue = job.next_due && isOverdue(job.next_due)
  const priorityColor = JOB_PRIORITY_CONFIG[job.priority].color

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div
        className={cn(
          'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer relative',
          'border-l-4'
        )}
        style={{ borderLeftColor: priorityColor }}
      >
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-2 line-clamp-2">
          {job.title}
        </p>

        {job.customer && (
          <div className="flex items-center gap-1.5 mb-2">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.customer.name}</span>
          </div>
        )}

        {job.next_action && (
          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-2 py-1 mb-2 line-clamp-2">
            → {job.next_action}
          </p>
        )}

        {job.next_due && (
          <div className={cn('flex items-center gap-1.5', overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-400')}>
            {overdue && <AlertCircle className="w-3 h-3 shrink-0" />}
            {!overdue && <Calendar className="w-3 h-3 shrink-0" />}
            <span className="text-xs">{formatRelativeDate(job.next_due)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
