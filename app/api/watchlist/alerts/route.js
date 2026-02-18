import { createServiceClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

// ============================================================================
// GET - List user's watchlist alerts
// ============================================================================

export async function GET(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const dismissed = searchParams.get('dismissed')

    const serviceClient = await createServiceClient()

    let query = serviceClient
      .from('watchlist_alerts')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('found_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (dismissed === 'false') {
      query = query.eq('is_dismissed', false)
    } else if (dismissed === 'true') {
      query = query.eq('is_dismissed', true)
    }

    const { data: alerts, count, error } = await query

    if (error) {
      console.error('[FlipChecker API] Watchlist alerts fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      alerts: alerts || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('[FlipChecker API] Watchlist alerts GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// POST - Create watchlist alert (dedup by user_id + fb_listing_id)
// ============================================================================

export async function POST(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const body = await request.json()

    const { filter_id, listing_title, listing_price, ebay_avg_price, estimated_profit, listing_url, fb_listing_id } = body

    if (!filter_id || !listing_title || !listing_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const serviceClient = await createServiceClient()

    // Dedup: skip if alert already exists for this user + listing
    if (fb_listing_id) {
      const { data: existing } = await serviceClient
        .from('watchlist_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('fb_listing_id', fb_listing_id)
        .single()

      if (existing) {
        return NextResponse.json({ alert: existing, duplicate: true })
      }
    }

    const { data: alert, error } = await serviceClient
      .from('watchlist_alerts')
      .insert({
        user_id: user.id,
        filter_id,
        listing_title,
        listing_price,
        ebay_avg_price: ebay_avg_price || null,
        estimated_profit: estimated_profit || null,
        listing_url,
        fb_listing_id: fb_listing_id || null
      })
      .select()
      .single()

    if (error) {
      console.error('[FlipChecker API] Watchlist alert insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ alert })

  } catch (error) {
    console.error('[FlipChecker API] Watchlist alerts POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// DELETE - Remove alert(s)
// ============================================================================

export async function DELETE(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const all = searchParams.get('all')

    const serviceClient = await createServiceClient()

    if (all === 'true') {
      const { error } = await serviceClient
        .from('watchlist_alerts')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('[FlipChecker API] Watchlist alerts bulk delete error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing alert ID or all=true' }, { status: 400 })
    }

    const { error } = await serviceClient
      .from('watchlist_alerts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[FlipChecker API] Watchlist alert delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[FlipChecker API] Watchlist alerts DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
