'use client'

import { JOB_STATUSES, JOB_STATUS_CONFIG } from '@/types/domain'
import type { JobStatus } from '@/types/domain'
import { cn } from '@/lib/utils'

interface StatusSelectorProps {
  value: JobStatus
  onChange: (status: JobStatus) => void
  disabled?: boolean
}

export function StatusSelector({ value, onChange, disabled }: StatusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {JOB_STATUSES.map(status => {
        const cfg = JOB_STATUS_CONFIG[status]
        const active = value === status
        return (
          <button
            key={status}
            type="button"
            disabled={disabled}
            onClick={() => onChange(status)}
            className={cn(
              'h-10 px-3 rounded-xl text-sm font-medium transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed',
              active
                ? 'border-current shadow-sm'
                : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
            style={active ? { color: cfg.color, backgroundColor: cfg.bgColor, borderColor: cfg.color } : undefined}
          >
            {cfg.label}
          </button>
        )
      })}
    </div>
  )
}
