'use client'

import { Mail, CheckCircle, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useGmailOAuth } from '@/hooks/useGmailOAuth'
import { useSession } from '@/hooks/useSession'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export function GmailSettings() {
  const { user } = useSession()
  const { connectGmail, connecting } = useGmailOAuth()

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.from('profiles').select('gmail_access_token, gmail_refresh_token').eq('id', user!.id).single()
      return data
    },
    enabled: !!user,
  })

  const connected = !!profile?.gmail_access_token

  async function handleDisconnect() {
    const supabase = getSupabaseBrowserClient()
    await supabase.from('profiles').update({ gmail_access_token: null, gmail_refresh_token: null }).eq('id', user!.id)
  }

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Gmail Integration</h3>
          {connected && <Badge variant="success" size="sm">Connected</Badge>}
        </div>

        <p className="text-sm text-slate-500">
          Connect Gmail to generate AI draft replies. Drafts are saved to your Gmail — nothing is sent without your review.
        </p>

        {connected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              Gmail connected
            </div>
            <Button variant="secondary" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} loading={connecting} onClick={connectGmail}>
              Reconnect
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="primary" size="md" icon={<Mail className="w-4 h-4" />} loading={connecting} onClick={connectGmail}>
              Connect Gmail (drafts only)
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
