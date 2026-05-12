'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/providers/SupabaseProvider'
import { Spinner } from '@/components/ui/Spinner'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
