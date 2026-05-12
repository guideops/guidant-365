'use client'

import { useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Spinner } from '@/components/ui/Spinner'
import { JobStatusBadge } from '@/components/jobs/JobStatusBadge'
import { JobPriorityBadge } from '@/components/jobs/JobPriorityBadge'
import { StatusSelector } from '@/components/jobs/StatusSelector'
import { JobTimeline } from '@/components/jobs/JobTimeline'
import { JobFiles } from '@/components/jobs/JobFiles'
import { JobInvoices } from '@/components/jobs/JobInvoices'
import { JobTags } from '@/components/jobs/JobTags'
import { JobForm } from '@/components/jobs/JobForm'
import { useJob } from '@/hooks/useJob'
import { useJobs } from '@/hooks/useJobs'
import { formatDate } from '@/lib/utils'
import type { JobStatus } from '@/types/domain'

interface Params { id: string }

export default function JobDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params)
  const { job, loading: isLoading, addTimelineEntry } = useJob(id)
  const { updateJob } = useJobs()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Job not found.</p>
        <Link href="/jobs" className="text-brand text-sm mt-2 inline-block">← Back to jobs</Link>
      </div>
    )
  }

  async function handleStatusChange(status: JobStatus) {
    await updateJob.mutateAsync({ id, status })
  }

  async function handleAddNote(content: string) {
    await addTimelineEntry.mutateAsync({ content, type: 'note' })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Link href="/jobs" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Jobs
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h1>
            <JobPriorityBadge priority={job.priority} />
          </div>
          {job.customer && (
            <Link href={`/customers/${job.customer_id}`} className="text-sm text-brand hover:underline mt-1 inline-block">
              {job.customer.name}
            </Link>
          )}
        </div>
        <Button variant="secondary" size="md" icon={<Edit2 className="w-4 h-4" />} onClick={() => setEditOpen(true)}>
          Edit
        </Button>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <JobStatusBadge status={job.status} />
        <StatusSelector value={job.status} onChange={handleStatusChange} />
      </div>

      {/* Quick info */}
      {(job.next_action || job.next_due || job.start_date || job.end_date) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {job.next_action && (
            <div>
              <p className="text-xs text-slate-500">Next action</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{job.next_action}</p>
            </div>
          )}
          {job.next_due && (
            <div>
              <p className="text-xs text-slate-500">Due</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(job.next_due)}</p>
            </div>
          )}
          {job.start_date && (
            <div>
              <p className="text-xs text-slate-500">Start</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(job.start_date)}</p>
            </div>
          )}
          {job.end_date && (
            <div>
              <p className="text-xs text-slate-500">End</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(job.end_date)}</p>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <JobTags jobId={id} tags={job.tags ?? []} />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'timeline', label: 'Timeline', content: <JobTimeline entries={job.timeline ?? []} onAddNote={handleAddNote} /> },
          { id: 'files', label: 'Files', count: job.files?.length, content: <JobFiles jobId={id} files={job.files ?? []} /> },
          { id: 'invoices', label: 'Invoices', count: job.invoices?.length, content: <JobInvoices jobId={id} invoices={job.invoices ?? []} /> },
        ]}
      />

      <JobForm open={editOpen} onClose={() => setEditOpen(false)} job={job} />
    </div>
  )
}
