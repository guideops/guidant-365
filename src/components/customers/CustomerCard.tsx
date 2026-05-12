'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import type { Customer } from '@/types/domain'

interface CustomerCardProps {
  customer: Customer & { job_count?: number }
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link href={`/customers/${customer.id}`}>
      <Card className="hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
        <div className="p-4 flex gap-3">
          <Avatar name={customer.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{customer.name}</p>
            <div className="mt-1 space-y-0.5">
              {customer.email && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{customer.address}</span>
                </div>
              )}
            </div>
          </div>
          {customer.job_count !== undefined && (
            <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0 self-start mt-1">
              <Briefcase className="w-3 h-3" />
              <span>{customer.job_count}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
