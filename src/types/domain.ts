import type { Database } from './database'

type Tables = Database['public']['Tables']

export type Profile = Tables['profiles']['Row']
export type Customer = Tables['customers']['Row']
export type Job = Tables['jobs']['Row']
export type JobFile = Tables['job_files']['Row']
export type Invoice = Tables['invoices']['Row']
export type TimelineEntry = Tables['job_timeline']['Row']
export type RecurringItem = Tables['recurring']['Row']
export type Tag = Tables['tags']['Row']
export type AuditLog = Tables['audit_log']['Row']
export type ApprovalItem = Tables['approval_queue']['Row']

export type JobStatus = Database['public']['Enums']['job_status']
export type JobPriority = Database['public']['Enums']['job_priority']
export type TimelineType = Database['public']['Enums']['timeline_type']
export type RecurrenceInterval = Database['public']['Enums']['recurrence_interval']
export type ApprovalType = Database['public']['Enums']['approval_type']
export type ApprovalStatus = Database['public']['Enums']['approval_status']
export type FileStatus = Database['public']['Enums']['file_status']
export type InvoiceStatus = Database['public']['Enums']['invoice_status']

export type JobWithCustomer = Job & {
  customer: Customer | null
  tags: Tag[]
}

export type JobDetail = JobWithCustomer & {
  files: JobFile[]
  invoices: Invoice[]
  timeline: TimelineEntry[]
}

export interface CalendarEvent {
  id: string
  title: string
  start: string | Date
  end?: string | Date
  backgroundColor: string
  borderColor?: string
  textColor?: string
  extendedProps: {
    type: 'job' | 'recurring' | 'invoice_due'
    entityId: string
    priority?: JobPriority
    status?: JobStatus
  }
}

export const JOB_STATUSES: JobStatus[] = [
  'inquiry', 'quote_tosend', 'quote_sent', 'agreed', 'rejected',
  'negotiation', 'planned_start', 'in_progress', 'awaiting_payment', 'archived',
]

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bgColor: string; calendarColor: string }> = {
  inquiry: { label: 'Inquiry', color: '#6B7280', bgColor: '#F3F4F6', calendarColor: '#6B7280' },
  quote_tosend: { label: 'Quote to Send', color: '#7C3AED', bgColor: '#EDE9FE', calendarColor: '#7C3AED' },
  quote_sent: { label: 'Quote Sent', color: '#2563EB', bgColor: '#DBEAFE', calendarColor: '#2563EB' },
  agreed: { label: 'Agreed', color: '#059669', bgColor: '#D1FAE5', calendarColor: '#059669' },
  rejected: { label: 'Rejected', color: '#DC2626', bgColor: '#FEE2E2', calendarColor: '#DC2626' },
  negotiation: { label: 'Negotiation', color: '#D97706', bgColor: '#FEF3C7', calendarColor: '#D97706' },
  planned_start: { label: 'Planned Start', color: '#0891B2', bgColor: '#CFFAFE', calendarColor: '#0891B2' },
  in_progress: { label: 'In Progress', color: '#1E40AF', bgColor: '#DBEAFE', calendarColor: '#1E40AF' },
  awaiting_payment: { label: 'Awaiting Payment', color: '#B45309', bgColor: '#FEF3C7', calendarColor: '#F59E0B' },
  archived: { label: 'Archived', color: '#9CA3AF', bgColor: '#F9FAFB', calendarColor: '#9CA3AF' },
}

export const JOB_PRIORITY_CONFIG: Record<JobPriority, { label: string; color: string; bgColor: string }> = {
  high: { label: 'High', color: '#DC2626', bgColor: '#FEE2E2' },
  medium: { label: 'Medium', color: '#D97706', bgColor: '#FEF3C7' },
  low: { label: 'Low', color: '#6B7280', bgColor: '#F3F4F6' },
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bgColor: string }> = {
  sent: { label: 'Sent', color: '#2563EB', bgColor: '#DBEAFE' },
  paid: { label: 'Paid', color: '#059669', bgColor: '#D1FAE5' },
  overdue: { label: 'Overdue', color: '#DC2626', bgColor: '#FEE2E2' },
}

export interface GmailThread {
  id: string
  subject: string
  snippet: string
  from: string
  date: string
}

export interface EmailDraft {
  formal: string
  friendly: string
  brief: string
}
