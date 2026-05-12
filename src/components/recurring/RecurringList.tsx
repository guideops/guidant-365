'use client'

import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { RecurringCard } from './RecurringCard'
import { RecurringForm } from './RecurringForm'
import { useRecurring } from '@/hooks/useRecurring'

export function RecurringList() {
  const { items, loading: isLoading } = useRecurring()
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setFormOpen(true)}>
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={<RefreshCw className="w-8 h-8" />}
          title="No recurring items"
          description="Track monthly bills, rent, insurance, and other recurring expenses."
          action={<Button variant="primary" size="lg" onClick={() => setFormOpen(true)}>Add Item</Button>}
        />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <RecurringCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <RecurringForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
