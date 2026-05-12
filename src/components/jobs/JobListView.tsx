'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpDown, AlertCircle } from 'lucide-react'
import { JobStatusBadge } from './JobStatusBadge'
import { JobPriorityBadge } from './JobPriorityBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { JobWithCustomer } from '@/types/domain'
import { formatRelativeDate, isOverdue, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

type SortKey = 'title' | 'status' | 'priority' | 'next_due' | 'updated_at'
type SortDir = 'asc' | 'desc'

interface JobListViewProps {
  jobs: JobWithCustomer[]
}

export function JobListView({ jobs }: JobListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('updated_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...jobs].sort((a, b) => {
    const av: string | number = a[sortKey] ?? ''
    const bv: string | number = b[sortKey] ?? ''
    const cmp = String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  if (sorted.length === 0) {
    return (
      <EmptyState title="No jobs found" description="Create your first job to get started." />
    )
  }

  const th = (key: SortKey, label: string) => (
    <th
      className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 whitespace-nowrap"
      onClick={() => toggleSort(key)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn('w-3 h-3', sortKey === key ? 'text-blue-600' : 'text-slate-300')} />
      </span>
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            {th('title', 'Job')}
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Customer</th>
            {th('status', 'Status')}
            {th('priority', 'Priority')}
            {th('next_due', 'Due')}
            {th('updated_at', 'Updated')}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map(job => {
            const overdue = job.next_due && isOverdue(job.next_due)
            return (
              <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4">
                  <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400">
                    {job.title}
                  </Link>
                  {job.next_action && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-48">→ {job.next_action}</p>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  {job.customer?.name ?? '—'}
                </td>
                <td className="py-3 px-4">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="py-3 px-4">
                  <JobPriorityBadge priority={job.priority} />
                </td>
                <td className="py-3 px-4">
                  {job.next_due ? (
                    <span className={cn('text-sm', overdue ? 'text-red-600 dark:text-red-400 flex items-center gap-1' : 'text-slate-600 dark:text-slate-400')}>
                      {overdue && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                      {formatRelativeDate(job.next_due)}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {formatDate(job.updated_at)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
