'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { Job, Customer } from '@/types/domain'

interface SearchResults {
  jobs: (Job & { customer_name: string | null })[]
  customers: Customer[]
}

export function useFullTextSearch(query: string, debounceMs = 300) {
  const { user } = useSession()
  const supabase = getSupabaseBrowserClient()
  const [results, setResults] = useState<SearchResults>({ jobs: [], customers: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || !user) {
      setResults({ jobs: [], customers: [] })
      return
    }

    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const term = query.trim().split(/\s+/).join(' & ')
        const [jobsRes, custRes] = await Promise.all([
          supabase
            .from('jobs')
            .select('*, customer:customers(name)')
            .eq('user_id', user.id)
            .textSearch('fts', term)
            .limit(8),
          supabase
            .from('customers')
            .select('*')
            .eq('user_id', user.id)
            .textSearch('fts', term)
            .limit(5),
        ])
        setResults({
          jobs: (jobsRes.data ?? []).map(j => ({
            ...j,
            customer_name: (j.customer as { name: string } | null)?.name ?? null,
          })) as (Job & { customer_name: string | null })[],
          customers: (custRes.data ?? []) as Customer[],
        })
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(t)
  }, [query, user, debounceMs, supabase])

  return { results, loading }
}
