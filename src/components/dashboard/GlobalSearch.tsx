'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, Briefcase, Users, X } from 'lucide-react'
import { useFullTextSearch } from '@/hooks/useFullTextSearch'
import { JOB_STATUS_CONFIG } from '@/types/domain'



interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { results, loading } = useFullTextSearch(query)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const hasResults = results.jobs.length > 0 || results.customers.length > 0

  function navigateTo(path: string) {
    router.push(path)
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-24 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search jobs, customers…"
              className="flex-1 bg-transparent text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto py-2">
            {loading && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">Searching…</div>
            )}

            {!loading && query && !hasResults && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">No results for &ldquo;{query}&rdquo;</div>
            )}

            {!loading && !query && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">Start typing to search…</div>
            )}

            {results.jobs.length > 0 && (
              <div>
                <div className="px-4 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" />
                  Jobs
                </div>
                {results.jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => navigateTo(`/jobs/${job.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: JOB_STATUS_CONFIG[job.status].color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{job.title}</p>
                      {job.customer_name && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.customer_name}</p>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                      {JOB_STATUS_CONFIG[job.status].label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {results.customers.length > 0 && (
              <div>
                <div className="px-4 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mt-1">
                  <Users className="w-3 h-3" />
                  Customers
                </div>
                {results.customers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigateTo(`/customers/${c.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {c.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{c.name}</p>
                      {c.email && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.email}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 flex items-center gap-3">
            <kbd className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5">Esc</kbd> to close
            <kbd className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5">↵</kbd> to open
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
