import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold text-slate-200 dark:text-slate-800">404</p>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
        <p className="text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard">
          <Button variant="primary" size="lg">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
