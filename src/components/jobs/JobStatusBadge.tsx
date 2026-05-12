import { Badge } from '@/components/ui/Badge'
import { JOB_STATUS_CONFIG } from '@/types/domain'
import type { JobStatus } from '@/types/domain'

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const cfg = JOB_STATUS_CONFIG[status]
  return (
    <Badge style={{ color: cfg.color, backgroundColor: cfg.bgColor }}>
      {cfg.label}
    </Badge>
  )
}
