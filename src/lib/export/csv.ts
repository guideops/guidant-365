import Papa from 'papaparse'
import type { JobWithCustomer, Customer } from '@/types/domain'
import { formatDate } from '@/lib/utils'

export function jobsToCSV(jobs: JobWithCustomer[]): string {
  const rows = jobs.map(j => ({
    ID: j.id,
    Title: j.title,
    Customer: j.customer?.name ?? '',
    Status: j.status,
    Priority: j.priority,
    'Next Action': j.next_action ?? '',
    'Next Due': j.next_due ? formatDate(j.next_due) : '',
    'Start Date': j.start_date ? formatDate(j.start_date) : '',
    'End Date': j.end_date ? formatDate(j.end_date) : '',
    Notes: j.notes ?? '',
    Created: formatDate(j.created_at),
    Updated: formatDate(j.updated_at),
  }))
  return Papa.unparse(rows)
}

export function customersToCSV(customers: Customer[]): string {
  const rows = customers.map(c => ({
    ID: c.id,
    Name: c.name,
    Email: c.email ?? '',
    Phone: c.phone ?? '',
    Address: c.address ?? '',
    Notes: c.notes ?? '',
    Created: formatDate(c.created_at),
  }))
  return Papa.unparse(rows)
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseCSVContacts(
  file: File
): Promise<Array<{ name: string; email?: string; phone?: string; address?: string }>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        const rows = result.data as Record<string, string>[]
        const contacts = rows.map(row => ({
          name: (row['name'] ?? row['Name'] ?? row['full_name'] ?? '').trim(),
          email: (row['email'] ?? row['Email'] ?? '').trim() || undefined,
          phone: (row['phone'] ?? row['Phone'] ?? row['mobile'] ?? '').trim() || undefined,
          address: (row['address'] ?? row['Address'] ?? '').trim() || undefined,
        })).filter(c => c.name)
        resolve(contacts)
      },
      error: reject,
    })
  })
}
