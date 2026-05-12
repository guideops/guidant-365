import { NextRequest, NextResponse } from 'next/server'
import { createWorker } from 'tesseract.js'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { extractDocumentData } from '@/lib/openai'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fileId, jobId } = await req.json() as { fileId: string; jobId: string }
  if (!fileId || !jobId) return NextResponse.json({ error: 'fileId and jobId required' }, { status: 400 })

  // Get file record + verify ownership
  const { data: fileRecord, error: fileError } = await supabase
    .from('job_files')
    .select('filepath, job_id, jobs!inner(user_id)')
    .eq('id', fileId)
    .single()

  if (fileError || !fileRecord) return NextResponse.json({ error: 'File not found' }, { status: 404 })
  const jobData = fileRecord.jobs as unknown as { user_id: string }
  if (jobData.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Signed URL for download (60s)
  const { data: signed } = await supabase.storage
    .from('job-files')
    .createSignedUrl(fileRecord.filepath, 60)

  if (!signed?.signedUrl) return NextResponse.json({ error: 'Could not access file' }, { status: 500 })

  // Download file buffer
  const fileRes = await fetch(signed.signedUrl)
  const buffer = await fileRes.arrayBuffer()

  // Tesseract OCR
  const worker = await createWorker('eng')
  const { data: { text: rawText } } = await worker.recognize(Buffer.from(buffer))
  await worker.terminate()

  if (!rawText.trim()) {
    return NextResponse.json({ error: 'No text could be extracted from this file' }, { status: 422 })
  }

  // GPT-4o-mini extraction
  const extracted = await extractDocumentData(rawText)

  // Update job_files with extracted data
  await supabase.from('job_files').update({
    extracted_data: extracted as unknown as import('@/types/database').Json,
    ai_confidence: extracted.confidence ?? null,
    status: 'pending',
  }).eq('id', fileId)

  // Insert into approval queue
  await supabase.from('approval_queue').insert({
    user_id: user.id,
    type: 'document',
    source_data: { rawText: rawText.slice(0, 2000), fileId, jobId } as unknown as import('@/types/database').Json,
    suggested_update: extracted as unknown as import('@/types/database').Json,
    status: 'pending',
  })

  return NextResponse.json({ success: true, extracted })
}
