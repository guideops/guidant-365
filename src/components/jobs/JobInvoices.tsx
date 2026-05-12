'use client'

import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { InvoiceForm } from './InvoiceForm'
import { INVOICE_STATUS_CONFIG } from '@/types/domain'
import type { Invoice } from '@/types/domain'
import { formatCurrency, formatDate } from '@/lib/utils'

interface JobInvoicesProps {
  jobId: string
  invoices: Invoice[]
}

export function JobInvoices({ jobId, invoices }: JobInvoicesProps) {
  const [showForm, setShowForm] = useState(false)

  const total = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const paid = invoices.reduce((sum, inv) => sum + Number(inv.paid_amount), 0)
  const outstanding = total - paid

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <span className="text-slate-500">Total: <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(total)}</strong></span>
          <span className="text-green-600">Paid: <strong>{formatCurrency(paid)}</strong></span>
          {outstanding > 0 && (
            <span className="text-amber-600">Outstanding: <strong>{formatCurrency(outstanding)}</strong></span>
          )}
        </div>
        <Button size="sm" variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
          Add invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon={<Receipt className="w-6 h-6" />} title="No invoices" description="Add an invoice to track payments." />
      ) : (
        <div className="space-y-2">
          {invoices.map(inv => {
            const cfg = INVOICE_STATUS_CONFIG[inv.status]
            return (
              <div key={inv.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(Number(inv.amount))}</span>
                    <Badge style={{ color: cfg.color, backgroundColor: cfg.bgColor }}>{cfg.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    {inv.due_date && <span>Due: {formatDate(inv.due_date)}</span>}
                    {Number(inv.paid_amount) > 0 && <span>Paid: {formatCurrency(Number(inv.paid_amount))}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <InvoiceForm open={showForm} onClose={() => setShowForm(false)} jobId={jobId} />
    </div>
  )
}
