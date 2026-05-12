'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

type ToastVariant = 'default' | 'success' | 'error' | 'warning'

interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((opts: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { ...opts, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const success = useCallback((title: string, description?: string) => toast({ title, description, variant: 'success' }), [toast])
  const error = useCallback((title: string, description?: string) => toast({ title, description, variant: 'error' }), [toast])
  const warning = useCallback((title: string, description?: string) => toast({ title, description, variant: 'warning' }), [toast])

  const variantStyles: Record<ToastVariant, string> = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800',
    error: 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800',
    warning: 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800',
  }

  return (
    <ToastContext.Provider value={{ toast, success, error, warning }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map(t => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(
              'flex flex-col gap-1 p-4 rounded-xl shadow-lg w-80 text-sm',
              variantStyles[t.variant ?? 'default']
            )}
          >
            <ToastPrimitive.Title className="font-semibold text-slate-900 dark:text-slate-100">
              {t.title}
            </ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className="text-slate-600 dark:text-slate-400">
                {t.description}
              </ToastPrimitive.Description>
            )}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 w-80" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
