'use client'

import { useRef, useState } from 'react'
import { Upload, FileText, Image as ImageIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useToast } from '@/providers/ToastProvider'
import { useQueryClient } from '@tanstack/react-query'
import type { JobFile } from '@/types/domain'
import { formatDate } from '@/lib/utils'
import { useSession } from '@/hooks/useSession'

interface JobFilesProps {
  jobId: string
  files: JobFile[]
}

const statusIcon = {
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  approved: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  rejected: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
}

export function JobFiles({ jobId, files }: JobFilesProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const { user } = useSession()
  const { success, error: showError } = useToast()
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const path = `${user.id}/${jobId}/${Date.now()}-${file.name}`
      const { error: uploadErr } = await supabase.storage.from('job-files').upload(path, file)
      if (uploadErr) throw uploadErr

      const { error: dbErr } = await supabase.from('job_files').insert({
        job_id: jobId,
        filename: file.name,
        filepath: path,
        status: 'pending',
      })
      if (dbErr) throw dbErr

      success('File uploaded', 'You can now extract data from this file.')
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
    } catch (e) {
      showError('Upload failed', String(e))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function extractFromFile(fileId: string) {
    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, jobId }),
      })
      if (!res.ok) throw new Error('Extraction failed')
      success('Extraction started', 'Review results in the Approvals queue.')
    } catch (e) {
      showError('Extraction failed', String(e))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload invoices, quotes, or photos
        </p>
        <Button
          size="md"
          variant="secondary"
          loading={uploading}
          icon={<Upload className="w-4 h-4" />}
          onClick={() => fileRef.current?.click()}
        >
          Upload file
        </Button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleUpload}
        />
      </div>

      {files.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No files yet"
          description="Upload invoices, photos, or documents"
        />
      ) : (
        <ul className="space-y-2">
          {files.map(f => (
            <li key={f.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-700">
                {f.filename.match(/\.(jpg|jpeg|png|webp)$/i)
                  ? <ImageIcon className="w-5 h-5 text-blue-500" />
                  : <FileText className="w-5 h-5 text-purple-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{f.filename}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {statusIcon[f.status]}
                  <span className="text-xs text-slate-400 capitalize">{f.status}</span>
                  {f.ai_confidence !== null && (
                    <span className="text-xs text-slate-400">· {Math.round((f.ai_confidence ?? 0) * 100)}% confidence</span>
                  )}
                  <span className="text-xs text-slate-400">· {formatDate(f.created_at)}</span>
                </div>
              </div>
              {f.status === 'pending' && !f.extracted_data && (
                <Button size="sm" variant="outline" onClick={() => extractFromFile(f.id)}>
                  Extract data
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
