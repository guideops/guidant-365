'use client'

import { useEffect, useCallback } from 'react'
import { getOfflineDrafts, removeOfflineDraft } from '@/lib/indexeddb'

export function useOfflineQueue(onFlush?: (draft: { id: string; type: string; payload: Record<string, unknown> }) => Promise<void>) {
  const flush = useCallback(async () => {
    if (!onFlush) return
    const drafts = await getOfflineDrafts()
    for (const draft of drafts) {
      try {
        await onFlush(draft)
        await removeOfflineDraft(draft.id)
      } catch {
        // leave in queue — will retry next time online
      }
    }
  }, [onFlush])

  useEffect(() => {
    const handleOnline = () => flush()
    window.addEventListener('online', handleOnline)
    if (navigator.onLine) flush()
    return () => window.removeEventListener('online', handleOnline)
  }, [flush])

  return { flush, isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true }
}
