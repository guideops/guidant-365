'use client'

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { JobKanbanColumn } from './JobKanbanColumn'
import { JOB_STATUSES } from '@/types/domain'
import type { JobWithCustomer, JobStatus } from '@/types/domain'
import { useJobs } from '@/hooks/useJobs'
import { useToast } from '@/providers/ToastProvider'

interface JobKanbanProps {
  jobs: JobWithCustomer[]
}

export function JobKanban({ jobs }: JobKanbanProps) {
  const { updateJob } = useJobs()
  const { error: showError } = useToast()

  const jobsByStatus = JOB_STATUSES.reduce(
    (acc, status) => {
      acc[status] = jobs.filter(j => j.status === status)
      return acc
    },
    {} as Record<JobStatus, JobWithCustomer[]>
  )

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const jobId = result.draggableId
    const newStatus = result.destination.droppableId as JobStatus
    const job = jobs.find(j => j.id === jobId)
    if (!job || job.status === newStatus) return

    try {
      await updateJob.mutateAsync({ id: jobId, status: newStatus })
    } catch {
      showError('Failed to update status')
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {JOB_STATUSES.map(status => (
          <JobKanbanColumn key={status} status={status} jobs={jobsByStatus[status]} />
        ))}
      </div>
    </DragDropContext>
  )
}
