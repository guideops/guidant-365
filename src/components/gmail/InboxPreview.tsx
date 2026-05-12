'use client'

import { Mail, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import type { GmailThread } from '@/types/domain'

interface InboxPreviewProps {
  onSelectThread: (thread: GmailThread) => void
}

export function InboxPreview({ onSelectThread }: InboxPreviewProps) {
  const { data: threads, isLoading, error, refetch } = useQuery<GmailThread[]>({
    queryKey: ['gmail-inbox'],
    queryFn: async () => {
      const res = await fetch('/api/gmail/inbox')
      if (!res.ok) throw new Error('Failed to load inbox')
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (error || !threads) {
    return (
      <EmptyState
        icon={<Mail className="w-8 h-8" />}
        title="Could not load inbox"
        description="Make sure Gmail is connected in Settings."
        action={<Button variant="secondary" size="md" onClick={() => refetch()}>Retry</Button>}
      />
    )
  }

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={<Mail className="w-8 h-8" />}
        title="Inbox empty"
        description="No unread messages."
      />
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {threads.map(thread => (
        <button
          key={thread.id}
          onClick={() => onSelectThread(thread)}
          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{thread.subject}</p>
              <p className="text-xs text-slate-500 truncate">{thread.from}</p>
            </div>
            <span className="text-xs text-slate-400 shrink-0">{thread.date}</span>
          </div>
          {thread.snippet && (
            <p className="text-xs text-slate-400 mt-1 ml-7 truncate">{thread.snippet}</p>
          )}
        </button>
      ))}
    </div>
  )
}
