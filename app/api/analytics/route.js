import { createServiceClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const auth = await authenticateRequest(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { user, profile } = auth
    const tier = profile?.tier || 'free'

    // Pro only
    if (tier !== 'pro') {
      return NextResponse.json(
        { error: 'Advanced analytics requires Pro plan' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '90')
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const serviceClient = await createServiceClient()

    const { data: deals, error } = await serviceClient
      .from('deals')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', since)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[FlipChecker API] Analytics fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
    }

    const allDeals = deals || []

    // Summary stats
    const soldDeals = allDeals.filter(d => d.status === 'sold' && d.actual_profit != null)
    const totalProfit = soldDeals.reduce((sum, d) => sum + (d.actual_profit || 0), 0)
    const totalInvested = soldDeals.reduce((sum, d) => sum + (d.purchase_price || d.user_asking_price || 0), 0)
    const totalRevenue = soldDeals.reduce((sum, d) => sum + (d.sold_price || 0), 0)
    const avgProfit = soldDeals.length > 0 ? totalProfit / soldDeals.length : 0
    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

    const summary = {
      totalDeals: allDeals.length,
      soldCount: soldDeals.length,
      totalProfit: round(totalProfit),
      avgProfit: round(avgProfit),
      roi: round(roi),
      totalInvested: round(totalInvested),
      totalRevenue: round(totalRevenue)
    }

    // Profit distribution histogram
    const buckets = [
      { range: '< -$50', min: -Infinity, max: -50 },
      { range: '-$50–$0', min: -50, max: 0 },
      { range: '$0–$25', min: 0, max: 25 },
      { range: '$25–$50', min: 25, max: 50 },
      { range: '$50–$100', min: 50, max: 100 },
      { range: '$100–$200', min: 100, max: 200 },
      { range: '$200+', min: 200, max: Infinity }
    ]

    const profitDistribution = buckets.map(b => ({
      range: b.range,
      count: soldDeals.filter(d => d.actual_profit >= b.min && d.actual_profit < b.max).length
    }))

    // Category breakdown
    const categoryMap = {}
    for (const deal of allDeals) {
      const cat = deal.category || 'Uncategorized'
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, deals: 0, profit: 0, sold: 0 }
      }
      categoryMap[cat].deals++
      if (deal.status === 'sold' && deal.actual_profit != null) {
        categoryMap[cat].profit += deal.actual_profit
        categoryMap[cat].sold++
      }
    }
    const categoryBreakdown = Object.values(categoryMap)
      .map(c => ({
        ...c,
        profit: round(c.profit),
        avgProfit: c.sold > 0 ? round(c.profit / c.sold) : 0
      }))
      .sort((a, b) => b.profit - a.profit)

    // Weekly trends
    const weekMap = {}
    for (const deal of allDeals) {
      const date = new Date(deal.created_at)
      // Get Monday of the week
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(date)
      monday.setDate(diff)
      const weekKey = monday.toISOString().split('T')[0]

      if (!weekMap[weekKey]) {
        weekMap[weekKey] = { date: weekKey, deals: 0, profit: 0 }
      }
      weekMap[weekKey].deals++
      if (deal.status === 'sold' && deal.actual_profit != null) {
        weekMap[weekKey].profit += deal.actual_profit
      }
    }
    const weeklyTrends = Object.values(weekMap)
      .map(w => ({ ...w, profit: round(w.profit) }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Best and worst deals
    const bestDeals = [...soldDeals]
      .sort((a, b) => (b.actual_profit || 0) - (a.actual_profit || 0))
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        title: d.user_title,
        profit: d.actual_profit,
        purchasePrice: d.purchase_price || d.user_asking_price,
        soldPrice: d.sold_price
      }))

    const worstDeals = [...soldDeals]
      .sort((a, b) => (a.actual_profit || 0) - (b.actual_profit || 0))
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        title: d.user_title,
        profit: d.actual_profit,
        purchasePrice: d.purchase_price || d.user_asking_price,
        soldPrice: d.sold_price
      }))

    return NextResponse.json({
      days,
      summary,
      profitDistribution,
      categoryBreakdown,
      weeklyTrends,
      bestDeals,
      worstDeals
    })
  } catch (error) {
    console.error('[FlipChecker API] Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function round(num) {
  return Math.round(num * 100) / 100
}
