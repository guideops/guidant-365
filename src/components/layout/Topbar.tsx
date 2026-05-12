'use client'

import { useState } from 'react'
import { Search, Moon, Sun, Menu, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTheme } from '@/providers/ThemeProvider'
import { useSupabase } from '@/providers/SupabaseProvider'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { GlobalSearch } from '@/components/dashboard/GlobalSearch'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useSupabase()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const userName = user?.user_metadata?.full_name ?? user?.email ?? 'User'

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center px-4 gap-3 shrink-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 h-10 flex-1 max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-slate-400 dark:text-slate-500 hover:border-blue-300 dark:hover:border-blue-700 transition-colors text-sm"
          aria-label="Search"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="hidden sm:block">Search jobs, customers…</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="User menu">
                <Avatar name={userName} size="sm" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <DropdownMenu.Item
                  onSelect={() => router.push('/settings')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer',
                    'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 outline-none'
                  )}
                >
                  <User className="w-4 h-4" />
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer',
                    'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 outline-none'
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
