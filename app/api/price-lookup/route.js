import { createClient, createServiceClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { fetchEbayActiveListings, generateEbaySearchUrl } from '@/lib/ebay'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(request) {
  try {
    // Support both session and API key auth
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user, profile } = auth
    const supabase = await createClient()

    const body = await request.json()
    const { query, category, dealId } = body

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 })
    }

    const cleanQuery = query.trim().toLowerCase()

    // Check usage limits using RPC
    const serviceClient = await createServiceClient()
    const { data: usageResult, error: usageError } = await serviceClient.rpc('increment_usage', {
      p_user_id: user.id,
      p_action: 'price_lookup'
    })

    if (usageError) {
      console.error('[FlipChecker API] Usage check error:', usageError)
      return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 })
    }

    if (!usageResult.allowed) {
      return NextResponse.json({
        error: 'Daily limit reached',
        usage: usageResult
      }, { status: 429 })
    }

    // Determine data source based on tier
    const dataSource = getDataSourceForTier(profile?.tier || 'free')

    // Check cache first
    const { data: cached } = await supabase
      .from('price_cache')
      .select('*')
      .eq('search_query', cleanQuery)
      .eq('source', dataSource)
      .gt('expires_at', new Date().toISOString())
      .single()

    let priceData
    let isCached = false

    if (cached) {
      isCached = true
      priceData = {
        source: cached.source,
        low: cached.price_low,
        high: cached.price_high,
        avg: cached.price_avg,
        median: cached.price_median,
        sample_count: cached.sample_count,
        samples: cached.raw_data || []
      }
    } else {
      // Fetch fresh data based on tier
      switch (dataSource) {
        case 'ebay_active_pro':
          // Pro tier - more results, tighter estimate
          priceData = await fetchEbayActiveListings(cleanQuery, category, 100)
          priceData = applySellingDiscount(priceData, 0.10)
          priceData.source = 'ebay_active_pro'
          break

        case 'ebay_active':
          // Flipper tier - active listings with discount
          priceData = await fetchEbayActiveListings(cleanQuery, category)
          priceData = applySellingDiscount(priceData, 0.15)
          break

        default:
          // Free tier - basic estimate from active listings
          priceData = await fetchEbayActiveListings(cleanQuery, category)
          priceData = applySellingDiscount(priceData, 0.20)
          priceData.source = 'estimate'
      }

      // Cache the result
      if (priceData.sample_count > 0) {
        await serviceClient
          .from('price_cache')
          .upsert({
            search_query: cleanQuery,
            category: category || null,
            source: dataSource,
            sample_count: priceData.sample_count,
            price_low: priceData.low,
            price_high: priceData.high,
            price_avg: priceData.avg,
            price_median: priceData.median,
            raw_data: priceData.samples?.slice(0, 10),
            fetched_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }, {
            onConflict: 'search_query,category,source'
          })
      }
    }

    // If dealId provided, update the deal with price data
    let dealUpdated = false
    if (dealId && priceData.sample_count > 0) {
      try {
        // Get current deal to calculate profit
        const { data: currentDeal } = await serviceClient
          .from('deals')
          .select('user_asking_price')
          .eq('id', dealId)
          .eq('user_id', user.id)
          .single()

        if (currentDeal) {
          const feeMultiplier = 0.87 // Account for eBay fees (~13%)
          const askingPrice = currentDeal.user_asking_price

          const updates = {
            ebay_estimate_low: priceData.low,
            ebay_estimate_high: priceData.high,
            ebay_estimate_avg: priceData.avg,
            ebay_sold_count: priceData.sample_count,
            ebay_search_url: generateEbaySearchUrl(cleanQuery, false),
            updated_at: new Date().toISOString()
          }

          // Calculate profit if we have asking price
          if (askingPrice && priceData.low) {
            updates.estimated_profit_low = Math.round((priceData.low * feeMultiplier - askingPrice) * 100) / 100
            updates.estimated_profit_high = priceData.high
              ? Math.round((priceData.high * feeMultiplier - askingPrice) * 100) / 100
              : updates.estimated_profit_low
          }

          const { error: updateError } = await serviceClient
            .from('deals')
            .update(updates)
            .eq('id', dealId)
            .eq('user_id', user.id)

          if (updateError) {
            console.error('[FlipChecker API] Deal update error:', updateError)
          } else {
            dealUpdated = true
          }
        }
      } catch (dealErr) {
        console.error('[FlipChecker API] Deal update failed:', dealErr)
        // Don't fail the whole request if deal update fails
      }
    }

    // Track price lookup completed event
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: user.id,
      event: 'price_lookup_completed',
      properties: {
        query: cleanQuery,
        tier: profile?.tier || 'free',
        data_source: dataSource,
        cached: isCached,
        sample_count: priceData.sample_count,
        deal_updated: dealUpdated
      }
    })

    return NextResponse.json({
      source: priceData.source || dataSource,
      cached: isCached,
      query: cleanQuery,
      prices: {
        low: priceData.low,
        high: priceData.high,
        avg: priceData.avg,
        median: priceData.median,
        sample_count: priceData.sample_count
      },
      samples: priceData.samples?.slice(0, 5),
      ebay_search_url: generateEbaySearchUrl(cleanQuery, false),
      usage: usageResult,
      dealUpdated
    })

  } catch (error) {
    console.error('[FlipChecker API] Price lookup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDataSourceForTier(tier) {
  switch (tier) {
    case 'pro':
      return 'ebay_active_pro'
    case 'flipper':
      return 'ebay_active'
    default:
      return 'estimate'
  }
}

function applySellingDiscount(priceData, discount = 0.17) {
  // Active listings typically sell for 15-20% less
  const multiplier = 1 - discount
  return {
    ...priceData,
    low: priceData.low ? round(priceData.low * multiplier) : null,
    high: priceData.high ? round(priceData.high * multiplier) : null,
    avg: priceData.avg ? round(priceData.avg * multiplier) : null,
    median: priceData.median ? round(priceData.median * multiplier) : null,
    is_estimate: true
  }
}

function round(num) {
  return Math.round(num * 100) / 100
}
