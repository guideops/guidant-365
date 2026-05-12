import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getAuthUrl } from '@/lib/gmail'

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const scope = (req.nextUrl.searchParams.get('scope') ?? 'draft') as 'read' | 'draft'
  const url = getAuthUrl(scope)
  return NextResponse.json({ url })
}
