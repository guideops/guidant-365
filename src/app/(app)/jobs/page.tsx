'use client'

import { useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { JobKanban } from '@/components/jobs/JobKanban'
import { JobListView } from '@/components/jobs/JobListView'
import { JobForm } from '@/components/jobs/JobForm'
import { useJobs } from '@/hooks/useJobs'

export default function JobsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [formOpen, setFormOpen] = useState(false)
  const { jobs, loading: isLoading } = useJobs()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex-1">Jobs</h1>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded-lg transition-colors ${view === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="Kanban view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setFormOpen(true)}>
          New Job
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : view === 'kanban' ? (
        <JobKanban jobs={jobs ?? []} />
      ) : (
        <JobListView jobs={jobs ?? []} />
      )}

      <JobForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
