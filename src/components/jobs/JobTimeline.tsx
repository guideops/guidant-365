'use client'

import { useState } from 'react'
import { MessageSquare, Mail, FileText, Phone, RefreshCw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { EmptyState } from '@/components/ui/EmptyState'
import type { TimelineEntry, TimelineType } from '@/types/domain'
import { formatDate } from '@/lib/utils'

const typeConfig: Record<TimelineType, { icon: React.ReactNode; label: string; color: string }> = {
  note: { icon: <MessageSquare className="w-4 h-4" />, label: 'Note', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  email: { icon: <Mail className="w-4 h-4" />, label: 'Email', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  file: { icon: <FileText className="w-4 h-4" />, label: 'File', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  call: { icon: <Phone className="w-4 h-4" />, label: 'Call', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  status_change: { icon: <RefreshCw className="w-4 h-4" />, label: 'Status', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
}

interface JobTimelineProps {
  entries: TimelineEntry[]
  onAddNote: (content: string) => Promise<void>
}

export function JobTimeline({ entries, onAddNote }: JobTimelineProps) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!note.trim()) return
    setSaving(true)
    try {
      await onAddNote(note.trim())
      setNote('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add note */}
      <div className="space-y-3">
        <Textarea
          placeholder="Add a note, call log, or update…"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
        />
        <Button
          size="md"
          variant="primary"
          loading={saving}
          disabled={!note.trim()}
          onClick={handleSave}
        >
          Add note
        </Button>
      </div>

      {/* Timeline entries */}
      {entries.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-6 h-6" />}
          title="No timeline entries"
          description="Actions and notes will appear here."
        />
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <ul className="space-y-4">
            {entries.map(entry => {
              const cfg = typeConfig[entry.type]
              return (
                <li key={entry.id} className="relative flex gap-4 pl-12">
                  <div className={`absolute left-1.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cfg.label}</span>
                      <span className="text-xs text-slate-400">{formatDate(entry.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
