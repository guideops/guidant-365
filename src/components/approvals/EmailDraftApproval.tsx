'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import type { ApprovalItem } from '@/types/domain'

interface EmailDraftApprovalProps {
  item: ApprovalItem
  onApprove: (id: string, editedData?: Record<string, unknown>) => Promise<void>
  onReject: (id: string) => Promise<void>
}

type Tone = 'formal' | 'friendly' | 'brief'

export function EmailDraftApproval({ item, onApprove, onReject }: EmailDraftApprovalProps) {
  const source = item.source_data as { subject?: string; from?: string; threadId?: string }
  const suggested = item.suggested_update as { formal?: string; friendly?: string; brief?: string; subject?: string }

  const [tone, setTone] = useState<Tone>('formal')
  const [editedBodies, setEditedBodies] = useState<Record<Tone, string>>({
    formal: suggested.formal ?? '',
    friendly: suggested.friendly ?? '',
    brief: suggested.brief ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  async function handleSaveDraft() {
    setSaving(true)
    try {
      await onApprove(item.id, {
        tone,
        body: editedBodies[tone],
        subject: suggested.subject ?? source.subject,
        threadId: source.threadId,
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleReject() {
    setRejecting(true)
    try {
      await onReject(item.id)
    } finally {
      setRejecting(false)
    }
  }

  const tones: { key: Tone; label: string }[] = [
    { key: 'formal', label: 'Formal' },
    { key: 'friendly', label: 'Friendly' },
    { key: 'brief', label: 'Brief' },
  ]

  return (
    <div className="space-y-4">
      {/* Thread context */}
      {(source.from || source.subject) && (
        <div className="text-xs text-slate-500 space-y-0.5">
          {source.from && <p><span className="font-medium">From:</span> {source.from}</p>}
          {source.subject && <p><span className="font-medium">Re:</span> {source.subject}</p>}
        </div>
      )}

      {/* Tone tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {tones.map(t => (
          <button
            key={t.key}
            onClick={() => setTone(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tone === t.key
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Draft body */}
      <Textarea
        label="Draft reply"
        value={editedBodies[tone]}
        onChange={e => setEditedBodies(prev => ({ ...prev, [tone]: e.target.value }))}
        rows={8}
      />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="danger" size="md" icon={<X className="w-4 h-4" />} loading={rejecting} onClick={handleReject}>
          Discard
        </Button>
        <Button variant="primary" size="md" icon={<Save className="w-4 h-4" />} loading={saving} onClick={handleSaveDraft}>
          Save as Gmail Draft
        </Button>
      </div>
    </div>
  )
}
