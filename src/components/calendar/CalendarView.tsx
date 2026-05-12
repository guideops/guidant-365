'use client'

import { useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import type { CalendarEvent } from '@/types/domain'

interface CalendarViewProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const calRef = useRef<FullCalendar>(null)

  function handleEventClick(arg: EventClickArg) {
    const event = arg.event
    onEventClick({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr || undefined,
      backgroundColor: event.backgroundColor ?? '',
      extendedProps: event.extendedProps as CalendarEvent['extendedProps'],
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events.map(e => ({
          id: e.id,
          title: e.title,
          start: e.start as string,
          end: e.end as string | undefined,
          backgroundColor: e.backgroundColor,
          borderColor: e.backgroundColor,
          extendedProps: e.extendedProps,
        }))}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={4}
        weekends={true}
        nowIndicator={true}
        eventDisplay="block"
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
      />
    </div>
  )
}
