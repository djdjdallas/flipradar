import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchEbayActiveListings, generateEbaySearchUrl } from '@/lib/ebay'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query, category } = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 })
    }

    const cleanQuery = query.trim().toLowerCase()

    // Get user profile for tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, lookups_used_today, lookups_reset_at')
      .eq('id', user.id)
      .single()

    // Check usage limits using RPC
    const serviceClient = await createServiceClient()
    const { data: usageResult, error: usageError } = await serviceClient.rpc('increment_usage', {
      p_user_id: user.id,
      p_action: 'price_lookup'
    })

    if (usageError) {
      console.error('Usage check error:', usageError)
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

    if (cached) {
      return NextResponse.json({
        source: cached.source,
        cached: true,
        query: cleanQuery,
        prices: {
          low: cached.price_low,
          high: cached.price_high,
          avg: cached.price_avg,
          median: cached.price_median,
          sample_count: cached.sample_count
        },
        samples: cached.raw_data || [],
        ebay_search_url: generateEbaySearchUrl(cleanQuery, false),
        usage: usageResult
      })
    }

    // Fetch fresh data based on tier
    let priceData

    switch (dataSource) {
      case 'ebay_active_pro':
        // Pro tier - more results, tighter estimate
        priceData = await fetchEbayActiveListings(cleanQuery, category, 100) // More results
        priceData = applySellingDiscount(priceData, 0.10) // Smaller discount = tighter estimate
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

    return NextResponse.json({
      source: priceData.source || dataSource,
      cached: false,
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
      usage: usageResult
    })

  } catch (error) {
    console.error('Price lookup error:', error)
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
