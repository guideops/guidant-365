'use client'

import { useState, KeyboardEvent } from 'react'
import { Tag, X, Plus } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/providers/ToastProvider'
import type { Tag as TagType } from '@/types/domain'

interface JobTagsProps {
  jobId: string
  tags: TagType[]
}

export function JobTags({ jobId, tags }: JobTagsProps) {
  const [adding, setAdding] = useState(false)
  const [tagName, setTagName] = useState('')
  const { user } = useSession()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()
  const { error: showError } = useToast()

  async function addTag() {
    const name = tagName.trim().toLowerCase()
    if (!name || !user) return

    // Find or create tag
    let { data: existing } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name)
      .maybeSingle()

    if (!existing) {
      const { data } = await supabase.from('tags').insert({ user_id: user.id, name }).select().single()
      existing = data
    }

    if (!existing) return

    // Check if already attached
    if (tags.some(t => t.id === existing!.id)) {
      setTagName('')
      setAdding(false)
      return
    }

    const { error } = await supabase.from('job_tags').insert({ job_id: jobId, tag_id: existing.id })
    if (error) { showError('Failed to add tag'); return }

    setTagName('')
    setAdding(false)
    queryClient.invalidateQueries({ queryKey: ['job', jobId] })
  }

  async function removeTag(tagId: string) {
    await supabase.from('job_tags').delete().eq('job_id', jobId).eq('tag_id', tagId)
    queryClient.invalidateQueries({ queryKey: ['job', jobId] })
  }

  const tagColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
  const getColor = (name: string) => tagColors[name.charCodeAt(0) % tagColors.length]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="w-4 h-4 text-slate-400 shrink-0" />
      {tags.map(tag => (
        <span key={tag.id} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${getColor(tag.name)}`}>
          {tag.name}
          <button onClick={() => removeTag(tag.id)} className="hover:text-red-500 transition-colors" aria-label={`Remove ${tag.name}`}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          value={tagName}
          onChange={e => setTagName(e.target.value)}
          onBlur={() => { if (!tagName.trim()) setAdding(false) }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') addTag()
            if (e.key === 'Escape') { setTagName(''); setAdding(false) }
          }}
          placeholder="Tag name"
          className="text-xs h-7 px-2.5 rounded-full border border-blue-300 bg-blue-50 text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24"
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add tag
        </button>
      )}
    </div>
  )
}
