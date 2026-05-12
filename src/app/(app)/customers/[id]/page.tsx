'use client'

import { useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { CustomerJobHistory } from '@/components/customers/CustomerJobHistory'
import { useCustomer } from '@/hooks/useCustomer'

interface Params { id: string }

export default function CustomerDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params)
  const { customer, jobs, loading: isLoading } = useCustomer(id)
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Customer not found.</p>
        <Link href="/customers" className="text-brand text-sm mt-2 inline-block">← Back to customers</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/customers" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Customers
        </Link>
      </div>

      <Card>
        <div className="p-6 flex items-start gap-4">
          <Avatar name={customer.name} size="lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{customer.name}</h1>
            {customer.email && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4 shrink-0" />
                <a href={`mailto:${customer.email}`} className="hover:text-brand">{customer.email}</a>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-4 h-4 shrink-0" />
                <a href={`tel:${customer.phone}`} className="hover:text-brand">{customer.phone}</a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{customer.address}</span>
              </div>
            )}
            {customer.notes && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                {customer.notes}
              </p>
            )}
          </div>
          <Button variant="secondary" size="md" icon={<Edit2 className="w-4 h-4" />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Job history ({jobs?.length ?? 0})
        </h2>
        <Card>
          <div className="p-4">
            <CustomerJobHistory jobs={jobs ?? []} />
          </div>
        </Card>
      </div>

      <CustomerForm open={editOpen} onClose={() => setEditOpen(false)} customer={customer} />
    </div>
  )
}
