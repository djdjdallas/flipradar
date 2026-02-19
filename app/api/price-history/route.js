import { createServiceClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { profile } = auth
    const tier = profile?.tier || 'free'

    // Tier gate: Flipper and Pro only
    if (tier === 'free') {
      return NextResponse.json(
        { error: 'Price history requires Flipper or Pro plan' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const days = parseInt(searchParams.get('days') || '30')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
    }

    const cleanQuery = query.trim().toLowerCase()
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const serviceClient = await createServiceClient()

    const { data: history, error } = await serviceClient
      .from('price_history')
      .select('recorded_at, price_low, price_high, price_avg, price_median, sample_count, source')
      .eq('search_query', cleanQuery)
      .gte('recorded_at', since)
      .order('recorded_at', { ascending: true })

    if (error) {
      console.error('[FlipChecker API] Price history fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 })
    }

    return NextResponse.json({
      query: cleanQuery,
      days,
      history: (history || []).map(row => ({
        date: row.recorded_at.split('T')[0],
        low: row.price_low,
        high: row.price_high,
        avg: row.price_avg,
        median: row.price_median,
        samples: row.sample_count,
        source: row.source
      }))
    })
  } catch (error) {
    console.error('[FlipChecker API] Price history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
