'use client'

import { useMemo } from 'react'
import { Briefcase, AlertCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useJobs } from '@/hooks/useJobs'
import { isOverdue } from '@/lib/utils'

export function QuickStats() {
  const { jobs } = useJobs()

  const stats = useMemo(() => {
    const active = jobs.filter(j => !['archived', 'rejected'].includes(j.status))
    const overdue = active.filter(j => j.next_due && isOverdue(j.next_due))
    const inProgress = active.filter(j => j.status === 'in_progress' || j.status === 'awaiting_payment')
    return {
      active: active.length,
      overdue: overdue.length,
      inProgress: inProgress.length,
    }
  }, [jobs])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatCard
        icon={<Briefcase className="w-5 h-5" />}
        label="Active Jobs"
        value={stats.active}
        color="blue"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        label="In Progress"
        value={stats.inProgress}
        color="green"
      />
      <StatCard
        icon={<AlertCircle className="w-5 h-5" />}
        label="Overdue Actions"
        value={stats.overdue}
        color={stats.overdue > 0 ? 'red' : 'gray'}
      />
    </div>
  )
}

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
  gray: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: keyof typeof colorMap }) {
  return (
    <Card className="p-4">
      <div className={`inline-flex rounded-xl p-2.5 mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
    </Card>
  )
}
