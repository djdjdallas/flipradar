import { authenticateRequest } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/alerts — return user's active alerts (used by extension)
export async function GET(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const supabase = await createClient()

    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('id, search_query, max_price, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (error) {
      console.error('[FlipChecker API] Alerts fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ alerts: alerts || [] })
  } catch (error) {
    console.error('[FlipChecker API] Alerts GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
