import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { generateJobPDF } from '@/lib/export/pdf'
import type { JobDetail, Customer, JobFile, Invoice, TimelineEntry, Tag } from '@/types/domain'

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobId } = await req.json() as { jobId: string }
  if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })

  const [jobRes, customerRes, filesRes, invoicesRes, timelineRes, tagsRes] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', jobId).eq('user_id', user.id).single(),
    supabase.from('jobs').select('customer_id').eq('id', jobId).single(),
    supabase.from('job_files').select('*').eq('job_id', jobId).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').eq('job_id', jobId),
    supabase.from('job_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: true }),
    supabase.from('job_tags').select('tag:tags(*)').eq('job_id', jobId),
  ])

  if (jobRes.error || !jobRes.data) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  let customer: Customer | null = null
  if (customerRes.data?.customer_id) {
    const { data } = await supabase.from('customers').select('*').eq('id', customerRes.data.customer_id).single()
    customer = data as Customer | null
  }

  const tags = (tagsRes.data ?? []).map(t => t.tag).filter(Boolean) as Tag[]

  const jobDetail: JobDetail = {
    ...jobRes.data,
    customer,
    tags,
    files: (filesRes.data ?? []) as JobFile[],
    invoices: (invoicesRes.data ?? []) as Invoice[],
    timeline: (timelineRes.data ?? []) as TimelineEntry[],
  }

  const pdfBlob = generateJobPDF(jobDetail)
  const buffer = await pdfBlob.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="job-${jobId.slice(0, 8)}.pdf"`,
    },
  })
}
