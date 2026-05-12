'use client'

import { useState } from 'react'
import { FileText, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DocumentApproval } from './DocumentApproval'
import { EmailDraftApproval } from './EmailDraftApproval'
import type { ApprovalItem } from '@/types/domain'
import { formatDate } from '@/lib/utils'

interface ApprovalCardProps {
  item: ApprovalItem
  onApprove: (id: string, editedData?: Record<string, unknown>) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function ApprovalCard({ item, onApprove, onReject }: ApprovalCardProps) {
  const [expanded, setExpanded] = useState(true)

  const isDocument = item.type === 'document'
  const Icon = isDocument ? FileText : Mail
  const label = isDocument ? 'Document' : 'Email Draft'
  const source = item.source_data as { filename?: string; subject?: string; from?: string }
  const subtitle = isDocument
    ? (source.filename ?? 'Uploaded document')
    : (source.subject ?? 'Email thread')

  return (
    <Card>
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-2xl transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDocument ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
          <Icon className={`w-5 h-5 ${isDocument ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">{label}</Badge>
            <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5">{subtitle}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          {isDocument ? (
            <DocumentApproval item={item} onApprove={onApprove} onReject={onReject} />
          ) : (
            <EmailDraftApproval item={item} onApprove={onApprove} onReject={onReject} />
          )}
        </div>
      )}
    </Card>
  )
}
