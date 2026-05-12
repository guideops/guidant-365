'use client'

import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { JobStatusBadge } from '@/components/jobs/JobStatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import type { Job } from '@/types/domain'

interface CustomerJobHistoryProps {
  jobs: Job[]
}

export function CustomerJobHistory({ jobs }: CustomerJobHistoryProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="w-6 h-6" />}
        title="No jobs yet"
        description="Jobs created for this customer will appear here."
      />
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {jobs.map(job => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="flex items-center gap-3 py-3 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors -mx-1 px-2"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{job.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(job.created_at)}</p>
          </div>
          <JobStatusBadge status={job.status} />
        </Link>
      ))}
    </div>
  )
}
