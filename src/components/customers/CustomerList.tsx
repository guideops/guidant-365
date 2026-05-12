'use client'

import { useState } from 'react'
import { Search, UserPlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { CustomerCard } from './CustomerCard'
import { CustomerForm } from './CustomerForm'
import { CSVImport } from './CSVImport'
import { useCustomers } from '@/hooks/useCustomers'
import type { Customer } from '@/types/domain'

export function CustomerList() {
  const { customers, loading: isLoading } = useCustomers()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | undefined>()

  const filtered = (customers ?? []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search customers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" icon={<Upload className="w-4 h-4" />} onClick={() => setCsvOpen(true)}>
            Import CSV
          </Button>
          <Button variant="primary" size="md" icon={<UserPlus className="w-4 h-4" />} onClick={() => { setEditing(undefined); setFormOpen(true) }}>
            Add Customer
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<UserPlus className="w-8 h-8" />}
          title={search ? 'No results' : 'No customers yet'}
          description={search ? `No customers match "${search}"` : 'Add your first customer to get started.'}
          action={!search ? <Button variant="primary" size="lg" onClick={() => setFormOpen(true)}>Add Customer</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}

      <CustomerForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(undefined) }}
        customer={editing}
      />
      <CSVImport open={csvOpen} onClose={() => setCsvOpen(false)} />
    </div>
  )
}
