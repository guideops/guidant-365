import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { jobsToCSV, customersToCSV } from '@/lib/export/csv'
import type { JobWithCustomer } from '@/types/domain'

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const type = req.nextUrl.searchParams.get('type') ?? 'jobs'

  if (type === 'jobs') {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*, customer:customers(name, email)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const csv = jobsToCSV((jobs ?? []) as unknown as JobWithCustomer[])
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="guidant-jobs-${new Date().toISOString().slice(0,10)}.csv"`,
      },
    })
  }

  if (type === 'customers') {
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    const csv = customersToCSV(customers ?? [])
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="guidant-customers-${new Date().toISOString().slice(0,10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ error: 'type must be jobs or customers' }, { status: 400 })
}
