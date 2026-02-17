import { NextResponse } from 'next/server'
import { verifyAdminAPI } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const user = await verifyAdminAPI()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const supabase = await createServiceClient()

    const [profilesRes, dealsRes] = await Promise.all([
      supabase.from('profiles').select('subscription_tier'),
      supabase.from('deals').select('id', { count: 'exact', head: true }),
    ])

    const profiles = profilesRes.data || []
    const tierCounts = profiles.reduce(
      (acc, p) => {
        const tier = p.subscription_tier || 'free'
        acc[tier] = (acc[tier] || 0) + 1
        return acc
      },
      { free: 0, flipper: 0, pro: 0 }
    )

    return NextResponse.json({
      totalUsers: profiles.length,
      totalDeals: dealsRes.count || 0,
      tiers: tierCounts,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
