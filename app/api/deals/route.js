import { createClient, createServiceClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Detect if payload is new extension format or old format
 * New format has itemId, extractionMethod, or uses camelCase for keys
 */
function isNewExtensionFormat(body) {
  return (
    body.itemId !== undefined ||
    body.extractionMethod !== undefined ||
    body.sellerName !== undefined ||
    body.priceData !== undefined
  )
}

/**
 * Normalize payload to database-ready format
 * Handles both old format (snake_case) and new extension format (camelCase)
 */
function normalizePayload(body, isNewFormat) {
  if (!isNewFormat) {
    // Old format - return as-is (already uses snake_case)
    return {
      source_url: body.source_url,
      user_title: body.user_title,
      user_asking_price: parsePrice(body.user_asking_price),
      ebay_estimate_low: body.ebay_estimate_low,
      ebay_estimate_high: body.ebay_estimate_high,
      ebay_estimate_avg: body.ebay_estimate_avg,
      ebay_search_url: body.ebay_search_url,
      notes: body.notes
    }
  }

  // New extension format - map camelCase to snake_case
  const price = parsePrice(body.price)

  return {
    // Core fields
    source_url: body.url,
    fb_listing_id: body.itemId || null,
    user_title: body.title || 'Untitled Deal',
    listing_title: body.title || null,
    user_asking_price: price,
    listing_price: price,

    // Additional listing details
    location: body.location || null,
    seller_name: body.sellerName || null,
    condition: body.condition || null,
    description: body.description || null,
    images: body.images || null,

    // Extraction metadata
    extraction_method: body.extractionMethod || null,
    selectors_used: body.selectorsUsed || null,

    // Price data if provided by extension
    ebay_estimate_low: body.priceData?.ebayLow || body.ebay_estimate_low || null,
    ebay_estimate_high: body.priceData?.ebayHigh || body.ebay_estimate_high || null,
    ebay_estimate_avg: body.priceData?.ebayAvg || body.ebay_estimate_avg || null,
    ebay_sold_count: body.priceData?.soldCount || null,
    ebay_search_url: body.ebay_search_url || null,

    notes: body.notes || null
  }
}

/**
 * Parse price from various formats (string or number)
 */
function parsePrice(priceValue) {
  if (priceValue === null || priceValue === undefined) return null
  if (typeof priceValue === 'number') return priceValue

  // Remove currency symbols and parse
  const cleaned = String(priceValue).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

/**
 * Calculate estimated profit based on asking price and eBay estimates
 */
function calculateEstimatedProfit(askingPrice, ebayLow, ebayHigh) {
  if (!askingPrice || !ebayLow) {
    return { low: null, high: null }
  }

  const feeMultiplier = 0.87 // Account for eBay fees (~13%)

  const low = Math.round((ebayLow * feeMultiplier - askingPrice) * 100) / 100
  const high = ebayHigh
    ? Math.round((ebayHigh * feeMultiplier - askingPrice) * 100) / 100
    : low

  return { low, high }
}

// ============================================================================
// GET - List user's deals
// ============================================================================

export async function GET(request) {
  try {
    // Support both session and API key auth
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const supabase = await createClient()

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
      console.error('[FlipChecker API] Deals fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      deals: deals || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('[FlipChecker API] Deals GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// POST - Save new deal (supports both old and new extension formats)
// ============================================================================

export async function POST(request) {
  try {
    // Support both session and API key auth
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user, profile } = auth
    const body = await request.json()

    // Detect format and normalize
    const isNewFormat = isNewExtensionFormat(body)
    const normalized = normalizePayload(body, isNewFormat)

    // Validate required field
    if (!normalized.source_url) {
      return NextResponse.json({
        error: 'Missing required field: source_url (or url for new format)'
      }, { status: 400 })
    }

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
    const profit = calculateEstimatedProfit(
      normalized.user_asking_price,
      normalized.ebay_estimate_low,
      normalized.ebay_estimate_high
    )

    const serviceClient = await createServiceClient()

    // Prepare insert data
    const insertData = {
      user_id: user.id,
      source_url: normalized.source_url,
      fb_listing_id: normalized.fb_listing_id,
      user_title: normalized.user_title || 'Untitled Deal',
      listing_title: normalized.listing_title,
      user_asking_price: normalized.user_asking_price,
      listing_price: normalized.listing_price,
      location: normalized.location,
      seller_name: normalized.seller_name,
      condition: normalized.condition,
      description: normalized.description,
      images: normalized.images,
      extraction_method: normalized.extraction_method,
      selectors_used: normalized.selectors_used,
      ebay_estimate_low: normalized.ebay_estimate_low,
      ebay_estimate_high: normalized.ebay_estimate_high,
      ebay_estimate_avg: normalized.ebay_estimate_avg,
      ebay_sold_count: normalized.ebay_sold_count,
      ebay_search_url: normalized.ebay_search_url,
      estimated_profit_low: profit.low,
      estimated_profit_high: profit.high,
      notes: normalized.notes
    }

    let deal, error, isUpdate = false

    // If fb_listing_id provided, use upsert to prevent duplicates
    if (normalized.fb_listing_id) {
      // Check if deal already exists for this user and fb_listing_id
      const { data: existingDeal } = await serviceClient
        .from('deals')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('fb_listing_id', normalized.fb_listing_id)
        .single()

      if (existingDeal) {
        // Update existing deal
        isUpdate = true
        const result = await serviceClient
          .from('deals')
          .update({
            ...insertData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDeal.id)
          .eq('user_id', user.id)
          .select()
          .single()

        deal = result.data
        error = result.error
      } else {
        // Insert new deal
        const result = await serviceClient
          .from('deals')
          .insert(insertData)
          .select()
          .single()

        deal = result.data
        error = result.error

        // Only increment count for new inserts
        if (!error && deal) {
          await serviceClient
            .from('profiles')
            .update({ deals_saved_count: (profile?.deals_saved_count || 0) + 1 })
            .eq('id', user.id)
        }
      }
    } else {
      // No fb_listing_id - standard insert
      const result = await serviceClient
        .from('deals')
        .insert(insertData)
        .select()
        .single()

      deal = result.data
      error = result.error

      if (!error && deal) {
        await serviceClient
          .from('profiles')
          .update({ deals_saved_count: (profile?.deals_saved_count || 0) + 1 })
          .eq('id', user.id)
      }
    }

    if (error) {
      console.error('[FlipChecker API] Deal insert/upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      deal,
      isUpdate,
      format: isNewFormat ? 'extension' : 'legacy'
    })

  } catch (error) {
    console.error('[FlipChecker API] Deals POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// PATCH - Update deal
// ============================================================================

export async function PATCH(request) {
  try {
    // Support both session and API key auth
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const supabase = await createClient()
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
      console.error('[FlipChecker API] Deal update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ deal })

  } catch (error) {
    console.error('[FlipChecker API] Deals PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// DELETE - Remove deal
// ============================================================================

export async function DELETE(request) {
  try {
    // Support both session and API key auth
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user } = auth
    const supabase = await createClient()

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
      console.error('[FlipChecker API] Deal delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Decrement deals_saved_count
    const serviceClient = await createServiceClient()
    await serviceClient.rpc('decrement_deal_count', { p_user_id: user.id })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[FlipChecker API] Deals DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
