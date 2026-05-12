'use client'



import { useRouter } from 'next/navigation'
import { CalendarView } from '@/components/calendar/CalendarView'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import type { CalendarEvent } from '@/types/domain'

export default function CalendarPage() {
  const { events } = useCalendarEvents()
  const router = useRouter()

  function handleEventClick(event: CalendarEvent) {
    if (event.extendedProps.type === 'job') {
      router.push(`/jobs/${event.extendedProps.entityId}`)
    } else if (event.extendedProps.type === 'recurring') {
      router.push('/recurring')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Calendar</h1>
      <CalendarView events={events} onEventClick={handleEventClick} />
    </div>
  )
}
