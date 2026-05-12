'use client'

import { useState } from 'react'
import { downloadCSV, jobsToCSV, customersToCSV } from '@/lib/export/csv'
import { downloadPDF, generateJobPDF } from '@/lib/export/pdf'
import type { JobWithCustomer, Customer, JobDetail } from '@/types/domain'

export function useExport() {
  const [exporting, setExporting] = useState(false)

  async function exportJobsCSV(jobs: JobWithCustomer[]) {
    setExporting(true)
    try {
      const csv = jobsToCSV(jobs)
      downloadCSV(csv, `jobs-${new Date().toISOString().split('T')[0]}.csv`)
    } finally {
      setExporting(false)
    }
  }

  async function exportCustomersCSV(customers: Customer[]) {
    setExporting(true)
    try {
      const csv = customersToCSV(customers)
      downloadCSV(csv, `customers-${new Date().toISOString().split('T')[0]}.csv`)
    } finally {
      setExporting(false)
    }
  }

  async function exportJobPDF(job: JobDetail) {
    setExporting(true)
    try {
      const blob = generateJobPDF(job)
      downloadPDF(blob, `job-${job.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return { exportJobsCSV, exportCustomersCSV, exportJobPDF, exporting }
}
