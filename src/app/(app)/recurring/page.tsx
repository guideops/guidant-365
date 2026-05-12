import type { Metadata } from 'next'
import { RecurringList } from '@/components/recurring/RecurringList'

export const metadata: Metadata = { title: 'Recurring — Guidant 365' }

export default function RecurringPage() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recurring Items</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track monthly bills, rent, insurance, and subscriptions</p>
      </div>
      <RecurringList />
    </div>
  )
}
