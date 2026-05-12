'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Briefcase, Users } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { JobStatusBadge } from '@/components/jobs/JobStatusBadge'
import { Spinner } from '@/components/ui/Spinner'
import { useFullTextSearch } from '@/hooks/useFullTextSearch'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const { results, loading: isLoading } = useFullTextSearch(query)

  const jobs = results?.jobs ?? []
  const customers = results?.customers ?? []
  const hasResults = jobs.length > 0 || customers.length > 0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Search</h1>
      </div>

      <Input
        placeholder="Search jobs, customers…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        icon={<Search className="w-4 h-4 text-slate-400" />}
        autoFocus
      />

      {isLoading && (
        <div className="flex justify-center py-8"><Spinner size="md" /></div>
      )}

      {!isLoading && query.length >= 2 && !hasResults && (
        <p className="text-sm text-slate-500 text-center py-8">No results for &quot;{query}&quot;</p>
      )}

      {jobs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            Jobs ({jobs.length})
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {jobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{job.title}</p>
                  {job.next_action && <p className="text-xs text-slate-400 truncate">{job.next_action}</p>}
                </div>
                <JobStatusBadge status={job.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {customers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Customers ({customers.length})
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {customers.map(c => (
              <Link key={c.id} href={`/customers/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                  {c.email && <p className="text-xs text-slate-400">{c.email}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
