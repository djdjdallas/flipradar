import { authenticateRequest } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/alerts/match — save a match to alert_matches table
export async function POST(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const body = await request.json()

    const { alert_id, listing_title, listing_price, source_url } = body

    if (!alert_id) {
      return NextResponse.json({ error: 'Missing alert_id' }, { status: 400 })
    }

    const serviceClient = await createServiceClient()

    // Insert match
    const { data: match, error } = await serviceClient
      .from('alert_matches')
      .insert({
        alert_id,
        user_id: user.id,
        listing_title: listing_title || null,
        listing_price: listing_price || null,
        source_url: source_url || null
      })
      .select()
      .single()

    if (error) {
      console.error('[FlipChecker API] Alert match insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Increment times_triggered on the alert
    await serviceClient.rpc('increment_alert_triggers', { p_alert_id: alert_id }).catch(() => {
      // If RPC doesn't exist, do a manual update
      return serviceClient
        .from('alerts')
        .update({ times_triggered: serviceClient.raw('times_triggered + 1') })
        .eq('id', alert_id)
    })

    return NextResponse.json({ match })
  } catch (error) {
    console.error('[FlipChecker API] Alert match POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
