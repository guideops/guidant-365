'use client'

import { useState } from 'react'
import { Edit2, Trash2, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { RecurringForm } from './RecurringForm'
import { useRecurring } from '@/hooks/useRecurring'
import { useToast } from '@/providers/ToastProvider'
import { formatCurrency, formatDate, isOverdue, isDueSoon } from '@/lib/utils'
import type { RecurringItem } from '@/types/domain'

interface RecurringCardProps {
  item: RecurringItem
}

const RECURRENCE_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export function RecurringCard({ item }: RecurringCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { deleteRecurring } = useRecurring()
  const { success, error: showError } = useToast()

  async function handleDelete() {
    try {
      await deleteRecurring.mutateAsync(item.id)
      success('Deleted')
    } catch (e) {
      showError('Failed to delete', String(e))
    }
  }

  const overdue = isOverdue(item.next_date)
  const dueSoon = isDueSoon(item.next_date)

  return (
    <>
      <Card>
        <div className="p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${overdue ? 'bg-red-100 dark:bg-red-900/30' : dueSoon ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
            <RefreshCw className={`w-5 h-5 ${overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-purple-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{item.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" size="sm">{RECURRENCE_LABELS[item.recurrence]}</Badge>
              <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                Due {formatDate(item.next_date)}
              </span>
            </div>
          </div>
          {item.amount && (
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 shrink-0">
              {formatCurrency(Number(item.amount))}
            </p>
          )}
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      <RecurringForm open={editOpen} onClose={() => setEditOpen(false)} item={item} />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete recurring item"
        description={`Delete "${item.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </>
  )
}
