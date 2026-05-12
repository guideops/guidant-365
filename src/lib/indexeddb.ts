'use client'

import { get, set, del, keys } from 'idb-keyval'

export interface OfflineDraft {
  id: string
  type: 'email_draft' | 'timeline_note'
  payload: Record<string, unknown>
  created_at: string
}

const DRAFT_KEY = 'offline-drafts'

export async function getOfflineDrafts(): Promise<OfflineDraft[]> {
  try {
    return (await get<OfflineDraft[]>(DRAFT_KEY)) ?? []
  } catch {
    return []
  }
}

export async function addOfflineDraft(draft: Omit<OfflineDraft, 'id' | 'created_at'>): Promise<void> {
  const drafts = await getOfflineDrafts()
  drafts.push({
    ...draft,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  })
  await set(DRAFT_KEY, drafts)
}

export async function removeOfflineDraft(id: string): Promise<void> {
  const drafts = await getOfflineDrafts()
  await set(DRAFT_KEY, drafts.filter(d => d.id !== id))
}

export async function clearOfflineDrafts(): Promise<void> {
  await del(DRAFT_KEY)
}

// Cache for offline reading
export async function cacheData(key: string, data: unknown): Promise<void> {
  try {
    await set(`cache-${key}`, { data, cached_at: new Date().toISOString() })
  } catch {}
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cached = await get<{ data: T; cached_at: string }>(`cache-${key}`)
    return cached?.data ?? null
  } catch {
    return null
  }
}

export async function getAllCacheKeys(): Promise<string[]> {
  try {
    const allKeys = await keys()
    return allKeys.filter(k => typeof k === 'string' && k.startsWith('cache-')) as string[]
  } catch {
    return []
  }
}
