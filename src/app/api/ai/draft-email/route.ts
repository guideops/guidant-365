import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { generateEmailDrafts } from '@/lib/openai'
import { getGmailClient, extractTextFromPayload } from '@/lib/gmail'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { threadId, jobId } = await req.json() as { threadId: string; jobId?: string; tone?: string }
  if (!threadId) return NextResponse.json({ error: 'threadId required' }, { status: 400 })

  // Get Gmail tokens
  const { data: profile } = await supabase
    .from('profiles')
    .select('gmail_access_token, gmail_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profile?.gmail_access_token) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 })
  }

  // Fetch thread from Gmail
  const gmail = getGmailClient(profile.gmail_access_token, profile.gmail_refresh_token ?? undefined)
  const thread = await gmail.users.threads.get({ userId: 'me', id: threadId, format: 'full' })
  const messages = thread.data.messages ?? []

  const subject = messages[0]?.payload?.headers?.find(h => h.name === 'Subject')?.value ?? ''
  const from = messages[0]?.payload?.headers?.find(h => h.name === 'From')?.value ?? ''
  const threadContent = messages.map(m => extractTextFromPayload(m.payload)).join('\n\n---\n\n')

  // Build job context if provided
  let jobContext: string | undefined
  if (jobId) {
    const { data: job } = await supabase.from('jobs').select('title, notes, status').eq('id', jobId).single()
    if (job) jobContext = `Job: ${job.title}\nStatus: ${job.status}\nNotes: ${job.notes ?? 'none'}`
  }

  const drafts = await generateEmailDrafts(threadContent, jobContext)

  // Insert into approval queue
  await supabase.from('approval_queue').insert({
    user_id: user.id,
    type: 'email',
    source_data: { threadId, subject, from, jobId: jobId ?? null },
    suggested_update: { drafts },
    status: 'pending',
  })

  return NextResponse.json({ success: true, drafts })
}
