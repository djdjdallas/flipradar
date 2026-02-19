'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { StatsCard } from '@/components/StatsCard'
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Package,
  Lock,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [profile, setProfile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(90)

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile?.tier === 'pro') {
      fetchAnalytics()
    }
  }, [profile, period])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: prof } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single()

    setProfile(prof)
    if (prof?.tier !== 'pro') {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?days=${period}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  // Lock screen for non-Pro
  if (!loading && profile?.tier !== 'pro') {
    return (
      <div className="space-y-6 max-w-4xl">
        <h1 className="heading-font text-3xl flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics
        </h1>

        <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Lock className="h-12 w-12 text-[#09090B]/20 mb-4" />
            <h2 className="heading-font text-2xl mb-2">Advanced Analytics</h2>
            <p className="text-[#09090B]/50 max-w-md mb-6">
              Track your flipping performance with profit distribution, category breakdowns,
              weekly trends, and your best and worst deals.
            </p>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold text-lg"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#D2E823]" />
      </div>
    )
  }

  const { summary, profitDistribution, categoryBreakdown, weeklyTrends, bestDeals, worstDeals } = data || {}

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header with period selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="heading-font text-3xl flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics
        </h1>
        <div className="flex gap-2">
          {[30, 90, 365].map(d => (
            <button
              key={d}
              className={`px-3 py-1.5 border-2 border-[#09090B] font-bold text-sm ${
                period === d
                  ? 'bg-[#09090B] text-[#D2E823]'
                  : 'bg-white text-[#09090B] hover:bg-[#F8F4E8]'
              }`}
              onClick={() => setPeriod(d)}
            >
              {d === 365 ? '1y' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Deals"
            value={summary.totalDeals}
            subtitle={`${summary.soldCount} sold`}
            icon={Package}
          />
          <StatsCard
            title="Total Profit"
            value={`$${summary.totalProfit.toLocaleString()}`}
            subtitle={`Avg $${summary.avgProfit.toFixed(2)}/deal`}
            icon={DollarSign}
          />
          <StatsCard
            title="ROI"
            value={`${summary.roi.toFixed(1)}%`}
            subtitle={`$${summary.totalInvested.toLocaleString()} invested`}
            icon={TrendingUp}
          />
          <StatsCard
            title="Revenue"
            value={`$${summary.totalRevenue.toLocaleString()}`}
            subtitle={`${summary.soldCount} sales`}
            icon={BarChart3}
          />
        </div>
      )}

      {/* Weekly Trends */}
      {weeklyTrends && weeklyTrends.length > 0 && (
        <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
          <div className="p-4 border-b-2 border-[#09090B]">
            <h2 className="heading-font text-lg">Weekly Trends</h2>
          </div>
          <div className="p-4">
            <AnalyticsChart
              data={weeklyTrends}
              type="bar"
              dataKeys={['deals', 'profit']}
              xAxisKey="date"
            />
          </div>
        </div>
      )}

      {/* Profit Distribution */}
      {profitDistribution && (
        <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
          <div className="p-4 border-b-2 border-[#09090B]">
            <h2 className="heading-font text-lg">Profit Distribution</h2>
          </div>
          <div className="p-4">
            <AnalyticsChart
              data={profitDistribution}
              type="bar"
              dataKeys={['count']}
              xAxisKey="range"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        {categoryBreakdown && categoryBreakdown.length > 0 && (
          <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
            <div className="p-4 border-b-2 border-[#09090B]">
              <h2 className="heading-font text-lg">By Category</h2>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#09090B]">
                    <th className="text-left py-2 font-bold uppercase text-xs tracking-wider">Category</th>
                    <th className="text-right py-2 font-bold uppercase text-xs tracking-wider">Deals</th>
                    <th className="text-right py-2 font-bold uppercase text-xs tracking-wider">Profit</th>
                    <th className="text-right py-2 font-bold uppercase text-xs tracking-wider">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map(cat => (
                    <tr key={cat.category} className="border-b border-[#09090B]/10">
                      <td className="py-2 font-medium">{cat.category}</td>
                      <td className="py-2 text-right">{cat.deals}</td>
                      <td className={`py-2 text-right font-bold ${cat.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${cat.profit.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-[#09090B]/50">${cat.avgProfit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Best & Worst Deals */}
        <div className="space-y-6">
          {bestDeals && bestDeals.length > 0 && (
            <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
              <div className="p-4 border-b-2 border-[#09090B]">
                <h2 className="heading-font text-lg">Best Deals</h2>
              </div>
              <div className="p-4 space-y-2">
                {bestDeals.map((deal, i) => (
                  <div key={deal.id} className="flex items-center justify-between py-2 border-b border-[#09090B]/10 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-[#09090B]/30">#{i + 1}</span>
                      <span className="truncate text-sm font-medium">{deal.title}</span>
                    </div>
                    <span className="text-green-600 font-bold text-sm shrink-0 ml-2">
                      +${deal.profit?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {worstDeals && worstDeals.length > 0 && (
            <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
              <div className="p-4 border-b-2 border-[#09090B]">
                <h2 className="heading-font text-lg">Worst Deals</h2>
              </div>
              <div className="p-4 space-y-2">
                {worstDeals.map((deal, i) => (
                  <div key={deal.id} className="flex items-center justify-between py-2 border-b border-[#09090B]/10 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-[#09090B]/30">#{i + 1}</span>
                      <span className="truncate text-sm font-medium">{deal.title}</span>
                    </div>
                    <span className={`font-bold text-sm shrink-0 ml-2 ${deal.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {deal.profit >= 0 ? '+' : ''}${deal.profit?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
