import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  if (isNaN(num)) return '£0.00'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(num)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
  } catch {
    return '—'
  }
}

export function formatDateInput(date: string | Date | null | undefined): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = new Date(date)
    const now = new Date()
    const diffMs = d.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays <= 7) return `In ${diffDays} days`
    return formatDate(date)
  } catch {
    return '—'
  }
}

export function isOverdue(date: string | Date | null | undefined): boolean {
  if (!date) return false
  try {
    return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))
  } catch {
    return false
  }
}

export function isDueSoon(date: string | Date | null | undefined, days = 7): boolean {
  if (!date) return false
  try {
    const d = new Date(date)
    const now = new Date()
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    return d >= now && d <= future
  } catch {
    return false
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function advanceDate(date: string, interval: 'weekly' | 'monthly' | 'yearly'): string {
  const d = new Date(date)
  if (interval === 'weekly') d.setDate(d.getDate() + 7)
  if (interval === 'monthly') d.setMonth(d.getMonth() + 1)
  if (interval === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}
