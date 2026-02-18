import { createServiceClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

// ============================================================================
// GET - List user's watchlist filters
// ============================================================================

export async function GET(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const serviceClient = await createServiceClient()

    const { data: filters, error } = await serviceClient
      .from('watchlist_filters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[FlipChecker API] Watchlist filters fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ filters: filters || [] })

  } catch (error) {
    console.error('[FlipChecker API] Watchlist filters GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// POST - Create new watchlist filter
// ============================================================================

export async function POST(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user, profile } = auth
    const body = await request.json()

    // Validate required fields
    const { keywords, max_buy_price, min_profit, location_radius } = body

    if (!keywords || typeof keywords !== 'string' || !keywords.trim()) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 })
    }

    if (max_buy_price === undefined || max_buy_price === null || max_buy_price <= 0) {
      return NextResponse.json({ error: 'Max buy price must be greater than 0' }, { status: 400 })
    }

    if (min_profit === undefined || min_profit === null || min_profit < 0) {
      return NextResponse.json({ error: 'Min profit must be 0 or greater' }, { status: 400 })
    }

    // Check tier-based filter limits
    const limits = { free: 3, flipper: 10, pro: -1 }
    const tier = profile?.tier || 'free'
    const limit = limits[tier] || 3

    const serviceClient = await createServiceClient()

    if (limit > 0) {
      const { count } = await serviceClient
        .from('watchlist_filters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (count >= limit) {
        return NextResponse.json({
          error: 'Watchlist filter limit reached',
          limit,
          tier
        }, { status: 403 })
      }
    }

    const { data: filter, error } = await serviceClient
      .from('watchlist_filters')
      .insert({
        user_id: user.id,
        keywords: keywords.trim(),
        max_buy_price,
        min_profit,
        location_radius: location_radius || null
      })
      .select()
      .single()

    if (error) {
      console.error('[FlipChecker API] Watchlist filter insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ filter })

  } catch (error) {
    console.error('[FlipChecker API] Watchlist filters POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// DELETE - Remove watchlist filter (cascades to alerts)
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

    if (!id) {
      return NextResponse.json({ error: 'Missing filter ID' }, { status: 400 })
    }

    const serviceClient = await createServiceClient()

    const { error } = await serviceClient
      .from('watchlist_filters')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[FlipChecker API] Watchlist filter delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[FlipChecker API] Watchlist filters DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
