import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - List user's deals
export async function GET(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('deals')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: deals, count, error } = await query

    if (error) {
      console.error('Deals fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      deals: deals || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('Deals GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Save new deal
export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required field
    if (!body.source_url) {
      return NextResponse.json({
        error: 'Missing required field: source_url'
      }, { status: 400 })
    }

    // Get user profile to check deal limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, deals_saved_count')
      .eq('id', user.id)
      .single()

    // Check deal limit based on tier
    const limits = { free: 25, flipper: 500, pro: -1 }
    const limit = limits[profile?.tier] || 25

    if (limit > 0 && (profile?.deals_saved_count || 0) >= limit) {
      return NextResponse.json({
        error: 'Deal limit reached',
        limit,
        tier: profile?.tier || 'free'
      }, { status: 403 })
    }

    // Calculate estimated profit
    let estimatedProfitLow = null
    let estimatedProfitHigh = null

    if (body.user_asking_price && body.ebay_estimate_low) {
      const feeMultiplier = 0.87
      estimatedProfitLow = Math.round((body.ebay_estimate_low * feeMultiplier - body.user_asking_price) * 100) / 100
      estimatedProfitHigh = body.ebay_estimate_high
        ? Math.round((body.ebay_estimate_high * feeMultiplier - body.user_asking_price) * 100) / 100
        : estimatedProfitLow
    }

    // Insert deal with ONLY compliant fields
    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        source_url: body.source_url,
        user_title: body.user_title || 'Untitled Deal',
        user_asking_price: body.user_asking_price || null,
        ebay_estimate_low: body.ebay_estimate_low || null,
        ebay_estimate_high: body.ebay_estimate_high || null,
        ebay_estimate_avg: body.ebay_estimate_avg || null,
        ebay_search_url: body.ebay_search_url || null,
        estimated_profit_low: estimatedProfitLow,
        estimated_profit_high: estimatedProfitHigh,
        notes: body.notes || null
      })
      .select()
      .single()

    if (error) {
      console.error('Deal insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Increment deals_saved_count
    const serviceClient = await createServiceClient()
    await serviceClient
      .from('profiles')
      .update({ deals_saved_count: (profile?.deals_saved_count || 0) + 1 })
      .eq('id', user.id)

    return NextResponse.json({ deal })

  } catch (error) {
    console.error('Deals POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update deal
export async function PATCH(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing deal ID' }, { status: 400 })
    }

    // Calculate actual profit if marking as sold
    if (updates.status === 'sold' && updates.sold_price !== undefined) {
      // Get current deal to get purchase_price
      const { data: currentDeal } = await supabase
        .from('deals')
        .select('purchase_price, user_asking_price')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      const purchasePrice = updates.purchase_price || currentDeal?.purchase_price || currentDeal?.user_asking_price
      if (purchasePrice && updates.sold_price) {
        // Account for eBay fees (~13%) and PayPal (~3%)
        const netSoldPrice = updates.sold_price * 0.84
        updates.actual_profit = Math.round((netSoldPrice - purchasePrice) * 100) / 100
      }
    }

    // Update deal
    const { data: deal, error } = await supabase
      .from('deals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Deal update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ deal })

  } catch (error) {
    console.error('Deals PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove deal
export async function DELETE(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing deal ID' }, { status: 400 })
    }

    // Delete deal
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Deal delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Decrement deals_saved_count
    const serviceClient = await createServiceClient()
    await serviceClient.rpc('decrement_deal_count', { p_user_id: user.id })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Deals DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
