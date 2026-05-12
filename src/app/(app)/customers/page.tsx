import type { Metadata } from 'next'
import { CustomerList } from '@/components/customers/CustomerList'

export const metadata: Metadata = { title: 'Customers — Guidant 365' }

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customers</h1>
      <CustomerList />
    </div>
  )
}
