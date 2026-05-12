'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/providers/ToastProvider'

export function ExportPanel() {
  const [exporting, setExporting] = useState(false)
  const { error: showError } = useToast()

  async function download(type: 'jobs' | 'customers') {
    setExporting(true)
    try {
      const res = await fetch(`/api/export/csv?type=${type}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `guidant-${type}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      showError('Export failed', String(e))
    } finally {
      setExporting(false)
    }
  }

  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Export Data</h3>
        <p className="text-sm text-slate-500">Download your data as CSV files for use in spreadsheets.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<Download className="w-4 h-4" />}
            loading={exporting}
            onClick={() => download('jobs')}
          >
            Export Jobs (CSV)
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<Download className="w-4 h-4" />}
            loading={exporting}
            onClick={() => download('customers')}
          >
            Export Customers (CSV)
          </Button>
        </div>
      </div>
    </Card>
  )
}
