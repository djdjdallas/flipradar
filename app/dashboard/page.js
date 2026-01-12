'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DealCard } from '@/components/DealCard'
import { StatsCard } from '@/components/StatsCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Package, DollarSign, TrendingUp, Loader2, RefreshCw } from 'lucide-react'

const statusFilters = ['all', 'watching', 'contacted', 'purchased', 'sold', 'passed']

export default function DashboardPage() {
  const [deals, setDeals] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({
    totalDeals: 0,
    totalProfit: 0,
    avgProfit: 0
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDeals()
  }, [filter])

  const fetchDeals = async () => {
    setLoading(true)

    try {
      const url = new URL('/api/deals', window.location.origin)
      if (filter !== 'all') {
        url.searchParams.set('status', filter)
      }
      url.searchParams.set('limit', '50')

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setDeals(data.deals || [])
        setTotal(data.total || 0)
        calculateStats(data.deals || [])
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (dealsList) => {
    const soldDeals = dealsList.filter(d => d.status === 'sold' && d.actual_profit !== null)
    const totalProfit = soldDeals.reduce((sum, d) => sum + (d.actual_profit || 0), 0)
    const avgProfit = soldDeals.length > 0 ? totalProfit / soldDeals.length : 0

    setStats({
      totalDeals: dealsList.length,
      totalProfit: Math.round(totalProfit * 100) / 100,
      avgProfit: Math.round(avgProfit * 100) / 100
    })
  }

  const handleUpdateDeal = async (id, updates) => {
    try {
      const response = await fetch('/api/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })

      if (response.ok) {
        fetchDeals()
      }
    } catch (error) {
      console.error('Failed to update deal:', error)
    }
  }

  const handleDeleteDeal = async (id) => {
    try {
      const response = await fetch(`/api/deals?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDeals()
      }
    } catch (error) {
      console.error('Failed to delete deal:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Deals</h1>
        <Button variant="outline" onClick={fetchDeals} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Deals"
          value={stats.totalDeals}
          icon={Package}
        />
        <StatsCard
          title="Total Profit"
          value={`$${stats.totalProfit}`}
          subtitle="From sold items"
          icon={DollarSign}
        />
        <StatsCard
          title="Avg. Profit"
          value={`$${stats.avgProfit}`}
          subtitle="Per sold item"
          icon={TrendingUp}
        />
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {statusFilters.map((status) => (
            <TabsTrigger key={status} value={status} className="capitalize">
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Deals List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No deals yet</h3>
          <p className="text-gray-500 mt-1">
            Save deals from Facebook Marketplace using the FlipRadar extension.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onUpdate={handleUpdateDeal}
              onDelete={handleDeleteDeal}
            />
          ))}
        </div>
      )}

      {/* Pagination info */}
      {total > deals.length && (
        <p className="text-center text-sm text-gray-500">
          Showing {deals.length} of {total} deals
        </p>
      )}
    </div>
  )
}
