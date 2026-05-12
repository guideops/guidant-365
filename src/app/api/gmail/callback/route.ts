import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { exchangeCodeForTokens } from '@/lib/gmail'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/settings?gmail=error', req.url))

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  try {
    const tokens = await exchangeCodeForTokens(code)
    await supabase.from('profiles').update({
      gmail_access_token: tokens.access_token,
      gmail_refresh_token: tokens.refresh_token ?? null,
    }).eq('id', user.id)

    return NextResponse.redirect(new URL('/settings?gmail=connected', req.url))
  } catch {
    return NextResponse.redirect(new URL('/settings?gmail=error', req.url))
  }
}
