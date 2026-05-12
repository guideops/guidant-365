'use client'

import { useRef, useState } from 'react'
import { Upload, Check, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useCustomers } from '@/hooks/useCustomers'
import { parseCSVContacts } from '@/lib/export/csv'
import { useToast } from '@/providers/ToastProvider'

interface CSVImportProps {
  open: boolean
  onClose: () => void
}

interface ParsedContact {
  name: string
  email?: string
  phone?: string
  address?: string
}

export function CSVImport({ open, onClose }: CSVImportProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [parsed, setParsed] = useState<ParsedContact[]>([])
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const { bulkCreateCustomers } = useCustomers()
  const { success, error: showError } = useToast()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    try {
      const contacts = await parseCSVContacts(file)
      if (contacts.length === 0) {
        setError('No valid contacts found. Make sure the CSV has a "name" column.')
        return
      }
      setParsed(contacts)
    } catch {
      setError('Failed to parse CSV file.')
    }
  }

  async function handleImport() {
    setImporting(true)
    try {
      await bulkCreateCustomers.mutateAsync(parsed)
      success(`Imported ${parsed.length} contacts`)
      setParsed([])
      onClose()
    } catch (e) {
      showError('Import failed', String(e))
    } finally {
      setImporting(false)
    }
  }

  function handleClose() {
    setParsed([])
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import Customers from CSV" size="lg">
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Upload a CSV file with columns: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">name</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">email</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">phone</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">address</code>
          </p>
          <Button size="md" variant="secondary" onClick={() => fileRef.current?.click()} className="mt-3">
            Choose file
          </Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {parsed.length > 0 && (
          <>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Preview ({parsed.length} contacts)
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-60">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-slate-600">Name</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600">Email</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsed.slice(0, 5).map((c, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">{c.name}</td>
                      <td className="px-3 py-2 text-slate-500">{c.email || '—'}</td>
                      <td className="px-3 py-2 text-slate-500">{c.phone || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsed.length > 5 && (
                <p className="text-xs text-slate-400 px-3 py-2 border-t border-slate-100 dark:border-slate-700">
                  … and {parsed.length - 5} more
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="lg" onClick={handleClose} icon={<X className="w-4 h-4" />}>Cancel</Button>
              <Button variant="primary" size="lg" loading={importing} icon={<Check className="w-4 h-4" />} onClick={handleImport}>
                Import {parsed.length} contacts
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
