'use client'

import { useMemo } from 'react'
import type { CalendarEvent } from '@/types/domain'
import { JOB_STATUS_CONFIG } from '@/types/domain'
import { useJobs } from './useJobs'
import { useRecurring } from './useRecurring'

const RECURRING_COLOR = '#7C3AED'

export function useCalendarEvents() {
  const { jobs } = useJobs()
  const { items: recurring } = useRecurring()

  const events = useMemo<CalendarEvent[]>(() => {
    const result: CalendarEvent[] = []

    // Job events
    for (const job of jobs) {
      if (job.status === 'archived') continue

      const color = JOB_STATUS_CONFIG[job.status].calendarColor

      if (job.start_date) {
        result.push({
          id: `job-${job.id}`,
          title: job.title,
          start: job.start_date,
          end: job.end_date ?? undefined,
          backgroundColor: color,
          extendedProps: { type: 'job', entityId: job.id, status: job.status, priority: job.priority },
        })
      } else if (job.next_due) {
        result.push({
          id: `job-due-${job.id}`,
          title: `📋 ${job.title}`,
          start: job.next_due,
          backgroundColor: color,
          extendedProps: { type: 'job', entityId: job.id, status: job.status, priority: job.priority },
        })
      }
    }

    // Recurring items
    for (const item of recurring) {
      result.push({
        id: `recurring-${item.id}`,
        title: `🔄 ${item.title}`,
        start: item.next_date,
        backgroundColor: RECURRING_COLOR,
        extendedProps: { type: 'recurring', entityId: item.id },
      })
    }

    return result
  }, [jobs, recurring])

  return { events }
}
