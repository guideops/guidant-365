import { Badge, PriorityDot } from '@/components/ui/Badge'
import { JOB_PRIORITY_CONFIG } from '@/types/domain'
import type { JobPriority } from '@/types/domain'

export function JobPriorityBadge({ priority }: { priority: JobPriority }) {
  const cfg = JOB_PRIORITY_CONFIG[priority]
  return (
    <Badge style={{ color: cfg.color, backgroundColor: cfg.bgColor }} className="gap-1.5">
      <PriorityDot priority={priority} />
      {cfg.label}
    </Badge>
  )
}
