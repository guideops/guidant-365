import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  outline: 'border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export function Badge({ children, className, style, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        variantClasses[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return (
    <Badge style={{ color, backgroundColor: bgColor }}>
      {label}
    </Badge>
  )
}

export function PriorityDot({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const colors = { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-slate-400' }
  return <span className={cn('inline-block w-2 h-2 rounded-full', colors[priority])} />
}
