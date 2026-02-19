'use client'

import { useState, useEffect } from 'react'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { Lock, Loader2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function PriceHistoryChart({ query, tier = 'free' }) {
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || tier === 'free') return
    fetchHistory()
  }, [query, tier])

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/price-history?query=${encodeURIComponent(query)}&days=30`)
      if (!res.ok) {
        setError('Failed to load price history')
        return
      }
      const data = await res.json()
      setHistory(data.history)
    } catch {
      setError('Failed to load price history')
    } finally {
      setLoading(false)
    }
  }

  // Locked state for free tier
  if (tier === 'free') {
    return (
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h3 className="heading-font text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price History
          </h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <Lock className="h-8 w-8 text-[#09090B]/30 mb-3" />
          <p className="font-bold mb-1">Price History Charts</p>
          <p className="text-sm text-[#09090B]/50 mb-4">
            Track price trends over time with historical data
          </p>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] hard-shadow-sm btn-brutal font-bold"
          >
            Upgrade to Flipper
          </Link>
        </div>
      </div>
    )
  }

  if (!query) return null

  if (loading) {
    return (
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h3 className="heading-font text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price History
          </h3>
        </div>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#D2E823]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
        <div className="p-4 border-b-2 border-[#09090B]">
          <h3 className="heading-font text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price History
          </h3>
        </div>
        <div className="p-4 text-sm text-red-600">{error}</div>
      </div>
    )
  }

  if (!history || history.length < 2) return null

  return (
    <div className="border-2 border-[#09090B] hard-shadow-sm bg-white">
      <div className="p-4 border-b-2 border-[#09090B]">
        <h3 className="heading-font text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Price History
        </h3>
        <p className="text-xs text-[#09090B]/50 mt-1">Last 30 days</p>
      </div>
      <div className="p-4">
        <AnalyticsChart
          data={history}
          type="line"
          dataKeys={['avg', 'low', 'high']}
          xAxisKey="date"
        />
      </div>
    </div>
  )
}
