'use client'

import { Sun, Moon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useDarkMode } from '@/hooks/useDarkMode'

export function AppearanceSettings() {
  const { isDark, toggleTheme } = useDarkMode()

  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark mode</p>
            <p className="text-xs text-slate-500 mt-0.5">Switch between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-brand' : 'bg-slate-200'}`}
            role="switch"
            aria-checked={isDark}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { if (isDark) toggleTheme() }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${!isDark ? 'border-brand text-brand bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            onClick={() => { if (!isDark) toggleTheme() }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${isDark ? 'border-brand text-brand bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
        </div>
      </div>
    </Card>
  )
}
