import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getGmailClient, createDraft } from '@/lib/gmail'

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { to, subject, body, inReplyTo } = await req.json() as {
    to: string; subject: string; body: string; inReplyTo?: string
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('gmail_access_token, gmail_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profile?.gmail_access_token) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 })
  }

  const gmail = getGmailClient(profile.gmail_access_token, profile.gmail_refresh_token ?? undefined)
  const draft = await createDraft(gmail, { to, subject, body, inReplyTo })
  return NextResponse.json({ draftId: draft.data.id })
}
