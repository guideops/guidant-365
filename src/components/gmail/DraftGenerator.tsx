'use client'

import { useState } from 'react'
import { Wand2, Loader2 } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'
import type { GmailThread } from '@/types/domain'

interface DraftGeneratorProps {
  thread: GmailThread
  jobId?: string
}

type Tone = 'formal' | 'friendly' | 'brief'

const TONES: { key: Tone; label: string; desc: string }[] = [
  { key: 'formal', label: 'Formal', desc: 'Professional, business-like tone' },
  { key: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
  { key: 'brief', label: 'Brief', desc: 'Short and to the point' },
]

export function DraftGenerator({ thread, jobId }: DraftGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const { success, error: showError } = useToast()

  async function generate(tone: Tone) {
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: thread.id, jobId, tone }),
      })
      if (!res.ok) throw new Error(await res.text())
      success('Draft added to approval queue')
      setDone(true)
    } catch (e) {
      showError('Failed to generate draft', String(e))
    } finally {
      setGenerating(false)
    }
  }

  if (done) {
    return (
      <p className="text-sm text-green-600 dark:text-green-400 text-center py-4">
        Drafts generated — review them in the Approvals page.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-500 px-1">
        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Re: {thread.subject}</p>
        <p>Choose a tone — AI will draft a reply for your review before sending.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TONES.map(t => (
          <button
            key={t.key}
            onClick={() => generate(t.key)}
            disabled={generating}
            className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Wand2 className="w-4 h-4 text-blue-500" />}
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
            <span className="text-[10px] text-slate-400">{t.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
