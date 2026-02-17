import { createServiceClient } from '@/lib/supabase/server'
import { getDAU, getWAU, getReferrers, getErrors, getKeyEvents } from '@/lib/posthog-api'
import { StatsCard } from '@/components/StatsCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, ShoppingBag, Crown, Activity } from 'lucide-react'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { TierBreakdown } from '@/components/admin/TierBreakdown'
import { ReferrersTable } from '@/components/admin/ReferrersTable'
import { ErrorsList } from '@/components/admin/ErrorsList'

function transformTrendsData(result) {
  if (!result?.results) return []
  const series = result.results
  if (!series.length || !series[0].data) return []

  return series[0].data.map((val, i) => {
    const point = {
      date: series[0].labels?.[i] || series[0].days?.[i] || `Day ${i}`,
    }
    series.forEach((s) => {
      point[s.label || s.custom_name || 'value'] = s.data[i] || 0
    })
    return point
  })
}

function transformReferrersData(result) {
  if (!result?.results) return []
  return result.results
    .map((s) => ({
      domain: s.breakdown_value || s.label || 'Direct',
      count: s.aggregated_value ?? s.data?.reduce((a, b) => a + b, 0) ?? 0,
    }))
    .filter((r) => r.domain && r.domain !== '' && r.domain !== '$direct')
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function transformErrorsData(result) {
  if (!result?.results) return []
  const columns = result.columns || []
  const rows = result.results || []
  return rows.map((row) => {
    const obj = {}
    columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj
  })
}

export default async function AdminPage() {
  const [
    supabaseResults,
    dauResult,
    wauResult,
    referrersResult,
    errorsResult,
    keyEventsResult,
  ] = await Promise.allSettled([
    (async () => {
      const supabase = await createServiceClient()
      const [profilesRes, dealsRes] = await Promise.all([
        supabase.from('profiles').select('subscription_tier'),
        supabase.from('deals').select('id', { count: 'exact', head: true }),
      ])
      return {
        profiles: profilesRes.data || [],
        dealsCount: dealsRes.count || 0,
      }
    })(),
    getDAU(30),
    getWAU(12),
    getReferrers(30),
    getErrors(7),
    getKeyEvents(30),
  ])

  const supabase =
    supabaseResults.status === 'fulfilled'
      ? supabaseResults.value
      : { profiles: [], dealsCount: 0 }

  const totalUsers = supabase.profiles.length
  const tierCounts = supabase.profiles.reduce(
    (acc, p) => {
      const tier = p.subscription_tier || 'free'
      acc[tier] = (acc[tier] || 0) + 1
      return acc
    },
    { free: 0, flipper: 0, pro: 0 }
  )

  const dauData =
    dauResult.status === 'fulfilled' ? transformTrendsData(dauResult.value) : []
  const wauData =
    wauResult.status === 'fulfilled' ? transformTrendsData(wauResult.value) : []
  const referrersData =
    referrersResult.status === 'fulfilled'
      ? transformReferrersData(referrersResult.value)
      : []
  const errorsData =
    errorsResult.status === 'fulfilled'
      ? transformErrorsData(errorsResult.value)
      : []
  const keyEventsData =
    keyEventsResult.status === 'fulfilled'
      ? transformTrendsData(keyEventsResult.value)
      : []

  const todayDAU = dauData.length > 0 ? dauData[dauData.length - 1] : null
  const dauToday = todayDAU
    ? Object.values(todayDAU).find((v) => typeof v === 'number') || 0
    : 0

  const keyEventsSeries =
    keyEventsResult.status === 'fulfilled' && keyEventsResult.value?.results
      ? keyEventsResult.value.results.map(
          (s) => s.label || s.custom_name || 'Event'
        )
      : []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          title="Total Deals"
          value={supabase.dealsCount.toLocaleString()}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Pro Users"
          value={tierCounts.pro || 0}
          subtitle={`${tierCounts.flipper || 0} flipper`}
          icon={Crown}
        />
        <StatsCard
          title="DAU (Today)"
          value={dauToday}
          icon={Activity}
        />
      </div>

      {/* DAU + WAU Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={dauData} type="line" dataKeys={['DAU']} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Active Users (12w)</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={wauData} type="line" dataKeys={['WAU']} />
          </CardContent>
        </Card>
      </div>

      {/* Key Events Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Key Events (30d)</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={keyEventsData}
            type="bar"
            dataKeys={keyEventsSeries}
          />
        </CardContent>
      </Card>

      {/* Tier Breakdown + Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <TierBreakdown data={tierCounts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferrersTable data={referrersData} />
          </CardContent>
        </Card>
      </div>

      {/* Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors (7d)</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorsList data={errorsData} />
        </CardContent>
      </Card>
    </div>
  )
}
