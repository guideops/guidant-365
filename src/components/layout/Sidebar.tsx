'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, Calendar, Users, CheckCircle,
  RefreshCw, Settings, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle },
  { href: '/recurring', label: 'Recurring', icon: RefreshCw },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onClose?: () => void
  mobile?: boolean
  pendingApprovals?: number
}

export function Sidebar({ collapsed, onToggle, onClose, mobile, pendingApprovals = 0 }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-full bg-slate-900 dark:bg-slate-950 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-700 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-white font-semibold text-base truncate">Guidant 365</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-bold">G</span>
          </div>
        )}
        {mobile ? (
          <button onClick={onClose} className="text-slate-400 hover:text-white ml-auto" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white ml-auto p-1 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            const isPending = href === '/approvals' && pendingApprovals > 0
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center h-12 rounded-xl transition-colors relative',
                    collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium flex-1">{label}</span>}
                  {!collapsed && isPending && (
                    <span className="bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingApprovals > 9 ? '9+' : pendingApprovals}
                    </span>
                  )}
                  {collapsed && isPending && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
