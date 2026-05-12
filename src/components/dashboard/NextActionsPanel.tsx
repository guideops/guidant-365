'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertCircle, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useJobs } from '@/hooks/useJobs'
import { JOB_STATUS_CONFIG, JOB_PRIORITY_CONFIG } from '@/types/domain'
import { formatRelativeDate, isOverdue, isDueSoon } from '@/lib/utils'

export function NextActionsPanel() {
  const { jobs } = useJobs()

  const nextActions = useMemo(() => {
    return jobs
      .filter(j => j.next_action && !['archived', 'rejected'].includes(j.status))
      .sort((a, b) => {
        if (!a.next_due) return 1
        if (!b.next_due) return -1
        return new Date(a.next_due).getTime() - new Date(b.next_due).getTime()
      })
      .slice(0, 10)
  }, [jobs])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Actions</CardTitle>
      </CardHeader>
      <CardBody className="pt-0">
        {nextActions.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-6 h-6" />}
            title="No upcoming actions"
            description="Add a next action to a job to see it here."
            className="py-8"
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {nextActions.map(job => {
              const overdue = job.next_due && isOverdue(job.next_due)
              const soon = job.next_due && isDueSoon(job.next_due)
              return (
                <li key={job.id}>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-start gap-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl px-2 -mx-2 transition-colors group"
                  >
                    {overdue ? (
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: JOB_PRIORITY_CONFIG[job.priority].color }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{job.next_action}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.title}</span>
                        <Badge
                          style={{ color: JOB_STATUS_CONFIG[job.status].color, backgroundColor: JOB_STATUS_CONFIG[job.status].bgColor }}
                        >
                          {JOB_STATUS_CONFIG[job.status].label}
                        </Badge>
                      </div>
                    </div>
                    {job.next_due && (
                      <span className={`text-xs shrink-0 font-medium ${overdue ? 'text-red-600 dark:text-red-400' : soon ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                        {formatRelativeDate(job.next_due)}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 shrink-0 mt-0.5 transition-colors" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
