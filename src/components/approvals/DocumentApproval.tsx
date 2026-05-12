'use client'

import { useState } from 'react'
import { Check, X, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ApprovalItem } from '@/types/domain'
import type { ExtractedDocumentData } from '@/types/api'
import { formatCurrency } from '@/lib/utils'

interface DocumentApprovalProps {
  item: ApprovalItem
  onApprove: (id: string, editedData?: Record<string, unknown>) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function DocumentApproval({ item, onApprove, onReject }: DocumentApprovalProps) {
  const [editing, setEditing] = useState(false)
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const source = item.source_data as { rawText?: string; fileId?: string }
  const suggested = item.suggested_update as unknown as ExtractedDocumentData
  const confidence = (suggested as ExtractedDocumentData & { confidence?: number }).confidence

  const [editedData, setEditedData] = useState<Record<string, string>>({
    amount: suggested.amount?.toString() ?? '',
    due_date: suggested.due_date ?? '',
    vendor: suggested.vendor ?? '',
    description: suggested.description ?? '',
    invoice_number: suggested.invoice_number ?? '',
  })

  async function handleApprove() {
    setApproving(true)
    try {
      await onApprove(item.id, editing ? editedData : undefined)
    } finally {
      setApproving(false)
    }
  }

  async function handleReject() {
    setRejecting(true)
    try {
      await onReject(item.id)
    } finally {
      setRejecting(false)
    }
  }

  return (
    <div className="space-y-4">
      {confidence !== undefined && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">AI confidence</span>
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-32">
            <div
              className={`h-full rounded-full ${confidence >= 0.8 ? 'bg-green-500' : confidence >= 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.round(confidence * 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{Math.round((confidence ?? 0) * 100)}%</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Raw text */}
        <div>
          <h4 className="text-sm font-medium text-slate-500 mb-2">Extracted text</h4>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
            {source.rawText?.slice(0, 500) ?? 'No text available'}
          </div>
        </div>

        {/* AI suggestions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-500">AI suggestions</h4>
            <button
              onClick={() => setEditing(e => !e)}
              className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3 h-3" />
              {editing ? 'Stop editing' : 'Edit'}
            </button>
          </div>
          <div className="space-y-2">
            {editing ? (
              <>
                <Input label="Amount (£)" value={editedData.amount} onChange={e => setEditedData(d => ({ ...d, amount: e.target.value }))} />
                <Input label="Due date" type="date" value={editedData.due_date} onChange={e => setEditedData(d => ({ ...d, due_date: e.target.value }))} />
                <Input label="Vendor" value={editedData.vendor} onChange={e => setEditedData(d => ({ ...d, vendor: e.target.value }))} />
                <Input label="Description" value={editedData.description} onChange={e => setEditedData(d => ({ ...d, description: e.target.value }))} />
                <Input label="Invoice #" value={editedData.invoice_number} onChange={e => setEditedData(d => ({ ...d, invoice_number: e.target.value }))} />
              </>
            ) : (
              <dl className="space-y-1.5 text-sm">
                {suggested.amount && <Row label="Amount" value={formatCurrency(Number(suggested.amount))} />}
                {suggested.due_date && <Row label="Due date" value={suggested.due_date} />}
                {suggested.vendor && <Row label="Vendor" value={suggested.vendor} />}
                {suggested.description && <Row label="Description" value={suggested.description} />}
                {suggested.invoice_number && <Row label="Invoice #" value={suggested.invoice_number} />}
              </dl>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="danger" size="md" icon={<X className="w-4 h-4" />} loading={rejecting} onClick={handleReject}>
          Reject
        </Button>
        <Button variant="primary" size="md" icon={<Check className="w-4 h-4" />} loading={approving} onClick={handleApprove}>
          {editing ? 'Approve with edits' : 'Approve'}
        </Button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-slate-500 min-w-24 shrink-0">{label}:</dt>
      <dd className="text-slate-900 dark:text-slate-100 font-medium">{value}</dd>
    </div>
  )
}
