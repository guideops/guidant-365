import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

function advanceDate(date: string, interval: string): string {
  const d = new Date(date)
  if (interval === 'weekly') d.setDate(d.getDate() + 7)
  else if (interval === 'monthly') d.setMonth(d.getMonth() + 1)
  else if (interval === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

Deno.serve(async () => {
  const today = new Date().toISOString().slice(0, 10)

  const { data: due, error } = await supabase
    .from('recurring')
    .select('id, recurrence, next_date')
    .lte('next_date', today)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  let advanced = 0
  for (const item of (due ?? [])) {
    const next = advanceDate(item.next_date, item.recurrence)
    await supabase.from('recurring').update({ next_date: next }).eq('id', item.id)
    advanced++
  }

  return new Response(JSON.stringify({ advanced, checked: due?.length ?? 0 }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
