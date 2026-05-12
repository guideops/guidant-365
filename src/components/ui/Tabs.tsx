'use client'

import { useState } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '')

  return (
    <TabsPrimitive.Root value={active} onValueChange={setActive} className={className}>
      <TabsPrimitive.List className="flex border-b border-slate-200 dark:border-slate-700 gap-1 overflow-x-auto scrollbar-none">
        {tabs.map(tab => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 border-b-2 border-transparent transition-colors shrink-0',
              'hover:text-slate-900 dark:hover:text-slate-100',
              'data-[state=active]:text-blue-700 data-[state=active]:border-blue-700 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map(tab => (
        <TabsPrimitive.Content key={tab.id} value={tab.id} className="pt-4">
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
