'use client'

import { useSupabase } from '@/providers/SupabaseProvider'

export function useSession() {
  const { user, session, loading } = useSupabase()
  return { user, session, loading, isAuthenticated: !!user }
}
