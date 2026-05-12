'use client'

import { useState } from 'react'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { NextActionsPanel } from '@/components/dashboard/NextActionsPanel'
import { ApprovalQueuePreview } from '@/components/dashboard/ApprovalQueuePreview'
import { GlobalSearch } from '@/components/dashboard/GlobalSearch'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'

export default function DashboardPage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Your business at a glance</p>
        </div>
        <Button variant="secondary" size="md" icon={<Search className="w-4 h-4" />} onClick={() => setSearchOpen(true)}>
          Search
        </Button>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextActionsPanel />
        <ApprovalQueuePreview />
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
