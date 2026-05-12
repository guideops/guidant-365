import type { Metadata } from 'next'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { GmailSettings } from '@/components/settings/GmailSettings'
import { AppearanceSettings } from '@/components/settings/AppearanceSettings'
import { ExportPanel } from '@/components/settings/ExportPanel'

export const metadata: Metadata = { title: 'Settings — Guidant 365' }

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      <ProfileForm />
      <GmailSettings />
      <AppearanceSettings />
      <ExportPanel />
    </div>
  )
}
