'use client'

import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useGmailOAuth } from '@/hooks/useGmailOAuth'

interface GmailConnectProps {
  scope?: 'read' | 'draft'
}

export function GmailConnect({ scope = 'draft' }: GmailConnectProps) {
  const { connectGmail, connecting } = useGmailOAuth()

  return (
    <div className="text-center space-y-4 py-8">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Connect Gmail</h3>
        <p className="text-sm text-slate-500 mt-1">
          {scope === 'draft'
            ? 'Generate AI replies and save them as Gmail drafts.'
            : 'Read your inbox and generate AI draft replies.'}
        </p>
      </div>
      <Button variant="primary" size="lg" icon={<Mail className="w-5 h-5" />} loading={connecting} onClick={connectGmail}>
        Connect Gmail
      </Button>
    </div>
  )
}
