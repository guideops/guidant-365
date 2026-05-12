import type { Job, Customer } from './domain'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface ExtractDocumentRequest {
  fileId: string
  jobId: string
}

export interface ExtractDocumentResponse {
  approvalId: string
}

export interface ExtractedDocumentData {
  amount?: number
  due_date?: string
  vendor?: string
  description?: string
  invoice_number?: string
  line_items?: Array<{ description: string; amount: number }>
}

export interface DraftEmailRequest {
  threadId: string
  jobId?: string
}

export interface DraftEmailResponse {
  approvalId: string
  drafts: {
    formal: string
    friendly: string
    brief: string
  }
}

export interface SaveGmailDraftRequest {
  to: string
  subject: string
  body: string
  inReplyTo?: string
}

export interface SaveGmailDraftResponse {
  draftId: string
}

export interface GmailThread {
  id: string
  subject: string
  snippet: string
  from: string
  date: string
}

export interface ExportCSVRequest {
  type: 'jobs' | 'customers'
  status?: string
  dateFrom?: string
  dateTo?: string
}

export interface ExportPDFRequest {
  jobId: string
}

export interface SearchResult {
  jobs: Array<Job & { customer_name: string | null }>
  customers: Customer[]
}

export interface ApproveItemRequest {
  id: string
  editedData?: Record<string, unknown>
}

export interface DashboardStats {
  activeJobs: number
  overdueInvoices: number
  pendingApprovals: number
  revenueThisMonth: number
}
