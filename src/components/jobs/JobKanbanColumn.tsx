'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import { JobKanbanCard } from './JobKanbanCard'
import { JOB_STATUS_CONFIG } from '@/types/domain'
import type { JobWithCustomer, JobStatus } from '@/types/domain'
import { cn } from '@/lib/utils'

interface JobKanbanColumnProps {
  status: JobStatus
  jobs: JobWithCustomer[]
}

export function JobKanbanColumn({ status, jobs }: JobKanbanColumnProps) {
  const cfg = JOB_STATUS_CONFIG[status]
  return (
    <div className="flex flex-col min-w-64 w-64">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cfg.label}</h3>
        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex flex-col gap-2 min-h-24 rounded-xl p-2 transition-colors',
              snapshot.isDraggingOver
                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700'
                : 'bg-slate-50 dark:bg-slate-900/30'
            )}
          >
            {jobs.map((job, index) => (
              <Draggable key={job.id} draggableId={job.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(snapshot.isDragging && 'opacity-80 rotate-1 scale-[1.02]')}
                  >
                    <JobKanbanCard job={job} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
